import { ref } from 'vue'

export type EventItem = {
  id: number
  title: string
  type: string
  status: string
  startDate: string // ISO string or yyyy-MM-ddTHH:mm
  endDate?: string // ISO string
  location: string
  capacity: number
  registrations: number
  revenue: number
  description: string
  // Whether this event collects submissions/abstracts
  collectsSubmissions?: boolean
  // Committee members organizing the event
  committee?: Array<{
    id: number
    name: string
    role?: string
    email?: string
    phone?: string
  }>
  // New: optional sponsors list for the event
  sponsors?: Array<{
    id: number
    name: string
    tier?: 'platinum' | 'gold' | 'silver' | 'bronze' | 'partner' | string
    logoUrl: string
    website?: string
  }>
  // New: optional speakers list for the event
  speakers?: Array<{
    id: number
    name: string
    title?: string
    org?: string
    photoUrl?: string
    bio?: string
  }>
  // New: optional gallery/media list for the event
  gallery?: Array<{
    id: number
    url: string
    caption?: string
    type?: 'image' | 'video'
  }>
}

export function useEvents() {
  // Mock events data (shared)
  const events = ref<EventItem[]>([
    {
      id: 1,
      title: 'Annual Scientific Conference 2025',
      type: 'conference',
      status: 'registration_open',
      startDate: '2025-11-15T09:00',
      endDate: '2025-11-17T17:00',
      location: 'Lagos Continental Hotel, Lagos',
      capacity: 500,
      registrations: 245,
      revenue: 12250000,
      description:
        'Join us for the biggest epidemiological conference in Nigeria featuring international speakers and cutting-edge research presentations.',
      collectsSubmissions: true,
      committee: [
        {
          id: 5001,
          name: 'Dr. Adaeze Okafor',
          role: 'Chair',
          email: 'adaeze.okafor@example.com',
          phone: '+234 803 000 0001',
        },
        { id: 5002, name: 'Prof. Tunde Alabi', role: 'Co-Chair', email: 'tunde.alabi@example.com' },
        {
          id: 5003,
          name: 'Chinwe Eze',
          role: 'Secretary',
          email: 'chinwe.eze@example.com',
          phone: '+234 802 111 2222',
        },
      ],
      sponsors: [
        {
          id: 1001,
          name: 'Federal Ministry of Health',
          tier: 'platinum',
          logoUrl: 'https://via.placeholder.com/160x80?text=MoH',
          website: 'https://health.gov.ng',
        },
      ],
      speakers: [
        {
          id: 3001,
          name: 'Dr. Adaeze Okafor',
          title: 'Chief Epidemiologist',
          org: 'Nigeria CDC',
          photoUrl:
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=640&auto=format&fit=crop',
          bio: 'Focus on infectious disease surveillance and response systems across West Africa.',
        },
        {
          id: 3002,
          name: 'Prof. Tunde Alabi',
          title: 'Professor of Public Health',
          org: 'University of Ibadan',
          photoUrl:
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=640&auto=format&fit=crop',
          bio: 'Researcher in epidemiological modeling and health systems strengthening.',
        },
      ],
      gallery: [
        {
          id: 2001,
          url: 'https://images.unsplash.com/photo-1533174072775-26d83692aa5d?auto=format&fit=crop&w=800&q=80',
          caption: 'Keynote session',
          type: 'image',
        },
      ],
    },
    {
      id: 2,
      title: 'Workshop on Data Analysis',
      type: 'workshop',
      status: 'registration_open',
      startDate: '2025-10-15T10:00',
      endDate: '2025-10-15T16:00',
      location: 'University of Lagos, Lagos',
      capacity: 50,
      registrations: 45,
      revenue: 2250000,
      description:
        'Hands-on workshop covering statistical analysis methods for epidemiological research using R and SPSS.',
      collectsSubmissions: false,
      committee: [
        { id: 5004, name: 'Musa Ibrahim', role: 'Coordinator', email: 'musa.ibrahim@example.com' },
      ],
      sponsors: [],
      gallery: [],
    },
    {
      id: 3,
      title: 'Public Health Forum',
      type: 'seminar',
      status: 'completed',
      startDate: '2024-09-20T14:00',
      endDate: '2024-09-20T18:00',
      location: 'Abuja International Conference Centre',
      capacity: 200,
      registrations: 180,
      revenue: 6000000,
      description:
        'Forum discussing current public health challenges and policy recommendations for Nigeria.',
      collectsSubmissions: false,
      committee: [],
      sponsors: [
        {
          id: 1002,
          name: 'WHO Nigeria',
          tier: 'gold',
          logoUrl: 'https://via.placeholder.com/160x80?text=WHO',
          website: 'https://www.who.int',
        },
      ],
      gallery: [],
    },
    {
      id: 4,
      title: 'COVID-19 Research Webinar',
      type: 'webinar',
      status: 'draft',
      startDate: '2025-12-01T15:00',
      endDate: '2025-12-01T17:00',
      location: 'Online',
      capacity: 1000,
      registrations: 0,
      revenue: 0,
      description:
        'Online presentation of latest COVID-19 research findings and their implications for public health policy.',
      collectsSubmissions: true,
      committee: [
        { id: 5005, name: 'Sarah Johnson', role: 'Program Lead', email: 'sarah.j@example.com' },
      ],
      sponsors: [],
      gallery: [],
    },
  ])

  return { events }
}
