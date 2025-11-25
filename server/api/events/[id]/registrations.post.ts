import { eq, and } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../utils/drizzle'
import { isH3Error } from '../../../utils/errors'
import { event, eventTicket, eventRegistration } from '../../../db/schema'
import { createEventRegistrationSchema } from '../../../validators/event'
import { addActivity } from '../../../utils/activity'
import { validateBody } from '../../../validators'
import { sendEventRegistrationEmail } from '../../../utils/event-email'

export default defineEventHandler(async eventHandler => {
  const eventId = getRouterParam(eventHandler, 'id')
  if (!eventId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Event ID is required',
    })
  }

  const body = await validateBody(
    eventHandler,
    createEventRegistrationSchema,
    'Invalid registration data'
  )

  try {
    // Check if event exists and is open for registration
    const eventResult = await db.select().from(event).where(eq(event.id, eventId)).limit(1)

    if (!eventResult.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Event not found',
      })
    }

    const eventData = eventResult[0]

    if (eventData.status !== 'registration_open') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Registration is not open for this event',
      })
    }

    // If ticketId is provided, validate the ticket
    let ticketData = null
    if (body.ticketId) {
      const ticketResult = await db
        .select()
        .from(eventTicket)
        .where(
          and(
            eq(eventTicket.id, body.ticketId),
            eq(eventTicket.eventId, eventId),
            eq(eventTicket.isPublic, true)
          )
        )
        .limit(1)

      if (!ticketResult.length) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid ticket selected',
        })
      }

      ticketData = ticketResult[0]

      // Check if ticket sales are within the allowed window
      const now = new Date().toISOString()
      if (ticketData.salesStart && now < ticketData.salesStart) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Ticket sales have not started yet',
        })
      }
      if (ticketData.salesEnd && now > ticketData.salesEnd) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Ticket sales have ended',
        })
      }

      // TODO: Check ticket availability (quantity vs sold)
    }

    // Generate registration ID
    const registrationId = crypto.randomUUID()

    // Calculate amounts
    const quantity = body.quantity || 1
    const unitPrice = ticketData?.price || 0
    const totalAmount = unitPrice * quantity

    // Create registration record
    const registrationData = {
      id: registrationId,
      eventId,
      attendeeName: body.attendeeName,
      attendeeEmail: body.attendeeEmail,
      category: body.category,
      ticketId: body.ticketId,
      ticketName: ticketData?.name,
      unitPrice,
      quantity,
      currency: 'NGN',
      totalAmount,
      paymentStatus: totalAmount > 0 ? 'Pending' : 'Paid', // Free events are auto-paid
      registeredAt: new Date(),
    }

    await db.insert(eventRegistration).values(registrationData)

    // If payment is required, generate Paystack payment reference
    let paymentReference = null
    if (totalAmount > 0) {
      // Generate payment reference for Paystack
      paymentReference = `REG_${registrationId.replace(/-/g, '').substring(0, 16).toUpperCase()}`

      // Update registration with payment reference
      await db
        .update(eventRegistration)
        .set({
          reference: paymentReference,
          paymentProvider: 'paystack',
        })
        .where(eq(eventRegistration.id, registrationId))
    }

    // Activity log: Registration created
    await addActivity({
      type: 'Registration',
      title: 'New registration',
      description: `${body.attendeeName} registered for ${eventData.title}`,
      entityType: 'registration',
      entityId: registrationId,
      metadata: { eventId, attendeeEmail: body.attendeeEmail, totalAmount },
    })

    // Kick off confirmation email (non-blocking failure)
    sendEventRegistrationEmail({
      eventName: eventData.title,
      attendeeName: body.attendeeName,
      attendeeEmail: body.attendeeEmail,
      eventDate: eventData.startDate,
      eventLocation: eventData.location || 'To be announced',
      registrationId,
      hasPaid: registrationData.paymentStatus === 'Paid',
      ticketName: ticketData?.name,
      paymentReference,
    }).catch(error => {
      console.error('Failed to send registration email:', error)
    })

    return {
      id: registrationId,
      eventId,
      attendeeName: body.attendeeName,
      attendeeEmail: body.attendeeEmail,
      totalAmount,
      currency: 'NGN',
      paymentStatus: registrationData.paymentStatus,
      paymentReference,
      // Include payment initialization data if needed
      ...(totalAmount > 0 && {
        paymentData: {
          reference: paymentReference,
          amount: totalAmount, // in kobo
          email: body.attendeeEmail,
          currency: 'NGN',
        },
      }),
    }
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error creating registration:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create registration',
    })
  }
})
