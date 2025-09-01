<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="relative bg-white dark:bg-gray-900 overflow-hidden">
      <div class="max-w-7xl mx-auto">
        <div
          class="relative z-10 pb-8 bg-white dark:bg-gray-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32"
        >
          <div class="pt-10 sm:pt-16 lg:pt-8 lg:pb-14 lg:overflow-hidden">
            <div class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8">
              <div class="lg:text-left">
                <span
                  v-if="event"
                  class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium"
                  :class="badgeClass"
                >
                  {{ typeLabel }}
                </span>
                <h1
                  class="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl mt-4"
                >
                  <span class="block">{{ event?.title || 'Event' }}</span>
                </h1>
                <div v-if="event" class="mt-6 space-y-4">
                  <div class="flex items-center text-gray-500 dark:text-gray-300">
                    <UIcon
                      name="i-heroicons-calendar"
                      class="flex-shrink-0 h-5 w-5 text-gray-400"
                    />
                    <span class="ml-2">{{ formatDateRange(event.startDate, event.endDate) }}</span>
                  </div>
                  <div class="flex items-center text-gray-500 dark:text-gray-300">
                    <UIcon name="i-heroicons-map-pin" class="flex-shrink-0 h-5 w-5 text-gray-400" />
                    <span class="ml-2">{{ event.location }}</span>
                  </div>
                  <!-- Past Event Notice -->
                  <div
                    v-if="isPast"
                    class="flex items-start p-3 rounded-lg bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 border border-amber-200 dark:border-amber-800"
                  >
                    <UIcon name="i-heroicons-information-circle" class="h-5 w-5 mt-0.5 mr-2" />
                    <div>
                      <p class="text-sm font-medium">This event has ended.</p>
                      <p v-if="event.endDate" class="text-xs opacity-80">
                        Ended on
                        {{
                          new Date(event.endDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        }}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  v-if="event"
                  class="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4"
                >
                  <NuxtLink
                    v-if="!isPast && event.status === 'registration_open'"
                    :to="registerPath"
                    class="w-full sm:w-auto"
                  >
                    <UButton size="lg" color="primary" class="w-full sm:w-auto justify-center">
                      Register Now
                    </UButton>
                  </NuxtLink>
                  <UButton
                    v-else-if="isPast"
                    to="/events"
                    size="lg"
                    color="neutral"
                    variant="soft"
                    class="w-full sm:w-auto justify-center"
                  >
                    View upcoming events
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          class="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          :src="heroImage"
          :alt="event?.title || 'Event cover'"
          @error="onImgError"
        />
      </div>
    </div>

    <div class="py-12 bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-3 lg:gap-8">
          <div class="lg:col-span-2">
            <!-- About -->
            <div v-if="event" class="prose dark:prose-invert max-w-none">
              <h2>About this {{ typeLabel.toLowerCase() }}</h2>
              <p>{{ event.description }}</p>
            </div>

            <!-- Speakers (always show; placeholder when empty) -->
            <div v-if="event && event.speakers?.length" class="mt-12">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Speakers</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div
                  v-for="sp in event!.speakers!"
                  :key="sp.id"
                  class="flex items-start gap-4 p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  <img
                    :src="sp.photoUrl || `https://picsum.photos/seed/speaker-${sp.id}/160/160`"
                    :alt="sp.name"
                    class="h-16 w-16 rounded-full object-cover"
                    @error="onSpeakerImgError"
                  />
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">{{ sp.name }}</p>
                    <p v-if="sp.title || sp.org" class="text-sm text-gray-600 dark:text-gray-300">
                      {{ [sp.title, sp.org].filter(Boolean).join(', ') }}
                    </p>
                    <p
                      v-if="sp.bio"
                      class="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-3"
                    >
                      {{ sp.bio }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="mt-12 lg:mt-0 lg:pl-8">
            <div class="space-y-6">
              <!-- Sponsors (always show; placeholder when empty) -->
              <div
                v-if="event?.sponsors?.length"
                class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
              >
                <div class="p-6">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Sponsors</h3>
                  <div class="grid grid-cols-2 gap-4">
                    <a
                      v-for="s in event!.sponsors!"
                      :key="s.id"
                      :href="s.website || '#'"
                      target="_blank"
                      class="flex items-center justify-center p-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                    >
                      <img
                        :src="s.logoUrl"
                        :alt="s.name"
                        class="h-10 object-contain"
                        @error="onSponsorImgError"
                      />
                    </a>
                  </div>
                </div>
              </div>
              <div
                v-else-if="event"
                class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
              >
                <div class="p-6">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Sponsors</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    Sponsorship information will be available soon.
                  </p>
                </div>
              </div>

              <!-- Gallery (only for past events) -->
              <div
                v-if="isPast && event?.gallery?.length"
                class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
              >
                <div class="p-6">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Gallery</h3>
                  <div class="grid grid-cols-2 gap-2">
                    <img
                      v-for="g in event!.gallery!.filter(g => g.type !== 'video')"
                      :key="g.id"
                      :src="g.url"
                      :alt="g.caption || 'Event image'"
                      class="rounded object-cover h-24 w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { events } = useEvents()
const slug = computed(() => route.params.slug as string)

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

const event = computed(() => events.value.find(e => slugify(e.title) === slug.value))

const typeLabel = computed(() =>
  event.value ? event.value.type.charAt(0).toUpperCase() + event.value.type.slice(1) : 'Event'
)

// Whether the event is a conference (used to show sponsors/speakers)
const _isConference = computed(() => (event.value?.type || '').toLowerCase() === 'conference')

const heroImage = computed(
  () =>
    event.value?.gallery?.find(g => g.type !== 'video')?.url ||
    // Seed with slug for deterministic placeholder per event
    `https://picsum.photos/seed/${slug.value || 'epison'}/1600/900`
)

// Register route path for this event
const registerPath = computed(() => `/events/${slug.value}/register`)

const badgeClass = computed(() => {
  switch (typeLabel.value) {
    case 'Conference':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'Workshop':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Seminar':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    case 'Symposium':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    case 'Webinar':
      return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
})

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
  return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} – ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
}

const isPast = computed(() => {
  if (!event.value) return false
  const end = event.value.endDate ? new Date(event.value.endDate) : new Date(event.value.startDate)
  return end.getTime() < Date.now()
})

function onImgError(e: Event) {
  const el = e.target as HTMLImageElement | null
  if (!el) return
  let idx = parseInt(el.dataset?.fallbackIdx ?? '0', 10)
  if (Number.isNaN(idx) || idx < 0) idx = 0
  const fallbacks: string[] = [
    'https://picsum.photos/seed/episonh1/1600/900',
    'https://picsum.photos/seed/episonh2/1600/900',
    'https://placehold.co/1600x900/png',
  ]
  if (idx >= fallbacks.length) return
  const fb = (fallbacks[idx] ?? fallbacks[0]) as string
  try {
    el.src = fb
  } catch {
    el.setAttribute('src', fb)
  }
  if (el.dataset) el.dataset.fallbackIdx = String(idx + 1)
}

// Speakers avatar fallback (square)
function onSpeakerImgError(e: Event) {
  const el = e.target as HTMLImageElement | null
  if (!el) return
  let idx = parseInt(el.dataset?.fallbackIdx ?? '0', 10)
  if (Number.isNaN(idx) || idx < 0) idx = 0
  const fallbacks: string[] = [
    'https://picsum.photos/seed/speaker1/160/160',
    'https://picsum.photos/seed/speaker2/160/160',
    'https://placehold.co/160x160/png',
  ]
  if (idx >= fallbacks.length) return
  const fb = (fallbacks[idx] ?? fallbacks[0]) as string
  try {
    el.src = fb
  } catch {
    el.setAttribute('src', fb)
  }
  if (el.dataset) el.dataset.fallbackIdx = String(idx + 1)
}

// Sponsor logo fallback (wide)
function onSponsorImgError(e: Event) {
  const el = e.target as HTMLImageElement | null
  if (!el) return
  let idx = parseInt(el.dataset?.fallbackIdx ?? '0', 10)
  if (Number.isNaN(idx) || idx < 0) idx = 0
  const fallbacks: string[] = [
    'https://placehold.co/160x80?text=Sponsor',
    'https://picsum.photos/seed/sponsor1/160/80',
    'https://picsum.photos/seed/sponsor2/160/80',
  ]
  if (idx >= fallbacks.length) return
  const fb = (fallbacks[idx] ?? fallbacks[0]) as string
  try {
    el.src = fb
  } catch {
    el.setAttribute('src', fb)
  }
  if (el.dataset) el.dataset.fallbackIdx = String(idx + 1)
}

// SEO
useHead(() => ({
  title: event.value ? `${event.value.title} | EPISON Events` : 'Event | EPISON',
  meta: [
    { name: 'description', content: event.value?.description || 'EPISON event' },
    {
      property: 'og:title',
      content: event.value ? `${event.value.title} | EPISON Events` : 'EPISON Event',
    },
    { property: 'og:description', content: event.value?.description || '' },
    { property: 'og:type', content: 'event' },
    { property: 'og:image', content: heroImage.value },
  ],
}))
</script>
