<template>
  <UHeader :links="links">
    <template #logo>
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-chart-bar" class="w-8 h-8 text-primary" />
        <span class="font-bold text-xl">EPISON</span>
      </div>
    </template>

    <template #right>
      <UButton
        v-if="!isAdminRoute"
        to="/admin"
        color="neutral"
        variant="ghost"
        icon="i-heroicons-cog-6-tooth"
        aria-label="Admin"
      />
      <UColorModeButton />
    </template>
  </UHeader>
</template>

<script setup lang="ts">
const route = useRoute()

const links = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Events', to: '/events' },
  { label: 'Membership', to: '/membership' },
  { label: 'Contact', to: '/contact' },
]

const isAdminRoute = computed(() => route.path.startsWith('/admin'))
</script>
