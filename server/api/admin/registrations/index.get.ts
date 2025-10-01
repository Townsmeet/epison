import { and, asc, desc, like, or, sql, eq } from 'drizzle-orm'
import { defineEventHandler, createError } from 'h3'
import { db } from '../../../utils/drizzle'
import { isH3Error } from '../../../utils/errors'
import { eventRegistration, event } from '../../../db/schema'
import { requireAuthUser } from '../../../utils/auth-helpers'
import { registrationListQuerySchema } from '../../../validators/event'
import { validateQuery } from '../../../validators'

export default defineEventHandler(async eventHandler => {
  // Auth check
  requireAuthUser(eventHandler)

  const query = validateQuery(
    eventHandler,
    registrationListQuerySchema,
    'Invalid registration query'
  )

  try {
    // Build where conditions
    const conditions: ReturnType<typeof like | typeof or>[] = []

    // Search across attendee name, email and reference
    if (query.q) {
      const search = `%${query.q}%`
      conditions.push(
        or(
          like(eventRegistration.attendeeName, search),
          like(eventRegistration.attendeeEmail, search),
          like(eventRegistration.reference, search)
        )
      )
    }

    // Event ID filter
    if (query.eventId) {
      conditions.push(eq(eventRegistration.eventId, query.eventId))
    }

    // Category filter
    if (query.category) {
      conditions.push(like(eventRegistration.category, query.category))
    }

    // Payment status filter
    if (query.paymentStatus) {
      conditions.push(like(eventRegistration.paymentStatus, query.paymentStatus))
    }

    const whereExpr = conditions.length > 0 ? and(...conditions) : undefined

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(eventRegistration)
      .where(whereExpr)

    const total = totalResult[0]?.count || 0
    const totalPages = Math.ceil(total / query.limit)

    // Pagination
    const offset = (query.page - 1) * query.limit

    // Get results with event title
    const rows = await db
      .select({
        id: eventRegistration.id,
        eventId: eventRegistration.eventId,
        attendeeName: eventRegistration.attendeeName,
        attendeeEmail: eventRegistration.attendeeEmail,
        category: eventRegistration.category,
        ticketId: eventRegistration.ticketId,
        ticketName: eventRegistration.ticketName,
        unitPrice: eventRegistration.unitPrice,
        quantity: eventRegistration.quantity,
        currency: eventRegistration.currency,
        totalAmount: eventRegistration.totalAmount,
        paymentStatus: eventRegistration.paymentStatus,
        reference: eventRegistration.reference,
        paymentProvider: eventRegistration.paymentProvider,
        paymentMetaJson: eventRegistration.paymentMetaJson,
        paidAt: eventRegistration.paidAt,
        refundedAt: eventRegistration.refundedAt,
        registeredAt: eventRegistration.registeredAt,
        notes: eventRegistration.notes,
        eventTitle: event.title,
        eventStartDate: event.startDate,
      })
      .from(eventRegistration)
      .leftJoin(event, eq(eventRegistration.eventId, event.id))
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
      data: rows,
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
