export interface AbstractSubmission {
  id: string
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
  category: 'oral' | 'poster' | 'workshop'
  subtheme?: string
  // Optional notes provided by the submitter
  notes?: string
  submissionDate: string
  status: 'pending' | 'under_review' | 'accepted' | 'rejected' | 'revision_required'
  reviewerComments?: string
  attachments?: {
    id: string
    filename: string
    url: string
    type: string
    size: number
  }[]
}

export interface SubmissionCategory {
  id: string
  label: string
}

export const submissionCategories: SubmissionCategory[] = [
  {
    id: 'oral',
    label: 'Oral Presentation',
  },
  {
    id: 'poster',
    label: 'Poster Presentation',
  },
  {
    id: 'workshop',
    label: 'Workshop Proposal',
  },
]
