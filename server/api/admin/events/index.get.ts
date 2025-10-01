import { eq, and, gte, lte, like, desc, asc, sql, or } from 'drizzle-orm'
import { createError } from 'h3'
import { db } from '../../../utils/drizzle'
import { isH3Error } from '../../../utils/errors'
import { event, eventRegistration } from '../../../db/schema'
import { requireAuthUser } from '../../../utils/auth-helpers'
import { eventListQuerySchema } from '../../../validators/event'
import { validateQuery } from '../../../validators'

export default defineEventHandler(async eventHandler => {
  // Auth check
  requireAuthUser(eventHandler)

  const query = validateQuery(eventHandler, eventListQuerySchema, 'Invalid event list query')

  try {
    // Build where conditions (admin can see all events including drafts)
    const conditions = []

    // Search query
    if (query.q) {
      conditions.push(
        or(
          like(event.title, `%${query.q}%`),
          like(event.description, `%${query.q}%`),
          like(event.location, `%${query.q}%`)
        )
      )
    }

    // Type filter
    if (query.type) {
      conditions.push(eq(event.type, query.type))
    }

    // Status filter
    if (query.status) {
      conditions.push(eq(event.status, query.status))
    }

    // Date range filters
    if (query.from) {
      conditions.push(gte(event.startDate, query.from))
    }
    if (query.to) {
      conditions.push(lte(event.startDate, query.to))
    }

    // Upcoming filter (only events starting from now)
    if (query.upcoming) {
      const now = new Date().toISOString()
      conditions.push(gte(event.startDate, now))
    }

    // Build order by
    let orderBy
    switch (query.sort) {
      case 'title':
        orderBy = asc(event.title)
        break
      case '-title':
        orderBy = desc(event.title)
        break
      case 'startDate':
        orderBy = asc(event.startDate)
        break
      case 'createdAt':
        orderBy = asc(event.createdAt)
        break
      case '-createdAt':
        orderBy = desc(event.createdAt)
        break
      case '-startDate':
      default:
        orderBy = desc(event.startDate)
        break
    }

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(event)
      .where(conditions.length > 0 ? and(...conditions) : undefined)

    const total = totalResult[0]?.count || 0
    const totalPages = Math.ceil(total / query.limit)

    // Get paginated results
    const offset = (query.page - 1) * query.limit
    const eventsList = await db
      .select()
      .from(event)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderBy)
      .limit(query.limit)
      .offset(offset)

    // Get registration stats for each event
    const eventsWithStats = await Promise.all(
      eventsList.map(async evt => {
        const stats = await db
          .select({
            registrationCount: sql<number>`COUNT(DISTINCT ${eventRegistration.id})`,
            revenue: sql<number>`COALESCE(SUM(CASE WHEN ${eventRegistration.paymentStatus} = 'Paid' THEN ${eventRegistration.totalAmount} ELSE 0 END), 0)`,
          })
          .from(event)
          .leftJoin(eventRegistration, eq(eventRegistration.eventId, event.id))
          .where(eq(event.id, evt.id))
          .groupBy(event.id)

        return {
          ...evt,
          registrationCount: Number(stats[0]?.registrationCount) || 0,
          revenue: Number(stats[0]?.revenue) || 0,
        }
      })
    )

    return {
      success: true,
      data: eventsWithStats,
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
    console.error('Error fetching admin events:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch events',
    })
  }
})
