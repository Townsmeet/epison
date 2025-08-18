<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Hero -->
    <div class="relative bg-primary-700">
      <div class="absolute inset-0">
        <img
          class="w-full h-full object-cover opacity-10"
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
          alt="Group of professionals"
        />
      </div>
      <div class="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Become a Member
        </h1>
        <p class="mt-6 text-xl text-primary-100 max-w-3xl">
          Join EPISON and become part of Nigeria's leading network of epidemiology professionals.
        </p>
      </div>
    </div>

    <!-- Membership Benefits -->
    <div class="py-16 bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center mb-16">
          <h2
            class="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase"
          >
            Benefits
          </h2>
          <p
            class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            Why Join EPISON?
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
            As an EPISON member, you'll enjoy these exclusive benefits and more
          </p>
        </div>

        <div class="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(benefit, index) in benefits"
            :key="index"
            class="group relative bg-white dark:bg-gray-800 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div>
              <span
                class="rounded-lg inline-flex p-3 bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-200 ring-4 ring-white dark:ring-gray-800"
              >
                <UIcon :name="benefit.icon" class="h-6 w-6" />
              </span>
            </div>
            <div class="mt-8">
              <h3 class="text-lg font-medium">
                <span class="absolute inset-0" aria-hidden="true" />
                {{ benefit.title }}
              </h3>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {{ benefit.description }}
              </p>
            </div>
            <span
              class="pointer-events-none absolute top-6 right-6 text-gray-300 dark:text-gray-600 group-hover:text-primary-400"
              aria-hidden="true"
            >
              <UIcon name="i-heroicons-arrow-right" class="h-6 w-6" />
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Membership Types -->
    <div class="py-16 bg-gray-50 dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center mb-16">
          <h2
            class="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase"
          >
            Membership
          </h2>
          <p
            class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            Choose Your Membership
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
            Select the membership category that best fits your professional status
          </p>
        </div>

        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="(type, index) in membershipTypes"
            :key="index"
            :class="[
              'rounded-2xl border border-gray-200 dark:border-gray-700 p-8',
              type.popular
                ? 'ring-2 ring-primary-500 bg-white dark:bg-gray-800 shadow-xl'
                : 'bg-white dark:bg-gray-800 shadow-sm',
            ]"
          >
            <div class="flex items-center justify-between">
              <h3
                :class="[
                  'text-lg font-medium',
                  type.popular
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-900 dark:text-white',
                ]"
              >
                {{ type.name }}
              </h3>

              <span
                v-if="type.popular"
                class="rounded-full bg-primary-100 dark:bg-primary-900 px-3 py-1 text-xs font-semibold leading-5 text-primary-800 dark:text-primary-100"
              >
                Most Popular
              </span>
            </div>

            <p class="mt-4 flex items-baseline text-gray-900 dark:text-white">
              <span class="text-4xl font-extrabold tracking-tight">
                {{ type.price === 0 ? 'Free' : `₦${type.price.toLocaleString()}` }}
              </span>
              <span
                v-if="type.price > 0"
                class="ml-1 text-lg font-semibold text-gray-500 dark:text-gray-400"
              >
                /year
              </span>
            </p>

            <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {{ type.description }}
            </p>

            <ul role="list" class="mt-6 space-y-4">
              <li v-for="(feature, i) in type.features" :key="i" class="flex">
                <UIcon name="i-heroicons-check" class="h-6 w-6 flex-shrink-0 text-green-500" />
                <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">{{ feature }}</span>
              </li>
            </ul>

            <div class="mt-8">
              <UButton
                :to="type.cta.to"
                :color="type.popular ? 'primary' : 'gray'"
                :variant="type.popular ? 'solid' : 'outline'"
                class="w-full"
              >
                {{ type.cta.text }}
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- How to Join -->
    <div class="py-16 bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center mb-16">
          <h2
            class="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase"
          >
            Process
          </h2>
          <p
            class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            How to Join EPISON
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
            Follow these simple steps to become a member
          </p>
        </div>

        <div class="relative">
          <div
            class="absolute left-4 h-full w-0.5 bg-gray-200 dark:bg-gray-700"
            aria-hidden="true"
          />

          <ul class="space-y-12">
            <li v-for="(step, index) in steps" :key="index" class="relative">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <div
                    class="flex items-center justify-center h-8 w-8 rounded-full bg-primary-500 text-white"
                  >
                    {{ index + 1 }}
                  </div>
                </div>
                <div class="ml-6">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                    {{ step.title }}
                  </h3>
                  <p class="mt-2 text-gray-600 dark:text-gray-300">
                    {{ step.description }}
                  </p>
                  <div v-if="step.details" class="mt-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p class="text-sm text-gray-600 dark:text-gray-300">{{ step.details }}</p>
                    <ul v-if="step.items" class="mt-2 space-y-2">
                      <li v-for="(item, i) in step.items" :key="i" class="flex items-start">
                        <UIcon
                          name="i-heroicons-check-circle"
                          class="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                        />
                        <span class="text-sm text-gray-600 dark:text-gray-300">{{ item }}</span>
                      </li>
                    </ul>
                    <UButton
                      v-if="step.button"
                      :to="step.button.to"
                      :color="step.button.color || 'primary'"
                      size="sm"
                      class="mt-3"
                    >
                      {{ step.button.text }}
                    </UButton>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- FAQ -->
    <div class="py-16 bg-gray-50 dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center mb-12">
          <h2
            class="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase"
          >
            FAQs
          </h2>
          <p
            class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            Frequently Asked Questions
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
            Find answers to common questions about EPISON membership
          </p>
        </div>

        <div class="max-w-3xl mx-auto">
          <div class="space-y-6">
            <UDivider />
            <UAccordion :items="faqs" :ui="{ wrapper: 'space-y-6' }" class="space-y-6">
              <template #default="{ item, open }">
                <UButton
                  color="gray"
                  variant="ghost"
                  class="flex items-center justify-between w-full px-0 py-4 font-normal"
                >
                  <span class="text-left text-base font-medium text-gray-900 dark:text-white">{{
                    item.label
                  }}</span>
                  <UIcon
                    name="i-heroicons-chevron-down"
                    class="w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform duration-200"
                    :class="[open ? 'rotate-180' : '']"
                  />
                </UButton>
                <div class="pb-4 text-gray-600 dark:text-gray-300 text-sm">
                  {{ item.content }}
                </div>
              </template>
            </UAccordion>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="bg-primary-700">
      <div class="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
          <span class="block">Ready to join EPISON?</span>
          <span class="block">Start your application today.</span>
        </h2>
        <p class="mt-4 text-lg leading-6 text-primary-100">
          Become part of Nigeria's leading network of epidemiology professionals and advance your
          career.
        </p>
        <div class="mt-8 flex justify-center space-x-4">
          <UButton
            to="/membership/apply"
            size="xl"
            class="bg-white text-primary-600 hover:bg-gray-100"
          >
            Apply Now
          </UButton>
          <UButton to="/contact" size="xl" color="white" variant="outline"> Contact Us </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const benefits = [
  {
    icon: 'i-heroicons-academic-cap',
    title: 'Professional Development',
    description:
      'Access to exclusive training, workshops, and webinars to enhance your epidemiological skills and knowledge.',
  },
  {
    icon: 'i-heroicons-user-group',
    title: 'Networking Opportunities',
    description:
      'Connect with fellow epidemiologists, researchers, and public health professionals across Nigeria and beyond.',
  },
  {
    icon: 'i-heroicons-document-text',
    title: 'Research & Publications',
    description:
      'Get access to our journal, research publications, and resources to stay updated with the latest in epidemiology.',
  },
  {
    icon: 'i-heroicons-briefcase',
    title: 'Career Advancement',
    description:
      'Access to job postings, career resources, and mentorship opportunities to advance your career in epidemiology.',
  },
  {
    icon: 'i-heroicons-ticket',
    title: 'Conference Discounts',
    description:
      'Enjoy significant discounts on registration fees for EPISON conferences, workshops, and training programs.',
  },
  {
    icon: 'i-heroicons-globe-alt',
    title: 'Global Recognition',
    description:
      'Be part of a recognized professional body that represents epidemiologists in Nigeria at national and international forums.',
  },
]

