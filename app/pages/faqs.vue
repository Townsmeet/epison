<template>
  <div class="bg-white dark:bg-gray-900">
    <!-- Hero Section -->
    <section
      class="relative min-h-[70vh] flex items-center bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden"
    >
      <div class="absolute inset-0 opacity-20">
        <div
          class="absolute top-20 left-10 w-72 h-72 bg-yellow-100 dark:bg-yellow-900/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
        />
        <div
          class="absolute top-40 right-10 w-72 h-72 bg-amber-100 dark:bg-amber-900/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          style="animation-delay: 2s"
        />
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="max-w-4xl">
          <div
            class="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm mb-8"
          >
            <div class="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >Frequently Asked Questions</span
            >
          </div>

          <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
            <span class="block text-gray-900 dark:text-white leading-none">Common</span>
            <span
              class="block bg-gradient-to-r from-yellow-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent leading-none"
            >
              Questions
            </span>
          </h1>

          <div class="w-24 h-1 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full mb-8" />

          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
            Find answers to frequently asked questions about EPISON membership, activities, and
            services.
          </p>
        </div>
      </div>
    </section>

    <!-- FAQs -->
    <section class="py-20 md:py-32 bg-gray-50/50 dark:bg-gray-900/50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="space-y-6">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
          >
            <button
              class="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-2xl"
              @click="toggleFaq(index)"
            >
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                {{ faq.question }}
              </h3>
              <UIcon
                :name="
                  openFaqs.includes(index) ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'
                "
                class="h-5 w-5 text-gray-500 flex-shrink-0 transition-transform"
              />
            </button>

            <div v-show="openFaqs.includes(index)" class="px-8 pb-6">
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                {{ faq.answer }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const openFaqs = ref<number[]>([])

const toggleFaq = (index: number) => {
  if (openFaqs.value.includes(index)) {
    openFaqs.value = openFaqs.value.filter(i => i !== index)
  } else {
    openFaqs.value.push(index)
  }
}

const faqs = [
  {
    question: 'What is EPISON?',
    answer:
      'EPISON (Epidemiological Society of Nigeria) is a professional organization dedicated to advancing the science and practice of epidemiology in Nigeria through research, education, and collaboration.',
  },
  {
    question: 'Who can become a member of EPISON?',
    answer:
      'Membership is open to epidemiologists, public health professionals, researchers, students, and anyone interested in advancing epidemiological practice in Nigeria.',
  },
  {
    question: 'What are the membership benefits?',
    answer:
      'Members enjoy access to conferences, workshops, research publications, networking opportunities, professional development programs, and reduced fees for EPISON events.',
  },
  {
    question: 'How much does membership cost?',
    answer:
      'Membership fees vary by category. Regular membership is ₦25,000 annually, student membership is free, and institutional membership is ₦100,000 annually.',
  },
  {
    question: 'How often does EPISON hold conferences?',
    answer:
      'EPISON holds an annual scientific conference, quarterly workshops, and monthly webinars. Special symposiums are organized based on emerging public health needs.',
  },
  {
    question: 'Can I present my research at EPISON events?',
    answer:
      'Yes! We encourage members to submit abstracts for oral and poster presentations at our conferences and workshops. Call for abstracts is usually announced 6 months before events.',
  },
  {
    question: 'Does EPISON offer training programs?',
    answer:
      'Yes, we offer various training programs including field epidemiology, data analysis, outbreak investigation, and research methodology workshops throughout the year.',
  },
  {
    question: 'How can I access EPISON publications?',
    answer:
      'Members have free access to our journal and research publications through the member portal. Non-members can purchase individual articles or subscribe to our publications.',
  },
  {
    question: 'Does EPISON collaborate with international organizations?',
    answer:
      'Yes, we have partnerships with WHO, CDC, and other international epidemiological societies for knowledge exchange, capacity building, and collaborative research.',
  },
  {
    question: 'How can I get involved in EPISON activities?',
    answer:
      'You can join committees, volunteer for events, participate in research groups, or apply for leadership positions. Contact us to learn about current opportunities.',
  },
]
</script>
