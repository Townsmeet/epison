<template>
  <div>
    <!-- Stats -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      <StatCard
        title="Total"
        :value="stats.total"
        :change="stats.change"
        icon="i-heroicons-user-group"
        color="blue"
      />
      <StatCard title="Paid" :value="stats.paid" icon="i-heroicons-banknotes" color="green" />
      <StatCard title="Pending" :value="stats.pending" icon="i-heroicons-clock" color="yellow" />
      <StatCard
        title="Cancelled"
        :value="stats.cancelled"
        icon="i-heroicons-x-circle"
        color="red"
      />
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UInput
          v-model="searchQuery"
          placeholder="Search registrations..."
          icon="i-heroicons-magnifying-glass"
        />
        <USelect v-model="selectedStatus" :items="statusOptions" placeholder="Filter by status" />
        <USelectMenu
          v-model="selectedEventItem"
          :items="eventOptions"
          option-attribute="label"
          value-attribute="value"
          placeholder="Filter by event"
          searchable
          :popper="{ strategy: 'fixed', placement: 'bottom-start' }"
        />
        <UButton color="neutral" variant="outline" icon="i-heroicons-funnel" @click="clearFilters">
          Clear Filters
        </UButton>
      </div>
    </div>

    <!-- Registrations table -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                <UCheckbox v-model="selectAll" />
              </th>
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
                Amount
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
            <tr v-for="registration in registrations" :key="registration.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <UCheckbox
                  :model-value="selectedRegistrations.includes(registration.id)"
                  @update:model-value="
                    (checked: boolean | 'indeterminate') => {
                      if (typeof checked === 'boolean') {
                        toggleRegistration(registration.id, checked)
                      }
                    }
                  "
                />
              </td>
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
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ registration.eventDateFormatted }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ registration.dateFormatted }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                ₦{{ registration.amount.toLocaleString() }}
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
                <UDropdownMenu :items="getActionItems(registration)">
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    icon="i-heroicons-ellipsis-horizontal"
                    class="rounded-full"
                  />
                </UDropdownMenu>
              </td>
            </tr>
            <tr v-if="registrations.length === 0">
              <td colspan="7" class="px-6 py-12 text-center">
                <UIcon name="i-heroicons-inbox" class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No registrations found
                </h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {{
                    searchQuery
                      ? 'No registrations match your search.'
                      : 'No registrations yet. Registrations are created when attendees register for events.'
                  }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between"
      >
        <div class="flex-1 flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Showing <span class="font-medium">{{ pagination.from }}</span> to
              <span class="font-medium">{{ pagination.to }}</span> of
              <span class="font-medium">{{ pagination.total }}</span> results
            </p>
          </div>
          <div class="flex space-x-2">
            <UButton
              color="neutral"
              variant="ghost"
              :disabled="pagination.currentPage === 1"
              icon="i-heroicons-chevron-left"
              @click="pagination.currentPage--"
            />
            <UButton
              color="neutral"
              variant="ghost"
              :disabled="pagination.currentPage * pagination.perPage >= pagination.total"
              icon="i-heroicons-chevron-right"
              @click="pagination.currentPage++"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Actions -->
    <div
      v-if="selectedRegistrations.length > 0"
      class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg p-4"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <p class="text-sm text-gray-700 dark:text-gray-300">
              <span class="font-medium">{{ selectedRegistrations.length }}</span>
              {{ selectedRegistrations.length === 1 ? 'registration' : 'registrations' }} selected
            </p>
            <UButton
              color="neutral"
              variant="ghost"
              size="xs"
              class="ml-2"
              @click="selectedRegistrations = []"
            >
              Clear
            </UButton>
          </div>
          <div class="flex space-x-2">
            <UDropdownMenu :items="bulkActions">
              <UButton color="neutral" variant="outline" trailing-icon="i-heroicons-chevron-down">
                Update Status
              </UButton>
            </UDropdownMenu>
            <UButton color="error" variant="outline" @click="confirmDeleteMultiple">
              Delete
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="isDeleteModalOpen">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">
                {{
                  selectedRegistrations.length > 1
                    ? `Delete ${selectedRegistrations.length} registrations`
                    : 'Delete Registration'
                }}
              </h3>
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-heroicons-x-mark"
                @click="isDeleteModalOpen = false"
              />
            </div>
          </template>

          <p class="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete
            {{ selectedRegistrations.length > 1 ? 'these registrations' : 'this registration' }}?
            This action cannot be undone.
          </p>

          <template #footer>
            <div class="flex justify-end space-x-3">
              <UButton color="neutral" variant="ghost" @click="isDeleteModalOpen = false">
                Cancel
              </UButton>
              <UButton color="error" :loading="isDeleting" @click="deleteRegistrations">
                Delete
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import StatCard from '~/components/admin/StatCard.vue'

definePageMeta({
  layout: 'admin',
})

// Data
const selectedRegistrations = ref<string[]>([])

// Toggle registration selection
const selectAll = computed({
  get: () => {
    if (filteredRegistrations.value.length === 0) return false
    return filteredRegistrations.value.every(reg => selectedRegistrations.value.includes(reg.id))
  },
  set: (value: boolean) => {
    if (value) {
      // Only select the currently visible (paginated) registrations
      selectedRegistrations.value = [
        ...selectedRegistrations.value,
        ...registrations.value
          .map(reg => reg.id)
          .filter(id => !selectedRegistrations.value.includes(id)),
      ]
    } else {
      // Only deselect the currently visible (paginated) registrations
      const paginatedIds = new Set(registrations.value.map(reg => reg.id))
      selectedRegistrations.value = selectedRegistrations.value.filter(id => !paginatedIds.has(id))
    }
  },
})

const selectedStatus = ref('all')
const selectedEventItem = ref<{ label: string; value: string } | undefined>(undefined)
const statusOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Paid', value: 'Paid' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Cancelled', value: 'Cancelled' },
  { label: 'Refunded', value: 'Refunded' },
]
const isDeleteModalOpen = ref(false)
const isDeleting = ref(false)
const searchQuery = ref('')

