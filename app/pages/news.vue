<template>
  <div class="bg-white dark:bg-gray-900">
    <!-- Hero Section -->
    <section
      class="relative min-h-[70vh] flex items-center bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden"
    >
      <div class="absolute inset-0 opacity-20">
        <div
          class="absolute top-20 left-10 w-72 h-72 bg-orange-100 dark:bg-orange-900/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
        />
        <div
          class="absolute top-40 right-10 w-72 h-72 bg-red-100 dark:bg-red-900/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          style="animation-delay: 2s"
        />
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="max-w-4xl">
          <div
            class="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm mb-8"
          >
            <div class="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Latest News</span>
          </div>

          <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
            <span class="block text-gray-900 dark:text-white leading-none">Latest</span>
            <span
              class="block bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 bg-clip-text text-transparent leading-none"
            >
              News
            </span>
          </h1>

          <div class="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-8" />

          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
            Stay updated with the latest developments in epidemiology, public health, and EPISON
            activities.
          </p>
        </div>
      </div>
    </section>

    <!-- News Grid -->
    <section class="py-20 md:py-32 bg-gray-50/50 dark:bg-gray-900/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="(article, index) in newsArticles"
            :key="index"
            class="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
          >
            <div class="h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
              <img
                :src="article.image"
                :alt="article.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div class="p-6">
              <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                <time>{{ formatDate(article.date) }}</time>
                <span class="mx-2">•</span>
                <span>{{ article.category }}</span>
              </div>

              <h3
                class="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
              >
                {{ article.title }}
              </h3>

              <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4">
                {{ article.excerpt }}
              </p>

              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-primary-600 dark:text-primary-400"
                  >Read more</span
                >
                <UIcon
                  name="i-heroicons-arrow-right"
                  class="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform"
                />
              </div>
            </div>

            <div
              class="absolute inset-0 bg-gradient-to-t from-primary-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            />
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const newsArticles = [
  {
    title: 'EPISON Launches New Research Initiative on Climate and Health',
    excerpt:
      'A groundbreaking research program to study the impact of climate change on infectious disease patterns in Nigeria.',
    date: '2024-08-15',
    category: 'Research',
    image:
      'https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  },
  {
    title: 'Annual Conference 2024: Call for Abstracts Now Open',
    excerpt:
      'Submit your research abstracts for presentation at the premier epidemiology conference in Nigeria.',
    date: '2024-08-10',
    category: 'Conference',
    image:
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  },
  {
    title: 'New Guidelines for Outbreak Investigation Released',
    excerpt:
      'Updated protocols and best practices for rapid response to infectious disease outbreaks.',
    date: '2024-08-05',
    category: 'Guidelines',
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  },
  {
    title: 'EPISON Partners with WHO on Capacity Building Program',
    excerpt:
      'Collaboration to strengthen epidemiological surveillance and response capabilities across West Africa.',
    date: '2024-07-28',
    category: 'Partnership',
    image:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  },
  {
    title: 'Student Scholarship Program Expanded for 2024',
    excerpt: 'Increased funding available for epidemiology students pursuing advanced degrees.',
    date: '2024-07-20',
    category: 'Education',
    image:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  },
  {
    title: 'Digital Health Surveillance Platform Launched',
    excerpt: 'New technology platform to enhance real-time disease surveillance and reporting.',
    date: '2024-07-15',
    category: 'Technology',
    image:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  },
]

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}
</script>
