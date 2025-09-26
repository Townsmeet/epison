import { eq, and } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../../utils/drizzle'
import { isH3Error } from '../../../../../utils/errors'
import { eventSponsor } from '../../../../../db/schema'
import { requireAuthUser } from '../../../../../utils/auth-helpers'

export default defineEventHandler(async eventHandler => {
  // Auth check
  requireAuthUser(eventHandler)

  const eventId = getRouterParam(eventHandler, 'id')
  const sponsorId = getRouterParam(eventHandler, 'sponsorId')

  if (!eventId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Event ID is required',
    })
  }

  if (!sponsorId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Sponsor ID is required',
    })
  }

  try {
    // Check if sponsor exists and belongs to the event
    const existingSponsor = await db
      .select({ id: eventSponsor.id })
      .from(eventSponsor)
      .where(and(eq(eventSponsor.id, sponsorId), eq(eventSponsor.eventId, eventId)))
      .limit(1)

    if (!existingSponsor.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Sponsor not found',
      })
    }

    // Delete the sponsor
    await db
      .delete(eventSponsor)
      .where(and(eq(eventSponsor.id, sponsorId), eq(eventSponsor.eventId, eventId)))

    return { success: true, message: 'Sponsor deleted successfully' }
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error deleting sponsor:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete sponsor',
    })
  }
})
