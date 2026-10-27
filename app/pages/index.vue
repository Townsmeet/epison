<template>
  <div class="overflow-x-hidden">
    <!-- Hero Section -->
    <section
      class="relative flex min-h-[calc(100svh-5rem)] items-center overflow-hidden bg-[#f8f8f4] dark:bg-gray-950"
    >
      <div class="absolute inset-0 opacity-20 dark:opacity-10">
        <div
          class="absolute -top-24 -left-24 h-[30rem] w-[30rem] rounded-full bg-teal-200 blur-3xl dark:bg-teal-900"
        />
        <div
          class="absolute -bottom-40 right-0 h-[34rem] w-[34rem] rounded-full bg-amber-100 blur-3xl dark:bg-amber-900"
        />
      </div>

      <div class="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div class="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div class="space-y-7 lg:col-span-7">
            <div class="space-y-4">
              <h1 class="text-5xl font-semibold tracking-[-0.055em] md:text-6xl lg:text-[4.5rem]">
                <span class="block leading-[1.02] text-gray-950 dark:text-white">Evidence for</span>
                <span class="block leading-[1.02] text-gray-950 dark:text-white">a healthier</span>
                <span
                  class="block font-serif text-primary-700 italic leading-[1.02] tracking-[-0.04em] dark:text-primary-400"
                >
                  Nigeria.
                </span>
              </h1>
            </div>

            <p class="max-w-xl text-lg leading-relaxed text-gray-600 dark:text-gray-300 md:text-xl">
              Advancing public health through epidemiological research, education, and a stronger
              professional community.
            </p>

            <div class="flex flex-wrap items-center gap-3 pt-1">
              <UButton
                to="/membership"
                color="primary"
                size="xl"
                trailing-icon="i-heroicons-arrow-right"
                class="rounded-full px-6 py-3 font-semibold shadow-sm"
              >
                Become a member
              </UButton>
              <NuxtLink
                to="/about"
                class="inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold text-gray-800 transition-colors hover:bg-white/70 dark:text-gray-200 dark:hover:bg-gray-900/70"
              >
                Discover EPISON
              </NuxtLink>
            </div>
          </div>

          <div class="relative lg:col-span-5 lg:pl-4">
            <div class="relative mx-auto max-w-lg">
              <div
                class="relative z-10 overflow-hidden rounded-[2rem] border-[8px] border-white/80 shadow-[0_30px_80px_-30px_rgba(18,52,43,0.4)] dark:border-gray-900"
              >
                <img
                  class="h-[23rem] w-full object-cover md:h-[28rem]"
                  src="/hero.jpeg"
                  alt="Medical professionals in discussion"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"
                />
              </div>

              <div
                class="absolute -bottom-5 -left-4 z-20 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-900 sm:-left-8"
              >
                <div class="flex items-center space-x-3">
                  <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-700">
                    <UIcon name="i-heroicons-chart-bar" class="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-900 dark:text-white">Health Impact</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Measurable Results</p>
                  </div>
                </div>
              </div>

              <div
                class="absolute -right-3 -top-3 z-20 rounded-full border border-white/70 bg-amber-100 px-4 py-2 text-xs font-bold tracking-wide text-amber-950 shadow-lg dark:border-gray-800 dark:bg-amber-300 dark:text-amber-950"
              >
                Est. 2010
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Events Section -->
    <section class="bg-white py-20 dark:bg-gray-900 md:py-28">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-16 max-w-2xl">
          <div
            class="mb-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3.5 py-2 dark:border-gray-700 dark:bg-gray-800"
          >
            <div class="h-1.5 w-1.5 rounded-full bg-primary-600" />
            <span
              class="text-xs font-semibold uppercase tracking-[0.12em] text-gray-700 dark:text-gray-300"
              >Connect & Learn</span
            >
          </div>
          <h2
            class="mb-5 text-4xl font-semibold tracking-tight text-gray-950 dark:text-white md:text-5xl"
          >
            Events
          </h2>
          <p class="max-w-xl text-lg leading-relaxed text-gray-600 dark:text-gray-300">
            Participate in our conferences, workshops, and seminars to stay ahead in the field of
            epidemiology.
          </p>
        </div>

        <div v-if="latestEvents.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="event in latestEvents"
            :key="event.id"
            class="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_20px_50px_-24px_rgba(15,23,42,0.28)] dark:border-gray-700 dark:bg-gray-800"
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
            <div class="h-52 overflow-hidden bg-gray-100 dark:bg-gray-700">
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

        <!-- View All Link -->
        <div class="mt-10 flex justify-center">
          <NuxtLink
            to="/events"
            class="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-primary-300 hover:text-primary-700 dark:border-gray-700 dark:text-gray-200 dark:hover:text-primary-300 group"
          >
            <span>View all events</span>
            <UIcon
              name="i-heroicons-arrow-right"
              class="h-4 w-4 transition-transform group-hover:translate-x-1"
            />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="relative overflow-hidden bg-[#f8f8f4] py-20 dark:bg-gray-950 md:py-28">
      <div class="absolute inset-0 opacity-[0.08] dark:opacity-[0.04]">
        <div class="absolute -right-20 top-20 h-96 w-96 rounded-full bg-primary-300 blur-3xl" />
        <div class="absolute -left-20 bottom-20 h-96 w-96 rounded-full bg-amber-200 blur-3xl" />
      </div>

      <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-20 max-w-2xl">
          <div
            class="mb-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3.5 py-2 dark:border-gray-700 dark:bg-gray-900/80"
          >
            <div class="h-1.5 w-1.5 rounded-full bg-primary-500" />
            <span
              class="text-xs font-semibold uppercase tracking-[0.12em] text-gray-700 dark:text-gray-300"
              >Why EPISON</span
            >
          </div>
          <h2
            class="mb-5 text-4xl font-semibold tracking-tight text-gray-950 dark:text-white md:text-5xl"
          >
            Why Join
            <span class="font-serif italic text-primary-700 dark:text-primary-400">EPISON?</span>
          </h2>
          <p class="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
            We provide unparalleled opportunities for professional growth, networking, and impact in
            the field of epidemiology.
          </p>
        </div>

        <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="feature in features" :key="feature.title" class="group">
            <div
              class="h-full rounded-2xl border border-gray-200/80 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_20px_50px_-24px_rgba(15,23,42,0.22)] dark:border-gray-700 dark:bg-gray-900"
            >
              <div class="mb-6">
                <div
                  class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
                >
                  <UIcon :name="feature.icon" class="h-6 w-6" />
                </div>
              </div>

              <div class="space-y-4">
                <h3
                  class="text-lg font-semibold text-gray-950 transition-colors group-hover:text-primary-700 dark:text-white dark:group-hover:text-primary-300"
                >
                  {{ feature.title }}
                </h3>

                <p class="leading-relaxed text-gray-600 dark:text-gray-300">
                  {{ feature.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-14">
          <div
            class="flex flex-col gap-5 rounded-2xl border border-primary-200/70 bg-white p-6 dark:border-primary-800 dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-between sm:px-8"
          >
            <div>
              <p
                class="text-xs font-semibold uppercase tracking-[0.12em] text-primary-700 dark:text-primary-300"
              >
                Join the community
              </p>
              <p class="mt-1 text-lg font-semibold text-gray-950 dark:text-white">
                Ready to make an impact?
              </p>
            </div>
            <UButton
              to="/membership"
              color="primary"
              trailing-icon="i-heroicons-arrow-right"
              class="w-fit rounded-full px-5 font-semibold"
            >
              Join EPISON
            </UButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// SEO Configuration
useSeoMeta({
  title: 'Epidemiological Society of Nigeria - EPISON',
  description:
    'The Epidemiological Society of Nigeria (EPISON) is a professional organization dedicated to advancing public health through research, education, and evidence-based practice in epidemiology.',
  ogTitle: 'Epidemiological Society of Nigeria - EPISON',
  ogDescription:
    'Join us in advancing public health through research, education, and evidence-based practice in epidemiology.',
  ogImage: 'https://epison.ng/hero.jpeg',
  ogUrl: 'https://epison.ng',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Epidemiological Society of Nigeria - EPISON',
  twitterDescription:
    'Join us in advancing public health through research, education, and evidence-based practice in epidemiology.',
  twitterImage: 'https://epison.ng/hero.jpeg',
})

defineOgImage({
  url: '/hero.jpeg',
  alt: 'Epidemiological Society of Nigeria - EPISON',
})

const { getPublicEvents } = useEvents()

// Fetch up to 3 latest public events
const { data: eventsResponse } = await getPublicEvents({
  limit: 3,
  sort: '-startDate',
})

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
  return end.getTime() < now.getTime()
}

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

const latestEvents = computed(() => {
  const list = eventsResponse.value?.data || []
  return [...list]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .map(e => ({
      id: e.id,
      title: e.title,
      type: toTitleCase(e.type),
      startDate: e.startDate,
      endDate: e.endDate,
      location: e.location,
      description: e.description || '',
      slug: e.slug || slugify(e.title),
      image: e.bannerUrl || `https://picsum.photos/seed/${slugify(e.slug || e.title)}/1200/800`,
    }))
})

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
</script>
