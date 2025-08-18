<template>
  <div class="overflow-x-hidden">
    <!-- Animated Hero Section -->
    <section
      class="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden"
    >
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />
        <div
          class="absolute -right-1/3 -top-1/3 w-full h-full bg-gradient-radial from-primary-500/5 to-transparent dark:from-primary-400/5 dark:to-transparent rounded-full"
        />
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8 text-center lg:text-left">
            <div
              class="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-sm font-medium"
            >
              <span class="relative flex h-2 w-2 mr-2">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"
                />
                <span
                  class="relative inline-flex rounded-full h-2 w-2 bg-primary-600 dark:bg-primary-400"
                />
              </span>
              Advancing Public Health in Nigeria
            </div>

            <h1
              class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white"
            >
              <span class="block">Shaping the Future of</span>
              <span class="relative inline-block">
                <span class="relative z-10">Epidemiology</span>
                <span
                  class="absolute bottom-2 left-0 w-full h-4 bg-primary-200/60 dark:bg-primary-800/50 -z-0 transform -rotate-1"
                />
              </span>
            </h1>

            <p
              class="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0"
            >
              Empowering health professionals through research, education, and community engagement
              to build a healthier Nigeria.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <NuxtLink
                to="/membership"
                class="group relative inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-primary-500/20 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Join Our Community
                <UIcon
                  name="i-heroicons-arrow-right"
                  class="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"
                />
              </NuxtLink>

              <NuxtLink
                to="/about"
                class="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Learn More
              </NuxtLink>
            </div>

            <div
              class="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-500 dark:text-gray-400"
            >
              <div class="flex items-center">
                <div class="flex -space-x-2">
                  <div
                    v-for="i in 5"
                    :key="i"
                    class="h-8 w-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700"
                  />
                </div>
                <span class="ml-3">Join 1000+ members</span>
              </div>
              <div class="flex items-center">
                <UIcon name="i-heroicons-map-pin" class="h-5 w-5 mr-1.5 text-primary-500" />
                <span>Nationwide Network</span>
              </div>
            </div>
          </div>

          <div class="relative">
            <div
              class="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-8 border-white dark:border-gray-800"
            >
              <img
                class="w-full h-auto"
                src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Healthcare professionals collaborating"
              />
            </div>

            <!-- Decorative elements -->
            <div
              class="absolute -bottom-6 -right-6 w-32 h-32 bg-primary-100 dark:bg-primary-900 rounded-full -z-10"
            />
            <div
              class="absolute -top-6 -left-6 w-24 h-24 bg-secondary-100 dark:bg-secondary-900 rounded-full -z-10"
            />
            <div
              class="absolute -bottom-8 left-1/4 w-16 h-16 bg-accent-100 dark:bg-accent-900 rounded-full -z-10"
            />
          </div>
        </div>
      </div>

      <!-- Wave divider -->
      <div class="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          class="relative block w-full h-12 md:h-20 lg:h-28"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity="0.25"
            class="fill-current text-gray-100 dark:text-gray-800"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity="0.5"
            class="fill-current text-gray-50 dark:text-gray-900"
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            class="fill-white dark:fill-gray-900"
          />
        </svg>
      </div>
    </section>

    <!-- Events Section -->
    <section class="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto">
          <span
            class="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300 mb-4"
          >
            Upcoming Events
          </span>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Join Our Next <span class="text-primary-600 dark:text-primary-400">Event</span>
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300">
            Participate in our upcoming conferences, workshops, and seminars to stay ahead in the
            field of epidemiology.
          </p>
        </div>

        <div class="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="event in upcomingEvents"
            :key="event.id"
            class="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div class="absolute top-4 right-4 z-10">
              <span
                class="px-3 py-1 text-xs font-semibold rounded-full"
                :class="{
                  'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300':
                    event.type === 'Conference',
                  'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300':
                    event.type === 'Workshop',
                  'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300':
                    event.type === 'Symposium',
                }"
              >
                {{ event.type }}
              </span>
            </div>

            <div class="h-48 overflow-hidden">
              <img
                :src="event.image"
                :alt="event.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div class="p-6">
              <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                <UIcon name="i-heroicons-calendar" class="h-4 w-4 mr-1.5" />
                <span>{{ formatDate(event.date) }}</span>
                <span class="mx-2">•</span>
                <UIcon name="i-heroicons-map-pin" class="h-4 w-4 mr-1.5" />
                <span>{{ event.location }}</span>
              </div>

              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                {{ event.title }}
              </h3>

              <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {{ event.description }}
              </p>

              <div
                class="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700"
              >
                <span class="text-sm font-medium text-primary-600 dark:text-primary-400">
                  Learn more
                </span>
                <UIcon
                  name="i-heroicons-arrow-right"
                  class="h-5 w-5 text-gray-400 group-hover:text-primary-500 transition-colors"
                />
              </div>
            </div>

            <NuxtLink
              :to="`/conferences/${event.id}`"
              class="absolute inset-0 z-0"
              aria-label="View event"
            />
          </div>
        </div>

        <div class="mt-12 text-center">
          <NuxtLink
            to="/conferences"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/50 hover:bg-primary-100 dark:hover:bg-primary-800/50 transition-colors"
          >
            View all events
            <UIcon name="i-heroicons-arrow-right" class="ml-2 h-5 w-5" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-800/50 relative overflow-hidden">
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <span
            class="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300 mb-4"
          >
            Our Value Proposition
          </span>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Why <span class="text-primary-600 dark:text-primary-400">Join EPISON?</span>
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300">
            We provide unparalleled opportunities for professional growth, networking, and impact in
            the field of epidemiology.
          </p>
        </div>

        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="group relative p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div class="flex flex-col h-full">
              <div
                class="flex items-center justify-center h-16 w-16 rounded-xl mb-6 bg-gradient-to-br from-primary-500 to-primary-600 text-white transform group-hover:-translate-y-1 transition-transform"
              >
                <UIcon :name="feature.icon" class="h-8 w-8" />
              </div>

              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {{ feature.title }}
              </h3>

              <p class="text-gray-600 dark:text-gray-300 mb-6 flex-grow">
                {{ feature.description }}
              </p>

              <div class="mt-auto">
                <span
                  class="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:underline"
                >
                  Learn more
                  <UIcon
                    name="i-heroicons-arrow-right"
                    class="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                  />
                </span>
              </div>
            </div>

            <div
              class="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary-200 dark:group-hover:border-primary-800 transition-all duration-300 pointer-events-none"
            />
          </div>
        </div>

        <div class="mt-16 text-center">
          <NuxtLink
            to="/about"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-primary-500/20 transition-all"
          >
            Discover More About Us
            <UIcon name="i-heroicons-arrow-right" class="ml-2 h-5 w-5" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700">
      <!-- Decorative elements -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0 bg-grid-pattern" />
      </div>
      <div class="absolute -right-32 -top-32 w-96 h-96 bg-white/5 rounded-full" />
      <div class="absolute -left-32 -bottom-32 w-96 h-96 bg-white/5 rounded-full" />

      <div class="relative max-w-4xl mx-auto px-4 py-20 sm:py-24 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to make an impact in public health?
        </h2>

        <p class="text-xl text-primary-100 max-w-3xl mx-auto mb-8">
          Join EPISON today and become part of Nigeria's leading network of epidemiology
          professionals.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/membership"
            class="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg text-primary-700 bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Join EPISON Now
            <UIcon
              name="i-heroicons-arrow-right"
              class="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"
            />
          </NuxtLink>

          <NuxtLink
            to="/contact"
            class="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg text-white border-2 border-white/20 hover:border-white/40 bg-transparent hover:bg-white/5 transition-colors"
          >
            Contact Us
          </NuxtLink>
        </div>

        <div class="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
          <div class="flex items-center">
            <UIcon name="i-heroicons-check-circle" class="h-5 w-5 mr-2 text-white" />
            <span>No membership fees for students</span>
          </div>
          <div class="flex items-center">
            <UIcon name="i-heroicons-check-circle" class="h-5 w-5 mr-2 text-white" />
            <span>Access to exclusive resources</span>
          </div>
          <div class="flex items-center">
            <UIcon name="i-heroicons-check-circle" class="h-5 w-5 mr-2 text-white" />
            <span>Networking opportunities</span>
          </div>
        </div>
      </div>

      <!-- Wave divider -->
      <div class="absolute bottom-0 left-0 w-full overflow-hidden transform rotate-180">
        <svg
          class="relative block w-full h-12 md:h-20 lg:h-28"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity="0.25"
            class="fill-current text-white"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity="0.5"
            class="fill-current text-white"
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            class="fill-current text-white"
          />
        </svg>
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
