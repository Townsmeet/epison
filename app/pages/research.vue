<template>
  <div class="bg-white dark:bg-gray-900">
    <!-- Hero Section -->
    <section
      class="relative min-h-[70vh] flex items-center bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden"
    >
      <div class="absolute inset-0 opacity-20">
        <div
          class="absolute top-20 left-10 w-72 h-72 bg-cyan-100 dark:bg-cyan-900/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
        />
        <div
          class="absolute top-40 right-10 w-72 h-72 bg-teal-100 dark:bg-teal-900/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          style="animation-delay: 2s"
        />
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="max-w-4xl">
          <div
            class="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm mb-8"
          >
            <div class="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Research Areas</span>
          </div>

          <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
            <span class="block text-gray-900 dark:text-white leading-none">Our</span>
            <span
              class="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-teal-600 bg-clip-text text-transparent leading-none"
            >
              Research
            </span>
          </h1>

          <div class="w-24 h-1 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full mb-8" />

          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
            Advancing epidemiological knowledge through cutting-edge research in public health.
          </p>
        </div>
      </div>
    </section>

    <!-- Research Areas -->
    <section class="py-20 md:py-32 bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(area, index) in researchAreas"
            :key="index"
            class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-gray-700/50 shadow-sm hover:shadow-lg transition-all duration-300 p-8"
          >
            <div class="relative mb-6">
              <div
                class="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-2xl blur-xl"
              />
              <div
                class="relative flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-lg"
              >
                <UIcon :name="area.icon" class="h-8 w-8" />
              </div>
            </div>

            <div class="space-y-4">
              <h3
                class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
              >
                {{ area.title }}
              </h3>

              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                {{ area.description }}
              </p>

              <div class="pt-4">
                <span class="text-sm font-medium text-cyan-600 dark:text-cyan-400"
                  >Learn more →</span
                >
              </div>
            </div>

            <div
              class="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />

            <div
              class="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-100 dark:to-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-white dark:text-gray-900 shadow-lg"
            >
              {{ index + 1 }}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const researchAreas = [
  {
    icon: 'i-heroicons-beaker',
    title: 'Infectious Disease Epidemiology',
    description:
      'Studying patterns, causes, and control of infectious diseases including emerging and re-emerging pathogens.',
  },
  {
    icon: 'i-heroicons-heart',
    title: 'Non-Communicable Diseases',
    description:
      'Research on cardiovascular diseases, diabetes, cancer, and other chronic conditions affecting Nigerian populations.',
  },
  {
    icon: 'i-heroicons-users',
    title: 'Maternal & Child Health',
    description:
      'Investigating factors affecting maternal and child health outcomes to improve survival rates.',
  },
  {
    icon: 'i-heroicons-globe-alt',
    title: 'Environmental Health',
    description:
      'Examining the impact of environmental factors on population health and disease distribution.',
  },
  {
    icon: 'i-heroicons-chart-bar',
    title: 'Health Systems Research',
    description: 'Evaluating health system performance, access, and quality of care delivery.',
  },
  {
    icon: 'i-heroicons-cpu-chip',
    title: 'Digital Health',
    description:
      'Leveraging technology for disease surveillance, health monitoring, and data analytics.',
  },
]
</script>
