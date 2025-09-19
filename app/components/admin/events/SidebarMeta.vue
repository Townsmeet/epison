<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold">Meta</h3>
    </template>
    <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-2">
      <li><span class="font-medium">ID:</span> {{ event.id }}</li>
      <li><span class="font-medium">Type:</span> {{ event.type }}</li>
      <li><span class="font-medium">Status:</span> {{ event.status }}</li>
      <li><span class="font-medium">Public:</span> Yes</li>
      <li v-if="event.sponsors">
        <span class="font-medium">Sponsors:</span> {{ event.sponsors.length }}
      </li>
      <li v-if="event.gallery">
        <span class="font-medium">Gallery items:</span> {{ event.gallery.length }}
      </li>
    </ul>
  </UCard>
</template>

<script setup lang="ts">
import type { EventItem } from '../../../composables/useEvents'

defineProps<{ event: EventItem }>()
</script>
