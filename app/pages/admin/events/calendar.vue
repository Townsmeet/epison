<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <UButton
          color="neutral"
          variant="outline"
          icon="i-heroicons-chevron-left"
          @click="prevMonth"
        />
        <UButton
          color="neutral"
          variant="outline"
          icon="i-heroicons-chevron-right"
          @click="nextMonth"
        />
        <UButton color="neutral" variant="ghost" @click="goToday">Today</UButton>
      </div>
      <div class="text-xl font-semibold text-gray-900 dark:text-white">
        {{ formatMonthYear(viewDate) }}
      </div>
      <div class="flex items-center gap-2">
        <UButton color="neutral" variant="outline" icon="i-heroicons-list-bullet" to="/admin/events"
          >List View</UButton
        >
        <UButton color="primary" icon="i-heroicons-plus" @click="isCreateEventOpen = true"
          >Create Event</UButton
        >
      </div>
    </div>

    <div v-if="eventsLoading" class="flex items-center justify-center py-16">
      <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin" />
      <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">Loading events…</span>
    </div>

    <div v-else-if="eventsError" class="text-center py-12">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 mx-auto text-red-500 mb-3" />
      <p class="text-gray-600 dark:text-gray-400">Failed to load events for this month.</p>
      <div class="mt-4">
        <UButton color="neutral" variant="outline" @click="refreshEvents(eventsQuery)"
          >Try Again</UButton
        >
      </div>
    </div>

    <div v-else-if="events.length === 0" class="text-center py-12">
      <UIcon name="i-heroicons-calendar" class="w-12 h-12 mx-auto text-gray-400 mb-3" />
      <p class="text-gray-600 dark:text-gray-400">No events scheduled this month.</p>
    </div>

    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
        <div
          v-for="d in weekDays"
          :key="d"
          class="p-3 text-xs font-medium text-gray-500 dark:text-gray-400 text-center"
        >
          {{ d }}
        </div>
      </div>
      <div class="grid grid-cols-7">
        <div
          v-for="cell in days"
          :key="cell.key"
          class="min-h-[110px] p-2 border-t border-l border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"
          :class="{
            'bg-gray-50 dark:bg-gray-900/30': cell.isOtherMonth,
            'ring-1 ring-primary-500': isSameDate(cell.date, today),
          }"
        >
          <div class="flex items-center justify-between mb-1">
            <span
              class="text-xs"
              :class="
                cell.isOtherMonth
                  ? 'text-gray-400 dark:text-gray-500'
                  : 'text-gray-700 dark:text-gray-200'
              "
              >{{ cell.date.getDate() }}</span
            >
            <span
              v-if="getEventsForDay(cell.date).length"
              class="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200"
              >{{ getEventsForDay(cell.date).length }}</span
            >
          </div>
          <div class="space-y-1">
            <div
              v-for="evt in getEventsForDay(cell.date).slice(0, 3)"
              :key="evt.id"
              class="flex items-start gap-1 text-xs px-2 py-1 rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
              @click.stop="viewEvent(evt.id)"
            >
              <span
                class="mt-0.5 block w-1.5 h-1.5 rounded-full"
                :class="statusDotColor(evt.status)"
              />
              <span class="truncate text-gray-700 dark:text-gray-200">{{ evt.title }}</span>
            </div>
            <UButton
              v-if="getEventsForDay(cell.date).length > 3"
              size="xs"
              variant="ghost"
              color="neutral"
              @click="viewDay(cell.date)"
              >+{{ getEventsForDay(cell.date).length - 3 }} more</UButton
            >
          </div>
        </div>
      </div>
    </div>

    <UModal v-model:open="isCreateEventOpen">
      <template #content>
        <UCard>
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
          <div class="text-sm text-gray-500 dark:text-gray-400">Coming soon</div>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
// Types
import type { EventItem, EventListQuery } from '../../../composables/useEvents'

definePageMeta({ layout: 'admin' })

const { getEvents, refreshEvents } = useEvents()

const isCreateEventOpen = ref(false)
const today = new Date()
const viewDate = ref(new Date(today.getFullYear(), today.getMonth(), 1))

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const days = computed(() => {
  const year = viewDate.value.getFullYear()
  const month = viewDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const start = new Date(firstDay)
  start.setDate(firstDay.getDate() - firstDay.getDay())
  const cells: { key: string; date: Date; isOtherMonth: boolean }[] = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    cells.push({ key: dayKey(d), date: d, isOtherMonth: d.getMonth() !== month })
  }
  return cells
})

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10)
}
function isSameDate(a: Date, b: Date) {
  return a.toDateString() === b.toDateString()
}
function formatMonthYear(d: Date) {
  return d.toLocaleString('en-US', { month: 'long', year: 'numeric' })
}

// Build month date range
const monthStart = computed(
  () => new Date(viewDate.value.getFullYear(), viewDate.value.getMonth(), 1)
)
const monthEnd = computed(
  () => new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 0)
)

function toIsoStart(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x.toISOString()
}
function toIsoEnd(d: Date) {
  const x = new Date(d)
  x.setHours(23, 59, 59, 999)
  return x.toISOString()
}

// Query to load events for the visible month
const eventsQuery = computed<EventListQuery>(() => ({
  page: 1,
  limit: 100,
  from: toIsoStart(monthStart.value),
  to: toIsoEnd(monthEnd.value),
  sort: 'startDate',
}))

// Fetch events for the calendar month
const {
  data: eventsResponse,
  pending: eventsLoading,
  error: eventsError,
} = await getEvents(eventsQuery.value)

// Computed events list for this view
const events = computed<EventItem[]>(() => (eventsResponse.value?.data as EventItem[]) ?? [])

const eventsByDay = computed<Record<string, EventItem[]>>(() => {
  const map: Record<string, EventItem[]> = {}
  for (const e of events.value) {
    const start = new Date(e.startDate)
    const end = e.endDate ? new Date(e.endDate) : new Date(e.startDate)
    const cur = new Date(start)
    while (cur <= end) {
      const k = dayKey(cur)
      ;(map[k] ||= []).push(e)
      cur.setDate(cur.getDate() + 1)
    }
  }
  return map
})

function getEventsForDay(d: Date): EventItem[] {
  return eventsByDay.value[dayKey(d)] ?? []
}

function statusDotColor(status: EventItem['status']) {
  const m: Record<string, string> = {
    draft: 'bg-neutral-400',
    published: 'bg-primary-500',
    registration_open: 'bg-green-500',
    registration_closed: 'bg-yellow-500',
    ongoing: 'bg-indigo-500',
    completed: 'bg-blue-500',
    cancelled: 'bg-red-500',
  }
  return m[status] || 'bg-neutral-400'
}

function prevMonth() {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1, 1)
}
function nextMonth() {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 1)
}
function goToday() {
  viewDate.value = new Date(today.getFullYear(), today.getMonth(), 1)
}

// Refetch when the visible month changes
watch(viewDate, async () => {
  await refreshEvents(eventsQuery.value)
})

function viewEvent(id: string) {
  navigateTo(`/admin/events/${id}`)
}
function viewDay(_d: Date) {
  /* optional: navigate to day detail or open modal */
}
</script>
