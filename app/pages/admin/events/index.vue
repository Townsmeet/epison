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

    <!-- Events Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                ₦{{ (event.revenue / 1000).toFixed(0) }}k
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Revenue</div>
            </div>
          </div>
        </div>
      </div>
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
                <UButton color="primary" :loading="isCreating" @click="createEvent">
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
import type { Ref } from 'vue'
import type { EventItem } from '../../../composables/useEvents'

definePageMeta({
  layout: 'admin',
})

const isCreateEventOpen = ref(false)
const isCreating = ref(false)
const searchQuery = ref('')
const selectedStatus = ref('all')
const selectedType = ref('all')

// Shared events data source
const { events }: { events: Ref<EventItem[]> } = useEvents()

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
  { label: 'Training', value: 'training' },
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
  isPublic: true,
  membersOnly: false,
  collectsSubmissions: false,
})

const filteredEvents = computed<EventItem[]>(() => {
  let filtered = events.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      event =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
    )
  }

  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(event => event.status === selectedStatus.value)
  }

  if (selectedType.value !== 'all') {
    filtered = filtered.filter(event => event.type === selectedType.value)
  }

  return filtered
})

function onBannerSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    const result = reader.result as string
    newEvent.value.bannerImage = result
  }
  reader.readAsDataURL(file)
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
      { label: 'Delete Event', icon: 'i-heroicons-trash', click: () => deleteEvent(event.id) },
    ],
  ]
}

function clearFilters() {
  searchQuery.value = ''
  selectedStatus.value = 'all'
  selectedType.value = 'all'
}

function viewEvent(id: number) {
  navigateTo(`/admin/events/${id}`)
}

function editEvent(id: number) {
  navigateTo(`/admin/events/${id}/edit`)
}

function viewRegistrations(id: number) {
  navigateTo(`/admin/registrations?event=${id}`)
}

function duplicateEvent(_id: number) {
  useToast().add({
    title: 'Event duplicated',
    description: 'Event has been duplicated successfully',
    color: 'success',
  })
}

function exportEvent(_id: number) {
  useToast().add({
    title: 'Export started',
    description: 'Event data is being exported...',
    color: 'info',
  })
}

function cancelEvent(_id: number) {
  useToast().add({
    title: 'Event cancelled',
    description: 'Event has been cancelled',
    color: 'warning',
  })
}

function deleteEvent(_id: number) {
  useToast().add({
    title: 'Event deleted',
    description: 'Event has been removed permanently',
    color: 'error',
  })
}

async function createEvent() {
  isCreating.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Reset form
    newEvent.value = {
      title: '',
      type: '',
      status: 'draft',
      startDate: '',
      endDate: '',
      location: '',
      capacity: '',
      description: '',
      bannerImage: '',
      isPublic: true,
      membersOnly: false,
      collectsSubmissions: false,
    }

    isCreateEventOpen.value = false

    useToast().add({
      title: 'Event created',
      description: 'New event has been created successfully',
      color: 'success',
    })
  } catch {
    useToast().add({
      title: 'Error',
      description: 'Failed to create event',
      color: 'error',
    })
  } finally {
    isCreating.value = false
  }
}
</script>