// Bulk actions
const bulkActions = [
  [
    {
      label: 'Mark as Paid',
      icon: 'i-heroicons-check-circle',
      click: () => updateStatus('Paid'),
    },
    {
      label: 'Mark as Pending',
      icon: 'i-heroicons-clock',
      click: () => updateStatus('Pending'),
    },
    {
      label: 'Mark as Cancelled',
      icon: 'i-heroicons-x-circle',
      click: () => updateStatus('Cancelled'),
    },
  ],
  [
    {
      label: 'Send Payment Reminder',
      icon: 'i-heroicons-envelope',
      click: () => sendPaymentReminder(),
    },
  ],
]

// API composable
const { getRegistrations, getRegistrationStats, getEvents } = useEvents()

// Fetch events for filter dropdown
const { data: eventsResponse } = getEvents({ limit: 100, sort: '-startDate' })
const eventOptions = computed(() => {
  const events = eventsResponse.value?.data || []
  return [
    { label: 'All Events', value: 'all' },
    ...events.map(e => ({
      label: e.title,
      value: e.id,
    })),
  ]
})

// Date formatting utility
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return 'Invalid Date'
  }
}

// Filtered registrations for select all functionality
const filteredRegistrations = computed(() => registrations.value)

// Pagination
const pagination = ref({
  currentPage: 1,
  perPage: 10,
  total: 0,
  get from() {
    return this.total === 0 ? 0 : (this.currentPage - 1) * this.perPage + 1
  },
  get to() {
    return Math.min(this.currentPage * this.perPage, this.total)
  },
})

// Fetch stats from API
const { data: statsResponse } = getRegistrationStats()

// Stats - from API
const stats = computed(() => {
  const data = statsResponse.value?.data
  if (!data) {
    return {
      total: 0,
      change: 0,
      paid: 0,
      pending: 0,
      cancelled: 0,
    }
  }

  return {
    total: data.total,
    change: 0, // Could calculate from historical data if available
    paid: data.paid,
    pending: data.pending,
    cancelled: data.cancelled,
  }
})

// API integration
type RegistrationListItem = {
  id: string
  attendeeName: string
  attendeeEmail: string
  eventId: string
  category?: string
  registeredAt: string
  totalAmount: number
  paymentStatus: string
  reference?: string
}

const regQuery = computed(() => ({
  page: pagination.value.currentPage,
  limit: pagination.value.perPage,
  q: searchQuery.value || undefined,
  eventId:
    (selectedEventItem.value?.value ?? 'all') !== 'all'
      ? selectedEventItem.value?.value
      : undefined,
  paymentStatus: selectedStatus.value !== 'all' ? selectedStatus.value : undefined,
  sort: '-registeredAt',
}))

const {
  data: registrationsResponse,
  pending: _registrationsLoading,
  error: _registrationsError,
  refresh: refreshData,
} = getRegistrations(regQuery)

// Update pagination when data changes
watch(
  registrationsResponse,
  newResponse => {
    if (newResponse?.pagination) {
      pagination.value.total = newResponse.pagination.total
      pagination.value.currentPage = newResponse.pagination.page
    }
  },
  { immediate: true }
)

