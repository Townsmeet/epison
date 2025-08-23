<template>
  <div class="bg-white dark:bg-gray-900">
    <!-- Hero Section -->
    <section
      class="relative min-h-[70vh] flex items-center bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden"
    >
      <div class="absolute inset-0 opacity-20">
        <div
          class="absolute top-20 left-10 w-72 h-72 bg-emerald-100 dark:bg-emerald-900/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
        />
        <div
          class="absolute top-40 right-10 w-72 h-72 bg-green-100 dark:bg-green-900/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          style="animation-delay: 2s"
        />
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="max-w-4xl">
          <div
            class="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm mb-8"
          >
            <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >Guidelines & Standards</span
            >
          </div>

          <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
            <span class="block text-gray-900 dark:text-white leading-none">Practice</span>
            <span
              class="block bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 bg-clip-text text-transparent leading-none"
            >
              Guidelines
            </span>
          </h1>

          <div class="w-24 h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mb-8" />

          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
            Evidence-based guidelines and standards for epidemiological practice in Nigeria.
          </p>
        </div>
      </div>
    </section>

    <!-- Guidelines Grid -->
    <section class="py-20 md:py-32 bg-gray-50/50 dark:bg-gray-900/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid gap-8 md:grid-cols-2">
          <div
            v-for="(guideline, index) in guidelines"
            :key="index"
            class="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
          >
            <div class="p-8">
              <div class="flex items-center justify-between mb-6">
                <div
                  class="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white"
                >
                  <UIcon :name="guideline.icon" class="h-6 w-6" />
                </div>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{
                  guideline.version
                }}</span>
              </div>

              <h3
                class="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
              >
                {{ guideline.title }}
              </h3>

              <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {{ guideline.description }}
              </p>

              <div class="space-y-3">
                <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <UIcon name="i-heroicons-calendar" class="h-4 w-4 mr-2" />
                  <span>Updated: {{ guideline.lastUpdated }}</span>
                </div>
                <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <UIcon name="i-heroicons-document-text" class="h-4 w-4 mr-2" />
                  <span>{{ guideline.pages }} pages</span>
                </div>
              </div>

              <div class="mt-6 flex items-center justify-between">
                <span class="text-sm font-medium text-emerald-600 dark:text-emerald-400"
                  >Download PDF</span
                >
                <UIcon
                  name="i-heroicons-arrow-down-tray"
                  class="h-4 w-4 text-gray-400 group-hover:translate-y-1 transition-transform"
                />
              </div>
            </div>

            <div
              class="absolute inset-0 bg-gradient-to-t from-emerald-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const guidelines = [
  {
    icon: 'i-heroicons-shield-exclamation',
    title: 'Outbreak Investigation Guidelines',
    description:
      'Comprehensive protocols for detecting, investigating, and responding to infectious disease outbreaks in Nigeria.',
    version: 'v2.1',
    lastUpdated: 'August 2024',
    pages: 45,
  },
  {
    icon: 'i-heroicons-chart-bar',
    title: 'Disease Surveillance Standards',
    description:
      'Standards and procedures for effective disease surveillance systems at national and sub-national levels.',
    version: 'v1.3',
    lastUpdated: 'July 2024',
    pages: 32,
  },
  {
    icon: 'i-heroicons-beaker',
    title: 'Laboratory Quality Assurance',
    description:
      'Guidelines for maintaining quality standards in epidemiological laboratory testing and sample management.',
    version: 'v1.8',
    lastUpdated: 'June 2024',
    pages: 28,
  },
  {
    icon: 'i-heroicons-users',
    title: 'Community Engagement Protocols',
    description:
      'Best practices for engaging communities in epidemiological research and public health interventions.',
    version: 'v1.5',
    lastUpdated: 'May 2024',
    pages: 22,
  },
  {
    icon: 'i-heroicons-document-duplicate',
    title: 'Data Management Standards',
    description:
      'Standards for collecting, storing, and analyzing epidemiological data while ensuring privacy and security.',
    version: 'v2.0',
    lastUpdated: 'April 2024',
    pages: 38,
  },
  {
    icon: 'i-heroicons-academic-cap',
    title: 'Training and Certification',
    description:
      'Guidelines for epidemiologist training programs and professional certification requirements.',
    version: 'v1.2',
    lastUpdated: 'March 2024',
    pages: 26,
  },
]
</script>
