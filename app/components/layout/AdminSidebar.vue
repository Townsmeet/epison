<template>
  <USidebar>
    <template #header>
      <div class="flex items-center gap-2 px-4 py-3">
        <UIcon name="i-heroicons-chart-bar" class="w-6 h-6 text-primary" />
        <span class="font-bold">EPISON</span>
      </div>
    </template>

    <div class="flex-1 overflow-y-auto">
      <UVerticalNavigation :links="links" />
    </div>

    <template #footer>
      <div class="p-4 pt-0">
        <UButton block color="gray" variant="ghost" icon="i-heroicons-arrow-left" to="/">
          Back to Site
        </UButton>
      </div>
    </template>
  </USidebar>
</template>

<script setup lang="ts">
const links = [
  {
    label: 'Dashboard',
    icon: 'i-heroicons-home',
    to: '/admin',
    exact: true,
  },
  {
    label: 'Conferences',
    icon: 'i-heroicons-calendar-days',
    to: '/admin/conferences',
  },
  {
    label: 'Registrations',
    icon: 'i-heroicons-clipboard-document-list',
    to: '/admin/registrations',
  },
  {
    label: 'Members',
    icon: 'i-heroicons-users',
    to: '/admin/members',
  },
  {
    label: 'Settings',
    icon: 'i-heroicons-cog-6-tooth',
    to: '/admin/settings',
  },
]
</script>
