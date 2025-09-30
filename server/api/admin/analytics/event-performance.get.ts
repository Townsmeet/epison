import { eq, sql, and, desc } from 'drizzle-orm'
import { db } from '../../../utils/drizzle'
import { event, eventRegistration, eventReview } from '../../../db/schema'
import { requireAuthUser } from '../../../utils/auth-helpers'

export default defineEventHandler(async eventHandler => {
  // Auth
  requireAuthUser(eventHandler)

  try {
    // Get all completed events
    const events = await db
      .select()
      .from(event)
      .where(eq(event.status, 'completed'))
      .orderBy(desc(event.startDate))
      .limit(10)

    const eventPerformance = await Promise.all(
      events.map(async evt => {
        // Get registration count
        const registrations = await db
          .select({ count: sql<number>`count(*)` })
          .from(eventRegistration)
          .where(eq(eventRegistration.eventId, evt.id))

        const registrationCount = registrations[0]?.count || 0

        // Get paid registrations for revenue
        const paidRegistrations = await db
          .select({
            totalAmount: sql<number>`sum(${eventRegistration.totalAmount})`,
          })
          .from(eventRegistration)
          .where(
            and(eq(eventRegistration.eventId, evt.id), eq(eventRegistration.paymentStatus, 'Paid'))
          )

        const revenue = paidRegistrations[0]?.totalAmount || 0

        // Get reviews for rating
        const reviews = await db
          .select()
          .from(eventReview)
          .where(and(eq(eventReview.eventId, evt.id), eq(eventReview.tokenUsed, true)))

        let averageRating = 0
        if (reviews.length > 0) {
          const sumRatings = reviews.reduce((sum, r) => sum + r.rating, 0)
          averageRating = Number((sumRatings / reviews.length).toFixed(1))
        }

        // Calculate attendance rate (assuming paid registrations = attendees)
        const paidCount = await db
          .select({ count: sql<number>`count(*)` })
          .from(eventRegistration)
          .where(
            and(eq(eventRegistration.eventId, evt.id), eq(eventRegistration.paymentStatus, 'Paid'))
          )

        const attendanceRate =
          registrationCount > 0
            ? Math.round(((paidCount[0]?.count || 0) / registrationCount) * 100)
            : 0

        return {
          id: evt.id,
          name: evt.title,
          date: evt.startDate,
          registrations: registrationCount,
          revenue: Math.round(revenue / 100), // Convert from kobo to naira
          attendanceRate,
          rating: averageRating,
        }
      })
    )

    return {
      success: true,
      data: eventPerformance,
    }
  } catch (err) {
    console.error('Error fetching event performance:', err)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch event performance data' })
  }
})