const membershipTypes = [
  {
    name: 'Student',
    price: 5000,
    description: 'For full-time students enrolled in epidemiology or related programs',
    features: [
      'Access to member resources',
      'Discounted conference rates',
      'E-newsletter subscription',
      'Student networking events',
      'Mentorship program access',
    ],
    cta: {
      text: 'Apply as Student',
      to: '/membership/apply/student',
    },
    popular: false,
  },
  {
    name: 'Early Career',
    price: 15000,
    description: 'For professionals with less than 5 years of experience',
    features: [
      'All Student benefits',
      'Professional development webinars',
      'Early career workshops',
      'Job board access',
      'Leadership opportunities',
    ],
    cta: {
      text: 'Apply as Early Career',
      to: '/membership/apply/early-career',
    },
    popular: true,
  },
  {
    name: 'Professional',
    price: 30000,
    description: 'For established epidemiology professionals',
    features: [
      'All Early Career benefits',
      'Mentorship opportunities',
      'Committee participation',
      'Voting rights',
      'Leadership eligibility',
    ],
    cta: {
      text: 'Apply as Professional',
      to: '/membership/apply/professional',
    },
    popular: false,
  },
  {
    name: 'Institutional',
    price: 100000,
    description: 'For organizations supporting epidemiology',
    features: [
      'Up to 5 staff members',
      'Organization profile listing',
      'Event sponsorship opportunities',
      'Networking with professionals',
      'Recognition in publications',
    ],
    cta: {
      text: 'Apply as Institution',
      to: '/membership/apply/institutional',
    },
    popular: false,
  },
]

