<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Sponsors</h3>
        <UBadge v-if="event.sponsors?.length" color="neutral" variant="subtle">
          {{ event.sponsors.length }} total
        </UBadge>
      </div>
    </template>

    <div class="space-y-6">
      <div
        v-if="event.sponsors && event.sponsors.length"
        class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div
          v-for="s in event.sponsors"
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

const props = defineProps<{ event: EventItem }>()
type Sponsor = {
  id: number
  name: string
  tier?: string
  logoUrl: string
  website?: string
}

const emit = defineEmits<{
  'update:event': [event: EventItem]
  'sponsor-added': [sponsor: Sponsor]
  'sponsor-removed': [id: number]
}>()

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

function addSponsor() {
  if (!logoFile.value) return
  const objectUrl = logoPreview.value || ''
  const sponsor = {
    id: Date.now(),
    name: newSponsor.name.trim(),
    tier: newSponsor.tier,
    logoUrl: objectUrl,
    website: newSponsor.website?.trim() || undefined,
  }

  if (!sponsor.name || !sponsor.logoUrl) return

  // Emit events
  emit('sponsor-added', sponsor)
  emit('update:event', {
    ...props.event,
    sponsors: [...(props.event.sponsors || []), sponsor],
  })

  // Reset form
  Object.assign(newSponsor, { name: '', tier: undefined, website: '' })
  logoFile.value = null
  logoPreview.value = null
  useToast().add({ title: 'Sponsor added', color: 'success' })
}

function removeSponsor(id: number) {
  if (!props.event.sponsors) return

  // Emit events
  const updatedSponsors = props.event.sponsors.filter(s => s.id !== id)
  emit('sponsor-removed', id)
  emit('update:event', {
    ...props.event,
    sponsors: updatedSponsors,
  })
  useToast().add({ title: 'Sponsor removed', color: 'neutral' })
}
</script>
