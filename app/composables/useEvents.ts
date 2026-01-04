import type {
  Event,
  EventWithDetails,
  CreateEventForm,
  EventRegistration,
  EventTicket,
  EventSponsor,
  EventCommitteeMember,
  AbstractSubmission,
  EventMedia,
  TicketCategory,
  TicketDisplayStructure,
} from '../../types/event'
import type { ApiResponse, PaginatedResponse } from '../../types/api'
// Ticket category types
interface CreateTicketCategoryRequest {
  name: string
  description?: string
  displayOrder?: number
}

export interface EventListQuery {
  page?: number
  limit?: number
  q?: string
  status?: string
  type?: string
  sort?: string
  from?: string
  to?: string
  upcoming?: boolean
}

export interface RegistrationListQuery {
  page?: number
  limit?: number
  q?: string
  category?: string
  paymentStatus?: string
  sort?: string
}

export interface SubmissionListQuery {
  page?: number
  limit?: number
  q?: string
  status?: string
  category?: string
  sort?: string
}

// Legacy type for backward compatibility
export type EventItem = Event & {
  registrations?: number
  revenue?: number
  registrationCount?: number
  // Additional properties for backward compatibility with existing components
  committee?: Array<{
    id: number
    name: string
    role?: string
    email?: string
    phone?: string
  }>
  sponsors?: Array<{
    id: number
    name: string
    tier?: 'platinum' | 'gold' | 'silver' | 'bronze' | 'partner' | string
    logoUrl: string
    website?: string
  }>
  speakers?: Array<{
    id: number
    name: string
    title?: string
    org?: string
    photoUrl?: string
    bio?: string
  }>
  gallery?: Array<{
    id: number
    url: string
    caption?: string
    type?: 'image' | 'video'
  }>
}

