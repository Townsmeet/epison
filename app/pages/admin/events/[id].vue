<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <UButton color="neutral" variant="ghost" icon="i-heroicons-arrow-left" @click="goBack"
          >Back</UButton
        >
        <span>/</span>
        <span class="text-gray-900 dark:text-white font-medium">Event Details</span>
      </div>
      <div class="flex items-center gap-2">
        <UButton color="neutral" variant="outline" icon="i-heroicons-pencil" @click="editEvent"
          >Edit</UButton
        >
        <UButton
          color="neutral"
          variant="outline"
          icon="i-heroicons-users"
          :class="[_getStatusBadgeClass('Registrations')]"
          @click="currentTab = 'Registrations' as any"
          >Registrations</UButton
        >
        <UButton color="error" variant="outline" icon="i-heroicons-trash" @click="deleteEvent"
          >Delete</UButton
        >
      </div>
    </div>

    <!-- Tabs -->
    <div class="mb-6">
      <div
        class="flex flex-wrap gap-2 p-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200/60 dark:border-gray-700/60"
      >
        <button
          v-for="tab in tabs"
          :key="tab"
          :class="[
            currentTab === tab
              ? 'bg-primary-600 text-white shadow'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
            'px-4 py-2 rounded-lg text-sm font-medium transition',
          ]"
          @click="switchTab(tab)"
        >
          {{ tab }}
        </button>
      </div>
    </div>

    <UAlert v-if="!event" title="Event not found" color="warning" variant="subtle" class="mb-6">
      <template #description>
        We couldn't find an event with ID "{{ id }}". It may have been removed.
      </template>
      <template #actions>
        <UButton color="primary" to="/admin/events" icon="i-heroicons-list-bullet"
          >Go to Events</UButton
        >
      </template>
    </UAlert>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Details Tab -->
        <AdminEventsDetailsTab v-if="event" v-show="currentTab === 'Details'" :event="event" />

        <!-- Tickets Tab -->
        <AdminEventsTicketsTab v-if="event" v-show="currentTab === 'Tickets'" :event="event" />

        <!-- Registrations Tab -->
        <AdminEventsRegistrationsTab
          v-show="currentTab === 'Registrations'"
          :event-title="event.title"
          :rows="allRegistrations"
          :format-date="_formatDate"
          :get-status-badge-class="_getStatusBadgeClass"
          :get-type-badge-class="_getTypeBadgeClass"
          :get-reg-action-items="_getRegActionItems"
        />

        <!-- Submissions Tab -->
        <AdminEventsSubmissionsTab
          v-if="event"
          v-show="currentTab === 'Submissions'"
          :event-id="event.id"
        />

        <!-- Sponsors Tab -->
        <AdminEventsSponsorsTab v-if="event" v-show="currentTab === 'Sponsors'" :event="event" />

        <!-- Gallery Tab -->
        <AdminEventsGalleryTab v-if="event" v-show="currentTab === 'Gallery'" :event="event" />
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <AdminEventsSidebarActions
          v-if="event"
          :event="event"
          @share="shareEvent"
          @duplicate="duplicateEvent"
          @export="exportEvent"
          @cancel="cancelEvent"
        />

        <AdminEventsSidebarMeta v-if="event" :event="event" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'
import type { AbstractSubmission } from '../../../../types/submissions'
definePageMeta({ layout: 'admin' })

const route = useRoute()
const id = computed(() => Number(route.params.id))

const { events }: { events: Ref<EventItem[]> } = useEvents()
const { getEventSubmissions, _updateSubmissionStatus } = useSubmissions()
const event = computed(() => events.value.find(e => e.id === id.value))

// Image URL computation is now handled in the component where it's needed

// Tabs
const tabs = ['Details', 'Tickets', 'Sponsors', 'Registrations', 'Submissions', 'Gallery']
const currentTab = ref<
  'Details' | 'Tickets' | 'Registrations' | 'Sponsors' | 'Submissions' | 'Gallery'
>('Details')

// Occupancy computation is now handled in the DetailsTab component

// Status color logic is now handled in the DetailsTab component

