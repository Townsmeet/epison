<template>
  <div class="py-12 bg-white dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Back Button -->
      <div class="mb-6">
        <UButton
          to="/resources"
          color="neutral"
          variant="ghost"
          icon="i-heroicons-arrow-left"
          label="Back to Resources"
          class="mb-6"
        />
      </div>

      <!-- Category Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            {{ category?.title || 'Loading...' }}
          </h1>
          <p class="mt-2 text-lg text-gray-500 dark:text-gray-400">
            {{ category?.description || 'Loading resources...' }}
          </p>
        </div>
        <UBadge
          size="lg"
          variant="subtle"
          :color="(category?.color || 'gray') as any"
          class="mt-4 sm:mt-0"
        >
          {{ resources.length }} resources available
        </UBadge>
      </div>

      <!-- Search and Filter -->
      <div class="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <UInput
          v-model="searchQuery"
          placeholder="Search resources..."
          icon="i-heroicons-magnifying-glass"
          size="lg"
          class="md:col-span-2"
        />
        <USelect
          v-model="selectedType"
          :options="resourceTypes"
          placeholder="Filter by type"
          size="lg"
        />
      </div>

      <!-- Resource List -->
      <div class="space-y-6">
        <div
          v-for="resource in filteredResources"
          :key="resource.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div class="flex-1">
              <div class="flex items-center">
                <UIcon :name="getTypeIcon(resource.type)" :class="iconClass" />
                <span
                  class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >{{ resource.type }}</span
                >
              </div>
              <h3 class="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                {{ resource.title }}
              </h3>
              <p class="mt-2 text-gray-600 dark:text-gray-300">
                {{ resource.description }}
              </p>
              <div
                v-if="resource.tags && resource.tags.length > 0"
                class="mt-3 flex flex-wrap gap-2"
              >
                <template v-for="tag in resource.tags" :key="tag">
                  <UBadge variant="subtle" color="neutral">
                    {{ tag }}
                  </UBadge>
                </template>
              </div>
            </div>
            <div class="mt-4 sm:mt-0 sm:ml-6 flex-shrink-0">
              <UButton
                :to="resource.url"
                :color="category.color as any"
                :variant="resource.type === 'external' ? 'outline' : 'solid'"
                :target="resource.type === 'external' ? '_blank' : undefined"
                :rel="resource.type === 'external' ? 'noopener noreferrer' : undefined"
                trailing-icon="i-heroicons-arrow-up-right"
                class="w-full sm:w-auto"
              >
                {{ resource.type === 'external' ? 'Visit Resource' : 'View Details' }}
              </UButton>
            </div>
          </div>
          <div
            v-if="resource.meta"
            class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400"
          >
            <div class="flex flex-wrap gap-x-6 gap-y-2">
              <div v-if="resource.meta.date" class="flex items-center">
                <UIcon name="i-heroicons-calendar" class="h-4 w-4 mr-1.5" />
                {{ formatDate(resource.meta.date) }}
              </div>
              <div v-if="resource.meta.author" class="flex items-center">
                <UIcon name="i-heroicons-user" class="h-4 w-4 mr-1.5" />
                {{ resource.meta.author }}
              </div>
              <div v-if="resource.meta.duration" class="flex items-center">
                <UIcon name="i-heroicons-clock" class="h-4 w-4 mr-1.5" />
                {{ resource.meta.duration }}
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredResources.length === 0" class="text-center py-12">
          <UIcon name="i-heroicons-inbox" class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">No resources found</h3>
          <p class="mt-1 text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <div class="mt-6">
            <UButton label="Clear filters" color="neutral" @click="clearFilters" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import types directly from the types file
interface ResourceMeta {
  date: string
  author: string
  pages?: number
  duration?: string
  external?: boolean
}

interface Resource {
  id: number
  title: string
  description: string
  type: 'pdf' | 'doc' | 'xls' | 'video' | 'external' | 'other'
  url: string
  tags?: string[]
  meta: ResourceMeta
}

interface ResourceCategory {
  id: number
  slug: string
  title: string
  description: string
  icon: string
  color: string
  count: number
}

const route = useRoute()

// Define the category type with a default value to avoid undefined issues
const category = ref<ResourceCategory>({
  id: 0,
  slug: '',
  title: 'Loading...',
  description: 'Loading resources...',
  icon: 'i-heroicons-document-text',
  color: 'gray',
  count: 0,
})

// Get category from slug
const { data: categoryData } = await useAsyncData<ResourceCategory>(
  `resource-category-${route.params.slug}`,
  async () => {
    const categories: ResourceCategory[] = [
      {
        id: 1,
        slug: 'guidelines',
        title: 'Guidelines & Protocols',
        description: 'Access the latest epidemiological guidelines, protocols, and best practices.',
        icon: 'i-heroicons-document-text',
        color: 'blue',
        count: 24,
      },
      {
        id: 2,
        slug: 'training',
        title: 'Training Materials',
        description: 'Educational resources, courses, and training materials for epidemiologists.',
        icon: 'i-heroicons-academic-cap',
        color: 'green',
        count: 18,
      },
      {
        id: 3,
        slug: 'publications',
        title: 'Research Publications',
        description: 'Access the latest research publications, articles, and case studies.',
        icon: 'i-heroicons-book-open',
        color: 'purple',
        count: 42,
      },
      {
        id: 4,
        slug: 'tools',
        title: 'Epidemiological Tools',
        description: 'Software, templates, and tools for data collection and analysis.',
        icon: 'i-heroicons-wrench-screwdriver',
        color: 'amber',
        count: 15,
      },
      {
        id: 5,
        slug: 'webinars',
        title: 'Webinars & Events',
        description: 'Recorded webinars, workshops, and upcoming events.',
        icon: 'i-heroicons-video-camera',
        color: 'red',
        count: 9,
      },
      {
        id: 6,
        slug: 'careers',
        title: 'Career Resources',
        description: 'Job opportunities, fellowships, and career development resources.',
        icon: 'i-heroicons-briefcase',
        color: 'indigo',
        count: 31,
      },
    ]
    const foundCategory = categories.find(cat => cat.slug === route.params.slug)
    if (!foundCategory) {
      throw createError({ statusCode: 404, statusMessage: 'Resource category not found' })
    }
    return foundCategory
  }
)

