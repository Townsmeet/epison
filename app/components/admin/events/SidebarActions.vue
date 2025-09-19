<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold">Actions</h3>
    </template>
    <div class="space-y-3">
      <UButton block color="primary" icon="i-heroicons-share" variant="soft" @click="emit('share')"
        >Share</UButton
      >
      <UButton
        block
        color="neutral"
        icon="i-heroicons-document-duplicate"
        variant="soft"
        @click="emit('duplicate')"
      >
        Duplicate
      </UButton>
      <UButton
        block
        color="neutral"
        icon="i-heroicons-arrow-down-tray"
        variant="soft"
        @click="emit('export')"
      >
        Export
      </UButton>
      <UButton
        block
        color="warning"
        icon="i-heroicons-x-circle"
        variant="soft"
        @click="emit('cancel')"
      >
        Cancel
      </UButton>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { EventItem } from '../../../composables/useEvents'
defineProps<{ event: EventItem }>()
const emit = defineEmits<{
  (e: 'share' | 'duplicate' | 'export' | 'cancel'): void
}>()
</script>
