import { eq, and } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../../utils/drizzle'
import { isH3Error } from '../../../../../utils/errors'
import { eventTicket } from '../../../../../db/schema'
import { requireAuthUser } from '../../../../../utils/auth-helpers'
import { addActivity } from '../../../../../utils/activity'

export default defineEventHandler(async eventHandler => {
  // Auth check
  requireAuthUser(eventHandler)

  const eventId = getRouterParam(eventHandler, 'id')
  const ticketId = getRouterParam(eventHandler, 'ticketId')

  if (!eventId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Event ID is required',
    })
  }

  if (!ticketId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Ticket ID is required',
    })
  }

  try {
    // Check if ticket exists and belongs to the event
    const existingTicket = await db
      .select({ id: eventTicket.id })
      .from(eventTicket)
      .where(and(eq(eventTicket.id, ticketId), eq(eventTicket.eventId, eventId)))
      .limit(1)

    if (!existingTicket.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Ticket not found',
      })
    }

    // Delete the ticket
    await db
      .delete(eventTicket)
      .where(and(eq(eventTicket.id, ticketId), eq(eventTicket.eventId, eventId)))

    // Activity log
    await addActivity({
      type: 'Event',
      title: 'Ticket deleted',
      description: `Ticket removed from event`,
      entityType: 'event',
      entityId: eventId,
      metadata: { ticketId },
    })

    return { success: true, message: 'Ticket deleted successfully' }
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error deleting ticket:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete ticket',
    })
  }
})
