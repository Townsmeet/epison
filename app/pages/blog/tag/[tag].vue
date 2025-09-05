<template>
  <div class="bg-white dark:bg-gray-900 min-h-screen">
    <section class="relative pt-20 pb-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <NuxtLink to="/blog" class="text-sm text-primary-600 hover:underline"
              >← Back to Knowledge Hub</NuxtLink
            >
            <h1
              class="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white"
            >
              {{ tagLabel }}
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">
              {{ filtered.length }} {{ filtered.length === 1 ? 'item' : 'items' }} in this category
            </p>
          </div>
          <div class="w-full sm:w-auto">
            <div class="relative max-w-sm">
              <UIcon
                name="i-heroicons-magnifying-glass"
                class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
              />
              <UInput v-model="q" placeholder="Search within this tag..." class="pl-10 w-full" />
            </div>
          </div>
        </div>

        <div v-if="filtered.length === 0" class="text-center py-16">
          <UIcon
            name="i-heroicons-document-magnifying-glass"
            class="h-12 w-12 text-gray-400 mx-auto mb-4"
          />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No results</h3>
          <p class="text-gray-600 dark:text-gray-400">Try another search query.</p>
        </div>

        <div v-else class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="(post, i) in filtered"
            :key="i"
            class="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
          >
            <div class="absolute top-4 right-4 z-10">
              <UBadge
                :color="getTagColor(activeTag) as any"
                size="sm"
                class="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90"
              >
                {{ tagLabel }}
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

              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-rose-600 dark:text-rose-400"
                  >Read article</span
                >
                <UIcon
                  name="i-heroicons-arrow-right"
                  class="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform"
                />
              </div>
            </div>

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
const route = useRoute()
const q = ref('')
const { posts, getTagLabel, getTagColor, slugify } = useBlog()

const activeTag = computed(() => route.params.tag as string)
const tagLabel = computed(() => getTagLabel(activeTag.value))

const filtered = computed(() => {
  let list = posts.value.filter(p => p.tags.includes(activeTag.value))
  if (q.value) {
    const s = q.value.toLowerCase()
    list = list.filter(
      p =>
        p.title.toLowerCase().includes(s) ||
        p.excerpt.toLowerCase().includes(s) ||
        p.author.name.toLowerCase().includes(s)
    )
  }
  return [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

useHead(() => ({
  title: `${tagLabel.value} | EPISON Knowledge Hub`,
}))
</script>
