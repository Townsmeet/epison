import { ref, computed } from 'vue'

export type PostType = 'article' | 'resource'
export type UIColor = 'primary' | 'neutral' | 'secondary' | 'info' | 'success' | 'warning' | 'error'

export interface BlogPost {
  title: string
  excerpt: string
  date: string // ISO
  type: PostType
  tags: string[]
  author: { name: string; avatar: string }
  image: string
}

export const tagDefinitions: Record<string, { label: string; color: UIColor }> = {
  insights: { label: 'Insights', color: 'primary' },
  guidelines: { label: 'Guidelines', color: 'info' },
  training: { label: 'Training', color: 'success' },
  research: { label: 'Research', color: 'secondary' },
  tools: { label: 'Tools', color: 'neutral' },
  webinars: { label: 'Webinars', color: 'secondary' },
  publications: { label: 'Publications', color: 'neutral' },
  policy: { label: 'Policy', color: 'warning' },
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function useBlog() {
  const posts = ref<BlogPost[]>([
    {
      title: 'The Future of Digital Health Surveillance in Nigeria',
      excerpt:
        'Exploring how technology is transforming disease surveillance and public health response in the digital age.',
      date: '2024-08-20',
      type: 'article',
      tags: ['insights', 'tools'],
      author: {
        name: 'Dr. Amina Bello',
        avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      },
      image:
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Climate Change and Infectious Disease Patterns',
      excerpt:
        'Understanding how changing climate patterns are affecting the distribution and transmission of infectious diseases.',
      date: '2024-08-15',
      type: 'article',
      tags: ['research', 'insights'],
      author: {
        name: 'Prof. Chukwuma Okoro',
        avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
      },
      image:
        'https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Building Resilient Health Systems: Lessons from COVID-19',
      excerpt:
        'Key insights and recommendations for strengthening health systems based on pandemic response experiences.',
      date: '2024-08-10',
      type: 'article',
      tags: ['policy', 'insights', 'research'],
      author: {
        name: 'Dr. Fatima Ibrahim',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      },
      image:
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
  ])

  const postSlugs = computed(() => posts.value.map(p => ({ ...p, slug: slugify(p.title) })))

  function getTagLabel(tagId: string): string {
    return tagDefinitions[tagId]?.label || tagId
  }

  function getTagColor(tagId: string): UIColor {
    return (tagDefinitions[tagId]?.color as UIColor) || 'neutral'
  }

  function findBySlug(slug: string) {
    return postSlugs.value.find(p => p.slug === slug)
  }

  function getAvailableTags() {
    const counts: Record<string, number> = {}
    posts.value.forEach(p => p.tags.forEach(t => (counts[t] = (counts[t] || 0) + 1)))
    return Object.keys(counts)
      .map(id => ({ id, label: getTagLabel(id), count: counts[id]! }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  return {
    posts,
    postSlugs,
    getTagLabel,
    getTagColor,
    slugify,
    findBySlug,
    getAvailableTags,
  }
}
