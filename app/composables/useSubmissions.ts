import type { AbstractSubmission } from '../../types/submissions'

export function useSubmissions() {
  // Check if submissions are open for an event
  const isSubmissionOpen = (_eventId: string) => {
    // Submissions are always open for events that collect submissions
    // The actual check for collectsSubmissions is done in the component
    // This function just returns true to allow the button to show
    // In a real implementation, you might check submission deadlines here
    return true
  }

  // Submit a new abstract via API
  const submitAbstract = async (
    submission: Omit<AbstractSubmission, 'id' | 'submissionDate' | 'status' | 'reviewerComments'>
  ) => {
    const response = await $fetch(`/api/events/${submission.eventId}/submissions`, {
      method: 'POST',
      body: {
        title: submission.title,
        abstract: submission.abstract,
        authors: submission.authors,
        correspondingAuthor: submission.correspondingAuthor,
        keywords: submission.keywords,
        category: submission.category,
        notes: submission.notes,
      },
    })

    return response
  }

  // Admin functions for managing submissions
  const getSubmissions = async (params?: {
    page?: number
    limit?: number
    q?: string
    status?: string
    category?: string
    eventId?: string
    sort?: string
  }) => {
    const queryParams = new URLSearchParams()

    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.q) queryParams.append('q', params.q)
    if (params?.status) queryParams.append('status', params.status)
    if (params?.category) queryParams.append('category', params.category)
    if (params?.eventId) queryParams.append('eventId', params.eventId)
    if (params?.sort) queryParams.append('sort', params.sort)

    const response = await $fetch(`/api/admin/submissions?${queryParams.toString()}`)

    return response
  }

  const getSubmission = async (submissionId: string) => {
    const response = await $fetch(`/api/admin/submissions/${submissionId}`)

    return response
  }

  const updateSubmission = async (
    submissionId: string,
    updates: Partial<
      Pick<
        AbstractSubmission,
        | 'title'
        | 'abstract'
        | 'authors'
        | 'correspondingAuthor'
        | 'keywords'
        | 'category'
        | 'notes'
        | 'status'
        | 'reviewerComments'
      >
    >
  ) => {
    const response = await $fetch(`/api/admin/submissions/${submissionId}`, {
      method: 'PATCH',
      body: updates,
    })

    return response
  }

  const deleteSubmission = async (submissionId: string) => {
    const response = await $fetch(`/api/admin/submissions/${submissionId}`, {
      method: 'DELETE',
    })

    return response
  }

  return {
    isSubmissionOpen,
    submitAbstract,
    getSubmissions,
    getSubmission,
    updateSubmission,
    deleteSubmission,
  }
}
