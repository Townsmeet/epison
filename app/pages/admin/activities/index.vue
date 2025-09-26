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
        <USelect v-model="selectedType" :items="typeOptions" placeholder="All types" class="w-44" />
      </div>
      <div class="text-sm text-gray-500 dark:text-gray-400">{{ totalCount }} activities</div>
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
          v-if="activitiesLoading"
          class="px-6 py-6 text-center text-gray-600 dark:text-gray-300"
        >
          <UIcon name="i-heroicons-arrow-path" class="h-5 w-5 inline-block animate-spin mr-2" />
          Loading activities...
        </div>
        <div
          v-else-if="pagedActivities.length === 0"
          class="px-6 py-6 text-center text-gray-600 dark:text-gray-300"
        >
          No activities found
        </div>
        <div
          v-for="(activity, idx) in pagedActivities"
          v-else
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
import type { ActivityLogRow } from '../../../composables/useActivities'

definePageMeta({
  layout: 'admin',
})

// Filters
const search = ref('')
const selectedType = ref<'All' | 'Registration' | 'Payment' | 'Event' | 'Membership'>('All')
const typeOptions = ['All', 'Registration', 'Payment', 'Event', 'Membership']

// Real activities via API
const page = ref(1)
const pageSize = 10

function defaultIcon(type?: string) {
  if (type === 'Registration') return 'i-heroicons-user-plus'
  if (type === 'Payment') return 'i-heroicons-banknotes'
  if (type === 'Event') return 'i-heroicons-calendar'
  if (type === 'Membership') return 'i-heroicons-user-plus'
  return 'i-heroicons-information-circle'
}

function defaultIconColor(type?: string) {
  if (type === 'Registration' || type === 'Membership') return 'text-green-500'
  if (type === 'Payment') return 'text-blue-500'
  if (type === 'Event') return 'text-purple-500'
  return 'text-gray-400'
}

const query = computed(() => ({
  q: search.value,
  type: selectedType.value,
  page: page.value,
  limit: pageSize,
  sort: '-createdAt',
}))
const { getActivities } = useActivities()
const { data: activitiesResponse, pending: activitiesLoading, refresh } = getActivities(query.value)

watch([search, selectedType, page], async () => {
  if (page.value < 1) page.value = 1
  await refresh()
})

const totalPages = computed(() => activitiesResponse.value?.pagination?.totalPages || 0)
const totalCount = computed(() => activitiesResponse.value?.pagination?.total || 0)

const pagedActivities = computed(() => {
  const rows = (activitiesResponse.value?.data as ActivityLogRow[] | undefined) ?? []
  return rows.map(a => ({
    id: a.id,
    title: a.title,
    description: a.description ?? '',
    timestamp: new Date(a.createdAt),
    icon: a.icon || defaultIcon(a.type),
    iconColor: a.iconColor || defaultIconColor(a.type),
    type: a.type,
  }))
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
