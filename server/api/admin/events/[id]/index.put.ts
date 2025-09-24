import { eq } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../utils/drizzle'
import { isH3Error } from '../../../../utils/errors'
import { event } from '../../../../db/schema'
import { updateEventSchema } from '../../../../validators/event'
import { requireAuthUser } from '../../../../utils/auth-helpers'
import { validateBody } from '../../../../validators'

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
      updatedAt: new Date(),
    }

    await db.update(event).set(updateData).where(eq(event.id, eventId))

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