export const useEvents = () => {
  // GET requests using useFetch/useAsyncData
  const getEvents = (query: EventListQuery | Ref<EventListQuery> = {}) => {
    const q = unref(query)
    return useFetch<PaginatedResponse<Event>>('/api/admin/events', {
      query: q,
      key: `admin-events-${JSON.stringify(q)}`,
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
  }

  // Public events endpoint (no auth required)
  const getPublicEvents = (query: EventListQuery | Ref<EventListQuery> = {}) => {
    const q = computed(() => unref(query))
    return useFetch<PaginatedResponse<Event>>('/api/events', {
      query: q,
      key: computed(() => `public-events-${JSON.stringify(q.value)}`),
      server: true,
      watch: [q],
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
  }

  // Public single event by slug (no auth required)
  const getPublicEventBySlug = (slug: string) => {
    return useFetch<EventWithDetails>(`/api/events/slug/${slug}`, {
      key: `public-event-slug-${slug}`,
      server: true,
      default: () => ({
        id: '',
        slug: '',
        title: '',
        type: 'conference' as const,
        status: 'draft' as const,
        startDate: '',
        location: '',
        membersOnly: false,
        collectsSubmissions: false,
        createdAt: '',
        updatedAt: '',
      }),
    })
  }

  const getEvent = (id: string) => {
    return useFetch<ApiResponse<EventWithDetails>>(`/api/admin/events/${id}`, {
      key: `admin-event-${id}`,
      server: true,
      default: () => ({
        success: true,
        data: {
          id: '',
          slug: '',
          title: '',
          type: 'conference' as const,
          status: 'draft' as const,
          startDate: '',
          location: '',
          membersOnly: false,
          collectsSubmissions: false,
          createdAt: '',
          updatedAt: '',
        },
      }),
    })
  }

  // Mutations using $fetch
  const createEvent = async (data: CreateEventForm) => {
    return await $fetch<Event>('/api/admin/events', {
      method: 'POST',
      credentials: 'include',
      body: data,
    })
  }

  const updateEvent = async (id: string, data: Partial<CreateEventForm>) => {
    return await $fetch<Event>(`/api/admin/events/${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: data,
    })
  }

  const deleteEvent = async (id: string) => {
    return await $fetch<ApiResponse>(`/api/admin/events/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
  }

  // Event Registrations
  const getEventRegistrations = (eventId: string, query: RegistrationListQuery = {}) => {
    return useFetch<PaginatedResponse<EventRegistration>>(
      `/api/admin/events/${eventId}/registrations`,
      {
        query,
        key: `event-registrations-${eventId}-${JSON.stringify(query)}`,
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
      }
    )
  }

  // All registrations (admin-level)
  const getRegistrations = (query: RegistrationListQuery | Ref<RegistrationListQuery> = {}) => {
    const q = computed(() => unref(query))
    return useFetch<PaginatedResponse<EventRegistration>>('/api/admin/registrations', {
      query: q,
      key: computed(() => `admin-registrations-${JSON.stringify(q.value)}`),
      server: true,
      watch: [q],
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
  }

  // Registration stats (admin-level)
  const getRegistrationStats = () => {
    return useFetch<
      ApiResponse<{
        total: number
        paid: number
        pending: number
        cancelled: number
        refunded: number
      }>
    >('/api/admin/registrations/stats', {
      key: 'admin-registration-stats',
      server: false,
      default: () => ({
        success: false,
        data: {
          total: 0,
          paid: 0,
          pending: 0,
          cancelled: 0,
          refunded: 0,
        },
      }),
    })
  }

  // Event Sponsors
  const getEventSponsors = (eventId: string) => {
    return useFetch<{ data: EventSponsor[] }>(`/api/admin/events/${eventId}/sponsors`, {
      key: `event-sponsors-${eventId}`,
      server: true,
      default: () => ({ data: [] }),
    })
  }

  const createEventSponsor = async (
    eventId: string,
    data: Omit<EventSponsor, 'id' | 'eventId' | 'createdAt'>
  ) => {
    return await $fetch<EventSponsor>(`/api/admin/events/${eventId}/sponsors`, {
      method: 'POST',
      credentials: 'include',
      body: data,
    })
  }

  const deleteEventSponsor = async (eventId: string, sponsorId: string) => {
    return await $fetch<ApiResponse>(`/api/admin/events/${eventId}/sponsors/${sponsorId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
  }

  // Event Tickets
  const getEventTickets = (eventId: string) => {
    return useFetch<{ data: EventTicket[] }>(`/api/admin/events/${eventId}/tickets`, {
      key: `event-tickets-${eventId}`,
      server: true,
      default: () => ({ data: [] }),
    })
  }

  const createEventTicket = async (
    eventId: string,
    data: Omit<EventTicket, 'id' | 'eventId' | 'createdAt' | 'updatedAt'>
  ) => {
    return await $fetch<EventTicket>(`/api/admin/events/${eventId}/tickets`, {
      method: 'POST',
      credentials: 'include',
      body: data,
    })
  }

  const updateEventTicket = async (
    ticketId: string,
    data: Omit<EventTicket, 'id' | 'eventId' | 'createdAt' | 'updatedAt'>
  ) => {
    return await $fetch<EventTicket>(`/api/admin/tickets/${ticketId}`, {
      method: 'PUT',
      body: data,
      credentials: 'include',
    })
  }

  const deleteEventTicket = async (eventId: string, ticketId: string) => {
    return await $fetch<ApiResponse>(`/api/admin/events/${eventId}/tickets/${ticketId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
  }

  // Event Committee
  const getEventCommittee = (eventId: string) => {
    return useFetch<{ data: EventCommitteeMember[] }>(`/api/admin/events/${eventId}/committee`, {
      key: `event-committee-${eventId}`,
      server: true,
      default: () => ({ data: [] }),
    })
  }

  const createEventCommitteeMember = async (
    eventId: string,
    data: Omit<EventCommitteeMember, 'id' | 'eventId' | 'createdAt'>
  ) => {
    return await $fetch<EventCommitteeMember>(`/api/admin/events/${eventId}/committee`, {
      method: 'POST',
      credentials: 'include',
      body: data,
    })
  }

  const deleteEventCommitteeMember = async (eventId: string, memberId: string) => {
    return await $fetch<ApiResponse>(`/api/admin/events/${eventId}/committee/${memberId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
  }

  const updateEventCommitteeMember = async (
    memberId: string,
    data: Partial<Omit<EventCommitteeMember, 'id' | 'eventId' | 'createdAt'>>
  ) => {
    return await $fetch<EventCommitteeMember>(`/api/admin/committee/${memberId}`, {
      method: 'PUT',
      credentials: 'include',
      body: data,
    })
  }

  // Event Submissions
  const getEventSubmissions = (eventId: string, query: SubmissionListQuery = {}) => {
    return useFetch<PaginatedResponse<AbstractSubmission>>(
      `/api/admin/events/${eventId}/submissions`,
      {
        query,
        key: `event-submissions-${eventId}-${JSON.stringify(query)}`,
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
      }
    )
  }

  // Event Media/Gallery
  const getEventMedia = (eventId: string) => {
    return useFetch<{ data: EventMedia[] }>(`/api/admin/events/${eventId}/media`, {
      key: `event-media-${eventId}`,
      server: true,
      default: () => ({ data: [] }),
    })
  }

  const createEventMedia = async (
    eventId: string,
    data: Omit<EventMedia, 'id' | 'eventId' | 'createdAt'>
  ) => {
    return await $fetch<EventMedia>(`/api/admin/events/${eventId}/media`, {
      method: 'POST',
      credentials: 'include',
      body: data,
    })
  }

  const deleteEventMedia = async (eventId: string, mediaId: string) => {
    return await $fetch<ApiResponse>(`/api/admin/events/${eventId}/media/${mediaId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
  }

  // Public: Create an event registration (generates payment reference)
  const createPublicEventRegistration = async (
    eventId: string,
    data: {
      attendeeName: string
      attendeeEmail: string
      category?: string
      ticketId?: string
      quantity?: number
    }
  ) => {
    return await $fetch<{
      id: string
      eventId: string
      attendeeName: string
      attendeeEmail: string
      totalAmount: number // kobo
      currency: string
      paymentStatus: 'Pending' | 'Paid' | 'Cancelled' | 'Refunded'
      paymentReference?: string | null
      paymentData?: { reference: string; amount: number; email: string; currency: string }
    }>(`/api/events/${eventId}/registrations`, {
      method: 'POST',
      body: data,
    })
  }

  // Utility functions for reactive data management
  const refreshEvents = (query: EventListQuery | Ref<EventListQuery> = {}) => {
    const q = unref(query)
    return refreshCookie(`admin-events-${JSON.stringify(q)}`)
  }

  const refreshEvent = (id: string) => {
    return refreshCookie(`admin-event-${id}`)
  }

  const refreshEventRegistrations = (eventId: string, query: RegistrationListQuery = {}) => {
    return refreshCookie(`event-registrations-${eventId}-${JSON.stringify(query)}`)
  }

  const refreshRegistrations = (query: RegistrationListQuery = {}) => {
    return refreshCookie(`admin-registrations-${JSON.stringify(query)}`)
  }

  const refreshEventSponsors = (eventId: string) => {
    return refreshCookie(`event-sponsors-${eventId}`)
  }

  const refreshEventTickets = (eventId: string) => {
    return refreshCookie(`event-tickets-${eventId}`)
  }

  const refreshEventCommittee = (eventId: string) => {
    return refreshCookie(`event-committee-${eventId}`)
  }

  const refreshEventSubmissions = (eventId: string, query: SubmissionListQuery = {}) => {
    return refreshCookie(`event-submissions-${eventId}-${JSON.stringify(query)}`)
  }

  const refreshEventMedia = (eventId: string) => {
    return refreshCookie(`event-media-${eventId}`)
  }

  // ===== Ticket Categories =====
  const getTicketCategories = (eventId: string) => {
    return useLazyFetch<ApiResponse<TicketCategory[]>>(`/api/admin/events/${eventId}/categories`, {
      key: `event-categories-${eventId}`,
      server: false,
    })
  }

  const getTicketsWithCategories = (eventId: string) => {
    return useLazyFetch<ApiResponse<TicketDisplayStructure>>(
      `/api/admin/events/${eventId}/tickets-with-categories`,
      {
        key: `event-tickets-categories-${eventId}`,
        server: false,
      }
    )
  }

  const getPublicTicketsStructured = (eventId: string) => {
    return useLazyFetch<ApiResponse<TicketDisplayStructure>>(
      `/api/events/${eventId}/tickets-structured`,
      {
        key: `public-tickets-structured-${eventId}`,
        server: false,
      }
    )
  }

  const createTicketCategory = async (eventId: string, data: CreateTicketCategoryRequest) => {
    return await $fetch<TicketCategory>(`/api/admin/events/${eventId}/categories`, {
      method: 'POST',
      body: data,
    })
  }

  const updateTicketCategory = async (
    categoryId: string,
    data: Partial<CreateTicketCategoryRequest>
  ) => {
    return await $fetch<TicketCategory>(`/api/admin/categories/${categoryId}`, {
      method: 'PUT',
      body: data,
    })
  }

  const deleteTicketCategory = async (categoryId: string) => {
    return await $fetch<{ success: boolean; message: string }>(
      `/api/admin/categories/${categoryId}`,
      {
        method: 'DELETE',
      }
    )
  }

  const refreshTicketCategories = (eventId: string) => {
    return refreshCookie(`event-categories-${eventId}`)
  }

  const refreshTicketsWithCategories = (eventId: string) => {
    return refreshCookie(`event-tickets-categories-${eventId}`)
  }

  return {
    // GET requests
    getEvents,
    getPublicEvents,
    getPublicEventBySlug,
    getEvent,
    getEventRegistrations,
    getRegistrations,
    getRegistrationStats,
    getEventSponsors,
    getEventTickets,
    getEventCommittee,
    getEventSubmissions,
    getEventMedia,

    // Mutations
    createEvent,
    updateEvent,
    deleteEvent,
    createEventSponsor,
    deleteEventSponsor,
    createEventTicket,
    updateEventTicket,
    deleteEventTicket,
    createEventCommitteeMember,
    updateEventCommitteeMember,
    deleteEventCommitteeMember,
    createEventMedia,
    deleteEventMedia,
    createPublicEventRegistration,

    // Utilities
    refreshEvents,
    refreshEvent,
    refreshEventRegistrations,
    refreshRegistrations,
    refreshEventSponsors,
    refreshEventTickets,
    refreshEventCommittee,
    refreshEventSubmissions,
    refreshEventMedia,

    // Ticket Categories
    getTicketCategories,
    getTicketsWithCategories,
    getPublicTicketsStructured,
    createTicketCategory,
    updateTicketCategory,
    deleteTicketCategory,
    refreshTicketCategories,
    refreshTicketsWithCategories,
  }
}
