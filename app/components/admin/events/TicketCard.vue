<template>
  <div
    class="flex items-start justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
  >
    <div class="min-w-0 flex-1">
      <div class="flex items-center gap-2 mb-1">
        <p class="font-medium text-gray-900 dark:text-white truncate">{{ ticket.name }}</p>
        <UBadge v-if="!ticket.isPublic" color="warning" variant="soft" size="xs"> Private </UBadge>
      </div>

      <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
        <span class="font-semibold text-primary-600 dark:text-primary-400">
          ₦{{ (Number(ticket.price) / 100).toLocaleString() }}
        </span>
        <span>Qty: {{ ticket.quantity }}</span>
        <span v-if="ticket.salesStart || ticket.salesEnd" class="text-xs text-gray-500">
          {{ formatSalesWindow() }}
        </span>
      </div>

      <p
        v-if="ticket.description"
        class="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2"
      >
        {{ ticket.description }}
      </p>
    </div>

    <div class="flex items-center gap-2 ml-4">
      <!-- Move to Category Dropdown -->
      <UDropdownMenu v-if="categories.length" :items="getMoveMenuItems()">
        <UButton
          size="xs"
          color="neutral"
          variant="ghost"
          icon="i-heroicons-arrow-right-circle"
          title="Move to category"
        />
      </UDropdownMenu>

      <!-- Edit Button -->
      <UButton
        size="xs"
        color="primary"
        variant="ghost"
        icon="i-heroicons-pencil"
        title="Edit ticket"
        @click="$emit('edit', ticket)"
      />

      <!-- Delete Button -->
      <UButton
        size="xs"
        color="error"
        variant="ghost"
        icon="i-heroicons-trash"
        title="Delete ticket"
        @click="$emit('delete', ticket.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EventTicket, TicketCategory } from '../../../../types/event'

interface Props {
  ticket: EventTicket
  categories: TicketCategory[]
}

interface Emits {
  edit: [ticket: EventTicket]
  delete: [ticketId: string]
  move: [ticketId: string, categoryId: string | null]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function formatSalesWindow(): string {
  const start = props.ticket.salesStart
  const end = props.ticket.salesEnd

  if (!start && !end) return ''

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  if (start && end) {
    return `${formatDate(start)} → ${formatDate(end)}`
  } else if (start) {
    return `From ${formatDate(start)}`
  } else if (end) {
    return `Until ${formatDate(end)}`
  }

  return ''
}

function getMoveMenuItems() {
  const items = []

  // Move to uncategorized
  if (props.ticket.categoryId) {
    items.push([
      {
        label: 'Move to Uncategorized',
        icon: 'i-heroicons-folder-minus',
        click: () => emit('move', props.ticket.id, null),
      },
    ])
  }

  // Move to categories
  const availableCategories = props.categories.filter(cat => cat.id !== props.ticket.categoryId)
  if (availableCategories.length) {
    items.push(
      availableCategories.map(category => ({
        label: `Move to ${category.name}`,
        icon: 'i-heroicons-folder-plus',
        click: () => emit('move', props.ticket.id, category.id),
      }))
    )
  }

  return items
}
</script>
