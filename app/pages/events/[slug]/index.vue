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
                  <span v-if="event?.title" class="block">{{ event!.title }}</span>
                  <span v-else class="block sr-only">Loading event...</span>
                </h1>
                <div v-if="event" class="mt-6 space-y-4">
                  <div class="flex items-center text-gray-700 dark:text-gray-200">
                    <UIcon
                      name="i-heroicons-calendar"
                      class="flex-shrink-0 h-5 w-5 text-gray-500"
                    />
                    <span class="ml-2 font-medium">{{
                      formatDateRange(event.startDate, event.endDate)
                    }}</span>
                  </div>
                  <div class="flex items-center text-gray-700 dark:text-gray-200">
                    <UIcon name="i-heroicons-map-pin" class="flex-shrink-0 h-5 w-5 text-gray-500" />
                    <span class="ml-2 font-medium">{{ event.location }}</span>
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
                  class="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4"
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
                    v-if="!isPast && canSubmitAbstract"
                    size="lg"
                    color="secondary"
                    variant="soft"
                    class="w-full sm:w-auto justify-center"
                    @click="showSubmissionForm = true"
                  >
                    Submit Abstract
                  </UButton>
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
                <div v-if="event?.theme" class="mt-6">
                  <div class="text-xl font-extrabold text-gray-900 dark:text-white">Theme</div>
                  <div class="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    {{ event.theme }}
                  </div>
                </div>
                <div v-if="event?.subthemes && event.subthemes.length" class="mt-4">
                  <div class="text-base font-semibold text-gray-900 dark:text-white">Subthemes</div>
                  <div
                    class="text-sm font-medium text-gray-900 dark:text-white mt-1 flex flex-wrap gap-x-4 gap-y-1"
                  >
                    <span v-for="(s, si) in event.subthemes" :key="`${s}-${si}`">{{ s }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          v-if="event"
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

            <!-- Submission Guidelines and Important Dates -->
            <div
              v-if="
                event?.submissionGuidelines ||
                (event?.submissionDates && event.submissionDates.length)
              "
              class="mt-8"
            >
              <div v-if="event?.submissionGuidelines">
                <h3 class="font-bold mb-1">Submission Guidelines</h3>
                <div
                  class="whitespace-pre-line text-sm bg-gray-50 dark:bg-gray-900 rounded p-3 mb-4"
                >
                  {{ event.submissionGuidelines }}
                </div>
              </div>
              <div v-if="event?.submissionDates && event.submissionDates.length">
                <h3 class="font-bold mb-1">Important Dates</h3>
                <ul class="text-xs space-y-1">
                  <li v-for="d in event.submissionDates" :key="d.label">
                    <span class="font-semibold">{{ d.label }}:</span>
                    <span v-if="d.date">{{ d.date }}</span
                    ><span v-if="!d.date && d.startDate && d.endDate"
                      >{{ d.startDate }} - {{ d.endDate }}</span
                    >
                  </li>
                </ul>
              </div>
            </div>

            <!-- Speakers (always show; placeholder when empty) -->
            <div v-if="event && event.speakers?.length" class="mt-12">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Speakers</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div
                  v-for="sp in event?.speakers || []"
                  :key="sp.id"
                  class="flex items-start gap-4 p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  <img
                    :src="
                      normalizeUrl(sp.photoUrl) ||
                      `https://picsum.photos/seed/speaker-${sp.id}/160/160`
                    "
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
              <!-- Organizing Committee -->
              <div
                v-if="event?.committee && event.committee.length"
                class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
              >
                <div class="p-6">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Organizing Committee
                  </h3>
                  <ul class="space-y-4">
                    <li v-for="m in event.committee" :key="m.id" class="flex items-start gap-3">
                      <UIcon name="i-heroicons-user" class="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <div class="font-medium text-gray-900 dark:text-white">{{ m.name }}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-300">
                          <span v-if="m.role">{{ m.role }}</span>
                          <span v-if="m.role && (m.email || m.phone)" class="mx-2">•</span>
                          <NuxtLink
                            v-if="m.email"
                            :to="`mailto:${m.email}`"
                            class="hover:underline"
                            >{{ m.email }}</NuxtLink
                          >
                          <span v-if="m.phone">
                            <span v-if="m.email" class="mx-2">•</span>
                            <NuxtLink :to="`tel:${m.phone}`" class="hover:underline">{{
                              m.phone
                            }}</NuxtLink>
                          </span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Sponsors (always show; placeholder when empty) -->
              <div
                v-if="event?.sponsors?.length"
                class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
              >
                <div class="p-6">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Sponsors</h3>
                  <div class="grid grid-cols-2 gap-4">
                    <a
                      v-for="s in event?.sponsors || []"
                      :key="s.id"
                      :href="s.website || '#'"
                      target="_blank"
                      class="flex items-center justify-center p-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                    >
                      <img
                        :src="normalizeUrl(s.logoUrl) || ''"
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
                      v-for="g in (event?.gallery || []).filter(g => g.type !== 'video')"
                      :key="g.id"
                      :src="normalizeUrl(g.url) || ''"
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

    <!-- Abstract Submission Modal -->
    <UModal v-model:open="showSubmissionForm" :dismissible="false">
      <template #content>
        <div class="h-[85vh] flex flex-col">
          <UCard
            class="flex flex-col h-full"
            :ui="{ body: 'flex-1 flex flex-col overflow-hidden p-0' }"
          >
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Submit Abstract - {{ event?.title }}
                </h3>
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-heroicons-x-mark"
                  @click="showSubmissionForm = false"
                />
              </div>
            </template>
            <div v-if="submissionStep === 1" class="overflow-y-auto p-6">
              <div v-if="event?.submissionGuidelines">
                <h3 class="font-bold mb-1">Submission Guidelines</h3>
                <div
                  class="whitespace-pre-line text-sm bg-gray-50 dark:bg-gray-900 rounded p-3 mb-4"
                >
                  {{ event.submissionGuidelines }}
                </div>
              </div>
              <div v-if="event?.submissionDates && event.submissionDates.length">
                <h3 class="font-bold mb-1">Important Dates</h3>
                <ul class="text-xs space-y-1">
                  <li v-for="d in event.submissionDates" :key="d.label">
                    <span class="font-semibold">{{ d.label }}:</span>
                    <span v-if="d.date">{{ d.date }}</span
                    ><span v-if="!d.date && d.startDate && d.endDate"
                      >{{ d.startDate }} - {{ d.endDate }}</span
                    >
                  </li>
                </ul>
              </div>
              <div
                v-if="
                  !event?.submissionGuidelines &&
                  (!event?.submissionDates || !event.submissionDates.length)
                "
                class="text-gray-500 italic text-sm mb-4"
              >
                No submission guidelines or important dates are set for this event.
              </div>
            </div>
            <div v-else-if="submissionStep === 2" class="overflow-y-auto flex-1 flex flex-col">
              <!-- Render the saved submission form as before -->
              <form
                ref="submissionFormRef"
                class="flex-1 flex flex-col overflow-y-auto p-6 space-y-6"
              >
                <!-- Submission Category -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Submission Category *
                  </label>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div
                      v-for="category in submissionCategories"
                      :key="category.id"
                      class="relative h-full"
                    >
                      <input
                        :id="`category-${category.id}`"
                        v-model="submissionForm.category"
                        type="radio"
                        :value="category.id"
                        class="sr-only"
                      />
                      <label
                        :for="`category-${category.id}`"
                        class="h-full p-4 border-2 rounded-lg cursor-pointer transition-colors flex flex-col items-center justify-center text-center"
                        :class="[
                          submissionForm.category === category.id
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
                        ]"
                      >
                        <div class="font-medium text-sm">{{ category.label }}</div>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Title -->
                <UFormField label="Title *" name="title">
                  <UInput
                    v-model="submissionForm.title"
                    placeholder="Enter your abstract title"
                    class="w-full"
                  />
                </UFormField>

                <!-- Authors -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Authors *
                  </label>
                  <div class="space-y-2">
                    <div
                      v-for="(author, index) in submissionForm.authors"
                      :key="index"
                      class="flex gap-2"
                    >
                      <UInput
                        v-model="submissionForm.authors[index]"
                        :placeholder="`Author ${index + 1}`"
                        class="flex-1"
                      />
                      <UButton
                        v-if="submissionForm.authors.length > 1"
                        color="error"
                        variant="ghost"
                        icon="i-heroicons-trash"
                        @click="removeAuthor(index)"
                      />
                    </div>
                    <UButton
                      color="neutral"
                      variant="soft"
                      icon="i-heroicons-plus"
                      @click="addAuthor"
                    >
                      Add Author
                    </UButton>
                  </div>
                </div>

                <!-- Corresponding Author -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <UFormField label="Corresponding Author Name *" name="correspondingAuthor.name">
                    <UInput
                      v-model="submissionForm.correspondingAuthor.name"
                      placeholder="Full name"
                      class="w-full"
                    />
                  </UFormField>
                  <UFormField label="Email *" name="correspondingAuthor.email">
                    <UInput
                      v-model="submissionForm.correspondingAuthor.email"
                      type="email"
                      placeholder="email@example.com"
                      class="w-full"
                    />
                  </UFormField>
                </div>

                <!-- Institution -->
                <UFormField
                  label="Institution/Organization *"
                  name="correspondingAuthor.affiliation"
                >
                  <UInput
                    v-model="submissionForm.correspondingAuthor.affiliation"
                    placeholder="Enter your institution or organization"
                    class="w-full"
                  />
                </UFormField>

                <!-- Phone (Optional) -->
                <UFormField label="Phone (Optional)" name="correspondingAuthor.phone">
                  <UInput
                    v-model="submissionForm.correspondingAuthor.phone"
                    placeholder="Phone number"
                    class="w-full"
                  />
                </UFormField>

                <!-- Abstract -->
                <UFormField label="Abstract *" name="abstract">
                  <UTextarea
                    v-model="submissionForm.abstract"
                    :rows="8"
                    placeholder="Enter your abstract here..."
                    class="w-full"
                  />
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Word count:
                    {{
                      submissionForm.abstract
                        ? submissionForm.abstract.split(/\s+/).filter(Boolean).length
                        : 0
                    }}
                  </p>
                </UFormField>

                <!-- Keywords -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Keywords (3-5) *
                  </label>
                  <div class="space-y-2">
                    <div class="flex gap-2">
                      <UInput
                        v-model="keywordsInput"
                        placeholder="Add a keyword and press Enter"
                        class="flex-1"
                        @keydown.enter.prevent="updateKeywords"
                      />
                      <UButton @click="updateKeywords">Add</UButton>
                    </div>
                    <div
                      v-if="submissionForm.keywords.length > 0"
                      class="flex flex-wrap gap-2 mt-2"
                    >
                      <span
                        v-for="(keyword, index) in submissionForm.keywords"
                        :key="index"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                      >
                        {{ keyword }}
                        <button
                          type="button"
                          class="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 dark:hover:bg-blue-800 dark:hover:text-blue-300"
                          @click="removeKeyword(index)"
                        >
                          <span class="sr-only">Remove</span>
                          <svg class="w-2 h-2" fill="currentColor" viewBox="0 0 8 8">
                            <path
                              fill-rule="evenodd"
                              d="M4 3.293l2.146-2.147a.5.5 0 01.708.708L4.707 4l2.147 2.146a.5.5 0 01-.708.708L4 4.707l-2.146 2.147a.5.5 0 01-.708-.708L3.293 4 1.146 1.854a.5.5 0 01.708-.708L4 3.293z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </button>
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Additional Notes -->
                <UFormField label="Additional Notes (Optional)" name="notes">
                  <UTextarea
                    v-model="submissionForm.notes"
                    :rows="4"
                    placeholder="Any additional information or special requirements..."
                    class="w-full"
                  />
                </UFormField>
              </form>
            </div>
            <template #footer>
              <div class="flex justify-between space-x-3">
                <div />
                <div v-if="submissionStep === 1" class="flex gap-3">
                  <UButton color="primary" @click="handleSubmissionContinue">Continue</UButton>
                </div>
                <div v-else-if="submissionStep === 2" class="flex gap-3">
                  <UButton
                    color="neutral"
                    variant="ghost"
                    :disabled="isSubmitting"
                    @click="handleSubmissionBack"
                    >Back</UButton
                  >
                  <UButton
                    type="button"
                    color="primary"
                    :loading="isSubmitting"
                    :disabled="isSubmitting"
                    @click="handleSubmit()"
                    >Submit Abstract</UButton
                  >
                </div>
              </div>
            </template>
          </UCard>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { submissionCategories } from '../../../../types/submissions'
