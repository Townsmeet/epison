import { eq } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../utils/drizzle'
import { isH3Error } from '../../../../utils/errors'
import { eventTicket } from '../../../../db/schema'
import { createEventTicketSchema } from '../../../../validators/event'
import { validateBody } from '../../../../validators'

export default defineEventHandler(async eventHandler => {
  // TODO: Add authentication check

  const ticketId = getRouterParam(eventHandler, 'ticketId')
  if (!ticketId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Ticket ID is required',
    })
  }

  const body = await validateBody(
    eventHandler,
    createEventTicketSchema.partial(),
    'Invalid ticket data'
  )

  try {
    // Check if ticket exists
    const existingTicket = await db
      .select()
      .from(eventTicket)
      .where(eq(eventTicket.id, ticketId))
      .limit(1)

    if (!existingTicket.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Ticket not found',
      })
    }

    // Update ticket
    const updateData = {
      ...body,
      updatedAt: new Date(),
    }

    await db.update(eventTicket).set(updateData).where(eq(eventTicket.id, ticketId))

    // Return updated ticket
    const updatedTicket = await db
      .select()
      .from(eventTicket)
      .where(eq(eventTicket.id, ticketId))
      .limit(1)

    return updatedTicket[0]
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error updating ticket:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update ticket',
    })
  }
})
