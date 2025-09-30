<template>
  <div>
    <!-- Time Range Selector -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <USelect v-model="selectedTimeRange" :items="timeRangeOptions" class="w-48" />
        <div class="flex items-center space-x-2">
          <UInput v-model="customStartDate" type="date" placeholder="Start date" />
          <span class="text-gray-500">to</span>
          <UInput v-model="customEndDate" type="date" placeholder="End date" />
        </div>
        <UButton color="primary" icon="i-heroicons-arrow-path" @click="refreshData">
          Refresh
        </UButton>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center"
            >
              <UIcon name="i-heroicons-users" class="w-5 h-5 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Members</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ metrics.totalUsers.toLocaleString() }}
            </p>
            <p class="text-sm" :class="metrics.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ metrics.userGrowth >= 0 ? '+' : '' }}{{ metrics.userGrowth }}% from last period
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-calendar-days"
                class="w-5 h-5 text-green-600 dark:text-green-300"
              />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Events</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ metrics.totalEvents }}
            </p>
            <p
              class="text-sm"
              :class="metrics.eventGrowth >= 0 ? 'text-green-600' : 'text-red-600'"
            >
              {{ metrics.eventGrowth >= 0 ? '+' : '' }}{{ metrics.eventGrowth }}% from last period
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-clipboard-document-list"
                class="w-5 h-5 text-yellow-600 dark:text-yellow-300"
              />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Registrations</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ metrics.totalRegistrations.toLocaleString() }}
            </p>
            <p
              class="text-sm"
              :class="metrics.registrationGrowth >= 0 ? 'text-green-600' : 'text-red-600'"
            >
              {{ metrics.registrationGrowth >= 0 ? '+' : '' }}{{ metrics.registrationGrowth }}% from
              last period
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <!-- User Growth Chart fills available space -->
    <div class="mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Members Growth</h3>
        <div class="chart-wrapper">
          <LineChart
            :data="memberGrowthData"
            :categories="memberGrowthCategories"
            :height="300"
            :x-formatter="xFormatter"
            x-label="Month"
            y-label="Members"
          />
        </div>
      </div>
    </div>

    <!-- Event Performance -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Event Performance</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Event
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Registrations
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Revenue
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Attendance Rate
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Rating
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="event in eventPerformance" :key="event.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ event.name }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(event.date) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ event.registrations.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                ₦{{ event.revenue.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                    <div
                      class="bg-green-500 h-2 rounded-full"
                      :style="{ width: `${event.attendanceRate}%` }"
                    />
                  </div>
                  <span class="text-sm text-gray-900 dark:text-white"
                    >{{ event.attendanceRate }}%</span
                  >
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="event.rating > 0" class="flex items-center">
                  <UIcon name="i-heroicons-star" class="w-4 h-4 text-yellow-400 mr-1" />
                  <span class="text-sm text-gray-900 dark:text-white">{{ event.rating }}</span>
                </div>
                <span v-else class="text-sm text-gray-500 dark:text-gray-400 italic"
                  >No reviews</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Geographic Distribution -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Geographic Distribution
        </h3>
        <div class="space-y-4">
          <div
            v-for="location in geographicData"
            :key="location.state"
            class="flex items-center justify-between"
          >
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full mr-3" :style="{ backgroundColor: location.color }" />
              <span class="text-sm text-gray-900 dark:text-white">{{ location.state }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-500 dark:text-gray-400"
                >{{ location.percentage }}%</span
              >
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{
                location.count
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Membership Types</h3>
        <div class="space-y-4">
          <div
            v-for="type in membershipTypes"
            :key="type.name"
            class="flex items-center justify-between"
          >
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full mr-3" :style="{ backgroundColor: type.color }" />
              <span class="text-sm text-gray-900 dark:text-white">{{ type.name }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ type.percentage }}%</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{
                type.count
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LineChart } from 'vue-chrts'

definePageMeta({
  layout: 'admin',
})

const selectedTimeRange = ref('30d')
const customStartDate = ref('')
const customEndDate = ref('')

const timeRangeOptions = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'Last year', value: '1y' },
  { label: 'Custom range', value: 'custom' },
]

