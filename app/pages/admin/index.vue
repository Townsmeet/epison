<template>
  <div>
    <!-- Recent Activity and Upcoming Events -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Recent Activity -->
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div
            class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"
          >
            <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <UButton
              to="/admin/activities"
              color="neutral"
              variant="ghost"
              size="sm"
              trailing-icon="i-heroicons-arrow-right"
            >
              View All
            </UButton>
          </div>
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <div
              v-if="activitiesLoading"
              class="px-6 py-6 text-center text-gray-600 dark:text-gray-300"
            >
              <UIcon name="i-heroicons-arrow-path" class="h-5 w-5 inline-block animate-spin mr-2" />
              Loading recent activity...
            </div>
            <div
              v-else-if="recentActivities.length === 0"
              class="px-6 py-6 text-center text-gray-600 dark:text-gray-300"
            >
              No recent activity
            </div>
            <div
              v-for="(activity, index) in recentActivities"
              v-else
              :key="index"
              class="px-6 py-4"
            >
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <UIcon :name="activity.icon" class="h-6 w-6" :class="activity.iconColor" />
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ activity.title }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ activity.description }}
                  </p>
                  <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {{ formatTimeAgo(activity.timestamp) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Events -->
      <div>
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div
            class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"
          >
            <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Upcoming Events
            </h3>
            <UButton
              to="/admin/events"
              color="neutral"
              variant="ghost"
              size="sm"
              trailing-icon="i-heroicons-arrow-right"
            >
              View All
            </UButton>
          </div>
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <div
              v-if="upcomingLoading"
              class="px-6 py-6 text-center text-gray-600 dark:text-gray-300"
            >
              <UIcon name="i-heroicons-arrow-path" class="h-5 w-5 inline-block animate-spin mr-2" />
              Loading upcoming events...
            </div>
            <div
              v-else-if="upcomingEvents.length === 0"
              class="px-6 py-6 text-center text-gray-600 dark:text-gray-300"
            >
              No upcoming events
            </div>
            <div v-for="event in upcomingEvents" v-else :key="event.id" class="px-6 py-4">
              <div class="flex items-start">
                <div class="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-md p-2">
                  <UIcon
                    name="i-heroicons-calendar"
                    class="h-5 w-5 text-blue-600 dark:text-blue-300"
                  />
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ event.title }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(event.date) }}
                  </p>
                  <div class="mt-2">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getStatusBadgeClass(event.status)"
                    >
                      {{ event.status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Registrations -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div
        class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"
      >
        <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
          Recent Registrations
        </h3>
        <UButton
          to="/admin/registrations"
          color="neutral"
          variant="ghost"
          size="sm"
          trailing-icon="i-heroicons-arrow-right"
        >
          View All
        </UButton>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Event
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Status
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="recentLoading" class="">
              <td colspan="5" class="px-6 py-6 text-center text-gray-600 dark:text-gray-300">
                <UIcon
                  name="i-heroicons-arrow-path"
                  class="h-5 w-5 inline-block animate-spin mr-2"
                />
                Loading recent registrations...
              </td>
            </tr>
            <tr v-else-if="recentRegistrations.length === 0">
              <td colspan="5" class="px-6 py-6 text-center text-gray-600 dark:text-gray-300">
                No recent registrations
              </td>
            </tr>
            <tr v-for="registration in recentRegistrations" v-else :key="registration.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div
                      class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                    >
                      <span class="text-gray-600 dark:text-gray-300 font-medium">{{
                        getInitials(registration.name)
                      }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ registration.name }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ registration.email }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">{{ registration.event }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(registration.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusBadgeClass(registration.status)"
                >
                  {{ registration.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <UButton
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-eye"
                  :to="`/admin/registrations/${registration.id}`"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Recent activities (from API)
import type { ActivityLogRow } from '../../composables/useActivities'

definePageMeta({
  layout: 'admin',
})

// Stats data (currently unused)
const _stats = {
  totalRegistrations: 1245,
  registrationChange: 12.5,
  upcomingEvents: 3,
  eventsChange: 0,
  totalRevenue: 12500000,
  revenueChange: 8.2,
  activeMembers: 856,
  membersChange: 4.3,
}
const { getActivities } = useActivities()
const { data: activitiesResponse, pending: activitiesLoading } = getActivities({
  limit: 5,
  sort: '-createdAt',
})

function defaultIcon(type?: string) {
  if (type === 'Registration') return 'i-heroicons-user-plus'
  if (type === 'Payment') return 'i-heroicons-banknotes'
  if (type === 'Event') return 'i-heroicons-calendar'
  if (type === 'Membership') return 'i-heroicons-user-plus'
  return 'i-heroicons-information-circle'
}

function defaultIconColor(type?: string) {
  if (type === 'Registration' || type === 'Membership') return 'text-green-500'
  if (type === 'Payment') return 'text-blue-500'
  if (type === 'Event') return 'text-purple-500'
  return 'text-gray-400'
}

const recentActivities = computed(() => {
  const rows = (activitiesResponse.value?.data as ActivityLogRow[] | undefined) ?? []
  return rows.map(a => ({
    id: a.id,
    title: a.title,
    description: a.description ?? '',
    timestamp: new Date(a.createdAt),
    icon: a.icon || defaultIcon(a.type),
    iconColor: a.iconColor || defaultIconColor(a.type),
    type: a.type,
  }))
})

// Upcoming events via API
const { getEvents } = useEvents()
const { data: upcomingResponse, pending: upcomingLoading } = getEvents({
  upcoming: true,
  limit: 5,
  sort: 'startDate',
})

function toStatusLabel(status?: string): string {
  if (!status) return 'Upcoming'
  // Convert snake_case to Title Case
  const pretty = status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  // Map to existing badge classes keys when needed
  if (pretty === 'Registration Open') return 'Registration Open'
  if (pretty === 'Registration Closed') return 'Completed'
  if (pretty === 'Published') return 'Upcoming'
  return pretty
}

const upcomingEvents = computed(() => {
  const rows =
    (upcomingResponse.value?.data as
      | { id: string; title: string; startDate: string; status?: string }[]
      | undefined) ?? []

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const isUpcoming = (dateStr: string) => {
    const d = new Date(dateStr)
    if (Number.isNaN(d.getTime())) return false
    const eventDay = new Date(d)
    eventDay.setHours(0, 0, 0, 0)
    // Keep events on or after today regardless of time
    return eventDay.getTime() >= todayStart.getTime()
  }

  return rows
    .filter(e => isUpcoming(e.startDate))
    .map((e: { id: string; title: string; startDate: string; status?: string }) => ({
      id: e.id,
      title: e.title,
      date: e.startDate,
      status: toStatusLabel(e.status),
    }))
})

// Recent registrations via API
const { getRegistrations } = useEvents()
const { data: recentResponse, pending: recentLoading } = getRegistrations({
  page: 1,
  limit: 5,
  sort: '-registeredAt',
})

type RecentReg = {
  id: string
  attendeeName: string
  attendeeEmail: string
  eventId: string
  category?: string
  registeredAt: string
  paymentStatus: string
  reference?: string
}

const recentRegistrations = computed(() => {
  const rows = (recentResponse.value?.data as RecentReg[] | undefined) ?? []
  return rows.map((r: RecentReg & { eventTitle?: string }) => ({
    id: r.id,
    name: r.attendeeName,
    email: r.attendeeEmail,
    event: r.eventTitle || 'Event',
    type: r.category || 'Member',
    date: r.registeredAt,
    status: r.paymentStatus,
  }))
})

// New event UI was removed from dashboard

// Methods
function formatDate(dateString: string): string {
  if (!dateString) return ''
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} ${days === 1 ? 'day' : 'days'} ago`
  }
}

function getStatusBadgeClass(status: string): string {
  const statusClasses: Record<string, string> = {
    Paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    Upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Registration Open': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Completed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Create event logic removed from dashboard
</script>
