<template>
  <div class="bg-white dark:bg-gray-900">
    <!-- Hero Section -->
    <section
      class="relative min-h-[70vh] flex items-center bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden"
    >
      <div class="absolute inset-0 opacity-20">
        <div
          class="absolute top-20 left-10 w-72 h-72 bg-rose-100 dark:bg-rose-900/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
        />
        <div
          class="absolute top-40 right-10 w-72 h-72 bg-pink-100 dark:bg-pink-900/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          style="animation-delay: 2s"
        />
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="max-w-4xl">
          <div
            class="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm mb-8"
          >
            <div class="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >Blog & Insights</span
            >
          </div>

          <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
            <span class="block text-gray-900 dark:text-white leading-none">Expert</span>
            <span
              class="block bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 bg-clip-text text-transparent leading-none"
            >
              Insights
            </span>
          </h1>

          <div class="w-24 h-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full mb-8" />

          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
            Expert perspectives on epidemiology, public health trends, and research insights from
            our community.
          </p>
        </div>
      </div>
    </section>

    <!-- Blog Posts -->
    <section class="py-20 md:py-32 bg-gray-50/50 dark:bg-gray-900/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="(post, index) in blogPosts"
            :key="index"
            class="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
          >
            <div class="h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
              <img
                :src="post.image"
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div class="p-6">
              <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                <img
                  :src="post.author.avatar"
                  :alt="post.author.name"
                  class="w-6 h-6 rounded-full mr-2"
                />
                <span>{{ post.author.name }}</span>
                <span class="mx-2">•</span>
                <time>{{ formatDate(post.date) }}</time>
              </div>

              <h3
                class="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
              >
                {{ post.title }}
              </h3>

              <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4">
                {{ post.excerpt }}
              </p>

              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-rose-600 dark:text-rose-400"
                  >Read article</span
                >
                <UIcon
                  name="i-heroicons-arrow-right"
                  class="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform"
                />
              </div>
            </div>

            <div
              class="absolute inset-0 bg-gradient-to-t from-rose-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            />
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const blogPosts = [
  {
    title: 'The Future of Digital Health Surveillance in Nigeria',
    excerpt:
      'Exploring how technology is transforming disease surveillance and public health response in the digital age.',
    date: '2024-08-20',
    author: {
      name: 'Dr. Amina Bello',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Climate Change and Infectious Disease Patterns',
    excerpt:
      'Understanding how changing climate patterns are affecting the distribution and transmission of infectious diseases.',
    date: '2024-08-15',
    author: {
      name: 'Prof. Chukwuma Okoro',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
    },
    image:
      'https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Building Resilient Health Systems: Lessons from COVID-19',
    excerpt:
      'Key insights and recommendations for strengthening health systems based on pandemic response experiences.',
    date: '2024-08-10',
    author: {
      name: 'Dr. Fatima Ibrahim',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    image:
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Community Engagement in Outbreak Response',
    excerpt:
      'Best practices for involving communities in disease outbreak investigation and response efforts.',
    date: '2024-08-05',
    author: {
      name: 'Dr. Olumide Adebayo',
      avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
    },
    image:
      'https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Maternal Health Indicators: Progress and Challenges',
    excerpt:
      'Analyzing trends in maternal health outcomes and identifying areas for improvement in Nigeria.',
    date: '2024-07-30',
    author: {
      name: 'Dr. Aisha Yusuf',
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
    },
    image:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Data Analytics in Public Health Decision Making',
    excerpt:
      'How advanced analytics and machine learning are revolutionizing public health research and policy.',
    date: '2024-07-25',
    author: {
      name: 'Dr. Emeka Nwosu',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    image:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
]

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}
</script>
