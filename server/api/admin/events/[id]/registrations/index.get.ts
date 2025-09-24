import { eq, and, like, desc, asc, sql, or } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../../utils/drizzle'
import { isH3Error } from '../../../../../utils/errors'
import { eventRegistration } from '../../../../../db/schema'
import { requireAuthUser } from '../../../../../utils/auth-helpers'
import { registrationListQuerySchema } from '../../../../../validators/event'
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

  const query = validateQuery(
    eventHandler,
    registrationListQuerySchema,
    'Invalid registration query'
  )

  try {
    // Build where conditions
    const conditions = [eq(eventRegistration.eventId, eventId)]

    // Search query
    if (query.q) {
      const search = `%${query.q}%`
      const searchExpr = or(
        like(eventRegistration.attendeeName, search),
        like(eventRegistration.attendeeEmail, search),
        like(eventRegistration.reference, search)
      )!
      conditions.push(searchExpr)
    }

    // Category filter
    if (query.category) {
      conditions.push(eq(eventRegistration.category, query.category))
    }

    // Payment status filter
    if (query.paymentStatus) {
      conditions.push(eq(eventRegistration.paymentStatus, query.paymentStatus))
    }

    // Compute where expression safely (avoid SQL | undefined)
    const whereExpr = conditions.length > 1 ? and(...conditions) : conditions[0]

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(eventRegistration)
      .where(whereExpr)

    const total = totalResult[0]?.count || 0
    const totalPages = Math.ceil(total / query.perPage)

    // Get paginated results
    const offset = (query.page - 1) * query.perPage
    const registrations = await db
      .select()
      .from(eventRegistration)
      .where(whereExpr)
      .orderBy(
        query.sort === 'attendeeName'
          ? asc(eventRegistration.attendeeName)
          : query.sort === '-attendeeName'
            ? desc(eventRegistration.attendeeName)
            : query.sort === 'registeredAt'
              ? asc(eventRegistration.registeredAt)
              : desc(eventRegistration.registeredAt)
      )
      .limit(query.perPage)
      .offset(offset)

    return {
      data: registrations,
      meta: {
        page: query.page,
        perPage: query.perPage,
        total,
        totalPages,
      },
    }
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error fetching registrations:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch registrations',
    })
  }
})
