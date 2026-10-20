<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <!-- Modern Sticky Header -->
    <header
      class="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 transition-all duration-300 hover:shadow-sm"
    >
      <div class="relative">
        <!-- Announcement Bar -->
        <!-- <div
          class="bg-gradient-to-r from-info-600 to-info-700 text-white text-sm text-center py-1.5 px-4"
        >
          <p class="animate-pulse">🎉 Join us at our upcoming conference on June 4-6, 2026</p>
        </div> -->

        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex h-[4.5rem] items-center justify-between">
            <!-- Logo -->
            <NuxtLink to="/" class="group flex items-center space-x-2.5">
              <div class="relative">
                <img
                  src="/logo.png"
                  alt="EPISON Logo"
                  class="h-9 w-auto transition-transform duration-300 group-hover:scale-105"
                />
                <div
                  class="absolute -inset-2 bg-primary-100 dark:bg-primary-900/30 rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
              <div class="flex flex-col">
                <span class="text-xl font-bold tracking-tight text-gray-950 dark:text-white"
                  >EPISON</span
                >
                <span
                  class="-mt-0.5 text-[10px] font-medium tracking-wide text-gray-500 dark:text-gray-400"
                  >Epidemiological Society of Nigeria</span
                >
              </div>
            </NuxtLink>

            <!-- Desktop Navigation -->
            <nav class="hidden md:flex items-center gap-0.5">
              <NuxtLink
                v-for="link in navLinks"
                :key="link.to"
                :to="link.to"
                :target="link.target || undefined"
                class="group relative rounded-full px-3 py-2 text-[13px] font-medium transition-colors duration-200"
                :class="{
                  'text-primary-600 dark:text-primary-400': isActive(link.to),
                  'text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400':
                    !isActive(link.to),
                }"
              >
                {{ link.label }}
                <span
                  v-if="isActive(link.to)"
                  class="absolute bottom-1 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-primary-600 dark:bg-primary-400"
                />
                <span
                  v-else
                  class="absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-primary-600 transition-all duration-200 group-hover:w-5 dark:bg-primary-400"
                />
              </NuxtLink>

              <UButton
                to="/membership"
                color="primary"
                variant="solid"
                class="ml-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                Join Us
                <UIcon
                  name="i-heroicons-arrow-right"
                  class="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                />
              </UButton>
            </nav>

            <!-- Right Side Controls -->
            <div class="flex items-center space-x-3">
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

              <UButton
                v-if="!isAdminRoute"
                to="/admin"
                color="neutral"
                variant="ghost"
                icon="i-heroicons-cog-6-tooth"
                aria-label="Admin"
                class="hidden sm:flex h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              />

              <!-- Mobile buttons -->
              <div class="flex items-center md:hidden">
                <UButton
                  to="/membership"
                  color="primary"
                  variant="solid"
                  class="rounded-full text-sm font-semibold"
                >
                  Join Us
                </UButton>
                <UButton
                  color="neutral"
                  variant="ghost"
                  :icon="isMobileMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
                  :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
                  class="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  @click="isMobileMenuOpen = !isMobileMenuOpen"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile menu -->
        <div
          v-if="isMobileMenuOpen"
          class="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-xl transition-all duration-300 overflow-hidden"
          :class="isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'"
        >
          <div class="px-4 py-3 space-y-1">
            <NuxtLink
              v-for="link in navLinks"
              :key="`mobile-${link.to}`"
              :to="link.to"
              :target="link.target || undefined"
              class="flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors"
              :class="[
                isActive(link.to)
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/50',
              ]"
              @click="isMobileMenuOpen = false"
            >
              {{ link.label }}
              <UIcon
                v-if="isActive(link.to)"
                name="i-heroicons-chevron-right"
                class="ml-auto h-4 w-4"
              />
            </NuxtLink>

            <div class="pt-2 border-t border-gray-200 dark:border-gray-800 mt-2">
              <UButton
                to="/membership"
                color="primary"
                variant="solid"
                class="mt-2 w-full justify-center rounded-full py-3 text-base font-semibold"
                @click="isMobileMenuOpen = false"
              >
                Join EPISON
              </UButton>

              <UButton
                v-if="!isAdminRoute"
                to="/admin"
                color="neutral"
                variant="ghost"
                icon="i-heroicons-cog-6-tooth"
                class="w-full justify-start mt-2"
                @click="isMobileMenuOpen = false"
              >
                Admin Dashboard
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Modern Footer -->
    <footer
      class="relative overflow-hidden border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950"
    >
      <!-- Decorative elements -->
      <div
        class="absolute -right-20 -top-20 w-96 h-96 bg-primary-100/20 dark:bg-primary-900/10 rounded-full -z-10"
      />
      <div
        class="absolute -left-20 -bottom-20 w-96 h-96 bg-primary-100/20 dark:bg-primary-900/10 rounded-full -z-10"
      />

      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <!-- Brand Column -->
          <div class="lg:col-span-4">
            <div class="flex flex-col space-y-4">
              <div class="flex items-center space-x-3">
                <img src="/logo.png" alt="EPISON Logo" class="h-10 w-auto" />
                <span class="text-xl font-bold tracking-tight text-gray-950 dark:text-white"
                  >EPISON</span
                >
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                The Epidemiological Society of Nigeria (EPISON) is dedicated to advancing
                epidemiological research, practice, and education to improve public health outcomes
                across Nigeria.
              </p>
              <div class="flex items-center space-x-3 pt-2">
                <UButton
                  v-for="link in socialLinks"
                  :key="link.label"
                  :icon="link.icon"
                  :to="link.to"
                  color="neutral"
                  variant="ghost"
                  :aria-label="link.label"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="h-9 w-9 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                />
              </div>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="lg:col-span-2 lg:col-start-6">
            <h3
              class="relative mb-5 inline-block text-xs font-semibold uppercase tracking-[0.14em] text-gray-900 dark:text-white"
            >
              Quick Links
              <span
                class="absolute -bottom-2 left-0 h-0.5 w-8 rounded-full bg-primary-600 dark:bg-primary-400"
              />
            </h3>
            <ul class="space-y-3">
              <li v-for="link in footerLinks.quickLinks" :key="link.to">
                <NuxtLink
                  :to="link.to"
                  :target="link.target || undefined"
                  class="flex items-center text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors group"
                >
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Resources -->
          <div class="lg:col-span-2">
            <h3
              class="relative mb-5 inline-block text-xs font-semibold uppercase tracking-[0.14em] text-gray-900 dark:text-white"
            >
              Legal
              <span
                class="absolute -bottom-2 left-0 h-0.5 w-8 rounded-full bg-primary-600 dark:bg-primary-400"
              />
            </h3>
            <ul class="space-y-3">
              <li v-for="link in footerLinks.resources" :key="link.to">
                <NuxtLink
                  :to="link.to"
                  :target="link.target || undefined"
                  class="flex items-center text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors group"
                >
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Contact -->
          <div class="lg:col-span-3">
            <h3
              class="relative mb-5 inline-block text-xs font-semibold uppercase tracking-[0.14em] text-gray-900 dark:text-white"
            >
              Get In Touch
              <span
                class="absolute -bottom-2 left-0 h-0.5 w-8 rounded-full bg-primary-600 dark:bg-primary-400"
              />
            </h3>
            <address class="space-y-4 not-italic">
              <div class="flex items-start">
                <div class="flex-shrink-0 h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5">
                  <UIcon name="i-heroicons-map-pin" class="h-5 w-5" />
                </div>
                <p class="ml-3 text-sm text-gray-600 dark:text-gray-300">
                  Department of Community Medicine,<br />
                  Univeristy of Abuja Teaching Hospital,<br />
                  Abuja, Nigeria.
                </p>
              </div>
              <div class="flex items-center">
                <UIcon
                  name="i-heroicons-envelope"
                  class="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0"
                />
                <a
                  href="mailto:info@epison.org.ng"
                  class="ml-3 text-sm text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors"
                >
                  episonnigeria@gmail.com
                </a>
              </div>
            </address>
          </div>
        </div>

        <!-- Copyright -->
        <div
          class="mt-16 pt-8 border-t border-gray-200/50 dark:border-gray-800/50 flex flex-col md:flex-row justify-between items-center"
        >
          <p class="text-sm text-gray-500 dark:text-gray-500 text-center md:text-left">
            &copy; {{ new Date().getFullYear() }} Epidemiological Society of Nigeria. All rights
            reserved.
          </p>
          <div class="mt-4 md:mt-0 flex items-center space-x-6">
            <NuxtLink
              to="/privacy"
              class="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-500 dark:hover:text-primary-400 transition-colors"
            >
              Privacy Policy
            </NuxtLink>
            <span class="text-gray-300 dark:text-gray-700">•</span>
            <NuxtLink
              to="/terms"
              class="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-500 dark:hover:text-primary-400 transition-colors"
            >
              Terms of Service
            </NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const colorMode = useColorMode()
