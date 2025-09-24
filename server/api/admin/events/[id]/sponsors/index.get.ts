import { eq } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../../utils/drizzle'
import { eventSponsor } from '../../../../../db/schema'

export default defineEventHandler(async eventHandler => {
  // TODO: Add authentication check

  const eventId = getRouterParam(eventHandler, 'id')
  if (!eventId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Event ID is required',
    })
  }

  try {
    const sponsors = await db
      .select()
      .from(eventSponsor)
      .where(eq(eventSponsor.eventId, eventId))
      .orderBy(eventSponsor.createdAt)

    return { data: sponsors }
  } catch (error) {
    console.error('Error fetching sponsors:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch sponsors',
    })
  }
})
