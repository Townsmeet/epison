import { eq } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../../utils/drizzle'
import { eventMedia } from '../../../../../db/schema'
import { requireAuthUser } from '../../../../../utils/auth-helpers'

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

  try {
    const media = await db
      .select()
      .from(eventMedia)
      .where(eq(eventMedia.eventId, eventId))
      .orderBy(eventMedia.createdAt)

    return { data: media }
  } catch (error) {
    console.error('Error fetching event media:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch event media',
    })
  }
})
