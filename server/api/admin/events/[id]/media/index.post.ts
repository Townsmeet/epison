import { eq } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../../utils/drizzle'
import { isH3Error } from '../../../../../utils/errors'
import { event, eventMedia } from '../../../../../db/schema'
import { requireAuthUser } from '../../../../../utils/auth-helpers'
import { createEventMediaSchema } from '../../../../../validators/event'
import { validateBody } from '../../../../../validators'

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

  const body = await validateBody(eventHandler, createEventMediaSchema, 'Invalid media data')

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

    // Generate media ID
    const mediaId = crypto.randomUUID()

    // Create media
    const mediaData = {
      id: mediaId,
      eventId,
      url: body.url,
      caption: body.caption,
      type: body.type,
      createdAt: new Date(),
    }

    await db.insert(eventMedia).values(mediaData)

    // Return created media
    const createdMedia = await db
      .select()
      .from(eventMedia)
      .where(eq(eventMedia.id, mediaId))
      .limit(1)

    return createdMedia[0]
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error creating event media:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create event media',
    })
  }
})
