<template>
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
          <UInput v-model="newTicket.quantity" type="number" placeholder="Quantity (optional)" />
          <div class="grid grid-cols-2 gap-3">
            <UInput
              v-model="newTicket.salesStart"
              type="date"
              placeholder="Sales start (optional)"
            />
            <UInput v-model="newTicket.salesEnd" type="date" placeholder="Sales end (optional)" />
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

<script setup lang="ts">
import type { EventItem } from '../../../composables/useEvents'

const props = defineProps<{ event: EventItem }>()

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

// reactive tickets on the event object
const tickets = computed<EventTicket[]>(() => {
  type EventWithTickets = EventItem & { tickets?: EventTicket[] }
  const e = props.event as EventWithTickets
  if (!Array.isArray(e.tickets)) e.tickets = []
  return e.tickets as EventTicket[]
})

const newTicket = reactive({
  name: '',
  price: '' as string | number,
  quantity: '' as string | number,
  salesStart: '',
  salesEnd: '',
  description: '',
  isPublic: true,
})

const canAddTicket = computed(
  () => !!newTicket.name && Number(newTicket.price) >= 0 && Number(newTicket.quantity) >= 0
)

function addTicket() {
  const e = props.event as EventItem & { tickets?: EventTicket[] }
  if (!Array.isArray(e.tickets)) e.tickets = []
  if (!canAddTicket.value) return
  const t: EventTicket = {
    id: Date.now(),
    name: String(newTicket.name).trim(),
    price: Number(newTicket.price) || 0,
    quantity: Number(newTicket.quantity) || 0,
    salesStart: newTicket.salesStart || undefined,
    salesEnd: newTicket.salesEnd || undefined,
    description: newTicket.description?.trim() || undefined,
    isPublic: true,
  }
  e.tickets!.push(t)
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
  const e = props.event as EventItem & { tickets?: EventTicket[] }
  if (!Array.isArray(e.tickets)) return
  e.tickets = e.tickets.filter(t => t.id !== id)
  useToast().add({ title: 'Ticket removed', color: 'neutral' })
}

function formatDate(dateString: string): string {
  if (!dateString) return ''
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}
</script>
