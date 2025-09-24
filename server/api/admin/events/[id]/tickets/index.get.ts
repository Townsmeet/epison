import { eq } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../../utils/drizzle'
import { eventTicket } from '../../../../../db/schema'
import { requireAuthUser } from '../../../../../utils/auth-helpers'

export default defineEventHandler(async eventHandler => {
  // Auth check
  requireAuthUser(eventHandler)

  const eventId = getRouterParam(eventHandler, 'id')
  if (!eventId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Event ID is required',
    })
  }

  try {
    const tickets = await db
      .select()
      .from(eventTicket)
      .where(eq(eventTicket.eventId, eventId))
      .orderBy(eventTicket.createdAt)

    return { data: tickets }
  } catch (error) {
    console.error('Error fetching tickets:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch tickets',
    })
  }
})
