import { eq, sql } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../utils/drizzle'
import { isH3Error } from '../../../../utils/errors'
import {
  event,
  eventTicket,
  eventSponsor,
  eventSpeaker,
  eventMedia,
  eventCommitteeMember,
  eventRegistration,
  abstractSubmission,
} from '../../../../db/schema'
import { requireAuthUser } from '../../../../utils/auth-helpers'

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
    // Get event details
    const eventResult = await db.select().from(event).where(eq(event.id, eventId)).limit(1)

    if (!eventResult.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Event not found',
      })
    }

    const eventData = eventResult[0]

    // Get related data in parallel (admin sees all tickets, not just public ones)
    const [tickets, sponsors, speakers, media, committee, stats] = await Promise.all([
      db.select().from(eventTicket).where(eq(eventTicket.eventId, eventId)),
      db.select().from(eventSponsor).where(eq(eventSponsor.eventId, eventId)),
      db.select().from(eventSpeaker).where(eq(eventSpeaker.eventId, eventId)),
      db.select().from(eventMedia).where(eq(eventMedia.eventId, eventId)),
      db.select().from(eventCommitteeMember).where(eq(eventCommitteeMember.eventId, eventId)),
      // Get registration and submission stats
      db
        .select({
          registrationCount: sql<number>`COUNT(DISTINCT ${eventRegistration.id})`,
          submissionCount: sql<number>`COUNT(DISTINCT ${abstractSubmission.id})`,
          revenue: sql<number>`COALESCE(SUM(CASE WHEN ${eventRegistration.paymentStatus} = 'Paid' THEN ${eventRegistration.totalAmount} ELSE 0 END), 0)`,
        })
        .from(event)
        .leftJoin(eventRegistration, eq(eventRegistration.eventId, event.id))
        .leftJoin(abstractSubmission, eq(abstractSubmission.eventId, event.id))
        .where(eq(event.id, eventId))
        .groupBy(event.id),
    ])

    return {
      success: true,
      data: {
        ...eventData,
        tickets,
        sponsors,
        speakers,
        media,
        committee,
        registrationCount: stats[0]?.registrationCount || 0,
        submissionCount: stats[0]?.submissionCount || 0,
        revenue: stats[0]?.revenue || 0,
      },
    }
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error fetching admin event:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch event',
    })
  }
})
