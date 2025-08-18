<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Hero -->
    <div class="relative bg-primary-700">
      <div class="absolute inset-0">
        <img
          class="w-full h-full object-cover opacity-10"
          src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
          alt="Conference attendees"
        />
      </div>
      <div class="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Conferences & Events
        </h1>
        <p class="mt-6 text-xl text-primary-100 max-w-3xl">
          Join us for our upcoming conferences, workshops, and training programs.
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <!-- Tabs -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.name"
            :class="[
              tab.name === currentTab
                ? 'border-primary-500 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
            ]"
            @click="currentTab = tab.name"
          >
            {{ tab.name }}
            <span
              v-if="tab.count"
              class="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full"
            >
              {{ tab.count }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Events Grid -->
      <div class="mt-8">
        <!-- Upcoming Events -->
        <div v-if="currentTab === 'Upcoming'" class="space-y-8">
          <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="conference in upcomingConferences"
              :key="conference.id"
              class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col"
            >
              <img
                class="h-48 w-full object-cover"
                :src="conference.image"
                :alt="conference.title"
              />
              <div class="p-6 flex-1 flex flex-col">
                <div class="flex items-center">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="conference.badgeClass"
                  >
                    {{ conference.type }}
                  </span>
                  <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">{{
                    formatDate(conference.date)
                  }}</span>
                </div>
                <h3 class="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {{ conference.title }}
                </h3>
                <p class="mt-3 text-base text-gray-500 dark:text-gray-400 line-clamp-2">
                  {{ conference.description }}
                </p>
                <div
                  class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between"
                >
                  <UButton :to="`/conferences/${conference.id}`" variant="ghost" color="neutral">
                    View Details
                  </UButton>
                  <UButton :to="`/conferences/${conference.id}#register`" color="primary" size="sm">
                    Register Now
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Past Events -->
        <div v-else-if="currentTab === 'Past'" class="space-y-8">
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="conference in pastConferences"
              :key="conference.id"
              class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col"
            >
              <img
                class="h-48 w-full object-cover"
                :src="conference.image"
                :alt="conference.title"
              />
              <div class="p-6 flex-1 flex flex-col">
                <div class="flex items-center">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="conference.badgeClass"
                  >
                    {{ conference.type }}
                  </span>
                  <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">{{
                    formatDate(conference.date)
                  }}</span>
                </div>
                <h3 class="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {{ conference.title }}
                </h3>
                <p class="mt-3 text-base text-gray-500 dark:text-gray-400 line-clamp-2">
                  {{ conference.description }}
                </p>
                <div
                  class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between"
                >
                  <UButton :to="`/conferences/${conference.id}`" variant="ghost" color="neutral">
                    View Details
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Call for Abstracts -->
        <div v-else-if="currentTab === 'Call for Abstracts'" class="space-y-8">
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="conference in upcomingConferences"
              :key="conference.id"
              class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col"
            >
              <img
                class="h-48 w-full object-cover"
                :src="conference.image"
                :alt="conference.title"
              />
              <div class="p-6 flex-1 flex flex-col">
                <div class="flex items-center">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="conference.badgeClass"
                  >
                    {{ conference.type }}
                  </span>
                  <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">{{
                    formatDate(conference.date)
                  }}</span>
                </div>
                <h3 class="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {{ conference.title }}
                </h3>
                <p class="mt-3 text-base text-gray-500 dark:text-gray-400 line-clamp-2">
                  {{ conference.description }}
                </p>
                <div
                  class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between"
                >
                  <UButton :to="`/conferences/${conference.id}`" variant="ghost" color="neutral">
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
            </div>
          </div>
        </div>

        <!-- Sponsors -->
        <div v-else-if="currentTab === 'Sponsors'" class="space-y-8">
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="sponsor in sponsors"
              :key="sponsor.id"
              class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col"
            >
              <img class="h-48 w-full object-cover" :src="sponsor.image" :alt="sponsor.name" />
              <div class="p-6 flex-1 flex flex-col">
                <h3 class="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {{ sponsor.name }}
                </h3>
                <p class="mt-3 text-base text-gray-500 dark:text-gray-400 line-clamp-2">
                  {{ sponsor.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="mt-16 bg-white dark:bg-gray-800 shadow rounded-lg p-6 md:p-8">
        <div class="md:flex md:items-center md:justify-between">
          <div class="md:w-2/3">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              Host an Event with EPISON
            </h2>
            <p class="mt-2 text-gray-600 dark:text-gray-300">
              Interested in organizing a conference, workshop, or training program in collaboration
              with EPISON? Contact us to discuss partnership opportunities.
            </p>
          </div>
          <div class="mt-4 md:mt-0">
            <UButton to="/contact" color="primary" size="lg" class="w-full md:w-auto">
              Contact Us
            </UButton>
          </div>
        </div>
      </div>
    </div>
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
