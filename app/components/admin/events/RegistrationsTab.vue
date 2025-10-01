<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Registrations</h3>
        <div class="flex items-center gap-2">
          <UBadge color="neutral" variant="subtle">{{ filteredRows.length }} result(s)</UBadge>
          <UButton
            color="neutral"
            variant="soft"
            icon="i-heroicons-arrow-down-tray"
            @click="exportCsv"
          >
            Export CSV
          </UButton>
        </div>
      </div>
    </template>

    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <UInput
          v-model="search"
          placeholder="Search by name, email, reference..."
          icon="i-heroicons-magnifying-glass"
          autocomplete="off"
          class="w-full sm:w-72"
        />
      </div>

      <div
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="reg in paginatedRows" :key="reg.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ reg.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {{ reg.email }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {{ _formatDate(reg.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  ₦{{ reg.amount.toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="_getStatusBadgeClass(reg.status)"
                  >
                    {{ reg.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <UDropdownMenu :items="_getRegActionItems(reg)">
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
              <tr v-if="paginatedRows.length === 0">
                <td
                  colspan="6"
                  class="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No registrations for this event.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between"
        >
          <p class="text-sm text-gray-700 dark:text-gray-300">
            Showing <span class="font-medium">{{ pagination.from }}</span> to
            <span class="font-medium">{{ pagination.to }}</span> of
            <span class="font-medium">{{ pagination.total }}</span> results
          </p>
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
  </UCard>
</template>

<script setup lang="ts">
export type RegistrationRow = {
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

const props = defineProps<{
  eventId: string
  eventTitle: string
}>()

// Use the events API composable
const { getEventRegistrations, refreshEventRegistrations } = useEvents()

// Define search and pagination BEFORE using them in computed/fetch
const search = ref('')
const pagination = ref({
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

// Reactive query for registrations
const registrationsQuery = computed(() => ({
  page: pagination.value.currentPage,
  limit: pagination.value.perPage,
  q: search.value || undefined,
}))

// Fetch registrations data from API
const { data: registrationsResponse, pending: _registrationsLoading } = await getEventRegistrations(
  props.eventId,
  registrationsQuery.value
)

// Transform API data to match RegistrationRow format
const registrations = computed(() => {
  if (!registrationsResponse.value?.data) return []
  return registrationsResponse.value.data.map(reg => ({
    id: reg.id,
    name: reg.attendeeName,
    email: reg.attendeeEmail,
    event: props.eventTitle,
    eventDate: '',
    type: reg.category || 'Member',
    date: reg.registeredAt,
    amount: reg.totalAmount,
    status: reg.paymentStatus,
    reference: reg.reference || '',
  }))
})

const _formatDate = (date: string) => {
  if (!date) return ''
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(date).toLocaleDateString('en-US', options)
}

const _getStatusBadgeClass = (status: string) => {
  const statusClasses: Record<string, string> = {
    Paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    Refunded: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

const _getRegActionItems = (reg: RegistrationRow) => {
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

// (moved earlier)

// Registrations are already filtered by the API
const filteredRows = computed(() => registrations.value)

// Update pagination total from API response
watch(
  registrationsResponse,
  response => {
    if (response?.pagination) {
      pagination.value.total = response.pagination.total
    }
  },
  { immediate: true }
)

// Data is already paginated by the API
const paginatedRows = computed(() => filteredRows.value)

// Watch for search changes and refetch data
let debounceTimer: NodeJS.Timeout
watch(search, async () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    pagination.value.currentPage = 1
    await refreshEventRegistrations(props.eventId, registrationsQuery.value)
  }, 300)
})

watch(
  () => pagination.value.currentPage,
  async () => {
    await refreshEventRegistrations(props.eventId, registrationsQuery.value)
  }
)

// Functions are now provided via props with underscore-prefixed versions as fallbacks

function exportCsv() {
  const header = ['Name', 'Email', 'Date', 'Amount', 'Status', 'Reference']
  const rows = filteredRows.value.map(r => [
    r.name,
    r.email,
    r.date,
    r.amount,
    r.status,
    r.reference,
  ])
  const csv = [header, ...rows]
    .map(r => r.map(v => `"${String(v).replaceAll('"', '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `registrations-${props.eventTitle.replaceAll(' ', '-').toLowerCase()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
