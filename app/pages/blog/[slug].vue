<template>
  <div class="bg-white dark:bg-gray-900 min-h-screen">
    <section class="relative pt-20 pb-10">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-6">
          <NuxtLink to="/blog" class="text-sm text-primary-600 hover:underline"
            >← Back to Knowledge Hub</NuxtLink
          >
        </div>

        <div v-if="post" class="space-y-6">
          <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-3 flex-wrap">
            <img :src="post.author.avatar" :alt="post.author.name" class="w-8 h-8 rounded-full" />
            <span class="font-medium text-gray-700 dark:text-gray-200">{{ post.author.name }}</span>
            <span>•</span>
            <time>{{ formatDate(post.date) }}</time>
          </div>

          <h1
            class="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white"
          >
            {{ post.title }}
          </h1>

          <div class="flex flex-wrap gap-2">
            <NuxtLink
              v-for="tag in post.tags"
              :key="tag"
              :to="`/blog/tag/${tag}`"
              class="inline-block"
            >
              <UBadge :color="getTagColor(tag) as any" variant="soft">{{
                getTagLabel(tag)
              }}</UBadge>
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div class="rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img :src="post?.image" :alt="post?.title" class="w-full h-80 object-cover" />
        </div>
      </div>
    </section>

    <section class="py-12">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <article class="prose dark:prose-invert max-w-none">
          <p class="text-lg text-gray-700 dark:text-gray-300">
            {{ post?.excerpt }}
          </p>
          <p class="text-gray-600 dark:text-gray-400">
            This is a placeholder body. Connect this page to your CMS or backend to render full
            content for the post.
          </p>
        </article>

        <div class="mt-10">
          <UButton to="/blog" color="neutral" variant="soft">Back to Knowledge Hub</UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { findBySlug, getTagLabel, getTagColor } = useBlog()

const slug = computed(() => route.params.slug as string)
const post = computed(() => findBySlug(slug.value))

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

useHead(() => ({
  title: post.value ? `${post.value.title} | EPISON Knowledge Hub` : 'Knowledge Hub',
  meta: [
    { name: 'description', content: post.value?.excerpt || '' },
    { property: 'og:title', content: post.value ? `${post.value.title} | EPISON` : 'EPISON' },
    { property: 'og:description', content: post.value?.excerpt || '' },
    { property: 'og:type', content: 'article' },
    { property: 'og:image', content: post.value?.image || '' },
  ],
}))
</script>
