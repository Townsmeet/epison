<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-teal-900/20"
  >
    <!-- Hero Section (Reusable) -->
    <HeroSection
      title="Knowledge Hub"
      subtitle="Expert insights, guidelines, training materials, and resources for epidemiology professionals and public health practitioners."
    />

    <!-- Filters Section -->
    <section class="py-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <!-- Search -->
          <div class="flex-1 max-w-md">
            <div class="relative">
              <UIcon
                name="i-heroicons-magnifying-glass"
                class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              />
              <UInput
                v-model="searchQuery"
                placeholder="Search articles and resources..."
                class="pl-10"
              />
            </div>
          </div>

          <!-- Tag Filters -->
          <div class="flex flex-wrap gap-2">
            <UButton
              :variant="selectedTag === null ? 'solid' : 'soft'"
              :color="selectedTag === null ? 'primary' : 'neutral'"
              size="sm"
              @click="selectedTag = null"
            >
              All
            </UButton>
            <UButton
              v-for="tag in availableTags"
              :key="tag.id"
              :variant="selectedTag === tag.id ? 'solid' : 'soft'"
              :color="selectedTag === tag.id ? 'primary' : 'neutral'"
              size="sm"
              @click="selectedTag = selectedTag === tag.id ? null : tag.id"
            >
              {{ tag.label }}
              <UBadge v-if="tag.count" color="neutral" size="xs" class="ml-1">
                {{ tag.count }}
              </UBadge>
            </UButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Grid -->
    <section class="py-20 md:py-32 bg-gray-50/50 dark:bg-gray-900/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Results Info -->
        <div class="mb-8">
          <p class="text-gray-600 dark:text-gray-400">
            {{ filteredPosts.length }} {{ filteredPosts.length === 1 ? 'result' : 'results' }}
            <span v-if="selectedTag || searchQuery">
              for
              <span v-if="searchQuery" class="font-medium">"{{ searchQuery }}"</span>
              <span v-if="selectedTag && searchQuery"> in </span>
              <span v-if="selectedTag" class="font-medium">{{ getTagLabel(selectedTag) }}</span>
            </span>
          </p>
        </div>

        <!-- No Results -->
        <div v-if="filteredPosts.length === 0" class="text-center py-12">
          <UIcon
            name="i-heroicons-document-magnifying-glass"
            class="h-12 w-12 text-gray-400 mx-auto mb-4"
          />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your search or filter criteria
          </p>
          <UButton variant="soft" @click="clearFilters">Clear all filters</UButton>
        </div>

        <!-- Content Grid -->
        <div v-else class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="(post, index) in filteredPosts"
            :key="index"
            class="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
          >
            <!-- Content Type Badge -->
            <div v-if="post.tags && post.tags.length" class="absolute top-4 right-4 z-10">
              <UBadge
                :color="getTagColor(post.tags[0] as string)"
                size="sm"
                class="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90"
              >
                {{ getTagLabel(post.tags[0] as string) }}
              </UBadge>
            </div>

            <div class="h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
              <img
                :src="post.image"
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div class="p-6">
              <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                <img
                  :src="post.author.avatar"
                  :alt="post.author.name"
                  class="w-6 h-6 rounded-full mr-2"
                />
                <span>{{ post.author.name }}</span>
                <span class="mx-2">•</span>
                <time>{{ formatDate(post.date) }}</time>
              </div>

              <h3
                class="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
              >
                {{ post.title }}
              </h3>

              <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4">
                {{ post.excerpt }}
              </p>

              <!-- Tags -->
              <div class="flex flex-wrap gap-1 mb-4">
                <NuxtLink
                  v-for="tag in (post.tags || []).slice(0, 3)"
                  :key="tag"
                  :to="`/blog/tag/${tag}`"
                  class="inline-block"
                  aria-label="Filter by tag"
                >
                  <UBadge
                    :color="getTagColor(tag) as any"
                    size="xs"
                    variant="soft"
                    class="hover:opacity-90"
                  >
                    {{ getTagLabel(tag) }}
                  </UBadge>
                </NuxtLink>
                <UBadge
                  v-if="(post.tags?.length ?? 0) > 3"
                  color="neutral"
                  size="xs"
                  variant="soft"
                >
                  +{{ post.tags.length - 3 }}
                </UBadge>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-rose-600 dark:text-rose-400">
                  {{ post.type === 'resource' ? 'View resource' : 'Read article' }}
                </span>
                <UIcon
                  name="i-heroicons-arrow-right"
                  class="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform"
                />
              </div>
            </div>

            <div
              class="absolute inset-0 bg-gradient-to-t from-rose-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            />

            <!-- Click overlay -->
            <NuxtLink
              :to="`/blog/${slugify(post.title)}`"
              class="absolute inset-0 z-0"
              aria-label="Read article"
            />
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// SEO Configuration
useSeoMeta({
  title: 'Knowledge Hub - Blog & Resources | EPISON',
  description:
    'Expert insights, guidelines, training materials, and resources for epidemiology professionals and public health practitioners in Nigeria.',
  ogTitle: 'Knowledge Hub - Blog & Resources | EPISON',
  ogDescription:
    'Access expert insights and resources for epidemiology professionals and public health practitioners.',
  ogImage: 'https://epison.ng/hero.jpeg',
  ogUrl: 'https://epison.ng/blog',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Knowledge Hub - Blog & Resources | EPISON',
  twitterDescription:
    'Access expert insights and resources for epidemiology professionals and public health practitioners.',
  twitterImage: 'https://epison.ng/hero.jpeg',
})

const searchQuery = ref('')
const selectedTag = ref<string | null>(null)

// Use centralized blog composable
const { posts, getTagLabel, getTagColor, slugify, getAvailableTags } = useBlog()

const availableTags = computed(() => getAvailableTags())

const filteredPosts = computed(() => {
  let list = posts.value
  if (selectedTag.value) {
    list = list.filter(p => p.tags.includes(selectedTag.value as string))
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.author.name.toLowerCase().includes(q) ||
        p.tags.some(t => getTagLabel(t).toLowerCase().includes(q))
    )
  }
  return [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

function clearFilters() {
  searchQuery.value = ''
  selectedTag.value = null
}

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}
</script>