import type { Event as ApiEvent } from '../../../../types/event'

const route = useRoute()
const { getPublicEventBySlug } = useEvents()
const { submitAbstract } = useSubmissions()
const slug = computed(() => route.params.slug as string)

function _slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

// Normalize potentially relative URLs from backend to absolute URLs for <img src>
function normalizeUrl(u?: string | null): string | undefined {
  if (!u) return undefined
  if (/^https?:\/\//i.test(u)) return u
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    return origin && u.startsWith('/') ? `${origin}${u}` : u
  } catch {
    return u
  }
}

// Extend API Event with optional fields used in this page
type ExtendedEvent = ApiEvent & {
  speakers?: Array<{
    id: number
    name: string
    title?: string
    org?: string
    photoUrl?: string
    bio?: string
  }>
  committee?: Array<{
    id: number
    name: string
    role?: string
    email?: string
    phone?: string
  }>
  sponsors?: Array<{
    id: number
    name: string
    logoUrl: string
    website?: string
    tier?: string
  }>
  gallery?: Array<{
    id: number
    url: string
    caption?: string
    type?: 'image' | 'video'
  }>
  bannerUrl?: string
  submissionGuidelines?: string
  submissionDates?: Array<{
    label: string
    date?: string
    startDate?: string
    endDate?: string
  }>
}

