<template>
  <div>
    <!-- Action buttons -->
    <div class="flex justify-end space-x-3 mb-6">
      <UButton
        color="neutral"
        variant="outline"
        icon="i-heroicons-calendar-days"
        to="/admin/events/calendar"
      >
        Calendar View
      </UButton>
      <UButton color="primary" icon="i-heroicons-plus" @click="isCreateEventOpen = true">
        Create Event
      </UButton>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UInput
          v-model="searchQuery"
          placeholder="Search events..."
          icon="i-heroicons-magnifying-glass"
        />
        <USelect v-model="selectedStatus" :items="statusOptions" placeholder="Filter by status" />
        <USelect v-model="selectedType" :items="typeOptions" placeholder="Filter by type" />
        <UButton color="neutral" variant="outline" icon="i-heroicons-funnel" @click="clearFilters">
          Clear Filters
        </UButton>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="eventsLoading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin" />
    </div>

    <!-- Error State -->
    <div v-else-if="eventsError" class="text-center py-12">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 mx-auto text-red-500 mb-4" />
      <p class="text-gray-600 dark:text-gray-400">Failed to load events</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!filteredEvents.length" class="text-center py-12">
      <UIcon name="i-heroicons-calendar-days" class="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <p class="text-gray-600 dark:text-gray-400">No events found</p>
    </div>

    <!-- Events Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="event in filteredEvents"
        :key="event.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
        @click="viewEvent(event.id)"
      >
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {{ event.title }}
              </h3>
              <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                <UIcon name="i-heroicons-calendar-days" class="w-4 h-4 mr-1" />
                {{ formatDateRange(event.startDate, event.endDate) }}
              </div>
              <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                <UIcon name="i-heroicons-map-pin" class="w-4 h-4 mr-1" />
                {{ event.location }}
              </div>
            </div>
            <UDropdownMenu :items="getEventActions(event)">
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-heroicons-ellipsis-vertical"
                size="sm"
                @click.stop
              />
            </UDropdownMenu>
          </div>

          <div class="flex items-center justify-between mb-4">
            <UBadge :color="getStatusColor(event.status)" size="sm">{{ event.status }}</UBadge>
            <UBadge color="neutral" variant="outline" size="sm">{{ event.type }}</UBadge>
          </div>

          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {{ event.description }}
          </p>

          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ event.registrations }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Registered</div>
            </div>
            <div>
              <div class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ event.capacity }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Capacity</div>
            </div>
            <div>
              <div class="text-lg font-semibold text-gray-900 dark:text-white">
                ₦{{ ((event.revenue ?? 0) / 100 / 1000).toFixed(0) }}k
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Revenue</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center mt-8">
      <UPagination v-model="currentPage" :page-count="totalPages" :total="totalEvents" />
    </div>

    <!-- Create Event Modal -->
    <UModal v-model:open="isCreateEventOpen">
      <template #content>
        <div class="h-[85vh] max-h-[85vh] flex flex-col">
          <UCard
            class="h-full flex flex-col"
            :ui="{
              body: 'flex-1 overflow-y-auto',
              header: 'sticky top-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur',
              footer: 'sticky bottom-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur',
            }"
          >
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold">Create New Event</h3>
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-heroicons-x-mark"
                  @click="isCreateEventOpen = false"
                />
              </div>
            </template>

            <UForm :state="newEvent" class="space-y-6">
              <UFormField label="Event Title" name="title" required>
                <UInput v-model="newEvent.title" placeholder="Enter event title" class="w-full" />
              </UFormField>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormField label="Event Type" name="type" required>
                  <USelect
                    v-model="newEvent.type"
                    :items="typeOptions.filter(t => t.value !== 'all')"
                    placeholder="Select event type"
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="Status" name="status" required>
                  <USelect
                    v-model="newEvent.status"
                    :items="statusOptions.filter(s => s.value !== 'all')"
                    placeholder="Select status"
                    class="w-full"
                  />
                </UFormField>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormField label="Start Date" name="startDate" required>
                  <UInput v-model="newEvent.startDate" type="datetime-local" class="w-full" />
                </UFormField>

                <UFormField label="End Date" name="endDate">
                  <UInput v-model="newEvent.endDate" type="datetime-local" class="w-full" />
                </UFormField>
              </div>

              <UFormField label="Location" name="location" required>
                <UInput v-model="newEvent.location" placeholder="Event location" class="w-full" />
              </UFormField>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormField label="Capacity" name="capacity">
                  <UInput
                    v-model="newEvent.capacity"
                    type="number"
                    placeholder="Maximum attendees"
                    class="w-full"
                  />
                </UFormField>
              </div>

              <UFormField label="Description" name="description">
                <UTextarea
                  v-model="newEvent.description"
                  placeholder="Event description"
                  :rows="4"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Event Banner Image" name="bannerImage">
                <input
                  type="file"
                  accept="image/*"
                  class="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:text-gray-300 dark:file:bg-primary-900/20 dark:file:text-primary-300"
                  @change="onBannerSelected"
                />
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Upload a JPG/PNG banner. Recommended aspect ratio ~3:2. Max ~2MB.
                </p>
                <div v-if="isUploadingBanner" class="mt-2 flex items-center gap-2">
                  <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
                  <span class="text-xs text-gray-500 dark:text-gray-400">Uploading banner...</span>
                </div>
                <div v-if="newEvent.bannerImage" class="mt-3">
                  <img
                    :src="newEvent.bannerImage"
                    alt="Banner preview"
                    class="w-full h-40 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                </div>
              </UFormField>

              <div class="flex items-center space-x-4">
                <UCheckbox v-model="newEvent.membersOnly" label="Members Only" />
                <UCheckbox v-model="newEvent.collectsSubmissions" label="Collect Submissions" />
              </div>
            </UForm>

            <template #footer>
              <div class="flex justify-end space-x-3">
                <UButton color="neutral" variant="ghost" @click="isCreateEventOpen = false">
                  Cancel
                </UButton>
                <UButton
                  color="primary"
                  :loading="isCreating || isUploadingBanner"
                  :disabled="isUploadingBanner"
                  @click="handleCreateEvent"
                >
                  Create Event
                </UButton>
              </div>
            </template>
          </UCard>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
