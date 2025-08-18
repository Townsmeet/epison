<template>
  <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
    <div class="p-5">
      <div class="flex items-center">
        <div class="flex-shrink-0 rounded-md p-3" :class="`bg-${color}-100 dark:bg-${color}-900`">
          <UIcon :name="icon" class="h-6 w-6" :class="`text-${color}-600 dark:text-${color}-300`" />
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
              {{ title }}
            </dt>
            <dd>
              <div class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ value }}
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
    <div v-if="change !== undefined" class="bg-gray-50 dark:bg-gray-700 px-5 py-3">
      <div class="text-sm">
        <span
          :class="
            change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          "
          class="font-semibold"
        >
          {{ change >= 0 ? '+' : '' }}{{ change }}%
        </span>
        <span class="text-gray-500 dark:text-gray-400 ml-2"> vs last period </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed as _computed } from 'vue'

const _props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  change: {
    type: Number,
    default: undefined,
  },
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'blue',
    validator: (value: string) => {
      return ['blue', 'green', 'red', 'yellow', 'purple', 'pink', 'indigo'].includes(value)
    },
  },
})
</script>