const isMobileMenuOpen = ref(false)

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(_isDark: boolean) {
    colorMode.preference = _isDark ? 'dark' : 'light'
  },
})

type NavLink = { label: string; to: string; target?: string }
const navLinks: NavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Events', to: '/events' },
  { label: 'Membership', to: '/membership' },
  { label: 'Blog', to: '/blog' },
  { label: 'Journal', to: 'https://jeson.org.ng/index.php/jeson', target: '_blank' },
  { label: 'Contact', to: '/contact' },
]

const socialLinks = [
  {
    label: 'Twitter',
    icon: 'i-heroicons-at-symbol',
    to: 'https://x.com/EPiSONNigeria',
  },
  {
    label: 'LinkedIn',
    icon: 'i-heroicons-building-office',
    to: 'https://www.linkedin.com/groups/12585259/',
  },
  {
    label: 'Instagram',
    icon: 'i-heroicons-play',
    to: 'https://www.instagram.com/episonnigeria/',
  },
]

type FooterLink = { label: string; to: string; target?: string }
const footerLinks: { quickLinks: FooterLink[]; resources: FooterLink[] } = {
  quickLinks: [
    { label: 'About Us', to: '/about' },
    { label: 'Events', to: '/events' },
    { label: 'Membership', to: '/membership' },
    { label: 'Blog', to: '/blog' },
    { label: 'Journal', to: 'https://jeson.org.ng/index.php/jeson', target: '_blank' },
  ],
  resources: [
    { label: 'Terms', to: '/terms' },
    { label: 'Privacy', to: '/privacy' },
  ],
}

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(`${path}/`)
}

const isAdminRoute = computed(() => route.path.startsWith('/admin'))

// Close mobile menu when route changes
watch(
  () => route.path,
  () => {
    isMobileMenuOpen.value = false
  }
)
</script>

<style scoped>
.router-link-active {
  color: var(--color-primary-600);
}

.dark .router-link-active {
  color: var(--color-primary-400);
}
</style>
