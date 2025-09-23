<template>
  <div class="space-y-8">
    <!-- Stepper -->
    <div ref="stepperRef" class="overflow-x-auto no-scrollbar">
      <div class="min-w-max inline-flex items-center gap-4">
        <template v-for="(s, i) in steps" :key="s.key">
          <div class="inline-flex items-center gap-4 shrink-0">
            <div
              :ref="el => el && (stepEls[i] = el as HTMLElement)"
              class="inline-flex items-center gap-3 group shrink-0 cursor-pointer"
              @click="goToStep(i + 1)"
            >
              <span
                :class="[
                  'h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold',
                  currentStep === i + 1
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
                ]"
              >
                {{ i + 1 }}
              </span>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ s.label }}
              </span>
            </div>
            <div v-if="i < steps.length - 1" class="h-0.5 w-10 bg-gray-200 dark:bg-gray-700" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  steps: Array<{ key: string; label: string }>
  currentStep: number
}

interface Emits {
  (e: 'goToStep', step: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Stepper auto-scroll to keep active step visible on mobile
const stepperRef = ref<HTMLElement | null>(null)
const stepEls = ref<HTMLElement[]>([])

async function scrollActiveStepIntoView() {
  await nextTick()
  const idx = props.currentStep - 1
  const el = stepEls.value[idx]
  const container = stepperRef.value
  if (el && container) {
    el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }
}

function goToStep(n: number) {
  emit('goToStep', n)
}

// Watch for currentStep changes to scroll
watch(
  () => props.currentStep,
  () => {
    scrollActiveStepIntoView()
  }
)

onMounted(() => {
  scrollActiveStepIntoView()
})
</script>

<style scoped>
/* Hide scrollbar but keep scroll functionality */
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.no-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
</style>
