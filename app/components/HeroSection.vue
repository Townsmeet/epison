<template>
  <section class="relative overflow-hidden pt-10 pb-16 min-h-[20vh] flex items-center">
    <!-- Background Elements -->
    <div class="absolute inset-0">
      <div
        class="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-br from-teal-400/20 to-cyan-500/20 rounded-full blur-3xl"
      />
      <div
        class="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-amber-400/15 to-orange-500/15 rounded-full blur-3xl"
      />
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
        <span
          class="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent"
        >
          {{ title }}
        </span>
      </h1>
      <p
        v-if="subtitle"
        class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
      >
        {{ subtitle }}
      </p>
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
}
const { title, subtitle } = defineProps<Props>()
</script>
