import { eq } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../../utils/drizzle'
import { isH3Error } from '../../../../../utils/errors'
import { event, eventTicket } from '../../../../../db/schema'
import { createEventTicketSchema } from '../../../../../validators/event'
import { addActivity } from '../../../../../utils/activity'
import { validateBody } from '../../../../../validators'

export default defineEventHandler(async eventHandler => {
  // TODO: Add authentication check

  const eventId = getRouterParam(eventHandler, 'id')
  if (!eventId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Event ID is required',
    })
  }

  const body = await validateBody(eventHandler, createEventTicketSchema, 'Invalid ticket data')

  try {
    // Verify event exists
    const eventExists = await db
      .select({ id: event.id })
      .from(event)
      .where(eq(event.id, eventId))
      .limit(1)

    if (!eventExists.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Event not found',
      })
    }

    // Generate ticket ID
    const ticketId = crypto.randomUUID()

    // Create ticket
    const ticketData = {
      id: ticketId,
      eventId,
      categoryId: body.categoryId || null,
      name: body.name,
      price: body.price,
      quantity: body.quantity,
      displayOrder: body.displayOrder,
      salesStart: body.salesStart,
      salesEnd: body.salesEnd,
      description: body.description,
      isPublic: body.isPublic ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.insert(eventTicket).values(ticketData)

    // Activity log
    await addActivity({
      type: 'Event',
      title: 'Ticket created',
      description: `${body.name} added to event`,
      entityType: 'event',
      entityId: eventId,
      metadata: { ticketId, price: body.price, quantity: body.quantity },
    })

    // Return created ticket
    const createdTicket = await db
      .select()
      .from(eventTicket)
      .where(eq(eventTicket.id, ticketId))
      .limit(1)

    return createdTicket[0]
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error creating ticket:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create ticket',
    })
  }
})
