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
          @click="viewRegistrations"
          >Registrations</UButton
        >
        <UButton color="error" variant="outline" icon="i-heroicons-trash" @click="deleteEvent"
          >Delete</UButton
        >
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
        <UCard>
          <template #header>
            <div class="flex items-start justify-between">
              <div>
                <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ event.title }}
                </h1>
                <div class="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <UBadge :color="statusColor(event.status)" size="sm">{{ event.status }}</UBadge>
                  <UBadge color="neutral" variant="outline" size="sm">{{ event.type }}</UBadge>
                </div>
              </div>
            </div>
          </template>

          <div class="space-y-4">
            <div class="flex items-center text-gray-600 dark:text-gray-300">
              <UIcon name="i-heroicons-calendar-days" class="w-5 h-5 mr-2" />
              <span>{{ formatDateRange(event.startDate, event.endDate) }}</span>
            </div>
            <div class="flex items-center text-gray-600 dark:text-gray-300">
              <UIcon name="i-heroicons-map-pin" class="w-5 h-5 mr-2" />
              <span>{{ event.location }}</span>
            </div>

            <div class="prose dark:prose-invert max-w-none">
              <h3 class="mt-6">Description</h3>
              <p>{{ event.description }}</p>
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Performance</h3>
          </template>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ event.registrations }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Registered</div>
            </div>
            <div>
              <div class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ event.capacity }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Capacity</div>
            </div>
            <div>
              <div class="text-2xl font-semibold text-gray-900 dark:text-white">
                ₦{{ (event.revenue / 1000).toFixed(0) }}k
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Revenue</div>
            </div>
            <div>
              <div class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ occupancy }}%
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Occupancy</div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Actions</h3>
          </template>
          <div class="space-y-3">
            <UButton block color="primary" icon="i-heroicons-share" variant="soft">Share</UButton>
            <UButton
              block
              color="neutral"
              icon="i-heroicons-document-duplicate"
              variant="soft"
              @click="duplicateEvent"
              >Duplicate</UButton
            >
            <UButton
              block
              color="neutral"
              icon="i-heroicons-arrow-down-tray"
              variant="soft"
              @click="exportEvent"
              >Export</UButton
            >
            <UButton
              block
              color="warning"
              icon="i-heroicons-x-circle"
              variant="soft"
              @click="cancelEvent"
              >Cancel</UButton
            >
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Meta</h3>
          </template>
          <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <li><span class="font-medium">ID:</span> {{ event?.id }}</li>
            <li><span class="font-medium">Type:</span> {{ event?.type }}</li>
            <li><span class="font-medium">Status:</span> {{ event?.status }}</li>
            <li><span class="font-medium">Public:</span> Yes</li>
          </ul>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()
const id = computed(() => Number(route.params.id))

const { events }: { events: Ref<EventItem[]> } = useEvents()
const event = computed(() => events.value.find(e => e.id === id.value))

const occupancy = computed(() => {
  if (!event.value) return 0
  const cap = Number(event.value.capacity) || 0
  const reg = Number(event.value.registrations) || 0
  if (cap === 0) return 0
  return Math.min(100, Math.round((reg / cap) * 100))
})

function statusColor(
  status: EventItem['status']
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
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
  if (!end || start.toDateString() === end.toDateString()) {
    return start.toLocaleDateString('en-US', options)
  }
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`
}

function goBack() {
  navigateTo('/admin/events')
}
function editEvent() {
  if (event.value) navigateTo(`/admin/events/${event.value.id}/edit`)
}
function viewRegistrations() {
  if (event.value) navigateTo(`/admin/registrations?event=${event.value.id}`)
}

function duplicateEvent() {
  if (!event.value) return
  useToast().add({
    title: 'Event duplicated',
    description: `Duplicated "${event.value.title}"`,
    color: 'success',
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
</script>
