<template>
  <div class="p-8 space-y-4">
    <h1 class="text-2xl font-bold">Color Alias Test</h1>

    <!-- Test semantic color utilities -->
    <div class="space-y-2">
      <h2 class="text-lg font-semibold">Tailwind Utilities Test</h2>
      <div class="p-3 text-white bg-primary-600">bg-primary-600 (should be teal-600)</div>
      <div class="p-3 text-white bg-secondary-600">bg-secondary-600 (should be cyan-600)</div>
      <div class="p-3 text-white bg-info-600">bg-info-600 (should be amber-600)</div>
      <div class="p-3 text-white bg-neutral-800">bg-neutral-800 (should be zinc-800)</div>
    </div>

    <!-- Test Nuxt UI components -->
    <div class="space-y-2">
      <h2 class="text-lg font-semibold">Nuxt UI Components Test</h2>
      <UButton color="primary">Primary Button (teal)</UButton>
      <UButton color="secondary">Secondary Button (cyan)</UButton>
      <UButton color="info">Info Button (amber)</UButton>
      <UButton color="neutral">Neutral Button (zinc)</UButton>
    </div>

    <!-- Runtime config check -->
    <div class="space-y-2">
      <h2 class="text-lg font-semibold">Runtime Config</h2>
      <pre class="bg-gray-100 p-3 text-sm">{{ JSON.stringify(appConfig.ui?.colors, null, 2) }}</pre>
    </div>

    <!-- Direct palette test -->
    <div class="space-y-2">
      <h2 class="text-lg font-semibold">Direct Palette Test</h2>
      <div class="p-3 text-white bg-teal-600">bg-teal-600 (direct teal)</div>
      <div class="p-3 text-white bg-cyan-600">bg-cyan-600 (direct cyan)</div>
      <div class="p-3 text-white bg-amber-600">bg-amber-600 (direct amber)</div>
      <div class="p-3 text-white bg-zinc-800">bg-zinc-800 (direct zinc)</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const appConfig = useAppConfig()
console.log('App config ui.colors:', appConfig.ui?.colors)
</script>
