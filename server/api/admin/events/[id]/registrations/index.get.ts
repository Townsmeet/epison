import { eq, and, desc, asc, sql } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../../utils/drizzle'
import { isH3Error } from '../../../../../utils/errors'
import { eventRegistration } from '../../../../../db/schema'
import { requireAuthUser } from '../../../../../utils/auth-helpers'
import { registrationListQuerySchema } from '../../../../../validators/event'
import { validateQuery } from '../../../../../validators'

import { buildSearchCondition } from '../../../../../utils/search'

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
      const searchCondition = buildSearchCondition(query.q, [
        eventRegistration.attendeeName,
        eventRegistration.attendeeEmail,
        eventRegistration.reference,
      ])
      if (searchCondition) {
        conditions.push(searchCondition)
      }
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
    const totalPages = Math.ceil(total / query.limit)

    // Get paginated results
    const offset = (query.page - 1) * query.limit
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
      .limit(query.limit)
      .offset(offset)

    return {
      success: true,
      data: registrations,
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
    console.error('Error fetching registrations:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch registrations',
    })
  }
})
