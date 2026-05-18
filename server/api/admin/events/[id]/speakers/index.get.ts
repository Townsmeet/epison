import { eq } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../../utils/drizzle'
import { isH3Error } from '../../../../../utils/errors'
import { eventSpeaker } from '../../../../../db/schema'

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
    const speakers = await db
      .select()
      .from(eventSpeaker)
      .where(eq(eventSpeaker.eventId, eventId))
      .orderBy(eventSpeaker.displayOrder, eventSpeaker.createdAt)

    return {
      data: speakers,
    }
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error fetching event speakers:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch event speakers',
    })
  }
})
