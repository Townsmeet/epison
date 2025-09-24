export interface AbstractSubmission {
  id: number
  eventId: number
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
  // Optional notes provided by the submitter
  notes?: string
  submissionDate: string
  status: 'pending' | 'under_review' | 'accepted' | 'rejected' | 'revision_required'
  reviewerComments?: string
  attachments?: {
    id: number
    filename: string
    url: string
    type: string
    size: number
  }[]
}

export interface SubmissionCategory {
  id: string
  label: string
  description: string
  maxWords: number
  requirements: string[]
}

export const submissionCategories: SubmissionCategory[] = [
  {
    id: 'oral',
    label: 'Oral Presentation',
    description: 'Research presentations for the main conference sessions',
    maxWords: 300,
    requirements: [
      'Original research work',
      'Clear methodology and results',
      'Relevance to epidemiology or public health',
    ],
  },
  {
    id: 'poster',
    label: 'Poster Presentation',
    description: 'Visual presentations for poster sessions',
    maxWords: 250,
    requirements: [
      'Preliminary or completed research',
      'Visual presentation format',
      'Interactive discussion opportunity',
    ],
  },
  {
    id: 'workshop',
    label: 'Workshop Proposal',
    description: 'Interactive workshop sessions',
    maxWords: 400,
    requirements: [
      'Educational or training content',
      'Interactive format',
      'Clear learning objectives',
    ],
  },
]
