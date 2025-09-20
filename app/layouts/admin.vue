<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Mobile sidebar overlay -->
    <div v-if="sidebarOpen" class="fixed inset-0 z-40 lg:hidden">
      <div class="fixed inset-0 bg-gray-600 bg-opacity-75" @click="sidebarOpen = false" />
    </div>

    <!-- Sidebar -->
    <div
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-center space-x-3">
            <div
              class="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center"
            >
              <span class="text-white font-bold text-sm">E</span>
            </div>
            <div>
              <h1 class="text-lg font-semibold text-gray-900 dark:text-white">EPISON</h1>
              <p class="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
            </div>
          </div>
          <button class="lg:hidden text-gray-400 hover:text-gray-600" @click="sidebarOpen = false">
            <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <NuxtLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.to"
            :class="[
              'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              $route.path === item.to
                ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
            ]"
          >
            <UIcon :name="item.icon" class="w-5 h-5 mr-3" />
            {{ item.name }}
            <UBadge
              v-if="item.badge"
              :color="item.badgeColor || 'neutral'"
              size="xs"
              class="ml-auto"
            >
              {{ item.badge }}
            </UBadge>
          </NuxtLink>
        </nav>

        <!-- User menu -->
        <div class="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
          <UDropdownMenu :items="userMenuItems" :popper="{ placement: 'top-start' }">
            <div
              class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
            >
              <div
                class="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mr-3"
              >
                <span class="text-white font-semibold text-xs">A</span>
              </div>
              <div class="flex-1">
                <p class="font-medium">Admin User</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">admin@epison.org.ng</p>
              </div>
              <UIcon name="i-heroicons-chevron-up" class="w-4 h-4" />
            </div>
          </UDropdownMenu>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="lg:pl-64">
      <!-- Top bar -->
      <div
        class="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button class="lg:hidden text-gray-400 hover:text-gray-600" @click="sidebarOpen = true">
              <UIcon name="i-heroicons-bars-3" class="w-6 h-6" />
            </button>
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ pageTitle }}</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ pageDescription }}</p>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <UButton variant="ghost" color="neutral" size="sm" icon="i-heroicons-bell">
              <UBadge color="error" size="xs" class="absolute -top-1 -right-1">3</UBadge>
            </UButton>

            <!-- Color mode switcher -->
            <ClientOnly v-if="!colorMode?.forced">
              <UButton
                :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
                color="neutral"
                variant="ghost"
                :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
                class="hidden sm:flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                @click="isDark = !isDark"
              />
              <template #fallback>
                <div class="size-10" />
              </template>
            </ClientOnly>
          </div>
        </div>
      </div>

      <!-- Page content -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const sidebarOpen = ref(false)
// Auth composable
const { logout } = useAuth()

const navigation = [
  { name: 'Dashboard', to: '/admin', icon: 'i-heroicons-home' },
  {
    name: 'Memberships',
    to: '/admin/memberships',
    icon: 'i-heroicons-user-group',
    badge: '45',
    badgeColor: 'warning' as const,
  },
  { name: 'Events', to: '/admin/events', icon: 'i-heroicons-calendar-days' },
  {
    name: 'Registrations',
    to: '/admin/registrations',
    icon: 'i-heroicons-clipboard-document-list',
    badge: '12',
    badgeColor: 'success' as const,
  },
  { name: 'Analytics', to: '/admin/analytics', icon: 'i-heroicons-chart-bar' },
  // Settings temporarily hidden until page is defined
]

const userMenuItems = [
  [
    { label: 'Profile', icon: 'i-heroicons-user', to: '/admin/profile' },
    { label: 'Settings', icon: 'i-heroicons-cog-6-tooth', to: '/admin/settings' },
  ],
  [
    {
      label: 'Sign out',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      onSelect: async () => {
        await logout()
      },
    },
  ],
]

const pageTitle = computed(() => {
  const route = useRoute()
  // Use parent title for nested admin sections
  if (route.path.startsWith('/admin/events')) return 'Events'
  const pathSegments = route.path.split('/').filter(Boolean)
  if (pathSegments.length <= 1) return 'Dashboard'
  const lastSegment = pathSegments[pathSegments.length - 1]
  return lastSegment ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1) : 'Dashboard'
})

const pageDescription = computed(() => {
  const route = useRoute()
  const descriptions: Record<string, string> = {
    '/admin': 'Overview of your EPISON administration',
    '/admin/memberships': 'Handle membership applications and renewals',
    '/admin/events': 'Create and manage events and conferences',
    '/admin/registrations': 'View and manage event registrations',
    '/admin/analytics': 'View detailed analytics and reports',
  }
  if (route.path.startsWith('/admin/events')) return descriptions['/admin/events']
  return descriptions[route.path] || 'Admin panel'
})

// Auto-close sidebar on route change (mobile)
watch(
  () => useRoute().path,
  () => {
    sidebarOpen.value = false
  }
)

// Color mode (same implementation as default layout)
const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(_isDark: boolean) {
    colorMode.preference = _isDark ? 'dark' : 'light'
  },
})
</script>
