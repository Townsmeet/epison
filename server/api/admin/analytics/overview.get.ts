import { count, gte, and, lt } from 'drizzle-orm'
import { db } from '../../../utils/drizzle'
import { member, event, eventRegistration } from '../../../db/schema'
import { requireAuthUser } from '../../../utils/auth-helpers'

interface OverviewStats {
  totalMembers: number
  memberGrowth: number
  totalEvents: number
  eventGrowth: number
  totalRegistrations: number
  registrationGrowth: number
}

export default defineEventHandler(async eventHandler => {
  // Auth
  requireAuthUser(eventHandler)

  try {
    // Calculate date ranges (timestamps in milliseconds)
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    // === MEMBERS ===
    // Total members
    const totalMembersResult = await db.select({ count: count() }).from(member)
    const totalMembers = totalMembersResult[0]?.count || 0

    // Members in last 30 days
    const recentMembersResult = await db
      .select({ count: count() })
      .from(member)
      .where(gte(member.createdAt, thirtyDaysAgo))
    const recentMembers = recentMembersResult[0]?.count || 0

    // Members in previous 30 days (30-60 days ago)
    const previousMembersResult = await db
      .select({ count: count() })
      .from(member)
      .where(and(gte(member.createdAt, sixtyDaysAgo), lt(member.createdAt, thirtyDaysAgo)))
    const previousMembers = previousMembersResult[0]?.count || 0

    // Calculate member growth percentage
    const memberGrowth =
      previousMembers > 0
        ? Number((((recentMembers - previousMembers) / previousMembers) * 100).toFixed(1))
        : recentMembers > 0
          ? 100
          : 0

    // === EVENTS ===
    // Total events
    const totalEventsResult = await db.select({ count: count() }).from(event)
    const totalEvents = totalEventsResult[0]?.count || 0

    // Events in last 30 days
    const recentEventsResult = await db
      .select({ count: count() })
      .from(event)
      .where(gte(event.createdAt, thirtyDaysAgo))
    const recentEvents = recentEventsResult[0]?.count || 0

    // Events in previous 30 days
    const previousEventsResult = await db
      .select({ count: count() })
      .from(event)
      .where(and(gte(event.createdAt, sixtyDaysAgo), lt(event.createdAt, thirtyDaysAgo)))
    const previousEvents = previousEventsResult[0]?.count || 0

    // Calculate event growth percentage
    const eventGrowth =
      previousEvents > 0
        ? Number((((recentEvents - previousEvents) / previousEvents) * 100).toFixed(1))
        : recentEvents > 0
          ? 100
          : 0

    // === REGISTRATIONS ===
    // Total registrations
    const totalRegistrationsResult = await db.select({ count: count() }).from(eventRegistration)
    const totalRegistrations = totalRegistrationsResult[0]?.count || 0

    // Registrations in last 30 days
    const recentRegistrationsResult = await db
      .select({ count: count() })
      .from(eventRegistration)
      .where(gte(eventRegistration.registeredAt, thirtyDaysAgo))
    const recentRegistrations = recentRegistrationsResult[0]?.count || 0

    // Registrations in previous 30 days
    const previousRegistrationsResult = await db
      .select({ count: count() })
      .from(eventRegistration)
      .where(
        and(
          gte(eventRegistration.registeredAt, sixtyDaysAgo),
          lt(eventRegistration.registeredAt, thirtyDaysAgo)
        )
      )
    const previousRegistrations = previousRegistrationsResult[0]?.count || 0

    // Calculate registration growth percentage
    const registrationGrowth =
      previousRegistrations > 0
        ? Number(
            (((recentRegistrations - previousRegistrations) / previousRegistrations) * 100).toFixed(
              1
            )
          )
        : recentRegistrations > 0
          ? 100
          : 0

    const stats: OverviewStats = {
      totalMembers,
      memberGrowth,
      totalEvents,
      eventGrowth,
      totalRegistrations,
      registrationGrowth,
    }

    return {
      success: true,
      data: stats,
    }
  } catch (err) {
    console.error('Error fetching overview statistics:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch overview statistics',
    })
  }
})
