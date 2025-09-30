import { createError, getRouterParam } from 'h3'
import { eq, and } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { db } from '../../../../utils/drizzle'
import { event, eventRegistration, eventReview } from '../../../../db/schema'
import { requireAuthUser } from '../../../../utils/auth-helpers'
import { sendEmail } from '../../../../utils/email'

export default defineEventHandler(async eventHandler => {
  // Auth
  requireAuthUser(eventHandler)

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

    // Get all paid registrations for this event
    const registrations = await db
      .select()
      .from(eventRegistration)
      .where(
        and(eq(eventRegistration.eventId, eventId), eq(eventRegistration.paymentStatus, 'Paid'))
      )

    if (!registrations.length) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No paid registrations found for this event',
      })
    }

    // Check for existing review tokens and create new ones only for those without
    const existingReviews = await db
      .select()
      .from(eventReview)
      .where(eq(eventReview.eventId, eventId))

    const existingRegistrationIds = new Set(existingReviews.map(review => review.registrationId))

    const newReviewRecords = []
    const emailPromises = []

    for (const registration of registrations) {
      let reviewToken: string
      let reviewRecord

      if (existingRegistrationIds.has(registration.id)) {
        // Find existing review record
        reviewRecord = existingReviews.find(r => r.registrationId === registration.id)
        reviewToken = reviewRecord!.reviewToken
      } else {
        // Create new review record
        reviewToken = nanoid(32)
        reviewRecord = {
          id: nanoid(),
          eventId,
          registrationId: registration.id,
          attendeeEmail: registration.attendeeEmail,
          attendeeName: registration.attendeeName,
          rating: 0,
          reviewText: null,
          reviewToken,
          tokenUsed: false,
          submittedAt: null,
          createdAt: new Date(),
        }
        newReviewRecords.push(reviewRecord)
      }

      // Send email (for both new and existing tokens if not yet submitted)
      if (!reviewRecord?.tokenUsed) {
        const config = useRuntimeConfig()
        const reviewUrl = `${config.public.siteUrl || 'http://localhost:3000'}/events/${eventId}/review?token=${reviewToken}`

        const htmlContent = createReviewRequestEmail(
          registration.attendeeName,
          eventData.title,
          reviewUrl
        )

        emailPromises.push(
          sendEmail({
            to: registration.attendeeEmail,
            subject: `Share your feedback: ${eventData.title}`,
            htmlContent,
          })
        )
      }
    }

    // Insert new review records
    if (newReviewRecords.length > 0) {
      await db.insert(eventReview).values(newReviewRecords)
    }

    // Send all emails
    await Promise.allSettled(emailPromises)

    return {
      success: true,
      message: `Review requests sent to ${emailPromises.length} attendees`,
      totalRegistrations: registrations.length,
      emailsSent: emailPromises.length,
    }
  } catch (err) {
    if (typeof err === 'object' && err && 'statusCode' in err) throw err
    throw createError({ statusCode: 500, statusMessage: 'Failed to request reviews' })
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
      <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
        <h1 style="color: #3b82f6; margin: 0; font-size: 28px;">EPISON</h1>
      </div>
      
      <h2 style="color: #1f2937; margin-bottom: 20px;">We'd love to hear from you!</h2>
      
      <p style="margin-bottom: 20px;">Hello ${attendeeName},</p>
      
      <p style="margin-bottom: 20px;">Thank you for attending <strong>${eventTitle}</strong>. Your feedback is invaluable in helping us improve future events.</p>
      
      <p style="margin-bottom: 20px;">Please take a moment to share your experience by clicking the button below:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${reviewUrl}" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Share Your Feedback</a>
      </div>
      
      <p style="margin-bottom: 20px;">If the button doesn't work, you can copy and paste this link into your browser:</p>
      <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 14px;">${reviewUrl}</p>
      
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
