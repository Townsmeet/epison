import { eq } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../utils/drizzle'
import { isH3Error } from '../../../../utils/errors'
import { eventTicket } from '../../../../db/schema'

export default defineEventHandler(async eventHandler => {
  // TODO: Add authentication check

  const ticketId = getRouterParam(eventHandler, 'ticketId')
  if (!ticketId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Ticket ID is required',
    })
  }

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

    // Delete ticket
    await db.delete(eventTicket).where(eq(eventTicket.id, ticketId))

    return {
      success: true,
      message: 'Ticket deleted successfully',
    }
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error deleting ticket:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete ticket',
    })
  }
})
