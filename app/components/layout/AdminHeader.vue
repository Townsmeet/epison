<template>
  <UHeader>
    <template #left>
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-chart-bar" class="w-6 h-6 text-primary" />
        <span class="font-bold">EPISON Admin</span>
      </div>
    </template>

    <template #right>
      <UDropdown :items="userMenuItems" :ui="{ width: 'w-48' }">
        <UButton color="white" trailing-icon="i-heroicons-chevron-down-20-solid">
          <UAvatar
            size="xs"
            src="https://ui-avatars.com/api/?name=Admin+User&background=0ea5e9&color=fff"
            :alt="'Admin User'"
          />
          <span class="hidden md:inline-flex ml-2">Admin User</span>
        </UButton>
      </UDropdown>
    </template>
  </UHeader>
</template>

<script setup lang="ts">
const userMenuItems = [
  [
    {
      label: 'Profile',
      icon: 'i-heroicons-user-circle',
      click: () => console.log('Profile'),
    },
    {
      label: 'Settings',
      icon: 'i-heroicons-cog-6-tooth',
      to: '/admin/settings',
    },
  ],
  [
    {
      label: 'Sign out',
      icon: 'i-heroicons-arrow-left-on-rectangle',
      click: () => navigateTo('/auth/login'),
    },
  ],
]
</script>
