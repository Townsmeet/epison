import type { Ref, ComputedRef } from 'vue'
import { toValue } from 'vue'
import type {
  MemberListItem,
  MemberDetail,
  MemberStats,
  CreateMemberRequest,
  UpdateMemberRequest,
  MemberActionRequest,
} from '../../types/members'
import type { ApiResponse, PaginatedResponse } from '../../types/api'

export interface MemberListQuery {
  page?: number
  limit?: number
  search?: string
  status?: string
  type?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export const useMembers = () => {
  // GET requests using useFetch/useAsyncData
  const getMembers = (
    query: MemberListQuery | Ref<MemberListQuery> | ComputedRef<MemberListQuery> = {}
  ) => {
    return useFetch<PaginatedResponse<MemberListItem>>('/api/members', {
      query,
      watch: [query],
      server: true,
      default: () => ({
        success: false,
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
  }

  const getMember = (id: string | Ref<string> | ComputedRef<string>) => {
    return useFetch<ApiResponse<MemberDetail>>(() => `/api/members/${toValue(id)}`, {
      key: `member-${toValue(id)}`,
      server: true,
      immediate: !!toValue(id),
      watch: [() => toValue(id)],
      default: () => ({
        success: false,
        error: 'Member not found',
      }),
    })
  }

  interface MemberHistoryItem {
    id: string
    memberId: string
    action: string
    type: string
    date: string
    notes?: string
  }

  const getMemberHistory = (id: string) => {
    return useFetch<ApiResponse<MemberHistoryItem[]>>(`/api/members/${id}/history`, {
      key: `member-history-${id}`,
      server: true,
      default: () => ({ success: false, data: [] }),
    })
  }

  const getMemberStats = () => {
    return useFetch<ApiResponse<MemberStats>>('/api/members/stats', {
      key: 'member-stats',
      // Fetch client-side so calling refresh() updates immediately after actions
      server: false,
      default: () => ({
        success: false,
        data: {
          total: 0,
          byStatus: {},
          byType: {},
          recentJoins: 0,
          expiringThisMonth: 0,
        },
      }),
    })
  }

  // Helper for retrying fetch requests with exponential backoff
  // Retries on network errors AND when API returns { success: false }
  const fetchWithRetry = async <T extends { success: boolean; error?: string }>(
    url: string,
    options: Parameters<typeof $fetch>[1],
    maxRetries = 3,
    baseDelay = 1000
  ): Promise<T> => {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(`[fetchWithRetry] Attempt ${attempt}/${maxRetries} for ${url}`)
      try {
        const result = await $fetch<T>(url, options)

        // Check if API returned success: false (should retry)
        if (result && result.success === false) {
          const errorMsg = result.error || 'API returned success: false'
          console.error(
            `[fetchWithRetry] Attempt ${attempt}/${maxRetries} API error for ${url}:`,
            errorMsg
          )
          lastError = new Error(errorMsg)

          if (attempt < maxRetries) {
            const delay = baseDelay * Math.pow(2, attempt - 1)
            console.log(`[fetchWithRetry] Waiting ${delay}ms before retry...`)
            await new Promise(resolve => setTimeout(resolve, delay))
            continue
          }
        } else {
          console.log(`[fetchWithRetry] Success on attempt ${attempt}`)
          return result
        }
      } catch (error) {
        lastError = error as Error
        console.error(`[fetchWithRetry] Attempt ${attempt}/${maxRetries} FAILED for ${url}:`, error)

        if (attempt < maxRetries) {
          // Exponential backoff: 1s, 2s, 4s
          const delay = baseDelay * Math.pow(2, attempt - 1)
          console.log(`[fetchWithRetry] Waiting ${delay}ms before retry...`)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }

    console.error(`[fetchWithRetry] All ${maxRetries} attempts failed for ${url}`)
    throw lastError
  }

  // Mutations using $fetch with explicit retry
  const createMember = async (data: CreateMemberRequest) => {
    return await fetchWithRetry<ApiResponse<MemberDetail>>(
      '/api/members',
      { method: 'POST', body: data },
      3,
      1000
    )
  }

  const updateMember = async (id: string, data: UpdateMemberRequest) => {
    return await $fetch<ApiResponse<MemberDetail>>(`/api/members/${id}`, {
      method: 'PUT',
      body: data,
    })
  }

  const deleteMember = async (id: string) => {
    return await $fetch<ApiResponse>(`/api/members/${id}`, {
      method: 'DELETE',
    })
  }

  const updateMemberPayment = async (id: string, paymentReference: string) => {
    return await fetchWithRetry<ApiResponse<{ success: boolean }>>(
      `/api/members/${id}/payment`,
      { method: 'POST', body: { paymentReference } },
      3,
      1000
    )
  }

  const activateMember = async (id: string, data: MemberActionRequest = {}) => {
    return await $fetch<ApiResponse<MemberDetail>>(`/api/members/${id}/activate`, {
      method: 'POST',
      body: data,
    })
  }

  const suspendMember = async (id: string, data: MemberActionRequest) => {
    return await $fetch<ApiResponse<MemberDetail>>(`/api/members/${id}/suspend`, {
      method: 'POST',
      body: data,
    })
  }

  const renewMember = async (
    id: string,
    data: { email?: string; fees: number; paymentReference: string }
  ) => {
    return await fetchWithRetry<ApiResponse<MemberDetail>>(
      `/api/members/${id}/renew`,
      { method: 'POST', body: data },
      3,
      1000
    )
  }

  // Admin renewal (no payment required)
  const adminRenewMember = async (id: string, data: { reason?: string; notes?: string } = {}) => {
    return await $fetch<ApiResponse<MemberDetail>>(`/api/admin/members/${id}/renew`, {
      method: 'POST',
      body: data,
    })
  }

  // Send renewal reminder email
  const remindMember = async (id: string) => {
    return await $fetch<ApiResponse<{ sent: boolean }>>(`/api/members/${id}/remind`, {
      method: 'POST',
    })
  }

  // Search members (for renewal/lookup)
  const searchMembers = async (query: string, limit = 10) => {
    return await $fetch<PaginatedResponse<MemberListItem>>('/api/members', {
      query: { search: query, limit },
    })
  }

  // Utility functions for reactive data management
  const refreshMembers = (query: MemberListQuery = {}) => {
    return refreshCookie(`members-${JSON.stringify(query)}`)
  }

  const refreshMember = (id: string) => {
    return refreshCookie(`member-${id}`)
  }

  const refreshStats = () => {
    return refreshCookie('member-stats')
  }

  return {
    // GET requests
    getMembers,
    getMember,
    getMemberHistory,
    getMemberStats,

    // Mutations
    createMember,
    updateMember,
    updateMemberPayment,
    deleteMember,
    activateMember,
    suspendMember,
    renewMember,
    adminRenewMember,
    remindMember,
    searchMembers,

    // Utilities
    refreshMembers,
    refreshMember,
    refreshStats,
  }
}
