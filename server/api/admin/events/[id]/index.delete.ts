import { eq } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../utils/drizzle'
import { isH3Error } from '../../../../utils/errors'
import { event } from '../../../../db/schema'

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
    // Check if event exists
    const existingEvent = await db.select().from(event).where(eq(event.id, eventId)).limit(1)

    if (!existingEvent.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Event not found',
      })
    }

    // Delete event (cascade will handle related records)
    await db.delete(event).where(eq(event.id, eventId))

    return {
      success: true,
      message: 'Event deleted successfully',
    }
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error deleting event:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete event',
    })
  }
})