// Types
import type { EventItem, EventListQuery } from '../../../composables/useEvents'
import type { CreateEventForm } from '../../../../types/event'

definePageMeta({
  layout: 'admin',
})

const isCreateEventOpen = ref(false)
const isCreating = ref(false)
const _isEditing = ref(false)
const _editingEventId = ref<string | null>(null)
const isUploadingBanner = ref(false)
const searchQuery = ref('')
const selectedStatus = ref('all')
const selectedType = ref('all')
const currentPage = ref(1)
const perPage = ref(12)

// Events API composable
const { getEvents, createEvent, deleteEvent, refreshEvents } = useEvents()

// Reactive query for API calls
const eventsQuery = computed<EventListQuery>(() => ({
  page: currentPage.value,
  limit: perPage.value,
  q: searchQuery.value || undefined,
  status: selectedStatus.value !== 'all' ? selectedStatus.value : undefined,
  type: selectedType.value !== 'all' ? selectedType.value : undefined,
  sort: '-startDate',
}))

// Fetch events data
const {
  data: eventsResponse,
  pending: eventsLoading,
  error: eventsError,
} = await getEvents(eventsQuery.value)

// Watch for filter changes and refetch data
// Use a debounced watcher for filter changes
let debounceTimer: NodeJS.Timeout
watch([searchQuery, selectedStatus, selectedType], async () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    currentPage.value = 1
    await refreshEvents(eventsQuery.value)
  }, 300)
})

watch(currentPage, async () => {
  await refreshEvents(eventsQuery.value)
})

// Transform API data to match EventItem interface
const events = computed(() => {
  if (!eventsResponse.value?.data) return []
  return eventsResponse.value.data.map(event => {
    const e = event as { registrationCount?: number; revenue?: number }
    return {
      ...event,
      registrations: Number(e.registrationCount) || 0,
      revenue: Number(e.revenue) || 0,
    }
  })
})

const totalPages = computed(() => eventsResponse.value?.pagination?.totalPages || 0)
const totalEvents = computed(() => eventsResponse.value?.pagination?.total || 0)

const statusOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Registration Open', value: 'registration_open' },
  { label: 'Registration Closed', value: 'registration_closed' },
  { label: 'Ongoing', value: 'ongoing' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
]

