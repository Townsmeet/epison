import { eq, and } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../../utils/drizzle'
import { isH3Error } from '../../../../../utils/errors'
import { eventMedia } from '../../../../../db/schema'
import { requireAuthUser } from '../../../../../utils/auth-helpers'
import { addActivity } from '../../../../../utils/activity'

export default defineEventHandler(async eventHandler => {
  // Auth check
  requireAuthUser(eventHandler)

  const eventId = getRouterParam(eventHandler, 'id')
  const mediaId = getRouterParam(eventHandler, 'mediaId')

  if (!eventId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Event ID is required',
    })
  }

  if (!mediaId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Media ID is required',
    })
  }

  try {
    // Check if media exists and belongs to the event
    const existingMedia = await db
      .select({ id: eventMedia.id })
      .from(eventMedia)
      .where(and(eq(eventMedia.id, mediaId), eq(eventMedia.eventId, eventId)))
      .limit(1)

    if (!existingMedia.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Media not found',
      })
    }

    // Delete the media
    await db
      .delete(eventMedia)
      .where(and(eq(eventMedia.id, mediaId), eq(eventMedia.eventId, eventId)))

    // Activity log
    await addActivity({
      type: 'Event',
      title: 'Event media deleted',
      description: `Media removed from event`,
      entityType: 'event',
      entityId: eventId,
      metadata: { mediaId },
    })

    return { success: true, message: 'Media deleted successfully' }
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error deleting event media:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete event media',
    })
  }
})
