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
        <!-- Toggle -->
        <div class="flex items-center justify-center mb-10">
          <div
            class="inline-flex rounded-xl border border-gray-200 dark:border-gray-700 p-1 bg-white dark:bg-gray-800 shadow-sm"
          >
            <button
              class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="
                activeTab === 'upcoming'
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              "
              @click="activeTab = 'upcoming'"
            >
              Upcoming
            </button>
            <button
              class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="
                activeTab === 'past'
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              "
              @click="activeTab = 'past'"
            >
              Past
            </button>
          </div>
        </div>

        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="event in displayedEvents"
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
            <div class="h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
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
const { events } = useEvents()

const eventsWithSlug = computed(() =>
  events.value.map(e => ({
    ...e,
    // Normalize type label and image fallback
    type: toTitleCase(e.type),
    image:
      e.gallery?.find(g => g.type !== 'video')?.url ||
      // Prefer picsum for higher reliability
      `https://picsum.photos/seed/${slugify(e.title)}/1200/800`,
    slug: slugify(e.title),
  }))
)

const activeTab = ref<'upcoming' | 'past'>('upcoming')

const upcomingEvents = computed(() =>
  eventsWithSlug.value
    .filter(e => !isPast(e))
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
)

const pastEvents = computed(() =>
  eventsWithSlug.value
    .filter(e => isPast(e))
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
)

const displayedEvents = computed(() =>
  activeTab.value === 'upcoming' ? upcomingEvents.value : pastEvents.value
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
