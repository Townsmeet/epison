<template>
  <div class="bg-white dark:bg-gray-900">
    <!-- Hero Section -->
    <section
      class="relative min-h-[70vh] flex items-center bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden"
    >
      <div class="absolute inset-0 opacity-20">
        <div
          class="absolute top-20 left-10 w-72 h-72 bg-pink-100 dark:bg-pink-900/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
        />
        <div
          class="absolute top-40 right-10 w-72 h-72 bg-purple-100 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          style="animation-delay: 2s"
        />
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="max-w-4xl">
          <div
            class="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm mb-8"
          >
            <div class="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Photo Gallery</span>
          </div>

          <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
            <span class="block text-gray-900 dark:text-white leading-none">Our</span>
            <span
              class="block bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 bg-clip-text text-transparent leading-none"
            >
              Gallery
            </span>
          </h1>

          <div class="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mb-8" />

          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
            Capturing moments from our conferences, workshops, and community activities.
          </p>
        </div>
      </div>
    </section>

    <!-- Gallery Grid -->
    <section class="py-20 md:py-32 bg-gray-50/50 dark:bg-gray-900/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(photo, index) in galleryPhotos"
            :key="index"
            class="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
          >
            <div class="aspect-square overflow-hidden">
              <img
                :src="photo.image"
                :alt="photo.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div class="p-6">
              <h3
                class="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
              >
                {{ photo.title }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {{ formatDate(photo.date) }}
              </p>
              <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {{ photo.description }}
              </p>
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
const galleryPhotos = [
  {
    title: 'Annual Conference 2023',
    description: 'Keynote presentation on emerging infectious diseases',
    date: '2023-11-15',
    image:
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Workshop Participants',
    description: 'Data analysis workshop in Lagos',
    date: '2023-09-22',
    image:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Field Training Exercise',
    description: 'Outbreak investigation simulation',
    date: '2023-08-10',
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Executive Committee Meeting',
    description: 'Strategic planning session in Abuja',
    date: '2023-07-05',
    image:
      'https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Student Symposium',
    description: 'Young epidemiologists presenting research',
    date: '2023-06-20',
    image:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Community Outreach',
    description: 'Health education program in rural communities',
    date: '2023-05-15',
    image:
      'https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
]

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}
</script>
