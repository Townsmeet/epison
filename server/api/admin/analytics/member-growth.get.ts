import { db } from '../../../utils/drizzle'
import { member } from '../../../db/schema'
import { requireAuthUser } from '../../../utils/auth-helpers'

interface MonthlyGrowth {
  month: string
  newMembers: number
  totalMembers: number
}

export default defineEventHandler(async eventHandler => {
  // Auth
  requireAuthUser(eventHandler)

  try {
    // Get the last 6 months of data
    const now = new Date()
    const monthsData: MonthlyGrowth[] = []

    // Get all members ordered by creation date
    const allMembers = await db
      .select({
        createdAt: member.createdAt,
      })
      .from(member)
      .orderBy(member.createdAt)

    // Generate data for last 6 months
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)

      const monthName = targetDate.toLocaleDateString('en-US', { month: 'short' })

      // Count new members in this month
      const newMembers = allMembers.filter(m => {
        if (!m.createdAt) return false
        const createdDate = new Date(m.createdAt)
        return createdDate >= targetDate && createdDate < nextMonth
      }).length

      // Count total members up to end of this month
      const totalMembers = allMembers.filter(m => {
        if (!m.createdAt) return false
        const createdDate = new Date(m.createdAt)
        return createdDate < nextMonth
      }).length

      monthsData.push({
        month: monthName,
        newMembers,
        totalMembers,
      })
    }

    return {
      success: true,
      data: monthsData,
    }
  } catch (err) {
    console.error('Error fetching member growth data:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch member growth data',
    })
  }
})
