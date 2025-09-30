<template>
  <div class="py-12 bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Member Directory</h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          Connect with our community of public health professionals
        </p>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="md:col-span-2">
            <UInput
              v-model="searchQuery"
              icon="i-heroicons-magnifying-glass"
              placeholder="Search by name, position, or employer..."
              size="lg"
            />
          </div>
          <USelect
            v-model="selectedState"
            :items="stateOptions"
            placeholder="All States"
            size="lg"
          />
          <USelect
            v-model="selectedMembershipType"
            :items="membershipTypeOptions"
            placeholder="All Types"
            size="lg"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="flex justify-center items-center py-20">
        <div class="text-center">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
          <p class="mt-2 text-gray-600 dark:text-gray-400">Loading members...</p>
        </div>
      </div>

      <!-- Members Grid -->
      <div
        v-else-if="members.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="member in members"
          :key="member.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6"
        >
          <div class="flex items-start space-x-4">
            <!-- Avatar -->
            <div class="flex-shrink-0">
              <div
                v-if="member.avatar"
                class="w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700"
              >
                <img
                  :src="member.avatar"
                  :alt="getFullName(member)"
                  class="w-full h-full object-cover"
                />
              </div>
              <div
                v-else
                class="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
              >
                <span class="text-xl font-semibold text-primary-600 dark:text-primary-400">
                  {{ getInitials(member) }}
                </span>
              </div>
            </div>

            <!-- Member Info -->
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {{ member.title }} {{ getFullName(member) }}
              </h3>

              <p v-if="member.position" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ member.position }}
              </p>

              <p
                v-if="member.employer"
                class="text-sm text-gray-500 dark:text-gray-500 mt-1 truncate"
              >
                {{ member.employer }}
              </p>

              <div class="flex flex-wrap gap-2 mt-3">
                <UBadge v-if="member.state" color="info" variant="subtle" size="xs">
                  <UIcon name="i-heroicons-map-pin" class="w-3 h-3" />
                  {{ member.state }}
                </UBadge>

                <UBadge v-if="member.membershipType" color="success" variant="subtle" size="xs">
                  {{ formatMembershipType(member.membershipType) }}
                </UBadge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <UIcon name="i-heroicons-users" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No members found</h3>
        <p class="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria</p>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="mt-8 flex justify-center">
        <UPagination
          v-model="currentPage"
          :total="pagination.total"
          :page-count="pagination.limit"
          show-first
          show-last
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

useSeoMeta({
  title: 'Member Directory - EPISON',
  description:
    'Browse our directory of public health professionals and epidemiologists in Nigeria.',
})

interface DirectoryMember {
  id: string
  title: string | null
  nameFirst: string
  nameFamily: string
  avatar: string | null
  position: string | null
  employer: string | null
  state: string | null
  membershipType: string | null
  joinedDate: string | null
}

const searchQuery = ref('')
const selectedState = ref('')
const selectedMembershipType = ref('')
const currentPage = ref(1)
const debouncedSearch = ref('')

// Debounce search manually
let searchTimeout: NodeJS.Timeout
watch(searchQuery, newValue => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    debouncedSearch.value = newValue
  }, 500)
})

const stateOptions = [
  'All States',
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'FCT (Abuja)',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
]

const membershipTypeOptions = [
  'All Types',
  'Regular',
  'Regular IEA',
  'Early Career',
  'Student',
  'Honorary',
  'Associate',
  'Fellow',
]

// Build query params
const queryParams = computed(() => {
  const params: Record<string, string | number> = {
    page: currentPage.value,
    limit: 12,
  }

  if (debouncedSearch.value) {
    params.search = debouncedSearch.value
  }

  if (selectedState.value && selectedState.value !== 'All States') {
    params.state = selectedState.value
  }

  if (selectedMembershipType.value && selectedMembershipType.value !== 'All Types') {
    params.membershipType = selectedMembershipType.value.toLowerCase().replace(' ', '-')
  }

  return params
})

// Fetch members
const {
  data,
  pending,
  refresh: _refresh,
} = await useFetch('/api/members/directory', {
  query: queryParams,
  watch: [queryParams],
})

const members = computed(() => data.value?.data || [])
const pagination = computed(
  () => data.value?.pagination || { page: 1, limit: 12, total: 0, totalPages: 0 }
)

// Helper functions
function getFullName(member: DirectoryMember): string {
  return `${member.nameFirst} ${member.nameFamily}`
}

function getInitials(member: DirectoryMember): string {
  return `${member.nameFirst.charAt(0)}${member.nameFamily.charAt(0)}`.toUpperCase()
}

function formatMembershipType(type: string | null): string {
  if (!type) return ''
  return type
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Reset page when filters change
watch([debouncedSearch, selectedState, selectedMembershipType], () => {
  currentPage.value = 1
})
</script>
