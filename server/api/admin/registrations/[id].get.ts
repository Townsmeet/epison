import { getRouterParam, createError } from 'h3'
import { eq } from 'drizzle-orm'
import { db } from '../../../utils/drizzle'
import { eventRegistration, event } from '../../../db/schema'

export default defineEventHandler(async eventHandler => {
  const id = getRouterParam(eventHandler, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Registration ID is required' })
  }

  try {
    const rows = await db
      .select()
      .from(eventRegistration)
      .where(eq(eventRegistration.id, id))
      .limit(1)
    if (!rows.length) {
      throw createError({ statusCode: 404, statusMessage: 'Registration not found' })
    }
    const reg = rows[0]

    // Try to enrich with event title if available
    let eventTitle: string | undefined
    if (reg.eventId) {
      const e = await db
        .select({ title: event.title })
        .from(event)
        .where(eq(event.id, reg.eventId))
        .limit(1)
      eventTitle = e[0]?.title
    }

    return {
      success: true,
      data: {
        id: reg.id,
        eventId: reg.eventId,
        eventTitle,
        attendeeName: reg.attendeeName,
        attendeeEmail: reg.attendeeEmail,
        category: reg.category,
        ticketId: reg.ticketId ?? undefined,
        ticketName: reg.ticketName ?? undefined,
        unitPrice: reg.unitPrice ?? 0,
        quantity: reg.quantity,
        currency: reg.currency,
        totalAmount: reg.totalAmount,
        paymentStatus: reg.paymentStatus,
        reference: reg.reference ?? undefined,
        paymentProvider: reg.paymentProvider ?? undefined,
        paidAt: reg.paidAt ?? undefined,
        refundedAt: reg.refundedAt ?? undefined,
        registeredAt: reg.registeredAt,
        notes: reg.notes ?? undefined,
      },
    }
  } catch (err) {
    if (typeof err === 'object' && err && 'statusCode' in err) throw err
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch registration' })
  }
})
