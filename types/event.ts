// Event-related TypeScript types for the frontend

export interface Event {
  id: string
  slug: string
  title: string
  type: 'conference' | 'workshop' | 'webinar' | 'seminar' | 'symposium'
  status:
    | 'draft'
    | 'published'
    | 'registration_open'
    | 'registration_closed'
    | 'ongoing'
    | 'completed'
    | 'cancelled'
  startDate: string // ISO string
  endDate?: string // ISO string
  location: string
  capacity?: number
  description?: string
  bannerUrl?: string
  membersOnly: boolean
  collectsSubmissions: boolean
  theme?: string
  subthemes?: string[]
  submissionGuidelines?: string
  submissionDates?: Array<{
    label: string
    date?: string
    startDate?: string
    endDate?: string
  }>
  createdAt: string
  updatedAt: string
}

export interface EventTicket {
  id: string
  eventId: string
  name: string
  price: number // in kobo
  quantity: number
  salesStart?: string
  salesEnd?: string
  description?: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export interface EventSponsor {
  id: string
  eventId: string
  name: string
  tier?: string
  logoUrl: string
  website?: string
  createdAt: string
}

export interface EventSpeaker {
  id: string
  eventId: string
  name: string
  title?: string
  org?: string
  photoUrl?: string
  bio?: string
  createdAt: string
}

export interface EventMedia {
  id: string
  eventId: string
  url: string
  caption?: string
  type: 'image' | 'video'
  createdAt: string
}

export interface EventCommitteeMember {
  id: string
  eventId: string
  name: string
  role?: string
  email?: string
  phone?: string
  createdAt: string
}

export interface EventRegistration {
  id: string
  eventId: string
  attendeeName: string
  attendeeEmail: string
  category?: 'Member' | 'Non-Member' | 'Student' | 'Speaker' | 'Sponsor'
  ticketId?: string
  ticketName?: string
  unitPrice?: number // in kobo
  quantity: number
  currency: string
  totalAmount: number // in kobo
  paymentStatus: 'Pending' | 'Paid' | 'Cancelled' | 'Refunded'
  reference?: string
  paymentProvider?: string
  paymentMetaJson?: string
  paidAt?: string
  refundedAt?: string
  registeredAt: string
  notes?: string
}

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
  notes?: string
  submissionDate: string
  status: 'pending' | 'under_review' | 'accepted' | 'rejected' | 'revision_required'
  reviewerComments?: string
}

// Extended event with related data for detailed views
export interface EventWithDetails extends Event {
  tickets?: EventTicket[]
  sponsors?: EventSponsor[]
  speakers?: EventSpeaker[]
  media?: EventMedia[]
  committee?: EventCommitteeMember[]
  registrationCount?: number
  submissionCount?: number
  revenue?: number
}

// API Response types
// Deprecated: Use ApiResponse and PaginatedResponse from types/api.ts instead of
// defining response shapes here.

// Form types for creating/updating
export interface CreateEventForm {
  title: string
  slug: string
  type: Event['type']
  status?: Event['status']
  startDate: string
  endDate?: string
  location: string
  capacity?: number
  description?: string
  bannerUrl?: string
  membersOnly?: boolean
  collectsSubmissions?: boolean
  theme?: string
  subthemes?: string[]
  submissionGuidelines?: string
  submissionDates?: Array<{
    label: string
    date?: string
    startDate?: string
    endDate?: string
  }>
}

export interface CreateRegistrationForm {
  attendeeName: string
  attendeeEmail: string
  category?: EventRegistration['category']
  ticketId?: string
  quantity?: number
}

export interface CreateSubmissionForm {
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
  category: AbstractSubmission['category']
  notes?: string
}
