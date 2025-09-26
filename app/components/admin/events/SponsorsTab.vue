<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <h3 class="text-lg font-semibold">Sponsors</h3>
          <UIcon
            v-if="isSyncing"
            name="i-heroicons-arrow-path"
            class="w-4 h-4 animate-spin text-gray-400"
          />
        </div>
        <UBadge v-if="sponsors.length" color="neutral" variant="subtle">
          {{ sponsors.length }} total
        </UBadge>
      </div>
    </template>

    <div class="space-y-6">
      <!-- Loading State -->
      <div v-if="sponsorsLoading" class="flex justify-center py-8">
        <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin" />
      </div>

      <div v-else-if="sponsors.length" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="s in sponsors"
          :key="s.id"
          class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <img :src="s.logoUrl" :alt="s.name" class="w-16 h-10 object-contain bg-white rounded" />
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <p class="font-medium truncate">{{ s.name }}</p>
              <UBadge v-if="s.tier" size="xs" color="primary" variant="subtle">{{ s.tier }}</UBadge>
            </div>
            <p v-if="s.website" class="text-xs text-primary-600 dark:text-primary-400 truncate">
              {{ s.website }}
            </p>
          </div>
          <div class="flex-1" />
          <UButton
            size="xs"
            color="error"
            variant="ghost"
            icon="i-heroicons-trash"
            @click="removeSponsor(s.id)"
          />
        </div>
      </div>

      <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 class="text-sm font-semibold mb-3">Add Sponsor</h4>
        <div class="grid md:grid-cols-2 gap-3">
          <UInput v-model="newSponsor.name" placeholder="Sponsor name" />
          <USelect
            v-model="newSponsor.tier"
            :items="sponsorTierOptions"
            placeholder="Tier (optional)"
          />
          <div class="md:col-span-2">
            <label class="text-xs text-gray-600 dark:text-gray-300 mb-1 block"
              >Logo (upload image)</label
            >
            <input
              type="file"
              accept="image/*"
              class="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 dark:file:bg-gray-700 dark:file:text-gray-200"
              @change="onLogoSelected"
            />
            <div v-if="logoPreview" class="mt-2">
              <img
                :src="logoPreview"
                alt="Logo preview"
                class="h-12 object-contain bg-white rounded border border-gray-200 dark:border-gray-700 p-2"
              />
            </div>
          </div>
          <UInput v-model="newSponsor.website" placeholder="Website (optional)" />
        </div>
        <div class="mt-3 flex justify-end">
          <UButton
            :disabled="!newSponsor.name || !logoFile"
            :loading="isCreating"
            icon="i-heroicons-plus"
            @click="addSponsor"
          >
            Add Sponsor
          </UButton>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { EventItem } from '../../../composables/useEvents'
import type { EventSponsor } from '../../../../types/event'

const props = defineProps<{ event: EventItem }>()

const emit = defineEmits<{
  'update:event': [event: EventItem]
  'sponsor-added': [sponsor: EventSponsor]
  'sponsor-removed': [id: string]
}>()

// Use the events API composable
const { getEventSponsors, createEventSponsor, deleteEventSponsor, refreshEventSponsors } =
  useEvents()

// Fetch sponsors data from API
const { data: sponsorsResponse, pending: sponsorsLoading } = await getEventSponsors(props.event.id)
const isSyncing = ref(false)
const sponsors = computed(() => sponsorsResponse.value?.data || [])

const sponsorTierOptions = [
  { label: 'Platinum', value: 'platinum' },
  { label: 'Gold', value: 'gold' },
  { label: 'Silver', value: 'silver' },
  { label: 'Bronze', value: 'bronze' },
  { label: 'Partner', value: 'partner' },
]

const newSponsor = reactive<{ name: string; tier?: string; website?: string }>({
  name: '',
  tier: undefined,
  website: '',
})

const logoFile = ref<File | null>(null)
const logoPreview = ref<string | null>(null)

function onLogoSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) {
    logoFile.value = null
    logoPreview.value = null
    return
  }
  logoFile.value = file
  const url = URL.createObjectURL(file)
  logoPreview.value = url
}

const isCreating = ref(false)

function _slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

async function addSponsor() {
  if (!logoFile.value || isCreating.value) return

  isCreating.value = true
  try {
    // Upload logo to S3 via uploads endpoint
    const file = logoFile.value
    const ext = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : ''
    const base = props.event.slug || _slugify(props.event.title)
    const key = `sponsor-${base}-${Date.now()}${ext}`
    const form = new FormData()
    form.append('file', file)
    form.append('folder', 'events/sponsors')
    form.append('key', key)

    let uploadedUrl = ''
    try {
      const uploadResp = await $fetch<{ url: string }>(`/api/uploads`, {
        method: 'POST',
        body: form,
        credentials: 'include',
      })
      uploadedUrl = uploadResp.url
    } catch (err) {
      console.error('Sponsor logo upload failed:', err)
      useToast().add({
        title: 'Upload failed',
        description: 'Could not upload sponsor logo. Please try again.',
        color: 'error',
      })
      throw err
    }

    const sponsorData = {
      name: newSponsor.name.trim(),
      tier: newSponsor.tier,
      logoUrl: uploadedUrl,
      website: newSponsor.website?.trim() || undefined,
    }

    if (!sponsorData.name || !sponsorData.logoUrl) return

    // Create sponsor via API
    const createdSponsor = await createEventSponsor(props.event.id, sponsorData)

    // Optimistically update local list
    if (sponsorsResponse.value) {
      const current = Array.isArray(sponsorsResponse.value.data) ? sponsorsResponse.value.data : []
      sponsorsResponse.value.data = [createdSponsor as unknown as EventSponsor, ...current]
    }

    // Refresh sponsors data from API (ensure consistency)
    isSyncing.value = true
    await refreshEventSponsors(props.event.id)
    // Additionally force Nuxt to refresh this key in case cookie-based trigger isn't immediate
    if (typeof refreshNuxtData === 'function') {
      await refreshNuxtData(`event-sponsors-${props.event.id}`)
    }
    isSyncing.value = false

    // Emit events
    emit('sponsor-added', createdSponsor)

    // Reset form
    Object.assign(newSponsor, { name: '', tier: undefined, website: '' })
    logoFile.value = null
    logoPreview.value = null

    useToast().add({ title: 'Sponsor added', color: 'success' })
  } catch (error) {
    console.error('Error adding sponsor:', error)
    useToast().add({ title: 'Error adding sponsor', color: 'error' })
  } finally {
    isCreating.value = false
  }
}

async function removeSponsor(id: string) {
  try {
    await deleteEventSponsor(props.event.id, id)
    // Optimistically remove from local list
    if (sponsorsResponse.value && Array.isArray(sponsorsResponse.value.data)) {
      sponsorsResponse.value.data = sponsorsResponse.value.data.filter(
        s => String(s.id) !== String(id)
      )
    }
    isSyncing.value = true
    await refreshEventSponsors(props.event.id)
    // Additionally force Nuxt to refresh this key in case cookie-based trigger isn't immediate
    if (typeof refreshNuxtData === 'function') {
      await refreshNuxtData(`event-sponsors-${props.event.id}`)
    }
    isSyncing.value = false
    emit('sponsor-removed', id)
    useToast().add({ title: 'Sponsor removed', color: 'success' })
  } catch (error) {
    console.error('Error removing sponsor:', error)
    useToast().add({ title: 'Error removing sponsor', color: 'error' })
  }
}
</script>
