import { eq, and } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../../utils/drizzle'
import { isH3Error } from '../../../../../utils/errors'
import { eventSpeaker } from '../../../../../db/schema'
import { addActivity } from '../../../../../utils/activity'

export default defineEventHandler(async eventHandler => {
  // TODO: Add authentication check

  const eventId = getRouterParam(eventHandler, 'id')
  const speakerId = getRouterParam(eventHandler, 'speakerId')

  if (!eventId || !speakerId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Event ID and Speaker ID are required',
    })
  }

  try {
    // Check if speaker exists
    const speaker = await db
      .select()
      .from(eventSpeaker)
      .where(and(eq(eventSpeaker.id, speakerId), eq(eventSpeaker.eventId, eventId)))
      .limit(1)

    if (!speaker.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Speaker not found',
      })
    }

    // Delete speaker
    await db
      .delete(eventSpeaker)
      .where(and(eq(eventSpeaker.id, speakerId), eq(eventSpeaker.eventId, eventId)))

    // Activity log
    await addActivity({
      type: 'Event',
      title: 'Speaker removed',
      description: `${speaker[0].name} removed from speakers`,
      entityType: 'event',
      entityId: eventId,
      metadata: { speakerId, name: speaker[0].name },
    })

    return {
      success: true,
      message: 'Speaker removed successfully',
    }
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error deleting speaker:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete speaker',
    })
  }
})
