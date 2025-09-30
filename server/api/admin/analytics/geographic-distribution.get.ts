import { count, isNotNull } from 'drizzle-orm'
import { db } from '../../../utils/drizzle'
import { member } from '../../../db/schema'
import { requireAuthUser } from '../../../utils/auth-helpers'

interface GeographicStats {
  state: string
  count: number
  percentage: number
  color: string
}

// Color mapping for states
const stateColors: Record<string, string> = {
  Lagos: '#3B82F6', // blue
  'FCT (Abuja)': '#10B981', // green
  Kano: '#F59E0B', // amber
  Rivers: '#EF4444', // red
  Oyo: '#8B5CF6', // purple
  Kaduna: '#06B6D4', // cyan
  Enugu: '#EC4899', // pink
  Anambra: '#14B8A6', // teal
  Ogun: '#F97316', // orange
  Delta: '#A855F7', // violet
}

export default defineEventHandler(async eventHandler => {
  // Auth
  requireAuthUser(eventHandler)

  try {
    // Get total count of members with state
    const totalResult = await db
      .select({ count: count() })
      .from(member)
      .where(isNotNull(member.state))
    const total = totalResult[0]?.count || 0

    if (total === 0) {
      return {
        success: true,
        data: [],
        total: 0,
      }
    }

    // Get counts by state
    const stateCounts = await db
      .select({
        state: member.state,
        count: count(),
      })
      .from(member)
      .where(isNotNull(member.state))
      .groupBy(member.state)

    // Transform data to include percentages and colors
    const geographicData: GeographicStats[] = stateCounts
      .map(item => {
        const stateName = item.state || 'Unknown'
        const percentage = total > 0 ? Number(((item.count / total) * 100).toFixed(1)) : 0

        return {
          state: stateName,
          count: item.count,
          percentage,
          color: stateColors[stateName] || '#6B7280', // Default gray color
        }
      })
      .sort((a, b) => b.count - a.count) // Sort by count descending
      .slice(0, 10) // Top 10 states

    // Calculate "Others" if there are more than 10 states
    if (stateCounts.length > 10) {
      const topStatesCount = geographicData.reduce((sum, item) => sum + item.count, 0)
      const othersCount = total - topStatesCount
      const othersPercentage = Number(((othersCount / total) * 100).toFixed(1))

      geographicData.push({
        state: 'Others',
        count: othersCount,
        percentage: othersPercentage,
        color: '#6B7280', // Gray
      })
    }

    return {
      success: true,
      data: geographicData,
      total,
    }
  } catch (err) {
    console.error('Error fetching geographic distribution:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch geographic distribution',
    })
  }
})
