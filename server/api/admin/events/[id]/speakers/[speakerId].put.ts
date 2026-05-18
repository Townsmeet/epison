import { eq, and } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../../utils/drizzle'
import { isH3Error } from '../../../../../utils/errors'
import { eventSpeaker } from '../../../../../db/schema'
import { updateEventSpeakerSchema } from '../../../../../validators/event'
import { addActivity } from '../../../../../utils/activity'
import { validateBody } from '../../../../../validators'

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

  const body = await validateBody(eventHandler, updateEventSpeakerSchema, 'Invalid speaker data')

  try {
    // Check if speaker exists
    const existingSpeaker = await db
      .select()
      .from(eventSpeaker)
      .where(and(eq(eventSpeaker.id, speakerId), eq(eventSpeaker.eventId, eventId)))
      .limit(1)

    if (!existingSpeaker.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Speaker not found',
      })
    }

    // Update speaker
    await db
      .update(eventSpeaker)
      .set(body)
      .where(and(eq(eventSpeaker.id, speakerId), eq(eventSpeaker.eventId, eventId)))

    // Fetch updated speaker
    const updatedSpeaker = await db
      .select()
      .from(eventSpeaker)
      .where(eq(eventSpeaker.id, speakerId))
      .limit(1)

    // Activity log
    await addActivity({
      type: 'Event',
      title: 'Speaker updated',
      description: `${updatedSpeaker[0].name}'s details updated`,
      entityType: 'event',
      entityId: eventId,
      metadata: { speakerId, changes: Object.keys(body) },
    })

    return updatedSpeaker[0]
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error updating speaker:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update speaker',
    })
  }
})
