<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <h3 class="text-lg font-semibold">Tickets</h3>
          <UIcon
            v-if="isSyncing"
            name="i-heroicons-arrow-path"
            class="w-4 h-4 animate-spin text-gray-400"
          />
        </div>
        <UBadge v-if="tickets.length" color="neutral" variant="subtle">
          {{ tickets.length }} total
        </UBadge>
      </div>
    </template>
    <div class="space-y-6">
      <!-- Loading State -->
      <div v-if="ticketsLoading" class="flex justify-center py-8">
        <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin" />
      </div>

      <!-- Existing Tickets -->
      <div v-else-if="tickets.length" class="grid gap-4">
        <div
          v-for="t in tickets"
          :key="t.id"
          class="flex items-start justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <div class="min-w-0">
            <p class="font-medium text-gray-900 dark:text-white truncate">{{ t.name }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
              ₦{{ (Number(t.price) / 100).toLocaleString() }} • Qty {{ t.quantity }}
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
          <UButton
            :disabled="!canAddTicket"
            :loading="isCreating"
            icon="i-heroicons-plus"
            @click="addTicket"
          >
            Add Ticket
          </UButton>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { EventItem } from '../../../composables/useEvents'
import type { EventTicket } from '../../../../types/event'

const props = defineProps<{ event: EventItem }>()

// Use the events API composable
const { getEventTickets, createEventTicket, deleteEventTicket, refreshEventTickets } = useEvents()

// Fetch tickets data from API
const { data: ticketsResponse, pending: ticketsLoading } = await getEventTickets(props.event.id)
const tickets = computed(() => ticketsResponse.value?.data || [])

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

const isCreating = ref(false)
const isSyncing = ref(false)

async function addTicket() {
  if (!canAddTicket.value || isCreating.value) return

  isCreating.value = true
  try {
    const ticketData = {
      name: String(newTicket.name).trim(),
      price: (Number(newTicket.price) || 0) * 100, // Convert naira to kobo
      quantity: Number(newTicket.quantity) || 0,
      salesStart: newTicket.salesStart || undefined,
      salesEnd: newTicket.salesEnd || undefined,
      description: newTicket.description?.trim() || undefined,
      isPublic: true,
    }

    // Create ticket via API
    const created = await createEventTicket(props.event.id, ticketData)
    const createdWithId: EventTicket = {
      ...(created as EventTicket),
      id: (created as EventTicket)?.id ?? String(Date.now()),
    }

    // Optimistically update local list
    if (!ticketsResponse.value) {
      // Initialize response container if absent so UI updates immediately
      ticketsResponse.value = { data: [] as EventTicket[] }
    }
    const current = Array.isArray(ticketsResponse.value.data) ? ticketsResponse.value.data : []
    ticketsResponse.value.data = [createdWithId, ...current]

    // Refresh tickets data from API (ensure consistency)
    isSyncing.value = true
    await refreshEventTickets(props.event.id)
    // Additionally force Nuxt to refresh this key in case cookie-based trigger isn't immediate
    if (typeof refreshNuxtData === 'function') {
      await refreshNuxtData(`event-tickets-${props.event.id}`)
    }
    // Reconcile in case API response is stale and doesn't include the new ticket yet
    try {
      const list = ticketsResponse.value?.data as EventTicket[] | undefined
      const cid = (created as EventTicket)?.id ?? createdWithId.id
      if (Array.isArray(list) && cid) {
        const found = list.some(t => String(t.id) === String(cid))
        if (!found) {
          ticketsResponse.value!.data = [created as EventTicket, ...list]
        }
      }
    } finally {
      isSyncing.value = false
    }

    // Reset form
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
  } catch (error) {
    console.error('Error adding ticket:', error)
    useToast().add({ title: 'Error adding ticket', color: 'error' })
  } finally {
    isCreating.value = false
  }
}

async function removeTicket(id: string) {
  try {
    await deleteEventTicket(props.event.id, id)
    // Optimistically remove from local list
    if (ticketsResponse.value && Array.isArray(ticketsResponse.value.data)) {
      ticketsResponse.value.data = ticketsResponse.value.data.filter(
        t => String(t.id) !== String(id)
      )
    }
    isSyncing.value = true
    await refreshEventTickets(props.event.id)
    // Additionally force Nuxt to refresh this key in case cookie-based trigger isn't immediate
    if (typeof refreshNuxtData === 'function') {
      await refreshNuxtData(`event-tickets-${props.event.id}`)
    }
    isSyncing.value = false
    useToast().add({ title: 'Ticket removed', color: 'success' })
  } catch (error) {
    console.error('Error removing ticket:', error)
    useToast().add({ title: 'Error removing ticket', color: 'error' })
  }
}

function formatDate(dateString: string): string {
  if (!dateString) return ''
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}
</script>
