import type { Ref, ComputedRef } from 'vue'
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
    // If query is a ref/computed, use it directly; otherwise wrap it
    const queryRef = isRef(query) ? query : ref(query)

    return useFetch<PaginatedResponse<MemberListItem>>('/api/members', {
      query: queryRef,
      watch: [queryRef],
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

  const getMember = (id: string) => {
    return useFetch<ApiResponse<MemberDetail>>(`/api/members/${id}`, {
      key: `member-${id}`,
      server: true,
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

  // Mutations using $fetch
  const createMember = async (data: CreateMemberRequest) => {
    return await $fetch<ApiResponse<MemberDetail>>('/api/members', {
      retry: 3,
      retryDelay: 1000,
      method: 'POST',
      body: data,
    })
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

  const renewMember = async (id: string, data: MemberActionRequest) => {
    return await $fetch<ApiResponse<MemberDetail>>(`/api/members/${id}/renew`, {
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
    deleteMember,
    activateMember,
    suspendMember,
    renewMember,
    remindMember,

    // Utilities
    refreshMembers,
    refreshMember,
    refreshStats,
  }
}
