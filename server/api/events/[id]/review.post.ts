import { createError, getRouterParam } from 'h3'
import { z } from 'zod'
import { eq, and } from 'drizzle-orm'
import { db } from '../../../utils/drizzle'
import { eventReview } from '../../../db/schema'
import { validateBody } from '../../../validators'

const ReviewSubmissionSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  reviewText: z.string().optional(),
})

type ReviewSubmissionInput = z.infer<typeof ReviewSubmissionSchema>

export default defineEventHandler(async eventHandler => {
  const eventId = getRouterParam(eventHandler, 'id')

  if (!eventId) {
    throw createError({ statusCode: 400, statusMessage: 'Event ID is required' })
  }

  const body = await validateBody(eventHandler, ReviewSubmissionSchema, 'Invalid review submission')

  const { token, rating, reviewText } = body as ReviewSubmissionInput

  try {
    // Find and validate token
    const [reviewRecord] = await db
      .select()
      .from(eventReview)
      .where(and(eq(eventReview.eventId, eventId), eq(eventReview.reviewToken, token)))
      .limit(1)

    if (!reviewRecord) {
      throw createError({ statusCode: 404, statusMessage: 'Invalid review token' })
    }

    if (reviewRecord.tokenUsed) {
      throw createError({
        statusCode: 400,
        statusMessage: 'This review has already been submitted',
      })
    }

    // Update review record
    await db
      .update(eventReview)
      .set({
        rating,
        reviewText: reviewText || null,
        tokenUsed: true,
        submittedAt: new Date(),
      })
      .where(eq(eventReview.id, reviewRecord.id))

    return {
      success: true,
      message: 'Thank you for your feedback!',
    }
  } catch (err) {
    if (typeof err === 'object' && err && 'statusCode' in err) throw err
    throw createError({ statusCode: 500, statusMessage: 'Failed to submit review' })
  }
})
