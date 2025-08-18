<template>
  <div class="py-12 bg-white dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Resources</h1>
        <p class="mt-3 text-lg text-gray-500 dark:text-gray-400">
          Helpful resources and materials for EPISON members
        </p>
      </div>

      <div class="mt-12">
        <!-- Search and Filter Bar -->
        <div class="mb-8">
          <UInput
            v-model="searchQuery"
            placeholder="Search resources..."
            icon="i-heroicons-magnifying-glass"
            size="lg"
          />
        </div>

        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="category in filteredCategories"
            :key="category.id"
            :to="`/resources/${category.slug}`"
            class="block hover:scale-[1.02] transition-transform duration-200"
          >
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-full flex flex-col">
              <div class="flex items-center justify-between">
                <div
                  class="flex items-center justify-center h-12 w-12 rounded-md"
                  :class="`bg-${category.color}-500 text-white`"
                >
                  <UIcon :name="category.icon" class="h-6 w-6" />
                </div>
                <UBadge color="neutral" variant="soft">{{ category.count }} items</UBadge>
              </div>
              <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                {{ category.title }}
              </h3>
              <p class="mt-2 text-gray-500 dark:text-gray-400 flex-grow">
                {{ category.description }}
              </p>
              <div class="mt-4">
                <UButton
                  :color="category.color as any"
                  variant="ghost"
                  trailing-icon="i-heroicons-arrow-right"
                  class="group"
                >
                  View Resources
                  <template #trailing>
                    <UIcon
                      name="i-heroicons-arrow-right"
                      class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                    />
                  </template>
                </UButton>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const searchQuery = ref('')

const resourceCategories = [
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

const filteredCategories = computed(() => {
  if (!searchQuery.value) return resourceCategories
  const query = searchQuery.value.toLowerCase()
  return resourceCategories.filter(
    category =>
      category.title.toLowerCase().includes(query) ||
      category.description.toLowerCase().includes(query)
  )
})

useHead({
  title: 'Resources - EPISON',
  meta: [
    {
      name: 'description',
      content:
        'Access helpful resources, guidelines, and training materials from the Epidemiological Society of Nigeria (EPISON).',
    },
  ],
})
</script>
