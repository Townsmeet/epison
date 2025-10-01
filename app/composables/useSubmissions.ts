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
    submission: Omit<AbstractSubmission, 'id' | 'submissionDate' | 'status'>
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

  return {
    isSubmissionOpen,
    submitAbstract,
  }
}
