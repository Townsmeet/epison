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
}

export function useEvents() {
  // Mock events data (shared)
  const events = ref<EventItem[]>([
    {
      id: 1,
      title: 'Annual Scientific Conference 2024',
      type: 'conference',
      status: 'registration_open',
      startDate: '2024-11-15T09:00',
      endDate: '2024-11-17T17:00',
      location: 'Lagos Continental Hotel, Lagos',
      capacity: 500,
      registrations: 245,
      revenue: 12250000,
      description:
        'Join us for the biggest epidemiological conference in Nigeria featuring international speakers and cutting-edge research presentations.',
    },
    {
      id: 2,
      title: 'Workshop on Data Analysis',
      type: 'workshop',
      status: 'registration_open',
      startDate: '2024-10-15T10:00',
      endDate: '2024-10-15T16:00',
      location: 'University of Lagos, Lagos',
      capacity: 50,
      registrations: 45,
      revenue: 2250000,
      description:
        'Hands-on workshop covering statistical analysis methods for epidemiological research using R and SPSS.',
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
    },
    {
      id: 4,
      title: 'COVID-19 Research Webinar',
      type: 'webinar',
      status: 'draft',
      startDate: '2024-12-01T15:00',
      endDate: '2024-12-01T17:00',
      location: 'Online',
      capacity: 1000,
      registrations: 0,
      revenue: 0,
      description:
        'Online presentation of latest COVID-19 research findings and their implications for public health policy.',
    },
  ])

  return { events }
}