// Types for event normalization
type MediaItem = { url?: string; [key: string]: unknown }
type SponsorItem = {
  logoUrl?: string
  logo_url?: string
  website?: string
  website_url?: string
  [key: string]: unknown
}
type SpeakerItem = {
  photoUrl?: string
  photo_url?: string
  [key: string]: unknown
}

// Fetch public single event by slug
const { data: eventResponse, refresh: refreshPublicEvent } = await getPublicEventBySlug(slug.value)

// Normalize server 'media' field to 'gallery' expected by the template
const event = computed<ExtendedEvent | null>(() => {
  const e = eventResponse.value as
    | (ExtendedEvent & {
        media?: MediaItem[]
        banner_url?: string
        logo_url?: string
        photo_url?: string
      })
    | null

  if (!e) return null

  // Normalize arrays with proper type assertions
  const gallery = ((e.gallery ?? e.media ?? []) as MediaItem[]).map(m => ({
    ...m,
    url: m.url ? normalizeUrl(m.url) : m.url,
  }))

  const sponsors = ((e.sponsors ?? []) as SponsorItem[]).map(s => ({
    ...s,
    logoUrl: s.logoUrl || s.logo_url ? normalizeUrl(s.logoUrl || s.logo_url || '') : undefined,
    website: s.website || s.website_url || '',
  }))

  const speakers = ((e.speakers ?? []) as SpeakerItem[]).map(sp => ({
    ...sp,
    photoUrl:
      sp.photoUrl || sp.photo_url ? normalizeUrl(sp.photoUrl || sp.photo_url || '') : undefined,
  }))
  return {
    ...e,
    gallery,
    sponsors,
    speakers,
    bannerUrl: normalizeUrl(e.bannerUrl || e.banner_url) || e.bannerUrl || e.banner_url,
  } as ExtendedEvent
})

