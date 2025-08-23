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
            Events
          </span>
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Join us for conferences, workshops, and networking events that advance epidemiological
          knowledge and practice
        </p>
      </div>
    </section>

    <!-- Events Grid -->
    <section class="py-20 md:py-32 bg-gray-50/50 dark:bg-gray-900/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="event in allEvents"
            :key="event.id"
            class="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
          >
            <!-- Event Type Badge -->
            <div class="absolute top-4 right-4 z-10">
              <div
                class="px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm"
                :class="{
                  'bg-blue-500/90 text-white': event.type === 'Conference',
                  'bg-green-500/90 text-white': event.type === 'Workshop',
                  'bg-purple-500/90 text-white': event.type === 'Symposium',
                }"
              >
                {{ event.type }}
              </div>
            </div>

            <!-- Event Image -->
            <div class="h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
              <img
                :src="event.image"
                :alt="event.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <!-- Event Content -->
            <div class="p-6">
              <!-- Date & Location -->
              <div
                class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4 space-x-4"
              >
                <div class="flex items-center">
                  <UIcon name="i-heroicons-calendar" class="h-4 w-4 mr-1.5" />
                  <span>{{ formatDate(event.date) }}</span>
                </div>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-map-pin" class="h-4 w-4 mr-1.5" />
                  <span>{{ event.location }}</span>
                </div>
              </div>

              <!-- Title -->
              <h3
                class="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
              >
                {{ event.title }}
              </h3>

              <!-- Description -->
              <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                {{ event.description }}
              </p>
            </div>

            <!-- Hover Overlay -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-primary-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            />

            <NuxtLink
              :to="`/conferences/${event.id}`"
              class="absolute inset-0 z-0"
              aria-label="View event"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const allEvents = [
  {
    id: 'annual-conference-2024',
    title: 'Annual Scientific Conference 2024',
    type: 'Conference',
    date: '2024-11-15',
    location: 'Abuja, Nigeria',
    description:
      'Join us for the premier epidemiology event of the year, featuring keynote speakers, workshops, and networking opportunities.',
    image:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 'public-health-workshop',
    title: 'Public Health Data Analysis Workshop',
    type: 'Workshop',
    date: '2024-09-22',
    location: 'Lagos, Nigeria',
    description:
      'Hands-on training in advanced data analysis techniques for public health professionals and researchers.',
    image:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 'research-symposium',
    title: 'Epidemiology Research Symposium',
    type: 'Symposium',
    date: '2024-10-05',
    location: 'Online',
    description:
      'Virtual symposium showcasing the latest research in epidemiology and public health from across Nigeria.',
    image:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 'capacity-building-workshop',
    title: 'Capacity Building in Field Epidemiology',
    type: 'Workshop',
    date: '2024-12-10',
    location: 'Kano, Nigeria',
    description:
      'Intensive training program for field epidemiologists and public health practitioners.',
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 'infectious-disease-conference',
    title: 'Infectious Disease Control Conference',
    type: 'Conference',
    date: '2025-02-20',
    location: 'Port Harcourt, Nigeria',
    description:
      'Focus on emerging infectious diseases and control strategies in the Nigerian context.',
    image:
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 'maternal-health-symposium',
    title: 'Maternal and Child Health Symposium',
    type: 'Symposium',
    date: '2025-03-15',
    location: 'Ibadan, Nigeria',
    description:
      'Addressing maternal and child health challenges through epidemiological approaches.',
    image:
      'https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  },
]

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}
</script>
