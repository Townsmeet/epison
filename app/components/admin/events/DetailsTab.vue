<template>
  <UCard>
    <template #header>
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">{{ event.title }}</h1>
          <div class="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <UBadge :color="statusColor(event.status)" size="sm">{{ event.status }}</UBadge>
            <UBadge color="neutral" variant="outline" size="sm">{{ event.type }}</UBadge>
          </div>
        </div>
      </div>
    </template>

    <div class="space-y-4">
      <div
        v-if="imageUrl"
        class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <img
          :src="imageUrl"
          :alt="`${event.title} cover image`"
          class="w-full h-64 object-cover"
          @error="onImgError"
        />
      </div>
      <div class="flex items-center text-gray-600 dark:text-gray-300">
        <UIcon name="i-heroicons-calendar-days" class="w-5 h-5 mr-2" />
        <span>{{ formatDateRange(event.startDate, event.endDate) }}</span>
      </div>
      <div class="flex items-center text-gray-600 dark:text-gray-300">
        <UIcon name="i-heroicons-map-pin" class="w-5 h-5 mr-2" />
        <span>{{ event.location }}</span>
      </div>

      <div class="prose dark:prose-invert max-w-none">
        <h3 class="mt-6">Description</h3>
        <p>{{ event.description }}</p>
      </div>
      <div v-if="event.theme || (event.subthemes && event.subthemes.length)" class="mt-2">
        <div v-if="event.theme" class="mb-1">
          <span class="font-semibold">Theme:</span>
          <span class="inline-block ml-2 py-0.5 px-2 bg-blue-100 text-blue-700 rounded">{{
            event.theme
          }}</span>
        </div>
        <div v-if="event.subthemes && event.subthemes.length">
          <span class="font-semibold">Subthemes:</span>
          <span
            v-for="s in event.subthemes"
            :key="s"
            class="inline-block bg-primary-100 text-primary-700 rounded px-2 py-0.5 mx-1 text-xs"
            >{{ s }}</span
          >
        </div>
      </div>

      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Performance</h3>
        </template>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ event.registrations }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Registered</div>
          </div>
          <div>
            <div class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ event.capacity }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Capacity</div>
          </div>
          <div>
            <div class="text-2xl font-semibold text-gray-900 dark:text-white">
              ₦{{ ((event.revenue ?? 0) / 100 / 1000).toFixed(0) }}k
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Revenue</div>
          </div>
          <div>
            <div class="text-2xl font-semibold text-gray-900 dark:text-white">{{ occupancy }}%</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Occupancy</div>
          </div>
        </div>
      </UCard>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { EventItem } from '../../../composables/useEvents'

const props = defineProps<{ event: EventItem }>()

const imageUrl = computed(() => {
  const e = props.event
  // Prefer the bannerUrl returned from backend when present
  if (e.bannerUrl && e.bannerUrl.trim().length > 0) return e.bannerUrl
  // Fallback to first non-video gallery image
  const galleryImage = e.gallery?.find(g => (g.type ?? 'image') !== 'video')?.url
  if (galleryImage && galleryImage.trim().length > 0) return galleryImage
  // Final fallback placeholder
  return `https://picsum.photos/seed/${slugify(e.title)}/1200/800`
})

const occupancy = computed(() => {
  const cap = Number(props.event.capacity) || 0
  const reg = Number(props.event.registrations) || 0
  if (cap === 0) return 0
  return Math.min(100, Math.round((reg / cap) * 100))
})

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

type StatusColor = 'neutral' | 'success' | 'primary' | 'secondary' | 'info' | 'warning' | 'error'

function statusColor(status: EventItem['status']): StatusColor {
  const colors: Record<string, StatusColor> = {
    draft: 'neutral',
    published: 'primary',
    registration_open: 'success',
    registration_closed: 'warning',
    ongoing: 'secondary',
    completed: 'info',
    cancelled: 'error',
  }
  return colors[status] || 'neutral'
}

function formatDateRange(startDate: string, endDate?: string): string {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : null
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
  if (!end || start.toDateString() === end.toDateString()) {
    return start.toLocaleDateString('en-US', options)
  }
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`
}

function onImgError(e: Event) {
  const el = e.target as HTMLImageElement | null
  if (!el) return
  let idx = parseInt(el.dataset?.fallbackIdx ?? '0', 10)
  if (Number.isNaN(idx) || idx < 0) idx = 0
  const fallbacks: string[] = [
    'https://picsum.photos/seed/episonadmin1/1200/800',
    'https://picsum.photos/seed/episonadmin2/1200/800',
    'https://placehold.co/1200x800/png',
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
</script>
