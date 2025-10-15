import { eq } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../utils/drizzle'
import { isH3Error } from '../../../../utils/errors'
import { event } from '../../../../db/schema'
import { updateEventSchema } from '../../../../validators/event'
import { addActivity } from '../../../../utils/activity'
import { requireAuthUser } from '../../../../utils/auth-helpers'
import { validateBody } from '../../../../validators'

export default defineEventHandler(async eventHandler => {
  const auth = requireAuthUser(eventHandler)
  // Auth check done above

  const eventId = getRouterParam(eventHandler, 'id')
  if (!eventId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Event ID is required',
    })
  }

  const body = await validateBody(eventHandler, updateEventSchema, 'Invalid event data')

  try {
    // Check if event exists
    const existingEvent = await db.select().from(event).where(eq(event.id, eventId)).limit(1)

    if (!existingEvent.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Event not found',
      })
    }

    // Update event
    const updateData = {
      ...body,
      theme: body.theme,
      subthemes: body.subthemes ? body.subthemes.join(',') : null,
      submissionGuidelines: body.submissionGuidelines ?? null,
      submissionDatesJson: body.submissionDates ? JSON.stringify(body.submissionDates) : null,
      updatedAt: new Date(),
    }

    await db.update(event).set(updateData).where(eq(event.id, eventId))

    await addActivity({
      type: 'Event',
      title: 'Event updated',
      description: `${existingEvent[0].title} updated`,
      actorId: auth.userId,
      entityType: 'event',
      entityId: eventId,
      metadata: updateData,
    })

    // Return updated event
    const updatedEvent = await db.select().from(event).where(eq(event.id, eventId)).limit(1)

    return updatedEvent[0]
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error updating event:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update event',
    })
  }
})
