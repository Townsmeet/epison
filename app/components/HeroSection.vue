<template>
  <section
    class="relative flex min-h-[18rem] items-center overflow-hidden bg-[#f8f8f4] py-16 dark:bg-gray-950 md:min-h-[22rem] md:py-20"
  >
    <div class="absolute inset-0 overflow-hidden opacity-30 dark:opacity-10">
      <div
        class="absolute -left-24 -top-32 h-96 w-96 rounded-full bg-teal-200 blur-3xl dark:bg-teal-900"
      />
      <div
        class="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-amber-100 blur-3xl dark:bg-amber-900"
      />
    </div>

    <div class="relative mx-auto w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <p
        class="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-700 dark:text-primary-300"
      >
        Epidemiological Society of Nigeria
      </p>
      <h1
        class="mb-5 text-4xl font-semibold tracking-[-0.04em] text-gray-950 dark:text-white md:text-5xl lg:text-6xl"
      >
        {{ title }}
      </h1>
      <p
        v-if="subtitle"
        class="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-gray-300 md:text-xl"
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
