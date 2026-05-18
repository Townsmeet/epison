import { eq } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../../utils/drizzle'
import { isH3Error } from '../../../../../utils/errors'
import { event, eventSpeaker } from '../../../../../db/schema'
import { createEventSpeakerSchema } from '../../../../../validators/event'
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

  const body = await validateBody(eventHandler, createEventSpeakerSchema, 'Invalid speaker data')

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

    // Generate speaker ID
    const speakerId = crypto.randomUUID()

    // Create speaker
    const speakerData = {
      id: speakerId,
      eventId,
      name: body.name,
      title: body.title,
      org: body.org,
      photoUrl: body.photoUrl,
      bio: body.bio,
      createdAt: new Date(),
    }

    await db.insert(eventSpeaker).values(speakerData)

    // Activity log
    await addActivity({
      type: 'Event',
      title: 'Speaker added',
      description: `${body.name} added as a speaker`,
      entityType: 'event',
      entityId: eventId,
      metadata: { speakerId, name: body.name },
    })

    // Return created speaker
    const createdSpeaker = await db
      .select()
      .from(eventSpeaker)
      .where(eq(eventSpeaker.id, speakerId))
      .limit(1)

    return createdSpeaker[0]
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error creating speaker:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create speaker',
    })
  }
})
