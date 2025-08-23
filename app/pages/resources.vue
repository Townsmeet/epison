<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-teal-900/20"
  >
    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-20 pb-16">
      <!-- Background Elements -->
      <div class="absolute inset-0">
        <div
          class="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-br from-teal-400/20 to-cyan-500/20 rounded-full blur-3xl"
        />
        <div
          class="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-amber-400/15 to-orange-500/15 rounded-full blur-3xl"
        />
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          <span
            class="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent"
          >
            Resources
          </span>
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Access comprehensive resources, guidelines, and materials designed to support
          epidemiologists and public health professionals
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <!-- Search Bar -->
      <div class="mb-12">
        <div class="max-w-2xl mx-auto">
          <div
            class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-gray-700/50 shadow-sm p-2"
          >
            <UInput
              v-model="searchQuery"
              placeholder="Search resources..."
              icon="i-heroicons-magnifying-glass"
              size="lg"
              variant="none"
              class="border-0 bg-transparent"
            />
          </div>
        </div>
      </div>

      <!-- Resource Categories Grid -->
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="category in filteredCategories"
          :key="category.id"
          :to="`/resources/${category.slug}`"
          class="group block"
        >
          <div
            class="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-gray-700/50 shadow-sm hover:shadow-lg transition-all duration-300 p-8 h-full flex flex-col overflow-hidden"
          >
            <!-- Icon and Badge -->
            <div class="flex items-center justify-between mb-6">
              <div class="relative">
                <div
                  class="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-blue-500/20 rounded-2xl blur-xl"
                />
                <div
                  class="relative flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-500 to-blue-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                >
                  <UIcon :name="category.icon" class="h-8 w-8" />
                </div>
              </div>
              <div
                class="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-3 py-1 rounded-full text-sm font-semibold"
              >
                {{ category.count }} items
              </div>
            </div>

            <!-- Content -->
            <div class="flex-grow">
              <h3
                class="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
              >
                {{ category.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                {{ category.description }}
              </p>
            </div>

            <!-- Action -->
            <div class="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
              <div
                class="flex items-center text-primary-600 dark:text-primary-400 font-semibold group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors"
              >
                <span>View Resources</span>
                <UIcon
                  name="i-heroicons-arrow-right"
                  class="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                />
              </div>
            </div>

            <!-- Hover Gradient Overlay -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-primary-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
            />
          </div>
        </NuxtLink>
      </div>
    </section>
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
