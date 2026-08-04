import { createError, getRouterParam } from 'h3'
import { eq, and, or, ne, sql } from 'drizzle-orm'
import crypto from 'node:crypto'
import { db } from '../../../../utils/drizzle'
import { event, eventRegistration, eventReview, activityLog } from '../../../../db/schema'
import { requireAuthUser } from '../../../../utils/auth-helpers'
import { sendEmail } from '../../../../utils/email'

export default defineEventHandler(async eventHandler => {
  // Auth
  const auth = requireAuthUser(eventHandler)

  const eventId = getRouterParam(eventHandler, 'id')
  if (!eventId) {
    throw createError({ statusCode: 400, statusMessage: 'Event ID is required' })
  }

  try {
    // Check if event exists and is completed
    const [eventData] = await db.select().from(event).where(eq(event.id, eventId)).limit(1)
    if (!eventData) {
      throw createError({ statusCode: 404, statusMessage: 'Event not found' })
    }

    if (eventData.status !== 'completed') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Reviews can only be requested for completed events',
      })
    }

    // Get all eligible registrations for this event (Paid or free event registrations, excluding Cancelled/Refunded)
    const registrations = await db
      .select()
      .from(eventRegistration)
      .where(
        and(
          eq(eventRegistration.eventId, eventId),
          or(eq(eventRegistration.paymentStatus, 'Paid'), eq(eventRegistration.totalAmount, 0)),
          ne(eventRegistration.paymentStatus, 'Cancelled'),
          ne(eventRegistration.paymentStatus, 'Refunded')
        )
      )

    if (!registrations.length) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No eligible registrations found for this event',
      })
    }

    // Check for existing review records
    const existingReviews = await db
      .select()
      .from(eventReview)
      .where(eq(eventReview.eventId, eventId))

    const existingReviewsMap = new Map(
      existingReviews.map(review => [review.registrationId, review])
    )

    const newReviewRecords = []
    const dispatchList: {
      reviewRecordId: string
      registrationId: string
      attendeeName: string
      attendeeEmail: string
      reviewToken: string
    }[] = []

    for (const registration of registrations) {
      const existing = existingReviewsMap.get(registration.id)
      let reviewRecordId: string
      let reviewToken: string

      if (existing) {
        if (existing.tokenUsed) {
          // Skip attendees who already submitted feedback
          continue
        }
        reviewRecordId = existing.id
        reviewToken = existing.reviewToken
      } else {
        reviewRecordId = crypto.randomUUID()
        reviewToken = crypto.randomBytes(16).toString('hex')
        const newRecord = {
          id: reviewRecordId,
          eventId,
          registrationId: registration.id,
          attendeeEmail: registration.attendeeEmail,
          attendeeName: registration.attendeeName,
          rating: 0,
          reviewText: null,
          reviewToken,
          tokenUsed: false,
          requestedAt: null,
          requestCount: 0,
          lastError: null,
          submittedAt: null,
          createdAt: new Date(),
        }
        newReviewRecords.push(newRecord)
      }

      dispatchList.push({
        reviewRecordId,
        registrationId: registration.id,
        attendeeName: registration.attendeeName,
        attendeeEmail: registration.attendeeEmail,
        reviewToken,
      })
    }

    // Insert any new review records to database first
    if (newReviewRecords.length > 0) {
      await db.insert(eventReview).values(newReviewRecords)
    }

    if (!dispatchList.length) {
      return {
        success: true,
        message: 'All eligible attendees have already submitted reviews',
        totalRegistrations: registrations.length,
        emailsSent: 0,
        emailsFailed: 0,
      }
    }

    const config = useRuntimeConfig()
    const siteUrl = config.public.siteUrl || 'http://localhost:3000'

    let sentCount = 0
    let failedCount = 0
    const batchSize = 10

    // Send emails in batches of 10
    for (let i = 0; i < dispatchList.length; i += batchSize) {
      const batch = dispatchList.slice(i, i + batchSize)

      const batchResults = await Promise.allSettled(
        batch.map(async item => {
          const reviewUrl = `${siteUrl}/events/${eventId}/review?token=${item.reviewToken}`
          const htmlContent = createReviewRequestEmail(
            item.attendeeName,
            eventData.title,
            reviewUrl
          )

          await sendEmail({
            to: item.attendeeEmail,
            subject: `Share your feedback: ${eventData.title}`,
            htmlContent,
          })
          return item
        })
      )

      // Update per-record status in database based on email result
      for (let j = 0; j < batchResults.length; j++) {
        const result = batchResults[j]
        const item = batch[j]

        if (result.status === 'fulfilled') {
          sentCount++
          await db
            .update(eventReview)
            .set({
              requestedAt: new Date(),
              requestCount: sql`COALESCE(${eventReview.requestCount}, 0) + 1`,
              lastError: null,
            })
            .where(eq(eventReview.id, item.reviewRecordId))
        } else {
          failedCount++
          const errorMsg =
            result.reason instanceof Error ? result.reason.message : String(result.reason)
          await db
            .update(eventReview)
            .set({
              lastError: errorMsg.slice(0, 500),
            })
            .where(eq(eventReview.id, item.reviewRecordId))
        }
      }

      // Small delay between batches to avoid rate limit spikes
      if (i + batchSize < dispatchList.length) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    // Create Audit Activity Log
    try {
      await db.insert(activityLog).values({
        id: crypto.randomUUID(),
        type: 'Event',
        title: 'Review Requests Broadcast',
        description: `Broadcast feedback requests for "${eventData.title}". Sent: ${sentCount}, Failed: ${failedCount}`,
        icon: 'i-heroicons-envelope',
        iconColor: 'text-teal-500',
        actorId: auth.userId,
        entityType: 'event',
        entityId: eventId,
        metadata: JSON.stringify({
          sentCount,
          failedCount,
          totalEligible: dispatchList.length,
        }),
        createdAt: new Date(),
      })
    } catch (logErr) {
      console.error('Failed to create activity log for review request:', logErr)
    }

    return {
      success: true,
      message: `Review requests sent: ${sentCount} succeeded, ${failedCount} failed`,
      totalRegistrations: registrations.length,
      emailsSent: sentCount,
      emailsFailed: failedCount,
    }
  } catch (err) {
    console.error('Error in request-reviews endpoint:', err)
    if (typeof err === 'object' && err && 'statusCode' in err) throw err
    const errorMsg = err instanceof Error ? err.message : String(err)
    throw createError({ statusCode: 500, statusMessage: `Failed to request reviews: ${errorMsg}` })
  }
})