const metrics = ref({
  totalUsers: 0,
  userGrowth: 0,
  totalEvents: 0,
  eventGrowth: 0,
  totalRevenue: 0,
  revenueGrowth: 0,
  totalRegistrations: 0,
  registrationGrowth: 0,
})

interface EventPerformanceItem {
  id: string
  name: string
  date: string
  registrations: number
  revenue: number
  attendanceRate: number
  rating: number
}

interface MembershipTypeStat {
  name: string
  count: number
  percentage: number
  color: string
}

interface MemberGrowthPoint {
  month: string
  newMembers: number
  totalMembers: number
}

interface GeographicItem {
  state: string
  count: number
  percentage: number
  color: string
}

const eventPerformance = ref<EventPerformanceItem[]>([])
const membershipTypes = ref<MembershipTypeStat[]>([])
const memberGrowthData = ref<MemberGrowthPoint[]>([])
const geographicData = ref<GeographicItem[]>([])

// Fetch overview statistics
async function fetchOverviewStats() {
  try {
    const response = await $fetch('/api/admin/analytics/overview')
    if (response.success && response.data) {
      metrics.value.totalUsers = response.data.totalMembers
      metrics.value.userGrowth = response.data.memberGrowth
      metrics.value.totalEvents = response.data.totalEvents
      metrics.value.eventGrowth = response.data.eventGrowth
      metrics.value.totalRegistrations = response.data.totalRegistrations
      metrics.value.registrationGrowth = response.data.registrationGrowth
    }
  } catch (error) {
    console.error('Error fetching overview stats:', error)
  }
}

// Fetch real event performance data
async function fetchEventPerformance() {
  try {
    const response = await $fetch('/api/admin/analytics/event-performance')
    eventPerformance.value = response.data
  } catch (error) {
    console.error('Error fetching event performance:', error)
    // Keep empty array on error
  }
}

// Fetch membership type statistics
async function fetchMembershipTypes() {
  try {
    const response = await $fetch('/api/admin/analytics/membership-types')
    membershipTypes.value = response.data
  } catch (error) {
    console.error('Error fetching membership types:', error)
    // Keep empty array on error
  }
}

// Fetch member growth chart data
async function fetchMemberGrowth() {
  try {
    const response = await $fetch('/api/admin/analytics/member-growth')
    if (response.success && response.data) {
      memberGrowthData.value = response.data
    }
  } catch (error) {
    console.error('Error fetching member growth:', error)
    // Keep empty array on error
  }
}

// Fetch geographic distribution data
async function fetchGeographicDistribution() {
  try {
    const response = await $fetch('/api/admin/analytics/geographic-distribution')
    if (response.success && response.data) {
      geographicData.value = response.data
    }
  } catch (error) {
    console.error('Error fetching geographic distribution:', error)
    // Keep empty array on error
  }
}

// Fetch on mount
onMounted(() => {
  fetchOverviewStats()
  fetchEventPerformance()
  fetchMembershipTypes()
  fetchMemberGrowth()
  fetchGeographicDistribution()
})

// Member growth chart categories

const memberGrowthCategories = {
  newMembers: {
    name: 'New Members',
    color: '#3b82f6',
  },
  totalMembers: {
    name: 'Total Members',
    color: '#10b981',
  },
}

const xFormatter = (i: number) => memberGrowthData.value[i]!.month

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

async function refreshData() {
  await Promise.all([
    fetchOverviewStats(),
    fetchEventPerformance(),
    fetchMembershipTypes(),
    fetchMemberGrowth(),
    fetchGeographicDistribution(),
  ])
  useToast().add({
    title: 'Data refreshed',
    description: 'Analytics data has been updated',
    color: 'success',
  })
}
</script>