const steps = [
  {
    title: 'Check Eligibility',
    description:
      'Review the membership categories and requirements to determine which one fits your professional status.',
    details:
      'Each membership category has specific eligibility criteria based on your professional experience, education, and current status.',
  },
  {
    title: 'Prepare Required Documents',
    description: 'Gather all necessary documentation needed for your application.',
    details: 'Depending on your membership category, you may need to provide:',
    items: [
      'Curriculum Vitae (CV)',
      'Copies of academic certificates',
      'Professional certifications',
      'Proof of student status (for student members)',
      'Letter of recommendation (for certain categories)',
    ],
  },
  {
    title: 'Complete Application',
    description:
      'Fill out the online application form with your personal and professional details.',
    button: {
      text: 'Start Application',
      to: '/membership/apply',
      color: 'primary',
    },
  },
  {
    title: 'Pay Membership Fee',
    description: 'Submit the required membership fee based on your category.',
    details:
      'Payment can be made online via secure payment gateway or through bank transfer. You will receive payment instructions after your application is reviewed and approved.',
  },
  {
    title: 'Get Approved',
    description:
      'Wait for your application to be reviewed and approved by the EPISON membership committee.',
    details:
      'The review process typically takes 5-7 business days. You will be notified via email once your application is approved.',
  },
  {
    title: 'Welcome to EPISON!',
    description: 'Once approved, you will receive your membership certificate and welcome package.',
    details:
      'You can now access all member benefits, including resources, events, and networking opportunities.',
  },
]

const faqs = [
  {
    label: 'What are the benefits of joining EPISON?',
    content:
      'EPISON members enjoy numerous benefits including access to professional development opportunities, networking events, discounted conference rates, access to research publications, career resources, and the ability to contribute to the advancement of epidemiology in Nigeria.',
  },
  {
    label: 'How do I know which membership category to apply for?',
    content:
      'Your membership category is determined by your professional status: Student (currently enrolled in a degree program), Early Career (less than 5 years of experience), Professional (5+ years of experience), or Institutional (organizations supporting epidemiology). Review the membership categories on our website or contact us if you need assistance determining your category.',
  },
  {
    label: 'How long does the application process take?',
    content:
      'The application review process typically takes 5-7 business days. You will be notified via email once your application has been reviewed. Incomplete applications or those requiring additional documentation may take longer to process.',
  },
  {
    label: 'What payment methods do you accept?',
    content:
      'We accept payments through our secure online payment gateway (credit/debit cards) as well as bank transfers. Detailed payment instructions will be provided after your application is approved.',
  },
  {
    label: 'Can I upgrade my membership category?',
    content:
      'Yes, you can upgrade your membership category at any time if you meet the eligibility criteria for the new category. Contact the membership committee for assistance with upgrading your membership.',
  },
  {
    label: 'Is my membership fee refundable?',
    content:
      'Membership fees are generally non-refundable. However, if there are exceptional circumstances, please contact our membership committee to discuss your situation.',
  },
  {
    label: 'How do I renew my membership?',
    content:
      'Membership renewal notices are sent via email 30 days before your membership expires. You can renew your membership online through the member portal or by contacting the EPISON secretariat.',
  },
  {
    label: 'Can I get involved in EPISON committees?',
    content:
      'Yes! Active members are encouraged to participate in EPISON committees. Committee participation is a great way to contribute to the society and develop leadership skills. Contact us for more information on current committee opportunities.',
  },
]
</script>
