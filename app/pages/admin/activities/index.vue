<template>
  <div>
    <!-- Filters -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
      <div class="flex items-center gap-3">
        <UInput
          v-model="search"
          icon="i-heroicons-magnifying-glass"
          placeholder="Search activities..."
          class="w-72"
        />
        <USelect
          v-model="selectedType"
          :options="typeOptions"
          placeholder="All types"
          class="w-44"
        />
      </div>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        {{ filteredActivities.length }} activities
      </div>
    </div>

    <!-- Activities List -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div
        class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"
      >
        <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">All Activity</h3>
      </div>
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="(activity, idx) in pagedActivities"
          :key="`${activity.id}-${idx}`"
          class="px-6 py-4"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0 rounded-md p-2" :class="iconBg(activity.iconColor)">
              <UIcon :name="activity.icon" class="h-5 w-5" :class="activity.iconColor" />
            </div>
            <div class="ml-4 flex-1">
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ activity.title }}
                </p>
                <span class="text-xs text-gray-400 dark:text-gray-500">{{
                  formatTimeAgo(activity.timestamp)
                }}</span>
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ activity.description }}</p>
              <div class="mt-2">
                <UBadge :color="typeColor(activity.type)" size="xs">{{ activity.type }}</UBadge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div
        class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between"
      >
        <p class="text-sm text-gray-500 dark:text-gray-400">Page {{ page }} of {{ totalPages }}</p>
        <div class="flex items-center gap-2">
          <UButton
            :disabled="page === 1"
            size="sm"
            icon="i-heroicons-chevron-left"
            variant="ghost"
            color="neutral"
            @click="page--"
          />
          <UButton
            :disabled="page === totalPages || totalPages === 0"
            size="sm"
            icon="i-heroicons-chevron-right"
            variant="ghost"
            color="neutral"
            @click="page++"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

// Filters
const search = ref('')
const selectedType = ref<'All' | 'Registration' | 'Payment' | 'Event' | 'Membership'>('All')
const typeOptions = ['All', 'Registration', 'Payment', 'Event', 'Membership']

// Mock activities (can be replaced by API)
const activities = ref([
  {
    id: 1,
    title: 'New registration',
    description: 'John Doe registered for Annual Conference 2024',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    icon: 'i-heroicons-user-plus',
    iconColor: 'text-green-500',
    type: 'Registration',
  },
  {
    id: 2,
    title: 'Payment received',
    description: 'Payment of ₦50,000 from Jane Smith',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    icon: 'i-heroicons-banknotes',
    iconColor: 'text-blue-500',
    type: 'Payment',
  },
  {
    id: 3,
    title: 'New event created',
    description: 'Workshop on Data Analysis scheduled for October 15',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    icon: 'i-heroicons-calendar',
    iconColor: 'text-purple-500',
    type: 'Event',
  },
  {
    id: 4,
    title: 'New member',
    description: 'Dr. Sarah Johnson joined EPISON',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    icon: 'i-heroicons-user-plus',
    iconColor: 'text-green-500',
    type: 'Membership',
  },
  {
    id: 5,
    title: 'Abstract submitted',
    description: 'New abstract submitted by Dr. Michael Brown',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    icon: 'i-heroicons-document-text',
    iconColor: 'text-yellow-500',
    type: 'Event',
  },
])

const filteredActivities = computed(() => {
  const q = search.value.trim().toLowerCase()
  return activities.value.filter(a => {
    const matchesQuery =
      !q || a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
    const matchesType = selectedType.value === 'All' || a.type === selectedType.value
    return matchesQuery && matchesType
  })
})

// Pagination
const page = ref(1)
const pageSize = 10
const totalPages = computed(() => Math.ceil(filteredActivities.value.length / pageSize))
watch([filteredActivities], () => {
  page.value = 1
})

const pagedActivities = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredActivities.value.slice(start, start + pageSize)
})

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr ago`
  const days = Math.floor(diffInSeconds / 86400)
  return `${days} ${days === 1 ? 'day' : 'days'} ago`
}

function typeColor(
  type: string
): 'neutral' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' {
  const map: Record<
    string,
    'neutral' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error'
  > = {
    Registration: 'success',
    Payment: 'info',
    Event: 'primary',
    Membership: 'secondary',
  }
  return map[type] || 'neutral'
}

function iconBg(iconTextColor: string) {
  if (iconTextColor.includes('green')) return 'bg-green-100 dark:bg-green-900'
  if (iconTextColor.includes('blue')) return 'bg-blue-100 dark:bg-blue-900'
  if (iconTextColor.includes('purple')) return 'bg-purple-100 dark:bg-purple-900'
  if (iconTextColor.includes('yellow')) return 'bg-yellow-100 dark:bg-yellow-900'
  return 'bg-gray-100 dark:bg-gray-700'
}
</script>
