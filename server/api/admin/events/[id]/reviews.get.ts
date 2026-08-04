import { createError, getRouterParam } from 'h3'
import { eq, desc } from 'drizzle-orm'
import { db } from '../../../../utils/drizzle'
import { eventReview } from '../../../../db/schema'
import { requireAuthUser } from '../../../../utils/auth-helpers'

export default defineEventHandler(async eventHandler => {
  // Auth
  requireAuthUser(eventHandler)

  const eventId = getRouterParam(eventHandler, 'id')
  if (!eventId) {
    throw createError({ statusCode: 400, statusMessage: 'Event ID is required' })
  }

  try {
    // Get all reviews for this event
    const reviews = await db
      .select()
      .from(eventReview)
      .where(eq(eventReview.eventId, eventId))
      .orderBy(desc(eventReview.submittedAt))

    // Calculate summary statistics
    const submittedReviews = reviews.filter(r => r.tokenUsed)
    const totalReviews = submittedReviews.length
    const totalRequests = reviews.length
    const failedDeliveries = reviews.filter(r => Boolean(r.lastError)).length

    let averageRating = 0
    if (totalReviews > 0) {
      const sumRatings = submittedReviews.reduce((sum, r) => sum + r.rating, 0)
      averageRating = Number((sumRatings / totalReviews).toFixed(2))
    }

    const responseRate =
      totalRequests > 0 ? Number(((totalReviews / totalRequests) * 100).toFixed(1)) : 0

    // Rating distribution
    const ratingDistribution = {
      5: submittedReviews.filter(r => r.rating === 5).length,
      4: submittedReviews.filter(r => r.rating === 4).length,
      3: submittedReviews.filter(r => r.rating === 3).length,
      2: submittedReviews.filter(r => r.rating === 2).length,
      1: submittedReviews.filter(r => r.rating === 1).length,
    }

    // Find latest request date
    const requestedDates = reviews
      .map(r => r.requestedAt)
      .filter((d): d is Date => d instanceof Date)
    const lastRequestedAt =
      requestedDates.length > 0 ? new Date(Math.max(...requestedDates.map(d => d.getTime()))) : null

    return {
      success: true,
      data: {
        reviews: submittedReviews.map(r => ({
          id: r.id,
          attendeeName: r.attendeeName,
          attendeeEmail: r.attendeeEmail,
          rating: r.rating,
          reviewText: r.reviewText,
          submittedAt: r.submittedAt,
          requestedAt: r.requestedAt,
          requestCount: r.requestCount,
        })),
        summary: {
          totalReviews,
          totalRequests,
          averageRating,
          responseRate,
          ratingDistribution,
          failedDeliveries,
          lastRequestedAt,
        },
      },
    }
  } catch (err) {
    if (typeof err === 'object' && err && 'statusCode' in err) throw err
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch reviews' })
  }
})
