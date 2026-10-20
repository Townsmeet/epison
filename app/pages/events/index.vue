<template>
  <div class="min-h-screen bg-[#f8f8f4] dark:bg-gray-950">
    <!-- Hero Section (Reusable) -->
    <HeroSection
      title="Events"
      subtitle="Join us for conferences, workshops, and networking events that advance epidemiological knowledge and practice"
    />

    <!-- Events Grid -->
    <section class="py-16 md:py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div v-if="displayedEvents.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="event in displayedEvents"
            :key="event.id"
            class="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_20px_50px_-24px_rgba(15,23,42,0.28)] dark:border-gray-700 dark:bg-gray-900"
          >
            <!-- Event Type Badge -->
            <div class="absolute top-4 right-4 z-10">
              <div
                class="px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm"
                :class="{
                  'bg-blue-500/90 text-white': event.type === 'Conference',
                  'bg-green-500/90 text-white': event.type === 'Workshop',
                  'bg-indigo-500/90 text-white': event.type === 'Seminar',
                  'bg-purple-500/90 text-white': event.type === 'Symposium',
                  'bg-pink-500/90 text-white': event.type === 'Webinar',
                }"
              >
                {{ event.type }}
              </div>
            </div>

            <!-- Past Event Badge -->
            <div v-if="isPast(event)" class="absolute top-4 left-4 z-10">
              <div
                class="px-2.5 py-1 text-[10px] font-semibold rounded-full bg-gray-800/90 text-white dark:bg-gray-200/90 dark:text-gray-900 uppercase tracking-wide"
              >
                Ended
              </div>
            </div>

            <!-- Event Image -->
            <div class="h-52 overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                :src="event.image"
                :alt="event.title"
                :class="[
                  'w-full h-full object-cover transition-transform duration-500',
                  isPast(event) ? 'opacity-70' : 'group-hover:scale-105',
                ]"
                @error="onImgError"
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
                  <span>{{ formatDateRange(event.startDate, event.endDate) }}</span>
                </div>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-map-pin" class="h-4 w-4 mr-1.5" />
                  <span>{{ event.location }}</span>
                </div>
              </div>

              <!-- Ended on subtitle for past events -->
              <p v-if="isPast(event)" class="-mt-2 mb-2 text-xs text-gray-500 dark:text-gray-400">
                Ended on {{ formatEndDate(event.startDate, event.endDate) }}
              </p>

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
              :to="`/events/${event.slug}`"
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
// SEO Configuration
useSeoMeta({
  title: 'Events - Conferences, Workshops & Seminars | EPISON',
  description:
    'Join EPISON for conferences, workshops, and networking events that advance epidemiological knowledge and practice across Nigeria.',
  ogTitle: 'Events - Conferences, Workshops & Seminars | EPISON',
  ogDescription:
    'Discover conferences, workshops, and networking events advancing epidemiological knowledge.',
  ogImage: 'https://epison.ng/hero.jpeg',
  ogUrl: 'https://epison.ng/events',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Events - Conferences, Workshops & Seminars | EPISON',
  twitterDescription:
    'Discover conferences, workshops, and networking events advancing epidemiological knowledge.',
  twitterImage: 'https://epison.ng/hero.jpeg',
})

defineOgImage({
  url: '/hero.jpeg',
  alt: 'Events - Conferences, Workshops & Seminars | EPISON',
})

const { getPublicEvents } = useEvents()

// Fetch all public events sorted with the latest at the top
const query = computed(() => ({
  limit: 100,
  sort: '-startDate',
}))

const { data: eventsResponse } = await getPublicEvents(query)

// Transform API response to match expected format
const events = computed(() => {
  if (!eventsResponse.value?.data) return []
  return eventsResponse.value.data
})

const eventsWithSlug = computed(() =>
  events.value.map(e => ({
    ...e,
    // Normalize type label and image fallback
    type: toTitleCase(e.type),
    image:
      e.bannerUrl ||
      // Prefer picsum for higher reliability
      `https://picsum.photos/seed/${slugify(e.title)}/1200/800`,
    slug: e.slug || slugify(e.title),
  }))
)

// List all events with the latest at the top
const displayedEvents = computed(() =>
  [...eventsWithSlug.value].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  )
)

function formatDateRange(start?: string, end?: string) {
  if (!start) return ''
  const startDate = new Date(start)
  if (!end)
    return startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const endDate = new Date(end)
  const sameMonth =
    startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()
  if (sameMonth) {
    return `${startDate.toLocaleDateString('en-US', { month: 'long' })} ${startDate.getDate()}–${endDate.getDate()}, ${endDate.getFullYear()}`
  }
  return `${startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })} – ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function toTitleCase(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function isPast(e: { startDate: string; endDate?: string }) {
  const now = new Date()
  const end = e.endDate ? new Date(e.endDate) : new Date(e.startDate)
  // Consider an event past if its end date is before today
  return end.getTime() < now.getTime()
}

function formatEndDate(start?: string, end?: string) {
  const endDate = end ? new Date(end) : start ? new Date(start) : undefined
  if (!endDate) return ''
  return endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function onImgError(e: Event) {
  const el = e.target as HTMLImageElement | null
  if (!el) return
  let idx = parseInt(el.dataset?.fallbackIdx ?? '0', 10)
  if (Number.isNaN(idx) || idx < 0) idx = 0
  const fallbacks: string[] = [
    'https://picsum.photos/seed/epison1/1200/800',
    'https://picsum.photos/seed/epison2/1200/800',
    'https://placehold.co/1200x800/png',
  ]
  if (idx >= fallbacks.length) return
  const fb = (fallbacks[idx] ?? fallbacks[0]) as string
  if (typeof fb === 'string') {
    try {
      el.src = fb
    } catch {
      el.setAttribute('src', fb)
    }
  }
  if (el.dataset) el.dataset.fallbackIdx = String(idx + 1)
}
</script>
