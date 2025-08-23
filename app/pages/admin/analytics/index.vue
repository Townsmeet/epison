<template>
  <div>
    <!-- Time Range Selector -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <USelect v-model="selectedTimeRange" :options="timeRangeOptions" class="w-48" />
        <div class="flex items-center space-x-2">
          <UInput
            v-model="customStartDate"
            type="date"
            placeholder="Start date"
            :disabled="selectedTimeRange !== 'custom'"
          />
          <span class="text-gray-500">to</span>
          <UInput
            v-model="customEndDate"
            type="date"
            placeholder="End date"
            :disabled="selectedTimeRange !== 'custom'"
          />
        </div>
        <UButton color="primary" icon="i-heroicons-arrow-path" @click="refreshData">
          Refresh
        </UButton>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
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
              class="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-currency-dollar"
                class="w-5 h-5 text-purple-600 dark:text-purple-300"
              />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Revenue</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              ₦{{ metrics.totalRevenue.toLocaleString() }}
            </p>
            <p
              class="text-sm"
              :class="metrics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'"
            >
              {{ metrics.revenueGrowth >= 0 ? '+' : '' }}{{ metrics.revenueGrowth }}% from last
              period
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
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- User Growth Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Growth</h3>
        <div class="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          <div class="text-center">
            <UIcon name="i-heroicons-chart-bar" class="w-12 h-12 mx-auto mb-2" />
            <p>Chart visualization would go here</p>
            <p class="text-sm">Integration with charting library needed</p>
          </div>
        </div>
      </div>

      <!-- Revenue Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Trends</h3>
        <div class="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          <div class="text-center">
            <UIcon name="i-heroicons-chart-pie" class="w-12 h-12 mx-auto mb-2" />
            <p>Chart visualization would go here</p>
            <p class="text-sm">Integration with charting library needed</p>
          </div>
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
                <div class="flex items-center">
                  <UIcon name="i-heroicons-star" class="w-4 h-4 text-yellow-400 mr-1" />
                  <span class="text-sm text-gray-900 dark:text-white">{{ event.rating }}</span>
                </div>
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
  totalUsers: 1245,
  userGrowth: 12.5,
  totalEvents: 15,
  eventGrowth: 25.0,
  totalRevenue: 12500000,
  revenueGrowth: 8.2,
  totalRegistrations: 3456,
  registrationGrowth: 15.7,
})

const eventPerformance = ref([
  {
    id: 1,
    name: 'Annual Scientific Conference 2024',
    date: '2024-11-15',
    registrations: 245,
    revenue: 12250000,
    attendanceRate: 92,
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Workshop on Data Analysis',
    date: '2024-10-15',
    registrations: 45,
    revenue: 2250000,
    attendanceRate: 87,
    rating: 4.6,
  },
  {
    id: 3,
    name: 'Public Health Forum',
    date: '2024-09-20',
    registrations: 120,
    revenue: 6000000,
    attendanceRate: 95,
    rating: 4.9,
  },
])

const geographicData = ref([
  { state: 'Lagos', count: 456, percentage: 36.6, color: '#3B82F6' },
  { state: 'Abuja', count: 234, percentage: 18.8, color: '#10B981' },
  { state: 'Kano', count: 189, percentage: 15.2, color: '#F59E0B' },
  { state: 'Rivers', count: 156, percentage: 12.5, color: '#EF4444' },
  { state: 'Oyo', count: 123, percentage: 9.9, color: '#8B5CF6' },
  { state: 'Others', count: 87, percentage: 7.0, color: '#6B7280' },
])

const membershipTypes = ref([
  { name: 'Full Member', count: 456, percentage: 52.1, color: '#3B82F6' },
  { name: 'Associate Member', count: 234, percentage: 26.7, color: '#10B981' },
  { name: 'Student Member', count: 123, percentage: 14.0, color: '#F59E0B' },
  { name: 'Honorary Member', count: 63, percentage: 7.2, color: '#8B5CF6' },
])

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function refreshData() {
  useToast().add({
    title: 'Data refreshed',
    description: 'Analytics data has been updated',
    color: 'success',
  })
}
</script>
