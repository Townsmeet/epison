import { eq, asc } from 'drizzle-orm'
import { getQuery, createError } from 'h3'
import { db } from '../../../utils/drizzle'
import { eventRegistration } from '../../../db/schema'
import { requireAuthUser } from '../../../utils/auth-helpers'

export default defineEventHandler(async eventHandler => {
  // Auth check
  requireAuthUser(eventHandler)

  const query = getQuery(eventHandler)
  const eventId = query.eventId as string

  if (!eventId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Event ID is required',
    })
  }

  try {
    // Fetch all registrations for the event
    const results = await db
      .select({
        id: eventRegistration.id,
        attendeeName: eventRegistration.attendeeName,
        attendeeEmail: eventRegistration.attendeeEmail,
        attendeePhone: eventRegistration.attendeePhone,
        attendeeOrg: eventRegistration.attendeeOrg,
        ticketName: eventRegistration.ticketName,
        totalAmount: eventRegistration.totalAmount,
        currency: eventRegistration.currency,
        paymentStatus: eventRegistration.paymentStatus,
        registeredAt: eventRegistration.registeredAt,
      })
      .from(eventRegistration)
      .where(eq(eventRegistration.eventId, eventId))
      .orderBy(asc(eventRegistration.registeredAt))

    return {
      success: true,
      data: results,
    }
  } catch (error: unknown) {
    console.error('Error fetching registrations for export:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch registrations',
    })
  }
})