// Update the reactive category when data is loaded
watchEffect(() => {
  if (categoryData.value) {
    Object.assign(category.value, categoryData.value)
  }
})

// Mock data - in a real app, this would come from an API
const resources = ref<Resource[]>([
  {
    id: 1,
    title: 'EPI Case Investigation Guidelines',
    description:
      'Comprehensive guide for conducting epidemiological case investigations in Nigeria.',
    type: 'pdf',
    url: '/resources/documents/epi-guidelines.pdf',
    tags: ['guidelines', 'investigation', 'outbreak'],
    meta: {
      date: '2023-06-15',
      author: 'EPISON Research Committee',
      pages: 42,
    },
  },
  {
    id: 2,
    title: 'Disease Surveillance Protocol',
    description: 'Standard operating procedures for disease surveillance and reporting in Nigeria.',
    type: 'pdf',
    url: '/resources/documents/surveillance-protocol.pdf',
    tags: ['protocol', 'surveillance', 'reporting'],
    meta: {
      date: '2023-05-22',
      author: 'EPISON Surveillance Team',
      pages: 36,
    },
  },
  {
    id: 3,
    title: 'Outbreak Response Checklist',
    description: 'Step-by-step checklist for responding to disease outbreaks.',
    type: 'doc',
    url: '/resources/documents/outbreak-checklist.docx',
    tags: ['checklist', 'outbreak', 'response'],
    meta: {
      date: '2023-07-10',
      author: 'EPISON Emergency Response Unit',
    },
  },
  {
    id: 4,
    title: 'Data Collection Templates',
    description: 'Standardized templates for epidemiological data collection.',
    type: 'xls',
    url: '/resources/templates/data-collection.xlsx',
    tags: ['templates', 'data', 'collection'],
    meta: {
      date: '2023-04-05',
      author: 'EPISON Data Team',
    },
  },
  {
    id: 5,
    title: 'Infection Prevention Guidelines',
    description: 'Best practices for infection prevention and control in healthcare settings.',
    type: 'external',
    url: 'https://www.who.int/infection-prevention/en/',
    tags: ['infection control', 'healthcare', 'guidelines'],
    meta: {
      date: '2023-03-18',
      author: 'World Health Organization',
      external: true,
    },
  },
])

// Filtering
const searchQuery = ref('')
const selectedType = ref('')

const resourceTypes = [
  { value: '', label: 'All Types' },
  { value: 'pdf', label: 'PDF Documents' },
  { value: 'doc', label: 'Word Documents' },
  { value: 'xls', label: 'Spreadsheets' },
  { value: 'external', label: 'External Links' },
  { value: 'video', label: 'Videos' },
  { value: 'other', label: 'Other' },
]

// Use a computed property to ensure we always have a valid color
// Define valid color types
type ValidColor = 'gray' | 'blue' | 'green' | 'red' | 'yellow' | 'indigo' | 'purple' | 'pink'

// Get valid color or default to gray
const getValidColor = (color: string | undefined): ValidColor => {
  if (!color) return 'gray'
  return (
    ['gray', 'blue', 'green', 'red', 'yellow', 'indigo', 'purple', 'pink'].includes(color)
      ? color
      : 'gray'
  ) as ValidColor
}

// Compute icon class based on the current category color
const iconClass = computed<string>(() => {
  const color = category.value?.color || 'gray'
  const validColor = getValidColor(color)
  return `h-5 w-5 mr-2 text-${validColor}-500`
})

const filteredResources = computed<Resource[]>(() => {
  return resources.value.filter(resource => {
    const matchesSearch =
      !searchQuery.value ||
      resource.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (resource.tags &&
        resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase())))

    const matchesType = !selectedType.value || resource.type === selectedType.value

    return matchesSearch && matchesType
  })
})

// Helper functions
function getTypeIcon(type: string): string {
  const icons = {
    pdf: 'i-heroicons-document-text',
    doc: 'i-heroicons-document',
    xls: 'i-heroicons-table-cells',
    external: 'i-heroicons-arrow-top-right-on-square',
    video: 'i-heroicons-play',
    default: 'i-heroicons-document',
  } as const

  const icon = icons[type as keyof typeof icons]
  return icon || icons.default
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function clearFilters() {
  searchQuery.value = ''
  selectedType.value = ''
}

// Set page title and meta
definePageMeta({
  layout: 'default',
})

useHead({
  title: `${category.value.title} - Resources - EPISON`,
  meta: [
    {
      name: 'description',
      content: category.value.description,
    },
  ],
})
</script>