// Date range formatting is now handled in the DetailsTab component
function _formatDateRange(startDate: string, endDate?: string): string {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : null
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
  if (!end || start.toDateString() === end.toDateString()) {
    return start.toLocaleDateString('en-US', options)
  }
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`
}

function _slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function _onImgError(e: Event) {
  const el = e.target as HTMLImageElement | null
  if (!el) return
  let idx = parseInt(el.dataset?.fallbackIdx ?? '0', 10)
  if (Number.isNaN(idx) || idx < 0) idx = 0
  const fallbacks: string[] = [
    'https://picsum.photos/seed/episonadmin1/1200/800',
    'https://picsum.photos/seed/episonadmin2/1200/800',
    'https://placehold.co/1200x800/png',
  ]
  if (idx >= fallbacks.length) return
  const fb = (fallbacks[idx] ?? fallbacks[0]) as string
  try {
    el.src = fb
  } catch {
    el.setAttribute('src', fb)
  }
  if (el.dataset) el.dataset.fallbackIdx = String(idx + 1)
}

function goBack() {
  navigateTo('/admin/events')
}
function editEvent() {
  if (event.value) navigateTo(`/admin/events/${event.value.id}/edit`)
}

function duplicateEvent() {
  if (!event.value) return
  useToast().add({
    title: 'Event duplicated',
    description: `Duplicated "${event.value.title}"`,
    color: 'success',
  })
}
function shareEvent() {
  if (!event.value) return
  useToast().add({
    title: 'Share',
    description: `Share "${event.value.title}"`,
    color: 'info',
  })
}
function exportEvent() {
  if (!event.value) return
  useToast().add({ title: 'Export started', description: 'Exporting event data...', color: 'info' })
}
function cancelEvent() {
  if (!event.value) return
  useToast().add({
    title: 'Event cancelled',
    description: 'The event has been cancelled',
    color: 'warning',
  })
}

function deleteEvent() {
  if (!event.value) return
  useToast().add({
    title: 'Event deleted',
    description: `Deleted "${event.value.title}"`,
    color: 'error',
  })
  navigateTo('/admin/events')
}

// Tickets management
type EventTicket = {
  id: number
  name: string
  price: number
  quantity: number
  salesStart?: string
  salesEnd?: string
  description?: string
  isPublic: boolean
}

// Tickets management is now handled in the TicketsTab component
const _tickets = computed<EventTicket[]>(() => {
  type EventWithTickets = EventItem & { tickets?: EventTicket[] }
  const e = event.value as EventWithTickets | undefined
  if (!e) return []
  if (!Array.isArray(e.tickets)) e.tickets = []
  return e.tickets as EventTicket[]
})

const newTicket = reactive<{
  name: string
  price: string | number
  quantity: string | number
  salesStart: string
  salesEnd: string
  description: string
  isPublic: boolean
}>({
  name: '',
  price: '',
  quantity: '',
  salesStart: '',
  salesEnd: '',
  description: '',
  isPublic: true,
})

const canAddTicket = computed(
  () => !!newTicket.name && Number(newTicket.price) >= 0 && Number(newTicket.quantity) >= 0
)

// Ticket management functions are now handled in the TicketsTab component
function _addTicket() {
  if (!event.value || !canAddTicket.value) return
  const t: EventTicket = {
    id: Date.now(),
    name: newTicket.name.trim(),
    price: Number(newTicket.price) || 0,
    quantity: Number(newTicket.quantity) || 0,
    salesStart: newTicket.salesStart || undefined,
    salesEnd: newTicket.salesEnd || undefined,
    description: newTicket.description?.trim() || undefined,
    isPublic: !!newTicket.isPublic,
  }
  ;(event.value as EventItem & { tickets?: EventTicket[] }).tickets!.push(t)
  Object.assign(newTicket, {
    name: '',
    price: '',
    quantity: '',
    salesStart: '',
    salesEnd: '',
    description: '',
    isPublic: true,
  })
  useToast().add({ title: 'Ticket added', color: 'success' })
}

function _removeTicket(id: number) {
  if (!event.value) return
  const e = event.value as EventItem & { tickets?: EventTicket[] }
  if (!Array.isArray(e.tickets)) return
  e.tickets = (e.tickets as EventTicket[]).filter((t: EventTicket) => t.id !== id)
  useToast().add({ title: 'Ticket removed', color: 'neutral' })
}

// Track if component is mounted to prevent updates after unmount
const isMounted = ref(true)
onUnmounted(() => {
  isMounted.value = false
})

async function switchTab(tab: string) {
  // Skip if no tab specified or component is unmounting
  if (!tab || !isMounted.value) return

  try {
    // Close any open dropdowns/menus first
    const active = document.activeElement as HTMLElement | null
    active?.blur?.()
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

    // Allow UI to update before switching tabs
    await nextTick()

    // Check again after tick in case component started unmounting
    if (!isMounted.value) return

    // Schedule the tab switch in the next frame
    requestAnimationFrame(() => {
      if (!isMounted.value) return
      currentTab.value = tab as typeof currentTab.value
    })
  } catch (error) {
    console.error('Error switching tabs:', error)
  }
}

// Sponsors management is now handled in the SponsorsTab component
const _sponsorTierOptions = [
  { label: 'Platinum', value: 'platinum' },
  { label: 'Gold', value: 'gold' },
  { label: 'Silver', value: 'silver' },
  { label: 'Bronze', value: 'bronze' },
  { label: 'Partner', value: 'partner' },
]
const newSponsor = reactive<{ name: string; tier?: string; logoUrl: string; website?: string }>({
  name: '',
  tier: undefined,
  logoUrl: '',
  website: '',
})
function _addSponsor() {
  if (!event.value) return
  if (!event.value.sponsors) event.value.sponsors = []
  const sponsor = {
    id: Date.now(),
    name: newSponsor.name.trim(),
    tier: newSponsor.tier,
    logoUrl: newSponsor.logoUrl.trim(),
    website: newSponsor.website?.trim() || undefined,
  }
  if (!sponsor.name || !sponsor.logoUrl) return
  event.value.sponsors.push(sponsor)
  Object.assign(newSponsor, { name: '', tier: undefined, logoUrl: '', website: '' })
  useToast().add({ title: 'Sponsor added', color: 'success' })
}
function _removeSponsor(sponsorId: number) {
  if (!event.value?.sponsors) return
  event.value.sponsors = event.value.sponsors.filter(s => s.id !== sponsorId)
  useToast().add({ title: 'Sponsor removed', color: 'neutral' })
}

// Gallery management is now handled in the GalleryTab component
const _mediaTypeOptions = [
  { label: 'Image', value: 'image' },
  { label: 'Video', value: 'video' },
]
const newMedia = reactive<{ url: string; caption?: string; type: 'image' | 'video' }>({
  url: '',
  caption: '',
  type: 'image',
})
function _addMedia() {
  if (!event.value) return
  if (!event.value.gallery) event.value.gallery = []
  const media = {
    id: Date.now(),
    url: newMedia.url.trim(),
    caption: newMedia.caption?.trim() || undefined,
    type: newMedia.type,
  }
  if (!media.url) return
  event.value.gallery.push(media)
  Object.assign(newMedia, { url: '', caption: '', type: 'image' })
  useToast().add({ title: 'Media added', color: 'success' })
}
function _removeMedia(mediaId: number) {
  if (!event.value?.gallery) return
  event.value.gallery = event.value.gallery.filter(m => m.id !== mediaId)
  useToast().add({ title: 'Media removed', color: 'neutral' })
}

// Registrations (inline) - mock data & helpers
type RegistrationRow = {
  id: string
  name: string
  email: string
  event: string
  eventDate: string
  type: string
  date: string
  amount: number
  status: string
  reference: string
}

const regSearch = ref('')
const regPagination = ref({
  currentPage: 1,
  perPage: 5,
  total: 0,
  get from() {
    return this.total === 0 ? 0 : (this.currentPage - 1) * this.perPage + 1
  },
  get to() {
    return Math.min(this.currentPage * this.perPage, this.total)
  },
})

const allRegistrations = ref<RegistrationRow[]>([
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    event: 'Annual Conference 2024',
    eventDate: '2024-11-15',
    type: 'Member',
    date: '2023-08-15',
    amount: 50000,
    status: 'Paid',
    reference: 'TX123456789',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    event: 'Workshop on Data Analysis',
    eventDate: '2024-10-15',
    type: 'Non-Member',
    date: '2023-08-14',
    amount: 75000,
    status: 'Pending',
    reference: 'PS987654321',
  },
  {
    id: '3',
    name: 'Dr. Michael Brown',
    email: 'michael.brown@example.com',
    event: 'Public Health Forum',
    eventDate: '2024-09-20',
    type: 'Student',
    date: '2023-08-13',
    amount: 15000,
    status: 'Paid',
    reference: 'TX987654321',
  },
  {
    id: '4',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.j@example.com',
    event: 'Annual Conference 2024',
    eventDate: '2024-11-15',
    type: 'Member',
    date: '2023-08-12',
    amount: 50000,
    status: 'Paid',
    reference: 'PS123456789',
  },
  {
    id: '5',
    name: 'Dr. David Wilson',
    email: 'david.w@example.com',
    event: 'Workshop on Data Analysis',
    eventDate: '2024-10-15',
    type: 'Non-Member',
    date: '2023-08-11',
    amount: 75000,
    status: 'Pending',
    reference: 'TX456789123',
  },
  {
    id: '6',
    name: 'Dr. Emily Davis',
    email: 'emily.d@example.com',
    event: 'Public Health Forum',
    eventDate: '2024-09-20',
    type: 'Speaker',
    date: '2023-08-10',
    amount: 0,
    status: 'Paid',
    reference: 'N/A',
  },
  {
    id: '7',
    name: 'Dr. Robert Thompson',
    email: 'robert.t@example.com',
    event: 'Annual Conference 2024',
    eventDate: '2024-11-15',
    type: 'Sponsor',
    date: '2023-08-09',
    amount: 150000,
    status: 'Paid',
    reference: 'TX789123456',
  },
  {
    id: '8',
    name: 'Dr. Jennifer Lee',
    email: 'jennifer.l@example.com',
    event: 'Workshop on Data Analysis',
    eventDate: '2024-10-15',
    type: 'Member',
    date: '2023-08-08',
    amount: 50000,
    status: 'Cancelled',
    reference: 'PS456789123',
  },
  {
    id: '9',
    name: 'Dr. James Wilson',
    email: 'james.w@example.com',
    event: 'Public Health Forum',
    eventDate: '2024-09-20',
    type: 'Non-Member',
    date: '2023-08-07',
    amount: 75000,
    status: 'Paid',
    reference: 'TX321654987',
  },
  {
    id: '10',
    name: 'Dr. Patricia Brown',
    email: 'patricia.b@example.com',
    event: 'Annual Conference 2024',
    eventDate: '2024-11-15',
    type: 'Student',
    date: '2023-08-06',
    amount: 15000,
    status: 'Paid',
    reference: 'PS789123456',
  },
])

const filteredEventRegistrations = computed(() => {
  const rows = allRegistrations.value.filter(r => r.event === (event.value?.title || ''))
  if (!regSearch.value) return rows
  const q = regSearch.value.toLowerCase()
  return rows.filter(
    r =>
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.reference.toLowerCase().includes(q)
  )
})

const _paginatedEventRegistrations = computed(() => {
  const start = (regPagination.value.currentPage - 1) * regPagination.value.perPage
  const end = start + regPagination.value.perPage
  return filteredEventRegistrations.value.slice(start, end)
})

watch(
  filteredEventRegistrations,
  rows => {
    regPagination.value.total = rows.length
    // Reset to first page if the current one is now out of range
    if ((regPagination.value.currentPage - 1) * regPagination.value.perPage >= rows.length) {
      regPagination.value.currentPage = 1
    }
  },
  { immediate: true }
)

function _formatDate(dateString: string): string {
  if (!dateString) return ''
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

function _getStatusBadgeClass(status: string): string {
  const statusClasses: Record<string, string> = {
    Paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    Refunded: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

function _getTypeBadgeClass(type: string): string {
  const typeClasses: Record<string, string> = {
    Member: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Non-Member': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    Student: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Speaker: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Sponsor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  }
  return typeClasses[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

function _getRegActionItems(reg: RegistrationRow) {
  return [
    [{ label: 'View Details', icon: 'i-heroicons-eye', to: `/admin/registrations/${reg.id}` }],
    [
      {
        label: 'Send Confirmation',
        icon: 'i-heroicons-envelope',
        click: () => useToast().add({ title: 'Confirmation Sent', color: 'success' }),
      },
    ],
  ]
}

// Submissions management
const _submissionSearch = ref('')
const _submissionStatusFilter = ref('')
const _submissionCategoryFilter = ref('')

const eventSubmissions = computed<AbstractSubmission[]>(() => {
  return event.value ? (getEventSubmissions(event.value.id) as AbstractSubmission[]) : []
})

const _submissionStatusOptions = [
  { label: 'All Status', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Under Review', value: 'under_review' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Revision Required', value: 'revision_required' },
]

const _submissionCategoryOptions = [
  { label: 'All Categories', value: '' },
  { label: 'Oral Presentation', value: 'oral' },
  { label: 'Poster Presentation', value: 'poster' },
  { label: 'Workshop Proposal', value: 'workshop' },
]

const _filteredSubmissions = computed<AbstractSubmission[]>(() => {
  let filtered = eventSubmissions.value

  if (_submissionSearch.value) {
    const search = _submissionSearch.value.toLowerCase()
    filtered = filtered.filter(
      s =>
        s.title.toLowerCase().includes(search) ||
        s.authors.some(author => author.toLowerCase().includes(search)) ||
        s.keywords.some(keyword => keyword.toLowerCase().includes(search)) ||
        s.correspondingAuthor.name.toLowerCase().includes(search)
    )
  }

  if (_submissionStatusFilter.value) {
    filtered = filtered.filter(s => s.status === _submissionStatusFilter.value)
  }

  if (_submissionCategoryFilter.value) {
    filtered = filtered.filter(s => s.category === _submissionCategoryFilter.value)
  }

  return filtered
})

// Typed counters for status summaries
const _acceptedCount = computed<number>(
  () => eventSubmissions.value.filter((s: AbstractSubmission) => s.status === 'accepted').length
)
const _underReviewCount = computed<number>(
  () => eventSubmissions.value.filter((s: AbstractSubmission) => s.status === 'under_review').length
)
const _pendingCount = computed<number>(
  () => eventSubmissions.value.filter((s: AbstractSubmission) => s.status === 'pending').length
)
const _rejectedCount = computed<number>(
  () => eventSubmissions.value.filter((s: AbstractSubmission) => s.status === 'rejected').length
)

type BadgeColor = 'neutral' | 'success' | 'primary' | 'secondary' | 'info' | 'warning' | 'error'
function _getSubmissionStatusColor(status: AbstractSubmission['status']): BadgeColor {
  const colors: Record<AbstractSubmission['status'], BadgeColor> = {
    pending: 'secondary',
    under_review: 'warning',
    accepted: 'success',
    rejected: 'error',
    revision_required: 'info',
  }
  return colors[status] ?? 'neutral'
}

interface SubmissionAction {
  label: string
  icon: string
  click: () => void
  color?: string
}

type _SubmissionActionGroup = SubmissionAction[][]

function _viewSubmission(submission: AbstractSubmission) {
  // For now, just show a toast. In a real app, this would open a detailed modal
  useToast().add({
    title: 'View Submission',
    description: `Opening details for "${submission.title}"`,
    color: 'info',
  })
}

function _getSubmissionActions(submission: AbstractSubmission) {
  return [
    [
      {
        label: 'Accept',
        icon: 'i-heroicons-check-circle',
        click: () => changeSubmissionStatus(submission.id, 'accepted'),
      },
    ],
    [
      {
        label: 'Request Revision',
        icon: 'i-heroicons-pencil-square',
        click: () => changeSubmissionStatus(submission.id, 'revision_required'),
      },
    ],
    [
      {
        label: 'Reject',
        icon: 'i-heroicons-x-circle',
        click: () => changeSubmissionStatus(submission.id, 'rejected'),
      },
    ],
  ]
}

function changeSubmissionStatus(submissionId: number, newStatus: AbstractSubmission['status']) {
  const submission = allSubmissions.value.find(s => s.id === submissionId)
  if (submission) {
    submission.status = newStatus
    useToast().add({
      title: 'Submission Updated',
      description: `Status changed to ${newStatus.replace('_', ' ')}`,
      color: 'success',
    })
  }
}
</script>