// Refresh if slug changes while staying on the same component instance
watch(slug, async () => {
  await refreshPublicEvent()
})

const typeLabel = computed(() =>
  event.value ? event.value.type.charAt(0).toUpperCase() + event.value.type.slice(1) : 'Event'
)

// Whether the event is a conference (used to show sponsors/speakers)
const _isConference = computed(() => (event.value?.type || '').toLowerCase() === 'conference')

const heroImage = computed(() => {
  const banner = normalizeUrl(event.value?.bannerUrl)
  const firstImage = normalizeUrl(
    event.value?.gallery?.find(g => (g.type ?? 'image') !== 'video')?.url
  )
  return banner || firstImage || `https://picsum.photos/seed/${slug.value || 'epison'}/1600/900`
})

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

// Abstract submission functionality
const showSubmissionForm = ref(false)
const submissionStep = ref(1) // 1 = guidelines, 2 = form
watch(showSubmissionForm, v => {
  if (v) submissionStep.value = 1
})

function handleSubmissionContinue() {
  submissionStep.value = 2
}
function handleSubmissionBack() {
  submissionStep.value = 1
}

const isSubmitting = ref(false)

const canSubmitAbstract = computed(() => {
  if (!event.value) return false
  if (!event.value.id) return false
  return !!(event.value.collectsSubmissions && !isPast.value)
})

