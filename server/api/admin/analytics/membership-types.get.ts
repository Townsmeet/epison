import { count } from 'drizzle-orm'
import { db } from '../../../utils/drizzle'
import { member } from '../../../db/schema'
import { requireAuthUser } from '../../../utils/auth-helpers'

interface MembershipTypeStats {
  name: string
  count: number
  percentage: number
  color: string
}

// Color mapping for different membership types
const colorMap: Record<string, string> = {
  regular: '#3B82F6', // blue
  'regular iea': '#10B981', // green
  'early-career': '#F59E0B', // amber
  student: '#8B5CF6', // purple
  honorary: '#EC4899', // pink
  associate: '#06B6D4', // cyan
  fellow: '#EF4444', // red
}

// Display name mapping
const displayNameMap: Record<string, string> = {
  regular: 'Regular Member',
  'regular iea': 'Regular IEA Member',
  'early-career': 'Early Career Member',
  student: 'Student Member',
  honorary: 'Honorary Member',
  associate: 'Associate Member',
  fellow: 'Fellow',
}

export default defineEventHandler(async eventHandler => {
  // Auth
  requireAuthUser(eventHandler)

  try {
    // Get total count
    const totalResult = await db.select({ count: count() }).from(member)
    const total = totalResult[0]?.count || 0

    // Get counts by membership type
    const typeCounts = await db
      .select({
        type: member.membershipType,
        count: count(),
      })
      .from(member)
      .groupBy(member.membershipType)

    // Transform data to include percentages and colors
    const membershipTypes: MembershipTypeStats[] = typeCounts
      .filter(item => item.type) // Filter out null/undefined types
      .map(item => {
        const typeKey = item.type?.toLowerCase() || 'unknown'
        const percentage = total > 0 ? Number(((item.count / total) * 100).toFixed(1)) : 0

        return {
          name: displayNameMap[typeKey] || item.type || 'Unknown',
          count: item.count,
          percentage,
          color: colorMap[typeKey] || '#6B7280', // Default gray color
        }
      })
      .sort((a, b) => b.count - a.count) // Sort by count descending

    return {
      success: true,
      data: membershipTypes,
      total,
    }
  } catch (err) {
    console.error('Error fetching membership type statistics:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch membership type statistics',
    })
  }
})
