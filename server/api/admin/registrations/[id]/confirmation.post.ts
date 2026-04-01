import { eq } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../utils/drizzle'
import { eventRegistration, event } from '../../../../db/schema'
import { sendEventRegistrationEmail } from '../../../../utils/event-email'
import { requireAuthUser } from '../../../../utils/auth-helpers'
import { isH3Error } from '../../../../utils/errors'

export default defineEventHandler(async eventHandler => {
  // Auth check
  requireAuthUser(eventHandler)

  const id = getRouterParam(eventHandler, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Registration ID is required',
    })
  }

  try {
    // Fetch registration with event details
    const registration = await db
      .select({
        id: eventRegistration.id,
        attendeeName: eventRegistration.attendeeName,
        attendeeEmail: eventRegistration.attendeeEmail,
        paymentStatus: eventRegistration.paymentStatus,
        paymentReference: eventRegistration.reference,
        ticketName: eventRegistration.ticketName,
        eventId: eventRegistration.eventId,
        eventName: event.title,
        eventDate: event.startDate,
        eventLocation: event.location,
      })
      .from(eventRegistration)
      .innerJoin(event, eq(eventRegistration.eventId, event.id))
      .where(eq(eventRegistration.id, id))
      .limit(1)

    if (!registration.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Registration not found',
      })
    }

    const reg = registration[0]

    // Send confirmation email
    const emailResult = await sendEventRegistrationEmail({
      eventName: reg.eventName || 'Event',
      attendeeName: reg.attendeeName,
      attendeeEmail: reg.attendeeEmail,
      eventDate: reg.eventDate || '',
      eventLocation: reg.eventLocation || '',
      registrationId: reg.id,
      hasPaid: reg.paymentStatus === 'Paid',
      ticketName: reg.ticketName || undefined,
      paymentReference: reg.paymentReference,
    })

    if (!emailResult.success) {
      throw createError({
        statusCode: 500,
        statusMessage: emailResult.error || 'Failed to send confirmation email',
      })
    }

    return {
      success: true,
      message: 'Confirmation email sent successfully',
    }
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error sending registration confirmation:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send confirmation email',
    })
  }
})
