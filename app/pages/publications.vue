<template>
  <div class="bg-white dark:bg-gray-900">
    <!-- Hero Section -->
    <section
      class="relative min-h-[70vh] flex items-center bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden"
    >
      <div class="absolute inset-0 opacity-20">
        <div
          class="absolute top-20 left-10 w-72 h-72 bg-indigo-100 dark:bg-indigo-900/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
        />
        <div
          class="absolute top-40 right-10 w-72 h-72 bg-blue-100 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          style="animation-delay: 2s"
        />
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="max-w-4xl">
          <div
            class="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm mb-8"
          >
            <div class="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Publications</span>
          </div>

          <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
            <span class="block text-gray-900 dark:text-white leading-none">Research</span>
            <span
              class="block bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 bg-clip-text text-transparent leading-none"
            >
              Publications
            </span>
          </h1>

          <div class="w-24 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full mb-8" />

          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
            Explore our collection of research papers, guidelines, and educational materials.
          </p>
        </div>
      </div>
    </section>

    <!-- Publications Grid -->
    <section class="py-20 md:py-32 bg-gray-50/50 dark:bg-gray-900/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(publication, index) in publications"
            :key="index"
            class="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
          >
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <span
                  class="px-3 py-1 text-xs font-semibold rounded-full"
                  :class="{
                    'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300':
                      publication.type === 'Journal Article',
                    'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300':
                      publication.type === 'Guidelines',
                    'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300':
                      publication.type === 'Report',
                  }"
                >
                  {{ publication.type }}
                </span>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{ publication.year }}</span>
              </div>

              <h3
                class="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
              >
                {{ publication.title }}
              </h3>

              <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">
                <strong>Authors:</strong> {{ publication.authors }}
              </p>

              <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4">
                {{ publication.abstract }}
              </p>

              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-primary-600 dark:text-primary-400"
                  >Download PDF</span
                >
                <UIcon
                  name="i-heroicons-arrow-down-tray"
                  class="h-4 w-4 text-gray-400 group-hover:translate-y-1 transition-transform"
                />
              </div>
            </div>

            <div
              class="absolute inset-0 bg-gradient-to-t from-primary-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const publications = [
  {
    title: 'Epidemiological Trends of Infectious Diseases in Nigeria: A 10-Year Analysis',
    authors: 'Bello, A., Okoro, C., Ibrahim, F.',
    type: 'Journal Article',
    year: '2024',
    abstract:
      'This comprehensive study analyzes the epidemiological patterns of major infectious diseases in Nigeria over the past decade, providing insights for public health policy.',
  },
  {
    title: 'Guidelines for Outbreak Investigation and Response in Nigeria',
    authors: 'EPISON Technical Committee',
    type: 'Guidelines',
    year: '2024',
    abstract:
      'Updated protocols and best practices for rapid detection, investigation, and response to infectious disease outbreaks in the Nigerian context.',
  },
  {
    title: 'Climate Change and Vector-Borne Diseases: Nigerian Perspective',
    authors: 'Yusuf, A., Nwosu, E., Adebayo, O.',
    type: 'Journal Article',
    year: '2023',
    abstract:
      'An analysis of how climate change is affecting the distribution and transmission patterns of vector-borne diseases in Nigeria.',
  },
  {
    title: 'Annual Epidemiological Report 2023',
    authors: 'EPISON Research Committee',
    type: 'Report',
    year: '2023',
    abstract:
      'Comprehensive overview of disease surveillance data, research findings, and public health recommendations for Nigeria.',
  },
  {
    title: 'Maternal and Child Health Indicators in Rural Nigeria',
    authors: 'Ibrahim, F., Bello, A.',
    type: 'Journal Article',
    year: '2023',
    abstract:
      'Assessment of maternal and child health outcomes in rural Nigerian communities with recommendations for improvement.',
  },
  {
    title: 'Digital Health Surveillance Systems: Implementation Guide',
    authors: 'Okoro, C., Yusuf, A.',
    type: 'Guidelines',
    year: '2023',
    abstract:
      'Practical guide for implementing digital surveillance systems for infectious disease monitoring in resource-limited settings.',
  },
]
</script>
