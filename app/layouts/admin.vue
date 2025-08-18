<template>
  <div class="min-h-screen flex flex-col">
    <LayoutAdminHeader />
    <div class="flex flex-1">
      <LayoutAdminSidebar />
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// This layout will be used for all admin pages
definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
})
</script>
