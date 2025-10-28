<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <h3 class="text-lg font-semibold">Tickets & Categories</h3>
          <UIcon
            v-if="isSyncing"
            name="i-heroicons-arrow-path"
            class="w-4 h-4 animate-spin text-gray-400"
          />
        </div>
        <div class="flex items-center gap-2">
          <UBadge v-if="totalTickets" color="neutral" variant="subtle">
            {{ totalTickets }} tickets
          </UBadge>
          <UButton
            size="xs"
            color="primary"
            variant="soft"
            icon="i-heroicons-plus"
            @click="showCategoryModal = true"
          >
            Add Category
          </UButton>
        </div>
      </div>
    </template>

    <div class="space-y-6">
      <!-- Loading State -->
      <div v-if="ticketsLoading" class="flex justify-center py-8">
        <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin" />
      </div>

      <!-- Categorized Tickets -->
      <div v-else class="space-y-6">
        <!-- Categories with Tickets -->
        <div v-for="category in ticketStructure.categorized" :key="category.id" class="space-y-3">
          <div
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border"
          >
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-folder" class="w-5 h-5 text-primary-500" />
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-white">{{ category.name }}</h4>
                <p v-if="category.description" class="text-sm text-gray-600 dark:text-gray-300">
                  {{ category.description }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <UBadge color="primary" variant="soft" size="sm">
                {{ category.tickets.length }} tickets
              </UBadge>
              <UDropdownMenu :items="getCategoryMenuItems(category)">
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-heroicons-ellipsis-horizontal"
                  size="xs"
                />
              </UDropdownMenu>
            </div>
          </div>

          <!-- Tickets in Category -->
          <div class="ml-8 space-y-2">
            <TicketCard
              v-for="ticket in category.tickets"
              :key="ticket.id"
              :ticket="ticket"
              :categories="categories"
              @edit="editTicket"
              @delete="removeTicket"
              @move="moveTicket"
            />
            <UButton
              size="xs"
              color="primary"
              variant="ghost"
              icon="i-heroicons-plus"
              @click="addTicketToCategory(category.id)"
            >
              Add ticket to {{ category.name }}
            </UButton>
          </div>
        </div>

        <!-- Uncategorized Tickets -->
        <div v-if="ticketStructure.uncategorized.length" class="space-y-3">
          <div
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border"
          >
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-ticket" class="w-5 h-5 text-gray-500" />
              <h4 class="font-semibold text-gray-900 dark:text-white">Uncategorized Tickets</h4>
            </div>
            <UBadge color="neutral" variant="soft" size="sm">
              {{ ticketStructure.uncategorized.length }} tickets
            </UBadge>
          </div>

          <div class="ml-8 space-y-2">
            <TicketCard
              v-for="ticket in ticketStructure.uncategorized"
              :key="ticket.id"
              :ticket="ticket"
              :categories="categories"
              @edit="editTicket"
              @delete="removeTicket"
              @move="moveTicket"
            />
          </div>
        </div>

        <!-- Add New Ticket -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-sm font-semibold">Create New Ticket</h4>
            <UButton
              v-if="showTicketForm"
              size="xs"
              color="neutral"
              variant="ghost"
              @click="cancelTicketForm"
            >
              Cancel
            </UButton>
          </div>

          <UButton
            v-if="!showTicketForm"
            color="primary"
            variant="soft"
            icon="i-heroicons-plus"
            @click="showTicketForm = true"
          >
            Add New Ticket
          </UButton>

          <div v-else class="space-y-4">
            <div class="grid md:grid-cols-2 gap-3">
              <div class="space-y-2">
                <div class="relative w-full">
                  <USelectMenu
                    v-model="selectedCategory"
                    :items="categoryOptions"
                    placeholder="Select category (optional)"
                    class="w-full"
                    @update:model-value="val => (newTicket.categoryId = val?.value || undefined)"
                  />
                </div>
              </div>
              <UInput v-model="newTicket.name" placeholder="Ticket name (e.g., Member)" />
              <UInput v-model="newTicket.price" type="number" placeholder="Price (₦)" />
              <UInput v-model="newTicket.quantity" type="number" placeholder="Quantity" />
              <UInput
                v-model="newTicket.salesStart"
                type="date"
                placeholder="Sales start (optional)"
              />
              <UInput v-model="newTicket.salesEnd" type="date" placeholder="Sales end (optional)" />
            </div>
            <UTextarea
              v-model="newTicket.description"
              placeholder="Description (optional)"
              :rows="3"
              class="w-full"
            />
            <div class="flex justify-end gap-2">
              <UButton color="neutral" variant="ghost" @click="cancelTicketForm"> Cancel </UButton>
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
      </div>
    </div>

    <!-- Category Modal -->
    <UModal v-model:open="showCategoryModal">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">
              {{ editingCategory ? 'Edit Category' : 'Create Category' }}
            </h3>
          </template>

          <div class="space-y-4">
            <UInput
              v-model="categoryForm.name"
              placeholder="Category name (e.g., International)"
              label="Name"
              class="w-full"
            />
            <UTextarea
              v-model="categoryForm.description"
              placeholder="Optional description"
              label="Description"
              :rows="3"
              class="w-full"
            />
          </div>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton color="neutral" variant="ghost" @click="closeCategoryModal">
                Cancel
              </UButton>
              <UButton
                :disabled="!categoryForm.name.trim()"
                :loading="isSavingCategory"
                @click="saveCategory"
              >
                {{ editingCategory ? 'Update' : 'Create' }}
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </UCard>
</template>

<script setup lang="ts">
import type { EventItem } from '../../../composables/useEvents'
import type { EventTicket, TicketCategory, TicketDisplayStructure } from '../../../../types/event'
import TicketCard from './TicketCard.vue'

const props = defineProps<{ event: EventItem }>()

// Use the events API composable
const {
  getTicketsWithCategories,
  getTicketCategories,
  createEventTicket,
  deleteEventTicket,
  updateEventTicket,
  createTicketCategory,
  updateTicketCategory,
  deleteTicketCategory,
  refreshTicketsWithCategories,
  refreshTicketCategories,
} = useEvents()

// Fetch structured tickets data from API
const { data: ticketsResponse, pending: ticketsLoading } = await getTicketsWithCategories(
  props.event.id
)
const { data: categoriesResponse } = await getTicketCategories(props.event.id)

const ticketStructure = computed<TicketDisplayStructure>(
  () => ticketsResponse.value?.data || { categorized: [], uncategorized: [] }
)

const categories = computed(() => categoriesResponse.value?.data || [])

const totalTickets = computed(() => {
  const structure = ticketStructure.value
  return (
    structure.categorized.reduce((sum, cat) => sum + cat.tickets.length, 0) +
    structure.uncategorized.length
  )
})

// UI State
const showTicketForm = ref(false)
const showCategoryModal = ref(false)
const editingCategory = ref<TicketCategory | null>(null)
const isCreating = ref(false)
const isSyncing = ref(false)
const isSavingCategory = ref(false)
const selectedCategory = ref<{ label: string; value: string } | undefined>(undefined)

// Forms
const newTicket = ref<Partial<EventTicket>>({
  name: '',
  description: '',
  price: undefined,
  quantity: undefined,
  categoryId: undefined,
  salesStart: undefined,
  salesEnd: undefined,
})

const categoryForm = reactive({
  name: '',
  description: '',
})

// Computed
const canAddTicket = computed(
  () =>
    !!newTicket.value.name &&
    (newTicket.value.price === undefined || Number(newTicket.value.price) >= 0) &&
    (newTicket.value.quantity === undefined || Number(newTicket.value.quantity) >= 0)
)

const categoryOptions = computed(() => {
  try {
    if (!categories.value || !Array.isArray(categories.value)) {
      return [{ label: 'No categories available', value: '' }]
    }

    const options = [{ label: 'No category', value: '' }]

    for (const cat of categories.value) {
      if (cat?.id && typeof cat.name === 'string') {
        options.push({
          label: cat.name.trim() || 'Unnamed Category',
          value: String(cat.id),
        })
      }
    }

    return options
  } catch (error) {
    console.error('Error generating category options:', error)
    return [{ label: 'Error loading categories', value: '' }]
  }
})

// Ticket Management
async function addTicket() {
  if (!canAddTicket.value || isCreating.value) return

  isCreating.value = true
  try {
    const ticketData = {
      name: String(newTicket.value.name).trim(),
      price: (Number(newTicket.value.price) || 0) * 100, // Convert naira to kobo
      quantity: Number(newTicket.value.quantity) || 0,
      categoryId: newTicket.value.categoryId || undefined,
      displayOrder: 0,
      salesStart: newTicket.value.salesStart || undefined,
      salesEnd: newTicket.value.salesEnd || undefined,
      description: newTicket.value.description?.trim() || undefined,
      isPublic: true,
    }

    await createEventTicket(props.event.id, ticketData)
    await refreshData()
    resetTicketForm()
    showTicketForm.value = false
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
    await refreshData()
    useToast().add({ title: 'Ticket removed', color: 'success' })
  } catch (error) {
    console.error('Error removing ticket:', error)
    useToast().add({ title: 'Error removing ticket', color: 'error' })
  }
}

async function editTicket(ticket: EventTicket) {
  // Populate form with ticket data
  Object.assign(newTicket.value, {
    categoryId: ticket.categoryId || '',
    name: ticket.name,
    price: ticket.price / 100, // Convert kobo to naira
    quantity: ticket.quantity,
    salesStart: ticket.salesStart || '',
    salesEnd: ticket.salesEnd || '',
    description: ticket.description || '',
    isPublic: ticket.isPublic,
  })
  showTicketForm.value = true
}

async function moveTicket(ticketId: string, newCategoryId: string | null) {
  try {
    // Find the ticket to get its current data
    const ticket = ticketStructure.value.categorized
      .flatMap(cat => cat.tickets)
      .concat(ticketStructure.value.uncategorized)
      .find(t => t.id === ticketId)

    if (!ticket) {
      throw new Error('Ticket not found')
    }

    // Update ticket with new category while preserving other properties
    await updateEventTicket(ticketId, {
      name: ticket.name,
      price: ticket.price,
      quantity: ticket.quantity,
      displayOrder: ticket.displayOrder,
      isPublic: ticket.isPublic,
      categoryId: newCategoryId || undefined,
      salesStart: ticket.salesStart,
      salesEnd: ticket.salesEnd,
      description: ticket.description,
    })

    await refreshData()
    useToast().add({ title: 'Ticket moved', color: 'success' })
  } catch (error) {
    console.error('Error moving ticket:', error)
    useToast().add({
      title: 'Error moving ticket',
      description: error instanceof Error ? error.message : 'An error occurred',
      color: 'error',
    })
  }
}

function addTicketToCategory(categoryId: string) {
  newTicket.value.categoryId = categoryId
  showTicketForm.value = true
}

function cancelTicketForm() {
  resetTicketForm()
  showTicketForm.value = false
}

const resetTicketForm = () => {
  newTicket.value = {
    name: '',
    description: '',
    price: 0,
    quantity: 1,
    categoryId: undefined,
    salesStart: new Date().toISOString().split('T')[0],
    salesEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  }
  selectedCategory.value = undefined
}

// Category Management
async function saveCategory() {
  if (!categoryForm.name.trim()) return

  isSavingCategory.value = true
  try {
    const categoryData = {
      name: categoryForm.name.trim(),
      description: categoryForm.description?.trim() || undefined,
      displayOrder: 0,
    }

    if (editingCategory.value) {
      await updateTicketCategory(editingCategory.value.id, categoryData)
      useToast().add({ title: 'Category updated', color: 'success' })
    } else {
      await createTicketCategory(props.event.id, categoryData)
      useToast().add({ title: 'Category created', color: 'success' })
    }

    await refreshData()
    closeCategoryModal()
  } catch (error) {
    console.error('Error saving category:', error)
    useToast().add({ title: 'Error saving category', color: 'error' })
  } finally {
    isSavingCategory.value = false
  }
}

function editCategory(category: TicketCategory) {
  editingCategory.value = category
  categoryForm.name = category.name
  categoryForm.description = category.description || ''
  showCategoryModal.value = true
}

async function deleteCategory(categoryId: string) {
  try {
    await deleteTicketCategory(categoryId)
    await refreshData()
    useToast().add({ title: 'Category deleted', color: 'success' })
  } catch (error) {
    console.error('Error deleting category:', error)
    useToast().add({ title: 'Error deleting category', color: 'error' })
  }
}

function closeCategoryModal() {
  showCategoryModal.value = false
  editingCategory.value = null
  categoryForm.name = ''
  categoryForm.description = ''
}

function getCategoryMenuItems(category: TicketCategory) {
  return [
    [
      {
        label: 'Edit Category',
        icon: 'i-heroicons-pencil',
        click: () => editCategory(category),
      },
    ],
    [
      {
        label: 'Delete Category',
        icon: 'i-heroicons-trash',
        click: () => deleteCategory(category.id),
      },
    ],
  ]
}

async function refreshData() {
  isSyncing.value = true
  try {
    await Promise.all([
      refreshTicketsWithCategories(props.event.id),
      refreshTicketCategories(props.event.id),
    ])
  } finally {
    isSyncing.value = false
  }
}
</script>