const typeOptions = [
  { label: 'All Types', value: 'all' },
  { label: 'Conference', value: 'conference' },
  { label: 'Workshop', value: 'workshop' },
  { label: 'Webinar', value: 'webinar' },
  { label: 'Seminar', value: 'seminar' },
  { label: 'Symposium', value: 'symposium' },
]

const newEvent = ref({
  title: '',
  type: 'webinar',
  status: 'draft',
  startDate: '',
  endDate: '',
  location: '',
  capacity: '',
  description: '',
  bannerImage: '',
  // not sent to API; used for upload
  bannerFile: null as File | null,
  isPublic: true,
  membersOnly: false,
  collectsSubmissions: false,
})

// Apply client-side filtering as a fallback to ensure immediate UX response
const filteredEvents = computed(() => {
  const list = events.value as EventItem[]
  if (!list || list.length === 0) return []

  const q = (searchQuery.value || '').toLowerCase().trim()
  const status = selectedStatus.value
  const type = selectedType.value

  return list.filter(e => {
    const matchQ = !q
      ? true
      : [e.title, e.location, e.description]
          .filter(Boolean)
          .some(v => String(v).toLowerCase().includes(q))

    const matchStatus = status === 'all' ? true : e.status === status
    const matchType = type === 'all' ? true : e.type === type

    return matchQ && matchStatus && matchType
  })
})

function onBannerSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  // Validate file type and size (<= 2MB)
  const allowed = new Set(['image/jpeg', 'image/png'])
  if (!allowed.has(file.type)) {
    useToast().add({
      title: 'Invalid file type',
      description: 'Please upload a JPG or PNG image.',
      color: 'warning',
    })
    input.value = ''
    return
  }
  const maxBytes = 2 * 1024 * 1024
  if (file.size > maxBytes) {
    useToast().add({
      title: 'File too large',
      description: 'Image must be 2MB or less.',
      color: 'warning',
    })
    input.value = ''
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    const result = reader.result as string
    newEvent.value.bannerImage = result
  }
  reader.readAsDataURL(file)
  // store file for upload
  newEvent.value.bannerFile = file
}

function getStatusColor(
  status: string
): 'neutral' | 'success' | 'primary' | 'secondary' | 'info' | 'warning' | 'error' {
  const colors: Record<
    string,
    'neutral' | 'success' | 'primary' | 'secondary' | 'info' | 'warning' | 'error'
  > = {
    draft: 'neutral',
    published: 'primary',
    registration_open: 'success',
    registration_closed: 'warning',
    ongoing: 'secondary',
    completed: 'info',
    cancelled: 'error',
  }
  return colors[status] || 'neutral'
}

