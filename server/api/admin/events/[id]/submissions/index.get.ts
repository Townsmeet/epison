import { eq, and, like, desc, asc, sql, or } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../../utils/drizzle'
import { isH3Error } from '../../../../../utils/errors'
import { abstractSubmission } from '../../../../../db/schema'
import { requireAuthUser } from '../../../../../utils/auth-helpers'
import { submissionListQuerySchema } from '../../../../../validators/event'
import { validateQuery } from '../../../../../validators'

export default defineEventHandler(async eventHandler => {
  // Auth check
  requireAuthUser(eventHandler)

  const eventId = getRouterParam(eventHandler, 'id')
  if (!eventId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Event ID is required',
    })
  }

  const query = validateQuery(eventHandler, submissionListQuerySchema, 'Invalid submission query')

  try {
    // Build where conditions
    const conditions = [eq(abstractSubmission.eventId, eventId)]

    // Search query
    if (query.q) {
      const search = `%${query.q}%`
      const searchExpr = or(
        like(abstractSubmission.title, search),
        like(abstractSubmission.correspondingAuthorName, search),
        like(abstractSubmission.correspondingAuthorEmail, search)
      )!
      conditions.push(searchExpr)
    }

    // Status filter
    if (query.status) {
      conditions.push(eq(abstractSubmission.status, query.status))
    }

    // Category filter
    if (query.category) {
      conditions.push(eq(abstractSubmission.category, query.category))
    }

    // Compute where expression safely (avoid SQL | undefined)
    const whereExpr = conditions.length > 1 ? and(...conditions) : conditions[0]

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(abstractSubmission)
      .where(whereExpr)

    const total = totalResult[0]?.count || 0
    const totalPages = Math.ceil(total / query.limit)

    // Get paginated results with parsed JSON fields
    const offset = (query.page - 1) * query.limit
    const submissions = await db
      .select()
      .from(abstractSubmission)
      .where(whereExpr)
      .orderBy(
        query.sort === 'title'
          ? asc(abstractSubmission.title)
          : query.sort === '-title'
            ? desc(abstractSubmission.title)
            : query.sort === 'submissionDate'
              ? asc(abstractSubmission.submissionDate)
              : desc(abstractSubmission.submissionDate)
      )
      .limit(query.limit)
      .offset(offset)

    // Parse JSON fields for response
    const parsedSubmissions = submissions.map(submission => ({
      ...submission,
      authors: JSON.parse(submission.authorsJson),
      keywords: JSON.parse(submission.keywordsJson),
      correspondingAuthor: {
        name: submission.correspondingAuthorName,
        email: submission.correspondingAuthorEmail,
        affiliation: submission.correspondingAuthorAffiliation,
        phone: submission.correspondingAuthorPhone,
      },
    }))

    return {
      success: true,
      data: parsedSubmissions,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
        hasNext: query.page < totalPages,
        hasPrev: query.page > 1,
      },
    }
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error fetching submissions:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch submissions',
    })
  }
})