// Form submission
const submissionFormRef = ref<HTMLFormElement>()
const keywordsInput = ref('')
const formData = reactive<AbstractSubmissionData>({
  title: '',
  abstract: '',
  authors: [''],
  correspondingAuthor: {
    name: '',
    email: '',
    affiliation: '',
    phone: '',
  },
  keywords: [],
  category: 'oral',
  notes: '',
})

// For v-model binding with form fields
const submissionForm = {
  get title() {
    return formData.title
  },
  set title(value: string) {
    formData.title = value
  },
  get abstract() {
    return formData.abstract
  },
  set abstract(value: string) {
    formData.abstract = value
  },
  get authors() {
    return formData.authors
  },
  set authors(value: string[]) {
    formData.authors = value
  },
  get correspondingAuthor() {
    return formData.correspondingAuthor
  },
  set correspondingAuthor(value: {
    name: string
    email: string
    affiliation: string
    phone?: string
  }) {
    formData.correspondingAuthor = value
  },
  get keywords() {
    return formData.keywords
  },
  set keywords(value: string[]) {
    formData.keywords = value
  },
  get category() {
    return formData.category
  },
  set category(value: 'oral' | 'poster' | 'workshop') {
    formData.category = value
  },
  get notes() {
    return formData.notes
  },
  set notes(value: string | undefined) {
    formData.notes = value
  },
}

function addAuthor() {
  formData.authors.push('')
}

// Remove author from the authors list
function removeAuthor(index: number) {
  formData.authors.splice(index, 1)
}

function updateKeywords(e?: Event) {
  e?.preventDefault()
  const input = keywordsInput.value.trim()
  if (input) {
    const newKeywords = input
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0)
    formData.keywords = [...new Set([...formData.keywords, ...newKeywords])]
    keywordsInput.value = ''
  }
}

// Remove keyword from the list
function removeKeyword(index: number) {
  formData.keywords.splice(index, 1)
}

