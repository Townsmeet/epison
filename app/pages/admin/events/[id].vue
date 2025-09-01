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
          @click="currentTab = tab as any"
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
        <template v-if="currentTab === 'Details'">
          <UCard>
            <template #header>
              <div class="flex items-start justify-between">
                <div>
                  <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
                    {{ event.title }}
                  </h1>
                  <div
                    class="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
                  >
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
        </template>

        <!-- Tickets Tab -->
        <template v-else-if="currentTab === 'Tickets'">
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold">Tickets</h3>
                <UBadge v-if="tickets.length" color="neutral" variant="subtle"
                  >{{ tickets.length }} total</UBadge
                >
              </div>
            </template>
            <div class="space-y-6">
              <!-- Existing Tickets -->
              <div v-if="tickets.length" class="grid gap-4">
                <div
                  v-for="t in tickets"
                  :key="t.id"
                  class="flex items-start justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  <div class="min-w-0">
                    <p class="font-medium text-gray-900 dark:text-white truncate">{{ t.name }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      ₦{{ Number(t.price).toLocaleString() }} • Qty {{ t.quantity }}
                      <span
                        v-if="t.salesStart || t.salesEnd"
                        class="ml-2 text-xs text-gray-500 dark:text-gray-400"
                      >
                        ({{ t.salesStart ? formatDate(t.salesStart) : '—' }} →
                        {{ t.salesEnd ? formatDate(t.salesEnd) : '—' }})
                      </span>
                    </p>
                    <p
                      v-if="t.description"
                      class="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2"
                    >
                      {{ t.description }}
                    </p>
                  </div>
                  <div class="flex items-center gap-2 ml-4">
                    <UBadge
                      size="xs"
                      :color="t.isPublic ? 'success' : 'neutral'"
                      variant="subtle"
                      >{{ t.isPublic ? 'Public' : 'Hidden' }}</UBadge
                    >
                    <UButton
                      size="xs"
                      color="error"
                      variant="ghost"
                      icon="i-heroicons-trash"
                      @click="removeTicket(t.id)"
                    />
                  </div>
                </div>
              </div>

              <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 class="text-sm font-semibold mb-3">Create Ticket</h4>
                <div class="grid md:grid-cols-2 gap-3">
                  <UInput v-model="newTicket.name" placeholder="Ticket name (e.g., Member)" />
                  <UInput v-model="newTicket.price" type="number" placeholder="Price (₦)" />
                  <UInput
                    v-model="newTicket.quantity"
                    type="number"
                    placeholder="Quantity (optional)"
                  />
                  <div class="grid grid-cols-2 gap-3">
                    <UInput
                      v-model="newTicket.salesStart"
                      type="date"
                      placeholder="Sales start (optional)"
                    />
                    <UInput
                      v-model="newTicket.salesEnd"
                      type="date"
                      placeholder="Sales end (optional)"
                    />
                  </div>
                  <div class="md:col-span-2">
                    <UTextarea
                      v-model="newTicket.description"
                      placeholder="Description (optional)"
                      :rows="3"
                      class="w-full"
                    />
                  </div>
                </div>
                <div class="mt-3 flex justify-end">
                  <UButton :disabled="!canAddTicket" icon="i-heroicons-plus" @click="addTicket"
                    >Add Ticket</UButton
                  >
                </div>
              </div>
            </div>
          </UCard>
        </template>

        <!-- Registrations Tab -->
        <template v-else-if="currentTab === 'Registrations'">
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold">Registrations</h3>
            </template>
            <div class="space-y-4">
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
                    {{ occupancy }}%
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">Occupancy</div>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <UInput
                  v-model="regSearch"
                  placeholder="Search by name, email, reference..."
                  icon="i-heroicons-magnifying-glass"
                  autocomplete="off"
                  class="w-full sm:w-72"
                />
                <div class="flex gap-2">
                  <UBadge color="neutral" variant="subtle"
                    >{{ filteredEventRegistrations.length }} result(s)</UBadge
                  >
                  <UButton
                    color="neutral"
                    variant="soft"
                    icon="i-heroicons-arrow-down-tray"
                    @click="exportEvent"
                    >Export CSV</UButton
                  >
                </div>
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
                          Type
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
                    <tbody
                      class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
                    >
                      <tr v-for="reg in paginatedEventRegistrations" :key="reg.id">
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                        >
                          {{ reg.name }}
                        </td>
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"
                        >
                          {{ reg.email }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span
                            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                            :class="getTypeBadgeClass(reg.type)"
                          >
                            {{ reg.type }}
                          </span>
                        </td>
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"
                        >
                          {{ formatDate(reg.date) }}
                        </td>
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                        >
                          ₦{{ reg.amount.toLocaleString() }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span
                            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                            :class="getStatusBadgeClass(reg.status)"
                          >
                            {{ reg.status }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <UDropdown :items="getRegActionItems(reg)">
                            <UButton
                              color="neutral"
                              variant="ghost"
                              size="xs"
                              icon="i-heroicons-ellipsis-horizontal"
                              class="rounded-full"
                            />
                          </UDropdown>
                        </td>
                      </tr>
                      <tr v-if="paginatedEventRegistrations.length === 0">
                        <td
                          colspan="7"
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
                    Showing <span class="font-medium">{{ regPagination.from }}</span> to
                    <span class="font-medium">{{ regPagination.to }}</span> of
                    <span class="font-medium">{{ regPagination.total }}</span> results
                  </p>
                  <div class="flex space-x-2">
                    <UButton
                      color="neutral"
                      variant="ghost"
                      :disabled="regPagination.currentPage === 1"
                      icon="i-heroicons-chevron-left"
                      @click="regPagination.currentPage--"
                    />
                    <UButton
                      color="neutral"
                      variant="ghost"
                      :disabled="
                        regPagination.currentPage * regPagination.perPage >= regPagination.total
                      "
                      icon="i-heroicons-chevron-right"
                      @click="regPagination.currentPage++"
                    />
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </template>

        <!-- Sponsors Tab -->
        <template v-else-if="currentTab === 'Sponsors'">
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold">Sponsors</h3>
                <UBadge v-if="event?.sponsors?.length" color="neutral" variant="subtle"
                  >{{ event?.sponsors?.length }} total</UBadge
                >
              </div>
            </template>
            <div class="space-y-6">
              <div
                v-if="event?.sponsors && event.sponsors.length"
                class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                <div
                  v-for="s in event.sponsors"
                  :key="s.id"
                  class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <img
                    :src="s.logoUrl"
                    :alt="s.name"
                    class="w-16 h-10 object-contain bg-white rounded"
                  />
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <p class="font-medium truncate">{{ s.name }}</p>
                      <UBadge v-if="s.tier" size="xs" color="primary" variant="subtle">{{
                        s.tier
                      }}</UBadge>
                    </div>
                    <p
                      v-if="s.website"
                      class="text-xs text-primary-600 dark:text-primary-400 truncate"
                    >
                      {{ s.website }}
                    </p>
                  </div>
                  <div class="flex-1" />
                  <UButton
                    size="xs"
                    color="error"
                    variant="ghost"
                    icon="i-heroicons-trash"
                    @click="removeSponsor(s.id)"
                  />
                </div>
              </div>

              <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 class="text-sm font-semibold mb-3">Add Sponsor</h4>
                <div class="grid md:grid-cols-2 gap-3">
                  <UInput v-model="newSponsor.name" placeholder="Sponsor name" />
                  <USelect
                    v-model="newSponsor.tier"
                    :options="sponsorTierOptions"
                    placeholder="Tier (optional)"
                  />
                  <UInput v-model="newSponsor.logoUrl" placeholder="Logo URL" />
                  <UInput v-model="newSponsor.website" placeholder="Website (optional)" />
                </div>
                <div class="mt-3 flex justify-end">
                  <UButton
                    :disabled="!newSponsor.name || !newSponsor.logoUrl"
                    icon="i-heroicons-plus"
                    @click="addSponsor"
                  >
                    Add Sponsor
                  </UButton>
                </div>
              </div>
            </div>
          </UCard>
        </template>

        <!-- Gallery Tab -->
        <template v-else-if="currentTab === 'Gallery'">
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold">Gallery</h3>
                <UBadge v-if="event?.gallery?.length" color="neutral" variant="subtle"
                  >{{ event?.gallery?.length }} items</UBadge
                >
              </div>
            </template>
            <div class="space-y-6">
              <div
                v-if="event?.gallery && event.gallery.length"
                class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                <div
                  v-for="m in event.gallery"
                  :key="m.id"
                  class="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <img
                    v-if="m.type !== 'video'"
                    :src="m.url"
                    :alt="m.caption || 'Media'"
                    class="w-full h-40 object-cover"
                  />
                  <div class="p-2 text-sm flex items-center justify-between">
                    <p class="truncate">{{ m.caption || '—' }}</p>
                    <UButton
                      size="xs"
                      color="error"
                      variant="ghost"
                      icon="i-heroicons-trash"
                      @click="removeMedia(m.id)"
                    />
                  </div>
                </div>
              </div>

              <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 class="text-sm font-semibold mb-3">Add Media</h4>
                <div class="grid md:grid-cols-3 gap-3">
                  <USelect v-model="newMedia.type" :options="mediaTypeOptions" />
                  <UInput v-model="newMedia.url" placeholder="Media URL" />
                  <UInput v-model="newMedia.caption" placeholder="Caption (optional)" />
                </div>
                <div class="mt-3 flex justify-end">
                  <UButton :disabled="!newMedia.url" icon="i-heroicons-plus" @click="addMedia">
                    Add Media
                  </UButton>
                </div>
              </div>
            </div>
          </UCard>
        </template>
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
            <li v-if="event?.sponsors">
              <span class="font-medium">Sponsors:</span> {{ event?.sponsors?.length }}
            </li>
            <li v-if="event?.gallery">
              <span class="font-medium">Gallery items:</span> {{ event?.gallery?.length }}
            </li>
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

// Tabs
const tabs = ['Details', 'Tickets', 'Sponsors', 'Registrations', 'Gallery']
const currentTab = ref<'Details' | 'Tickets' | 'Registrations' | 'Sponsors' | 'Gallery'>('Details')

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

// Ensure tickets array exists on the event when accessed
const tickets = computed<EventTicket[]>(() => {
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

function addTicket() {
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

function removeTicket(id: number) {
  if (!event.value) return
  const e = event.value as EventItem & { tickets?: EventTicket[] }
  if (!Array.isArray(e.tickets)) return
  e.tickets = (e.tickets as EventTicket[]).filter((t: EventTicket) => t.id !== id)
  useToast().add({ title: 'Ticket removed', color: 'neutral' })
}

// Sponsors management
const sponsorTierOptions = [
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
function addSponsor() {
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
function removeSponsor(sponsorId: number) {
  if (!event.value?.sponsors) return
  event.value.sponsors = event.value.sponsors.filter(s => s.id !== sponsorId)
  useToast().add({ title: 'Sponsor removed', color: 'neutral' })
}

// Gallery management
const mediaTypeOptions = [
  { label: 'Image', value: 'image' },
  { label: 'Video', value: 'video' },
]
const newMedia = reactive<{ url: string; caption?: string; type: 'image' | 'video' }>({
  url: '',
  caption: '',
  type: 'image',
})
function addMedia() {
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
function removeMedia(mediaId: number) {
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

const paginatedEventRegistrations = computed(() => {
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

function formatDate(dateString: string): string {
  if (!dateString) return ''
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

function getStatusBadgeClass(status: string): string {
  const statusClasses: Record<string, string> = {
    Paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    Refunded: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
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

function getRegActionItems(reg: RegistrationRow) {
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
</script>
