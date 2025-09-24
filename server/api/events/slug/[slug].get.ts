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
  const slug = getRouterParam(eventHandler, 'slug')
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Event slug is required',
    })
  }

  try {
    // Get event by slug
    const eventResult = await db.select().from(event).where(eq(event.slug, slug)).limit(1)

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
        .where(and(eq(eventTicket.eventId, eventData.id), eq(eventTicket.isPublic, true))),
      db.select().from(eventSponsor).where(eq(eventSponsor.eventId, eventData.id)),
      db.select().from(eventSpeaker).where(eq(eventSpeaker.eventId, eventData.id)),
      db.select().from(eventMedia).where(eq(eventMedia.eventId, eventData.id)),
      db.select().from(eventCommitteeMember).where(eq(eventCommitteeMember.eventId, eventData.id)),
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
    console.error('Error fetching event by slug:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch event',
    })
  }
})
