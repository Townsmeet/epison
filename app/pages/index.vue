<template>
  <div class="overflow-x-hidden">
    <!-- Hero Section -->
    <section
      class="relative min-h-screen flex items-center bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden"
    >
      <!-- Subtle geometric background -->
      <div class="absolute inset-0 opacity-30">
        <div
          class="absolute top-20 left-10 w-72 h-72 bg-primary-100 dark:bg-primary-900/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
        />
        <div
          class="absolute top-40 right-10 w-72 h-72 bg-blue-100 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          style="animation-delay: 2s"
        />
        <div
          class="absolute -bottom-8 left-20 w-72 h-72 bg-purple-100 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          style="animation-delay: 4s"
        />
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="grid lg:grid-cols-12 gap-8 items-center">
          <!-- Content Column -->
          <div class="lg:col-span-7 space-y-8">
            <!-- Badge -->
            <div
              class="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm"
            >
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
                >Advancing Public Health in Nigeria</span
              >
            </div>

            <!-- Main Headline -->
            <div class="space-y-4">
              <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span class="block text-gray-900 dark:text-white leading-none">Shaping the</span>
                <span class="block text-gray-900 dark:text-white leading-none">Future of</span>
                <span
                  class="block bg-gradient-to-r from-primary-600 via-primary-500 to-blue-600 bg-clip-text text-transparent leading-none"
                >
                  Epidemiology
                </span>
              </h1>

              <!-- Decorative line -->
              <div class="w-24 h-1 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full" />
            </div>

            <!-- Description -->
            <p class="text-xl text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
              Empowering health professionals through research, education, and community engagement
              to build a healthier Nigeria.
            </p>

            <!-- Stats -->
            <div class="flex flex-wrap items-center gap-8 pt-4">
              <div class="flex items-center space-x-3">
                <div class="flex -space-x-2">
                  <div
                    class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-2 border-white dark:border-gray-900 flex items-center justify-center"
                  >
                    <span class="text-xs font-bold text-white">1K+</span>
                  </div>
                  <div
                    class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white dark:border-gray-900"
                  />
                  <div
                    class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white dark:border-gray-900"
                  />
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">Active Members</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Nationwide Network</p>
                </div>
              </div>

              <div class="h-12 w-px bg-gray-200 dark:bg-gray-700" />

              <div>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">25+</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Years Experience
                </p>
              </div>

              <div>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">50+</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Research Projects
                </p>
              </div>
            </div>
          </div>

          <!-- Visual Column -->
          <div class="lg:col-span-5 relative">
            <div class="relative">
              <!-- Main image -->
              <div
                class="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700"
              >
                <img
                  class="w-full h-96 object-cover"
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Medical professionals in discussion"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              <!-- Floating card -->
              <div
                class="absolute -bottom-6 -left-6 z-20 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-gray-700 backdrop-blur-sm"
              >
                <div class="flex items-center space-x-3">
                  <div
                    class="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center"
                  >
                    <UIcon name="i-heroicons-chart-bar" class="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-900 dark:text-white">Health Impact</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Measurable Results</p>
                  </div>
                </div>
              </div>

              <!-- Floating badge -->
              <div
                class="absolute -top-4 -right-4 z-20 bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
              >
                Est. 1999
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Events Section -->
    <section class="py-20 md:py-32 bg-gray-50/50 dark:bg-gray-900/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="max-w-2xl mb-16">
          <div
            class="inline-flex items-center space-x-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm mb-6"
          >
            <div class="w-2 h-2 bg-blue-500 rounded-full" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >Upcoming Events</span
            >
          </div>
          <h2
            class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
          >
            Join Our Next
            <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >Event</span
            >
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Participate in our upcoming conferences, workshops, and seminars to stay ahead in the
            field of epidemiology.
          </p>
        </div>

        <!-- Events Grid -->
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="event in upcomingEvents"
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

        <!-- View All Link -->
        <div class="mt-16 text-center">
          <NuxtLink
            to="/conferences"
            class="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
          >
            <span class="font-medium">View all events</span>
            <UIcon
              name="i-heroicons-arrow-right"
              class="h-4 w-4 group-hover:translate-x-1 transition-transform"
            />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 md:py-32 bg-white dark:bg-gray-900 relative overflow-hidden">
      <!-- Subtle background pattern -->
      <div class="absolute inset-0 opacity-5">
        <div
          class="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-primary-500 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl"
        />
        <div
          class="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl"
        />
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="max-w-2xl mb-20">
          <div
            class="inline-flex items-center space-x-2 px-4 py-2 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm mb-6"
          >
            <div class="w-2 h-2 bg-primary-500 rounded-full" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >Our Value Proposition</span
            >
          </div>
          <h2
            class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
          >
            Why Join
            <span
              class="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent"
              >EPISON?</span
            >
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            We provide unparalleled opportunities for professional growth, networking, and impact in
            the field of epidemiology.
          </p>
        </div>

        <!-- Features Grid -->
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="(feature, index) in features" :key="index" class="group relative">
            <!-- Feature Card -->
            <div
              class="relative h-full p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-gray-700/50 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <!-- Icon with gradient background -->
              <div class="relative mb-6">
                <div
                  class="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-blue-500/20 rounded-2xl blur-xl"
                />
                <div
                  class="relative flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-500 to-blue-600 text-white shadow-lg"
                >
                  <UIcon :name="feature.icon" class="h-8 w-8" />
                </div>
              </div>

              <!-- Content -->
              <div class="space-y-4">
                <h3
                  class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
                >
                  {{ feature.title }}
                </h3>

                <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {{ feature.description }}
                </p>
              </div>

              <!-- Subtle hover effect -->
              <div
                class="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>

            <!-- Floating number indicator -->
            <div
              class="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-100 dark:to-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-white dark:text-gray-900 shadow-lg"
            >
              {{ index + 1 }}
            </div>
          </div>
        </div>

        <!-- Bottom CTA -->
        <div class="mt-20 text-center">
          <div
            class="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-full border border-primary-200/50 dark:border-primary-700/50"
          >
            <div class="flex -space-x-2">
              <div
                class="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full border-2 border-white dark:border-gray-900"
              />
              <div
                class="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white dark:border-gray-900"
              />
              <div
                class="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full border-2 border-white dark:border-gray-900"
              />
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >Ready to make an impact?</span
            >
            <NuxtLink
              to="/membership"
              class="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              Join us →
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const upcomingEvents = [
  {
    id: 'annual-conference-2024',
    title: 'Annual Scientific Conference 2024',
    type: 'Conference',
    date: '2024-11-15',
    location: 'Abuja, Nigeria',
    description:
      'Join us for the premier epidemiology event of the year, featuring keynote speakers, workshops, and networking opportunities.',
    image:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
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
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
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
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  },
]

const features = [
  {
    icon: 'i-heroicons-academic-cap',
    title: 'Professional Development',
    description:
      'Access to training, workshops, and conferences to enhance your epidemiological skills and knowledge.',
  },
  {
    icon: 'i-heroicons-user-group',
    title: 'Networking',
    description:
      'Connect with fellow epidemiologists and public health professionals across Nigeria and beyond.',
  },
  {
    icon: 'i-heroicons-book-open',
    title: 'Resources',
    description:
      'Exclusive access to research publications, guidelines, and other valuable resources in epidemiology.',
  },
]

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}
</script>
