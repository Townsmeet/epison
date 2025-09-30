import { createError, getRouterParam, getQuery } from 'h3'
import { eq, and } from 'drizzle-orm'
import { db } from '../../../utils/drizzle'
import { event, eventReview } from '../../../db/schema'

export default defineEventHandler(async eventHandler => {
  const eventId = getRouterParam(eventHandler, 'id')
  const query = getQuery(eventHandler)
  const token = query.token as string | undefined

  if (!eventId) {
    throw createError({ statusCode: 400, statusMessage: 'Event ID is required' })
  }

  if (!token) {
    throw createError({ statusCode: 400, statusMessage: 'Review token is required' })
  }

  try {
    // Validate token and get review record
    const [reviewRecord] = await db
      .select()
      .from(eventReview)
      .where(and(eq(eventReview.eventId, eventId), eq(eventReview.reviewToken, token)))
      .limit(1)

    if (!reviewRecord) {
      throw createError({ statusCode: 404, statusMessage: 'Invalid review token' })
    }

    // Get event details
    const [eventData] = await db.select().from(event).where(eq(event.id, eventId)).limit(1)

    if (!eventData) {
      throw createError({ statusCode: 404, statusMessage: 'Event not found' })
    }

    return {
      success: true,
      data: {
        event: {
          id: eventData.id,
          title: eventData.title,
          type: eventData.type,
          startDate: eventData.startDate,
          endDate: eventData.endDate,
          location: eventData.location,
        },
        review: {
          attendeeName: reviewRecord.attendeeName,
          tokenUsed: reviewRecord.tokenUsed,
          submittedAt: reviewRecord.submittedAt,
          rating: reviewRecord.tokenUsed ? reviewRecord.rating : null,
          reviewText: reviewRecord.tokenUsed ? reviewRecord.reviewText : null,
        },
      },
    }
  } catch (err) {
    if (typeof err === 'object' && err && 'statusCode' in err) throw err
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch review information' })
  }
})