async function handleSubmit(e?: Event) {
  // Prevent default only if event is provided (for form submission)
  if (e) {
    e.preventDefault()
  }

  if (!event.value) {
    console.error('[EventPage] No event data available')
    useToast().add({
      title: 'Error',
      description: 'Event data is not available. Please refresh the page and try again.',
      color: 'error',
    })
    return
  }

  isSubmitting.value = true
  console.log('[EventPage] Starting submission with event ID:', event.value.id)

  try {
    // Prepare submission data directly from the form
    const submissionData = {
      eventId: String(event.value.id),
      title: formData.title.trim(),
      abstract: formData.abstract.trim(),
      authors: formData.authors.filter((a: string) => a.trim()).map((a: string) => a.trim()),
      correspondingAuthor: {
        name: formData.correspondingAuthor.name.trim(),
        email: formData.correspondingAuthor.email.trim(),
        affiliation: formData.correspondingAuthor.affiliation.trim(),
        phone: formData.correspondingAuthor.phone?.trim() || undefined,
      },
      keywords: formData.keywords,
      category: formData.category,
      notes: formData.notes?.trim() || undefined,
    }

    console.log(
      '[EventPage] Calling submitAbstract with data:',
      JSON.stringify(submissionData, null, 2)
    )

    const response = await submitAbstract(submissionData)
    console.log('[EventPage] submitAbstract response:', response)
    useToast().add({
      title: 'Abstract Submitted',
      description: 'Your abstract has been successfully submitted for review.',
      color: 'success',
    })

    // Reset form
    Object.assign(formData, {
      title: '',
      abstract: '',
      authors: [''],
      correspondingAuthor: {
        name: '',
        email: '',
        affiliation: '',
        phone: '',
      },
      keywords: [],
      category: 'oral',
      notes: '',
    })
    keywordsInput.value = ''
    showSubmissionForm.value = false
  } catch (error: unknown) {
    console.error('Submission error:', error)

    // Type guard for server-side validation errors
    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      '_data' in error.response &&
      error.response._data &&
      typeof error.response._data === 'object' &&
      'data' in error.response._data &&
      error.response._data.data &&
      typeof error.response._data.data === 'object' &&
      'errors' in error.response._data.data &&
      error.response._data.data.errors
    ) {
      const { fieldErrors, formErrors } = error.response._data.data.errors as {
        fieldErrors?: Record<string, string[]>
        formErrors?: string[]
      }

      // Show field-specific errors
      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            // Format field name for display (remove path if present)
            const fieldName = field.split('.').pop() || field
            const formattedField = fieldName
              .replace(/([A-Z])/g, ' $1') // Add space before capital letters
              .replace(/^./, str => str.toUpperCase()) // Capitalize first letter

            useToast().add({
              title: 'Validation Error',
              description: `${formattedField}: ${messages[0]}`,
              color: 'error',
              icon: 'i-heroicons-exclamation-triangle',
            })
          }
        })
      }

      // Show form-level errors if any
      if (Array.isArray(formErrors) && formErrors.length > 0) {
        formErrors.forEach((message: string) => {
          useToast().add({
            title: 'Validation Error',
            description: message,
            color: 'error',
            icon: 'i-heroicons-exclamation-triangle',
          })
        })
      }

      return
    }

    // Handle client-side validation errors
    if (error && typeof error === 'object' && 'flatten' in error) {
      const flattened = (
        error as { flatten: () => { fieldErrors: Record<string, string[]>; formErrors: string[] } }
      ).flatten()

      // Show field-specific errors
      Object.entries(flattened.fieldErrors).forEach(([field, messages]) => {
        if (messages && Array.isArray(messages) && messages.length > 0) {
          // Format field name for display
          const formattedField = field
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())

          useToast().add({
            title: 'Validation Error',
            description: `${formattedField}: ${messages[0]}`,
            color: 'error',
            icon: 'i-heroicons-exclamation-triangle',
          })
        }
      })

      // Show form-level errors if any
      flattened.formErrors.forEach((message: string) => {
        useToast().add({
          title: 'Validation Error',
          description: message,
          color: 'error',
          icon: 'i-heroicons-exclamation-triangle',
        })
      })

      return
    }

    // Handle network or other errors
    const errorMessage =
      error?.response?._data?.message ||
      error?.message ||
      'There was an error submitting your abstract. Please try again.'

    useToast().add({
      title: 'Submission Failed',
      description: errorMessage,
      color: 'error',
      icon: 'i-heroicons-exclamation-circle',
    })
  } finally {
    isSubmitting.value = false
  }
}

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