// Reset to page 1 when filters change
watch([searchQuery, selectedStatus, selectedEventItem], () => {
  pagination.value.currentPage = 1
})

// Raw server list
const registrationsRaw = computed<RegistrationListItem[]>(
  () => (registrationsResponse.value?.data as RegistrationListItem[]) ?? []
)

// Map server fields to UI fields consumed by the table template
const registrations = computed(() =>
  registrationsRaw.value.map(
    (r: RegistrationListItem & { eventTitle?: string; eventStartDate?: string }) => ({
      id: r.id,
      name: r.attendeeName,
      email: r.attendeeEmail,
      event: r.eventTitle || 'Unknown Event',
      eventDateFormatted: formatDate(r.eventStartDate || ''),
      status: r.paymentStatus,
      amount: r.totalAmount / 100, // Convert from kobo to naira
      dateFormatted: formatDate(r.registeredAt),
      reference: r.reference || '',
    })
  )
)

function getStatusBadgeClass(status: string): string {
  const statusClasses: Record<string, string> = {
    Paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    Refunded: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

const toggleRegistration = (id: string, checked: boolean | 'indeterminate') => {
  if (checked === true) {
    selectedRegistrations.value = [...selectedRegistrations.value, id]
  } else if (checked === false) {
    selectedRegistrations.value = selectedRegistrations.value.filter(regId => regId !== id)
  }
  // Handle 'indeterminate' state if needed
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

interface Registration {
  id: string
  name: string
  email: string
  status: string
  event: string
  reference: string
  amount: number
  dateFormatted: string
  eventDateFormatted: string
}

function getActionItems(registration: Registration) {
  return [
    [
      {
        label: 'View Details',
        icon: 'i-heroicons-eye',
        to: `/admin/registrations/${registration.id}`,
      },
    ],
    [
      {
        label: 'Edit',
        icon: 'i-heroicons-pencil',
        to: `/admin/registrations/${registration.id}/edit`,
      },
    ],
    [
      {
        label: 'Send Confirmation',
        icon: 'i-heroicons-envelope',
        click: () => sendConfirmation(registration.id),
      },
    ],
    [
      {
        label: 'Delete',
        icon: 'i-heroicons-trash',
        click: () => confirmDelete(registration),
      },
    ],
  ]
}

function clearFilters() {
  searchQuery.value = ''
  selectedStatus.value = 'all'
  selectedEventItem.value = undefined
}

function confirmDelete(registration: Registration) {
  selectedRegistrations.value = [registration.id]
  isDeleteModalOpen.value = true
}

function confirmDeleteMultiple() {
  isDeleteModalOpen.value = true
}

async function deleteRegistrations() {
  isDeleting.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // In a real app, this would delete the registrations from the server

    // Clear selection
    selectedRegistrations.value = []

    // Close modal
    isDeleteModalOpen.value = false
    if (refreshData) {
      await refreshData()
    }

    // Show success message
    useToast().add({
      title: 'Success',
      description: 'Selected registrations have been deleted',
      icon: 'i-heroicons-check-circle',
      color: 'success',
    })
  } catch (error) {
    console.error('Error deleting registrations:', error)
    useToast().add({
      title: 'Error',
      description: 'There was an error deleting the registrations',
      icon: 'i-heroicons-exclamation-circle',
      color: 'error',
    })
  } finally {
    isDeleting.value = false
  }
}

function updateStatus(status: string) {
  // In a real app, this would update the status of selected registrations
  console.log(`Updating ${selectedRegistrations.value.length} registrations to ${status}`)

  // Show success message
  useToast().add({
    title: 'Status Updated',
    description: `Updated ${selectedRegistrations.value.length} registration(s) to ${status}`,
    icon: 'i-heroicons-check-circle',
    color: 'success',
  })

  // Clear selection
  selectedRegistrations.value = []
}

function sendPaymentReminder() {
  // In a real app, this would send payment reminders
  console.log(`Sending payment reminders to ${selectedRegistrations.value.length} registrations`)

  // Show success message
  useToast().add({
    title: 'Reminders Sent',
    description: `Payment reminders sent to ${selectedRegistrations.value.length} registration(s)`,
    icon: 'i-heroicons-envelope',
    color: 'success',
  })

  // Clear selection
  selectedRegistrations.value = []
}

function sendConfirmation(id: string) {
  // In a real app, this would send a confirmation email
  console.log(`Sending confirmation for registration ${id}`)

  // Show success message
  useToast().add({
    title: 'Confirmation Sent',
    description: 'Registration confirmation has been sent',
    icon: 'i-heroicons-check-circle',
    color: 'success',
  })
}
</script>
