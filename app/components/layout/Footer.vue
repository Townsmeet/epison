<template>
  <UFooter>
    <template #left>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        © {{ new Date().getFullYear() }} Epidemiological Society of Nigeria. All rights reserved.
      </p>
    </template>

    <template #right>
      <div class="flex items-center gap-4">
        <UButton
          v-for="link in socialLinks"
          :key="link.label"
          :icon="link.icon"
          :to="link.to"
          color="neutral"
          variant="ghost"
          :aria-label="link.label"
        />
      </div>
    </template>
  </UFooter>
</template>

<script setup lang="ts">
const socialLinks = [
  {
    label: 'Twitter',
    icon: 'i-heroicons-at-symbol',
    to: 'https://twitter.com/EPISONigeria',
  },
  {
    label: 'Facebook',
    icon: 'i-heroicons-globe-alt',
    to: 'https://facebook.com/EPISONigeria',
  },
  {
    label: 'LinkedIn',
    icon: 'i-heroicons-building-office',
    to: 'https://linkedin.com/company/EPISONigeria',
  },
]
</script>