function createReviewRequestEmail(attendeeName: string, eventTitle: string, reviewUrl: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Share Your Feedback</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #0f766e; padding: 30px; border-radius: 10px; margin-bottom: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0 0 5px 0; font-size: 28px; font-weight: 700;">EPISON</h1>
        <p style="color: #ccfbf1; margin: 0; font-size: 16px;">Event Feedback</p>
      </div>
      
      <h2 style="color: #134e4a; margin-bottom: 20px;">We'd love to hear from you!</h2>
      
      <p style="margin-bottom: 20px;">Hello ${attendeeName},</p>
      
      <p style="margin-bottom: 20px;">Thank you for attending <strong>${eventTitle}</strong>. Your feedback is invaluable in helping us improve future events.</p>
      
      <p style="margin-bottom: 20px;">Please take a moment to share your experience by clicking the button below:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${reviewUrl}" style="background: #0d9488; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Share Your Feedback</a>
      </div>
      
      <p style="margin-bottom: 20px;">If the button doesn't work, you can copy and paste this link into your browser:</p>
      <p style="word-break: break-all; background: #f0fdfa; border: 1px solid #ccfbf1; padding: 10px; border-radius: 6px; font-family: monospace; font-size: 14px; color: #0f766e;">${reviewUrl}</p>
      
      <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">
          Your feedback helps us create better experiences for the epidemiology community in Nigeria.
        </p>
        <p style="margin-bottom: 0;">
          Best regards,<br>
          <strong>The EPISON Team</strong>
        </p>
      </div>
    </body>
    </html>
  `
}