function formatDateRange(startDate: string, endDate?: string): string {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : null

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }

  if (!end || start.toDateString() === end.toDateString()) {
    return start.toLocaleDateString('en-US', options)
  }

  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`
}

function getEventActions(event: EventItem) {
  return [
    [
      { label: 'View Details', icon: 'i-heroicons-eye', click: () => viewEvent(event.id) },
      { label: 'Edit Event', icon: 'i-heroicons-pencil', click: () => editEvent(event.id) },
      {
        label: 'View Registrations',
        icon: 'i-heroicons-users',
        click: () => viewRegistrations(event.id),
      },
    ],
    [
      {
        label: 'Duplicate Event',
        icon: 'i-heroicons-document-duplicate',
        click: () => duplicateEvent(event.id),
      },
      {
        label: 'Export Data',
        icon: 'i-heroicons-arrow-down-tray',
        click: () => exportEvent(event.id),
      },
    ],
    [
      { label: 'Cancel Event', icon: 'i-heroicons-x-circle', click: () => cancelEvent(event.id) },
      {
        label: 'Delete Event',
        icon: 'i-heroicons-trash',
        click: () => handleDeleteEvent(event.id),
      },
    ],
  ]
}

function clearFilters() {
  searchQuery.value = ''
  selectedStatus.value = 'all'
  selectedType.value = 'all'
}

function viewEvent(id: string) {
  navigateTo(`/admin/events/${id}`)
}

function editEvent(id: string) {
  navigateTo(`/admin/events/${id}/edit`)
}

function viewRegistrations(id: string) {
  navigateTo(`/admin/registrations?event=${id}`)
}

function duplicateEvent(_id: string) {
  useToast().add({
    title: 'Event duplicated',
    description: 'Event has been duplicated successfully',
    color: 'success',
  })
}

function exportEvent(_id: string) {
  useToast().add({
    title: 'Export started',
    description: 'Event data is being exported...',
    color: 'info',
  })
}

function cancelEvent(_id: string) {
  useToast().add({
    title: 'Event cancelled',
    description: 'Event has been cancelled',
    color: 'warning',
  })
}

async function handleDeleteEvent(id: string) {
  try {
    await deleteEvent(id)
    await refreshEvents(eventsQuery.value)
    useToast().add({
      title: 'Event deleted',
      description: 'Event has been removed permanently',
      color: 'success',
    })
  } catch (error) {
    console.error('Error deleting event:', error)
    useToast().add({
      title: 'Error',
      description: 'Failed to delete event',
      color: 'error',
    })
  }
}

async function handleCreateEvent() {
  isCreating.value = true
  try {
    // Generate slug from title
    const slug = newEvent.value.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Convert datetime-local values to ISO strings expected by the API
    const startISO = newEvent.value.startDate
      ? new Date(newEvent.value.startDate).toISOString()
      : ''
    const endISO = newEvent.value.endDate
      ? new Date(newEvent.value.endDate).toISOString()
      : undefined

    // If a banner file is selected, upload to S3 and use the returned URL
    let bannerUrl: string | undefined = undefined
    if (newEvent.value.bannerFile) {
      isUploadingBanner.value = true
      const file = newEvent.value.bannerFile
      const ext = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : ''
      const key = `${slug}-${Date.now()}${ext}`
      const form = new FormData()
      form.append('file', file)
      form.append('folder', 'events/banners')
      form.append('key', key)
      try {
        const uploadResp = await $fetch<{ url: string }>(`/api/uploads`, {
          method: 'POST',
          body: form,
          credentials: 'include',
        })
        bannerUrl = uploadResp.url
      } catch (err) {
        console.error('Banner upload failed:', err)
        useToast().add({
          title: 'Upload failed',
          description: 'Could not upload banner image. Please try again.',
          color: 'error',
        })
        throw err
      } finally {
        isUploadingBanner.value = false
      }
    }

    const eventData: CreateEventForm = {
      title: newEvent.value.title,
      slug,
      type: newEvent.value.type as 'webinar' | 'conference' | 'workshop' | 'seminar' | 'symposium',
      status: newEvent.value.status as
        | 'draft'
        | 'published'
        | 'registration_open'
        | 'registration_closed'
        | 'ongoing'
        | 'completed'
        | 'cancelled',
      startDate: startISO,
      endDate: endISO,
      location: newEvent.value.location,
      capacity: newEvent.value.capacity ? parseInt(newEvent.value.capacity) : undefined,
      description: newEvent.value.description || undefined,
      bannerUrl,
      membersOnly: newEvent.value.membersOnly,
      collectsSubmissions: newEvent.value.collectsSubmissions,
    }

    await createEvent(eventData)

    // Reset form
    newEvent.value = {
      title: '',
      type: 'webinar',
      status: 'draft',
      startDate: '',
      endDate: '',
      location: '',
      capacity: '',
      description: '',
      bannerImage: '',
      bannerFile: null,
      isPublic: true,
      membersOnly: false,
      collectsSubmissions: false,
    }

    isCreateEventOpen.value = false

    // Ensure the list refreshes after modal closes
    await refreshEvents(eventsQuery.value)

    useToast().add({
      title: 'Event created',
      description: 'New event has been created successfully',
      color: 'success',
    })
  } catch (error) {
    console.error('Error creating event:', error)
    const e = error as {
      data?: { statusMessage?: string; message?: string }
      statusMessage?: string
      message?: string
      statusCode?: number
    }
    const apiMessage =
      e?.data?.statusMessage ||
      e?.data?.message ||
      e?.statusMessage ||
      e?.message ||
      'Failed to create event'
    useToast().add({
      title: 'Error',
      description: apiMessage,
      color: 'error',
    })
    // If unauthorised, prompt re-login
    if (e?.statusCode === 401) {
      useToast().add({
        title: 'Authentication required',
        description: 'Your session may have expired. Please sign in again.',
        color: 'warning',
      })
      // Optionally navigate to login page if you have one
      // navigateTo('/auth/sign-in')
    }
  } finally {
    isCreating.value = false
  }
}
</script>
