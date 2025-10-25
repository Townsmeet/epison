import type { Ref, ComputedRef } from 'vue'
import type { AbstractSubmission } from '../../types/submissions'
import type { ApiResponse, PaginatedResponse } from '../../types/api'
import type { SubmissionListQuery } from './useEvents'

// Removed local SubmissionListQuery definition

export const useSubmissions = () => {
  // GET requests using useFetch/useAsyncData
  const getSubmissions = (
    query: SubmissionListQuery | Ref<SubmissionListQuery> | ComputedRef<SubmissionListQuery> = {}
  ) => {
    // If query is a ref/computed, use it directly; otherwise wrap it
    const queryRef = isRef(query) ? query : ref(query)

    return useFetch<PaginatedResponse<AbstractSubmission>>('/api/admin/submissions', {
      query: queryRef,
      watch: [queryRef],
      server: true,
      default: () => ({
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      }),
    })
  }

  const getSubmission = (id: string) => {
    return useFetch<ApiResponse<AbstractSubmission>>(`/api/admin/submissions/${id}`, {
      key: `submission-${id}`,
      server: true,
      default: () => ({
        success: false,
        error: 'Submission not found',
      }),
    })
  }

  // Mutations using $fetch
  const updateSubmission = async (
    id: string,
    updates: Partial<
      Pick<
        AbstractSubmission,
        | 'title'
        | 'abstract'
        | 'authors'
        | 'correspondingAuthor'
        | 'keywords'
        | 'category'
        | 'subtheme'
        | 'notes'
        | 'status'
        | 'reviewerComments'
      >
    >
  ) => {
    return await $fetch<ApiResponse<AbstractSubmission>>(`/api/admin/submissions/${id}`, {
      method: 'PATCH',
      body: updates,
    })
  }

  const deleteSubmission = async (id: string) => {
    return await $fetch<ApiResponse>(`/api/admin/submissions/${id}`, {
      method: 'DELETE',
    })
  }

  // Public submission creation
  const submitAbstract = async (submissionData: {
    eventId: string
    title: string
    abstract: string
    authors: string[]
    correspondingAuthor: {
      name: string
      email: string
      affiliation: string
      phone?: string
    }
    keywords: string[]
    category: string
    subtheme?: string
    notes?: string
  }) => {
    return await $fetch(`/api/events/${submissionData.eventId}/submissions`, {
      method: 'POST',
      body: submissionData,
    })
  }

  // Utility functions for reactive data management
  const refreshSubmissions = (query: SubmissionListQuery = {}) => {
    return refreshCookie(`submissions-${JSON.stringify(query)}`)
  }

  const refreshSubmission = (id: string) => {
    return refreshCookie(`submission-${id}`)
  }

  return {
    // GET requests
    getSubmissions,
    getSubmission,

    // Mutations
    updateSubmission,
    deleteSubmission,
    submitAbstract,

    // Utilities
    refreshSubmissions,
    refreshSubmission,
  }
}
