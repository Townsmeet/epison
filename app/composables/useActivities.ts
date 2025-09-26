import type { PaginatedResponse } from '../../types/api'

export interface ActivityLogRow {
  id: string
  type: 'Registration' | 'Payment' | 'Event' | 'Membership' | string
  title: string
  description?: string | null
  icon?: string | null
  iconColor?: string | null
  actorId?: string | null
  entityType?: string | null
  entityId?: string | null
  metadata?: string | null
  createdAt: string | Date
}

export interface ActivityListQuery {
  q?: string
  type?: string // 'All' | 'Registration' | 'Payment' | 'Event' | 'Membership'
  page?: number
  limit?: number
  sort?: string // default -createdAt
}

export const useActivities = () => {
  const getActivities = (query: ActivityListQuery = {}) =>
    useFetch<PaginatedResponse<ActivityLogRow>>('/api/admin/activities', {
      query,
      key: `admin-activities-${JSON.stringify(query)}`,
      server: true,
      default: () => ({
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      }),
    })

  return { getActivities }
}
