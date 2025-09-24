import { eq, and, gte, lte, like, desc, asc, sql, or } from 'drizzle-orm'
import { db } from '../../utils/drizzle'
import { event } from '../../db/schema'
import { eventListQuerySchema } from '../../validators/event'
import { validateQuery } from '../../validators'

export default defineEventHandler(async eventHandler => {
  const query = validateQuery(eventHandler, eventListQuerySchema, 'Invalid event list query')

  try {
    // Build where conditions
    const conditions = []

    // Only show published or later status events for public
    conditions.push(
      or(
        eq(event.status, 'published'),
        eq(event.status, 'registration_open'),
        eq(event.status, 'registration_closed'),
        eq(event.status, 'ongoing'),
        eq(event.status, 'completed')
      )
    )

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

    // Upcoming filter
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
      case '-startDate':
      default:
        orderBy = desc(event.startDate)
        break
    }

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(event)
      .where(and(...conditions))

    const total = totalResult[0]?.count || 0
    const totalPages = Math.ceil(total / query.perPage)

    // Get paginated results
    const offset = (query.page - 1) * query.perPage
    const events = await db
      .select({
        id: event.id,
        slug: event.slug,
        title: event.title,
        type: event.type,
        status: event.status,
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location,
        capacity: event.capacity,
        description: event.description,
        bannerUrl: event.bannerUrl,
        membersOnly: event.membersOnly,
        collectsSubmissions: event.collectsSubmissions,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      })
      .from(event)
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(query.perPage)
      .offset(offset)

    return {
      data: events,
      meta: {
        page: query.page,
        perPage: query.perPage,
        total,
        totalPages,
      },
    }
  } catch (error) {
    console.error('Error fetching events:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch events',
    })
  }
})
