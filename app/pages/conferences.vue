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
            Conferences
          </span>
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Discover upcoming conferences, past events, and opportunities to share your research
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-20 md:py-32 bg-gray-50/50 dark:bg-gray-900/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Tabs -->
        <div class="mb-12">
          <div
            class="flex flex-wrap justify-center gap-2 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-gray-700/50 shadow-sm"
          >
            <button
              v-for="tab in tabs"
              :key="tab.name"
              :class="[
                tab.name === currentTab
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700',
                'px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center space-x-2',
              ]"
              @click="currentTab = tab.name"
            >
              <span>{{ tab.name }}</span>
              <span
                v-if="tab.count"
                :class="[
                  tab.name === currentTab
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300',
                  'text-xs font-semibold px-2 py-1 rounded-full min-w-[1.5rem] text-center',
                ]"
              >
                {{ tab.count }}
              </span>
            </button>
          </div>
        </div>

        <!-- Events Grid -->
        <div>
          <!-- Upcoming Events -->
          <div v-if="currentTab === 'Upcoming'">
            <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="conference in upcomingConferences"
                :key="conference.id"
                class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-gray-700/50 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div class="relative h-48 overflow-hidden">
                  <img
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    :src="conference.image"
                    :alt="conference.title"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                <div class="p-6">
                  <div class="flex items-center justify-between mb-4">
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                      :class="conference.badgeClass"
                    >
                      {{ conference.type }}
                    </span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">{{
                      formatDate(conference.date)
                    }}</span>
                  </div>

                  <h3
                    class="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
                  >
                    {{ conference.title }}
                  </h3>

                  <p
                    class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-6"
                  >
                    {{ conference.description }}
                  </p>

                  <div class="flex items-center justify-between">
                    <UButton
                      :to="`/conferences/${conference.id}`"
                      variant="ghost"
                      color="neutral"
                      size="sm"
                    >
                      View Details
                    </UButton>
                    <UButton
                      :to="`/conferences/${conference.id}#register`"
                      color="primary"
                      size="sm"
                    >
                      Register Now
                    </UButton>
                  </div>
                </div>

                <div
                  class="absolute inset-0 bg-gradient-to-t from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                />
              </div>
            </div>
          </div>

          <!-- Past Events -->
          <div v-else-if="currentTab === 'Past'">
            <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="conference in pastConferences"
                :key="conference.id"
                class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-gray-700/50 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div class="relative h-48 overflow-hidden">
                  <img
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    :src="conference.image"
                    :alt="conference.title"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                <div class="p-6">
                  <div class="flex items-center justify-between mb-4">
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                      :class="conference.badgeClass"
                    >
                      {{ conference.type }}
                    </span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">{{
                      formatDate(conference.date)
                    }}</span>
                  </div>

                  <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {{ conference.title }}
                  </h3>

                  <p
                    class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-6"
                  >
                    {{ conference.description }}
                  </p>

                  <UButton
                    :to="`/conferences/${conference.id}`"
                    variant="ghost"
                    color="neutral"
                    size="sm"
                    class="w-full"
                  >
                    View Details
                  </UButton>
                </div>
              </div>
            </div>
          </div>

          <!-- Call for Abstracts -->
          <div v-else-if="currentTab === 'Call for Abstracts'">
            <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="conference in upcomingConferences"
                :key="conference.id"
                class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-gray-700/50 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div class="relative h-48 overflow-hidden">
                  <img
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    :src="conference.image"
                    :alt="conference.title"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                <div class="p-6">
                  <div class="flex items-center justify-between mb-4">
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                      :class="conference.badgeClass"
                    >
                      {{ conference.type }}
                    </span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">{{
                      formatDate(conference.date)
                    }}</span>
                  </div>

                  <h3
                    class="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
                  >
                    {{ conference.title }}
                  </h3>

                  <p
                    class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-6"
                  >
                    {{ conference.description }}
                  </p>

                  <div class="flex items-center justify-between">
                    <UButton
                      :to="`/conferences/${conference.id}`"
                      variant="ghost"
                      color="neutral"
                      size="sm"
                    >
                      View Details
                    </UButton>
                    <UButton
                      :to="`/conferences/${conference.id}#submit-abstract`"
                      color="primary"
                      size="sm"
                    >
                      Submit Abstract
                    </UButton>
                  </div>
                </div>

                <div
                  class="absolute inset-0 bg-gradient-to-t from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                />
              </div>
            </div>
          </div>

          <!-- Sponsors -->
          <div v-else-if="currentTab === 'Sponsors'">
            <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="sponsor in sponsors"
                :key="sponsor.id"
                class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-gray-700/50 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div
                  class="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                >
                  <img
                    class="max-w-full max-h-full object-contain"
                    :src="sponsor.image"
                    :alt="sponsor.name"
                  />
                </div>

                <div class="p-6">
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {{ sponsor.name }}
                  </h3>

                  <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {{ sponsor.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div
          class="mt-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-gray-700/50 shadow-sm p-8"
        >
          <div class="md:flex md:items-center md:justify-between">
            <div class="md:w-2/3">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Host an Event with EPISON
              </h2>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                Interested in organizing a conference, workshop, or training program in
                collaboration with EPISON? Contact us to discuss partnership opportunities.
              </p>
            </div>
            <div class="mt-6 md:mt-0">
              <UButton to="/contact" color="primary" size="lg" class="w-full md:w-auto">
                Contact Us
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Conference {
  id: string
  title: string
  type: string
  date?: string
  startDate?: string
  endDate?: string
  description: string
  image: string
  location?: string
  registrationOpen?: boolean
  earlyBirdDeadline?: string
  attendees?: number
  theme?: string
  badgeClass?: string
}

interface Tab {
  name: string
  count?: number
}

interface Sponsor {
  id: string
  name: string
  description: string
  image: string
}

const currentTab = ref('Upcoming')

const tabs: Tab[] = [
  { name: 'Upcoming', count: 3 },
  { name: 'Past', count: 12 },
  { name: 'Call for Abstracts', count: 1 },
  { name: 'Sponsors' },
]

const upcomingConferences: Conference[] = [
  {
    id: 'annual-conference-2024',
    title: '29th Annual Scientific Conference',
    type: 'Conference',
    date: '2024-11-15',
    description:
      'Join us for the premier gathering of epidemiologists and public health professionals in Nigeria. This year\'s theme is "Advancing Epidemiology for Health Security and Sustainable Development".',
    image:
      'https://images.unsplash.com/photo-1533174072775-26d83692aa5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    location: 'Abuja, Nigeria',
    registrationOpen: true,
    earlyBirdDeadline: '2024-10-15',
  },
  {
    id: 'public-health-forum-2024',
    title: 'Public Health Forum 2024',
    type: 'Forum',
    date: '2024-09-10',
    description:
      'A forum discussing the latest trends and challenges in public health with a focus on emerging infectious diseases and health system strengthening.',
    image:
      'https://images.unsplash.com/photo-1505751172876-fa186e6446ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    badgeClass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    location: 'Lagos, Nigeria',
    registrationOpen: true,
    earlyBirdDeadline: '2024-08-15',
  },
]

const pastConferences: Conference[] = [
  {
    id: 'annual-conference-2023',
    title: '28th Annual Scientific Conference',
    type: 'Conference',
    date: '2023-11-10',
    description:
      'Our previous conference that brought together over 500 experts from across the country to discuss public health challenges and innovations in epidemiological research.',
    image:
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    location: 'Abuja, Nigeria',
    attendees: 500,
    theme: 'Epidemiology in the Post-Pandemic Era: Lessons and Way Forward',
    badgeClass: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  },
  {
    id: 'conference-2022',
    title: '27th Annual Scientific Conference',
    type: 'Conference',
    date: '2022-11-09',
    description:
      'Theme: "Epidemiology in the Digital Age: Harnessing Technology for Public Health"',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    location: 'Port Harcourt, Nigeria',
    attendees: 450,
    badgeClass: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  },
  {
    id: 'workshop-2022',
    title: 'Data Visualization Workshop',
    type: 'Workshop',
    date: '2022-08-15',
    location: 'Ibadan, Nigeria',
    description:
      'Hands-on training on creating effective data visualizations for public health data.',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    badgeClass: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    attendees: 120,
  },
  {
    id: 'infectious-disease-2022',
    title: 'Infectious Disease Symposium',
    type: 'Symposium',
    date: '2022-04-07',
    location: 'Abuja, Nigeria',
    description: 'Addressing emerging and re-emerging infectious diseases in Nigeria.',
    image:
      'https://images.unsplash.com/photo-1575505586569-646b2ca898fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    badgeClass: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    attendees: 300,
    theme: 'Combating Emerging Infectious Diseases in Nigeria',
  },
]

const sponsors: Sponsor[] = [
  {
    id: 'sponsor-1',
    name: 'Federal Ministry of Health',
    description: 'Platinum Sponsor',
    image: 'https://via.placeholder.com/300x150?text=Ministry+of+Health',
  },
  {
    id: 'sponsor-2',
    name: 'Nigerian Medical Association',
    description: 'Gold Sponsor',
    image: 'https://via.placeholder.com/300x150?text=NMA',
  },
  {
    id: 'sponsor-3',
    name: 'Pharmaceutical Company',
    description: 'Silver Sponsor',
    image: 'https://via.placeholder.com/300x150?text=Pharma+Co',
  },
]

function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'Date not specified'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
