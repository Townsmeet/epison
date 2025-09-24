import { eq, and } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../utils/drizzle'
import { isH3Error } from '../../../utils/errors'
import {
  event,
  eventTicket,
  eventSponsor,
  eventSpeaker,
  eventMedia,
  eventCommitteeMember,
} from '../../../db/schema'

export default defineEventHandler(async eventHandler => {
  const eventId = getRouterParam(eventHandler, 'id')
  if (!eventId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Event ID is required',
    })
  }

  try {
    // Get event details
    const eventResult = await db.select().from(event).where(eq(event.id, eventId)).limit(1)

    if (!eventResult.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Event not found',
      })
    }

    const eventData = eventResult[0]

    // Check if event is public (not draft)
    if (eventData.status === 'draft') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Event not found',
      })
    }

    // Get related data in parallel
    const [tickets, sponsors, speakers, media, committee] = await Promise.all([
      // Only public tickets
      db
        .select()
        .from(eventTicket)
        .where(and(eq(eventTicket.eventId, eventId), eq(eventTicket.isPublic, true))),
      db.select().from(eventSponsor).where(eq(eventSponsor.eventId, eventId)),
      db.select().from(eventSpeaker).where(eq(eventSpeaker.eventId, eventId)),
      db.select().from(eventMedia).where(eq(eventMedia.eventId, eventId)),
      db.select().from(eventCommitteeMember).where(eq(eventCommitteeMember.eventId, eventId)),
    ])

    return {
      ...eventData,
      tickets,
      sponsors,
      speakers,
      media,
      committee,
    }
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error fetching event:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch event',
    })
  }
})
