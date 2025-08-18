<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Page header -->
    <div class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="md:flex md:items-center md:justify-between">
          <div class="flex-1 min-w-0">
            <h1
              class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate"
            >
              Dashboard
            </h1>
          </div>
          <div class="mt-4 flex md:mt-0 md:ml-4">
            <UButton
              icon="i-heroicons-plus"
              color="primary"
              label="New Event"
              @click="isCreateEventOpen = true"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Stats -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Registrations"
          :value="stats.totalRegistrations"
          :change="stats.registrationChange"
          icon="i-heroicons-user-group"
          color="blue"
        />
        <StatCard
          title="Upcoming Events"
          :value="stats.upcomingEvents"
          :change="stats.eventsChange"
          icon="i-heroicons-calendar"
          color="green"
        />
        <StatCard
          title="Total Revenue"
          :value="`₦${stats.totalRevenue.toLocaleString()}`"
          :change="stats.revenueChange"
          icon="i-heroicons-currency-dollar"
          color="purple"
        />
        <StatCard
          title="Active Members"
          :value="stats.activeMembers"
          :change="stats.membersChange"
          icon="i-heroicons-users"
          color="yellow"
        />
      </div>

      <!-- Recent Activity and Upcoming Events -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Recent Activity -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Recent Activity
              </h3>
            </div>
            <div class="divide-y divide-gray-200 dark:divide-gray-700">
              <div v-for="(activity, index) in recentActivities" :key="index" class="px-6 py-4">
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
            <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Upcoming Events
              </h3>
            </div>
            <div class="divide-y divide-gray-200 dark:divide-gray-700">
              <div v-for="event in upcomingEvents" :key="event.id" class="px-6 py-4">
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
            color="gray"
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
                  Type
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
              <tr v-for="registration in recentRegistrations" :key="registration.id">
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
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getTypeBadgeClass(registration.type)"
                  >
                    {{ registration.type }}
                  </span>
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
                    color="gray"
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
    </main>

    <!-- Create Event Modal -->
    <UModal v-model="isCreateEventOpen">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Create New Event</h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark"
              @click="isCreateEventOpen = false"
            />
          </div>
        </template>

        <UForm :state="newEvent" class="space-y-4">
          <UFormGroup label="Event Title" name="title" required>
            <UInput v-model="newEvent.title" />
          </UFormGroup>

          <UFormGroup label="Event Type" name="type" required>
            <USelect
              v-model="newEvent.type"
              :options="eventTypes"
              placeholder="Select event type"
            />
          </UFormGroup>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormGroup label="Start Date" name="startDate" required>
              <UInput v-model="newEvent.startDate" type="date" />
            </UFormGroup>

            <UFormGroup label="End Date" name="endDate">
              <UInput v-model="newEvent.endDate" type="date" />
            </UFormGroup>
          </div>

          <UFormGroup label="Location" name="location">
            <UInput v-model="newEvent.location" />
          </UFormGroup>

          <UFormGroup label="Description" name="description">
            <UTextarea v-model="newEvent.description" />
          </UFormGroup>
        </UForm>

        <template #footer>
          <div class="flex justify-end space-x-3">
            <UButton color="gray" variant="ghost" @click="isCreateEventOpen = false">
              Cancel
            </UButton>
            <UButton color="primary" :loading="isCreating" @click="createEvent">
              Create Event
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// State
const isCreateEventOpen = ref(false)
const isCreating = ref(false)

// Stats data
const stats = {
  totalRegistrations: 1245,
  registrationChange: 12.5,
  upcomingEvents: 3,
  eventsChange: 0,
  totalRevenue: 12500000,
  revenueChange: 8.2,
  activeMembers: 856,
  membersChange: 4.3,
}

// Recent activities
const recentActivities = [
  {
    id: 1,
    title: 'New registration',
    description: 'John Doe registered for Annual Conference 2024',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    icon: 'i-heroicons-user-plus',
    iconColor: 'text-green-500',
  },
  {
    id: 2,
    title: 'Payment received',
    description: 'Payment of ₦50,000 from Jane Smith',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    icon: 'i-heroicons-banknotes',
    iconColor: 'text-blue-500',
  },
  {
    id: 3,
    title: 'New event created',
    description: 'Workshop on Data Analysis scheduled for October 15',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    icon: 'i-heroicons-calendar',
    iconColor: 'text-purple-500',
  },
  {
    id: 4,
    title: 'New member',
    description: 'Dr. Sarah Johnson joined EPISON',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    icon: 'i-heroicons-user-plus',
    iconColor: 'text-green-500',
  },
  {
    id: 5,
    title: 'Abstract submitted',
    description: 'New abstract submitted by Dr. Michael Brown',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    icon: 'i-heroicons-document-text',
    iconColor: 'text-yellow-500',
  },
]

// Upcoming events
const upcomingEvents = [
  {
    id: 1,
    title: 'Annual Scientific Conference 2024',
    date: '2024-11-15',
    status: 'Upcoming',
    registrations: 245,
  },
  {
    id: 2,
    title: 'Workshop on Data Analysis',
    date: '2024-10-15',
    status: 'Registration Open',
    registrations: 45,
  },
  {
    id: 3,
    title: 'Public Health Forum',
    date: '2024-09-20',
    status: 'Registration Open',
    registrations: 120,
  },
]

// Recent registrations
const recentRegistrations = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    event: 'Annual Conference 2024',
    type: 'Member',
    date: '2023-08-15',
    status: 'Paid',
    amount: 50000,
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    event: 'Workshop on Data Analysis',
    type: 'Non-Member',
    date: '2023-08-14',
    status: 'Pending',
    amount: 75000,
  },
  {
    id: 3,
    name: 'Dr. Michael Brown',
    email: 'michael.brown@example.com',
    event: 'Public Health Forum',
    type: 'Student',
    date: '2023-08-13',
    status: 'Paid',
    amount: 15000,
  },
  {
    id: 4,
    name: 'Dr. Sarah Johnson',
    email: 'sarah.j@example.com',
    event: 'Annual Conference 2024',
    type: 'Member',
    date: '2023-08-12',
    status: 'Paid',
    amount: 50000,
  },
  {
    id: 5,
    name: 'Dr. David Wilson',
    email: 'david.w@example.com',
    event: 'Workshop on Data Analysis',
    type: 'Non-Member',
    date: '2023-08-11',
    status: 'Pending',
    amount: 75000,
  },
]

// New event form
const eventTypes = ['Conference', 'Workshop', 'Webinar', 'Seminar', 'Symposium']

const newEvent = ref({
  title: '',
  type: '',
  startDate: '',
  endDate: '',
  location: '',
  description: '',
})

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

function getTypeBadgeClass(type: string): string {
  const typeClasses: Record<string, string> = {
    Member: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Non-Member': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    Student: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Speaker: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Sponsor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  }
  return typeClasses[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

async function createEvent() {
  isCreating.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Reset form
    newEvent.value = {
      title: '',
      type: '',
      startDate: '',
      endDate: '',
      location: '',
      description: '',
    }

    // Close modal
    isCreateEventOpen.value = false

    // Show success message
    useToast().add({
      title: 'Event created',
      description: 'The event has been created successfully',
      icon: 'i-heroicons-check-circle',
      color: 'green',
    })
  } catch (error) {
    console.error('Error creating event:', error)
    useToast().add({
      title: 'Error',
      description: 'There was an error creating the event',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red',
    })
  } finally {
    isCreating.value = false
  }
}
</script>
