<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-teal-900/20"
  >
    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-20 pb-16">
      <!-- Background Elements -->
      <div class="absolute inset-0">
        <div
          class="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-br from-teal-400/20 to-cyan-500/20 rounded-full blur-3xl"
        />
        <div
          class="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-amber-400/15 to-orange-500/15 rounded-full blur-3xl"
        />
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          <span
            class="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent"
          >
            Membership
          </span>
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Join a community of dedicated epidemiologists committed to advancing public health in
          Nigeria and beyond
        </p>
      </div>
    </section>

    <!-- Membership Benefits -->
    <section class="py-20 md:py-32 bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <div
            class="inline-flex items-center space-x-2 px-4 py-2 bg-amber-100/50 dark:bg-amber-900/20 rounded-full border border-amber-200/50 dark:border-amber-700/50 mb-6"
          >
            <div class="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span class="text-sm font-medium text-amber-700 dark:text-amber-300"
              >Member Benefits</span
            >
          </div>

          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Why Join
            <span
              class="bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent"
              >EPISON?</span
            >
          </h2>

          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            As an EPISON member, you'll enjoy these exclusive benefits and more
          </p>
        </div>

        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(benefit, index) in benefits"
            :key="index"
            class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-gray-700/50 shadow-sm hover:shadow-lg transition-all duration-300 p-8"
          >
            <div class="relative mb-6">
              <div
                class="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-2xl blur-xl"
              />
              <div
                class="relative flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-lg"
              >
                <UIcon :name="benefit.icon" class="h-8 w-8" />
              </div>
            </div>

            <div class="space-y-4">
              <h3
                class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
              >
                {{ benefit.title }}
              </h3>

              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                {{ benefit.description }}
              </p>
            </div>

            <div
              class="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />

            <div
              class="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-100 dark:to-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-white dark:text-gray-900 shadow-lg"
            >
              {{ index + 1 }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Membership Types -->
    <section class="py-20 md:py-32 bg-gray-50/50 dark:bg-gray-900/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <div
            class="inline-flex items-center space-x-2 px-4 py-2 bg-amber-100/50 dark:bg-amber-900/20 rounded-full border border-amber-200/50 dark:border-amber-700/50 mb-6"
          >
            <div class="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span class="text-sm font-medium text-amber-700 dark:text-amber-300"
              >Membership Options</span
            >
          </div>

          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Choose Your
            <span
              class="bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent"
              >Membership</span
            >
          </h2>

          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Select the membership category that best fits your professional status
          </p>
        </div>

        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="(type, index) in membershipTypes"
            :key="index"
            :class="[
              'relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-gray-700/50 shadow-sm hover:shadow-lg transition-all duration-300 p-8',
              type.popular ? 'ring-2 ring-amber-500 shadow-xl' : '',
            ]"
          >
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                {{ type.name }}
              </h3>

              <span
                v-if="type.popular"
                class="rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 px-3 py-1 text-xs font-semibold text-white shadow-sm"
              >
                Most Popular
              </span>
            </div>

            <div class="mb-6">
              <p class="flex items-baseline text-gray-900 dark:text-white">
                <span class="text-4xl font-bold tracking-tight">
                  {{ type.price === 0 ? 'Free' : `₦${type.price.toLocaleString()}` }}
                </span>
                <span
                  v-if="type.price > 0"
                  class="ml-1 text-lg font-semibold text-gray-500 dark:text-gray-400"
                >
                  /year
                </span>
              </p>

              <p class="mt-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {{ type.description }}
              </p>
            </div>

            <ul role="list" class="space-y-3 mb-8">
              <li v-for="(feature, i) in type.features" :key="i" class="flex items-start">
                <UIcon
                  name="i-heroicons-check"
                  class="h-5 w-5 flex-shrink-0 text-green-500 mt-0.5"
                />
                <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">{{ feature }}</span>
              </li>
            </ul>

            <UButton
              :to="type.cta.to"
              :color="type.popular ? 'primary' : 'neutral'"
              :variant="type.popular ? 'solid' : 'outline'"
              class="w-full"
            >
              {{ type.cta.text }}
            </UButton>

            <div
              v-if="type.popular"
              class="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 rounded-2xl pointer-events-none"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- How to Join -->
    <section class="py-20 md:py-32 bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <div
            class="inline-flex items-center space-x-2 px-4 py-2 bg-amber-100/50 dark:bg-amber-900/20 rounded-full border border-amber-200/50 dark:border-amber-700/50 mb-6"
          >
            <div class="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span class="text-sm font-medium text-amber-700 dark:text-amber-300"
              >Application Process</span
            >
          </div>

          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            How to Join
            <span
              class="bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent"
              >EPISON</span
            >
          </h2>

          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Follow these simple steps to become a member
          </p>
        </div>

        <div class="relative max-w-4xl mx-auto">
          <div
            class="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-amber-500 to-yellow-500 rounded-full"
            aria-hidden="true"
          />

          <div class="space-y-12">
            <div v-for="(step, index) in steps" :key="index" class="relative flex items-start">
              <div class="flex-shrink-0">
                <div
                  class="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-lg"
                >
                  <span class="text-lg font-bold">{{ index + 1 }}</span>
                </div>
              </div>

              <div class="ml-8 flex-1">
                <div
                  class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-gray-700/50 shadow-sm p-6"
                >
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {{ step.title }}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    {{ step.description }}
                  </p>

                  <div v-if="step.details" class="bg-gray-50/80 dark:bg-gray-700/50 rounded-xl p-4">
                    <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">{{ step.details }}</p>
                    <ul v-if="step.items" class="space-y-2">
                      <li v-for="(item, i) in step.items" :key="i" class="flex items-start">
                        <UIcon
                          name="i-heroicons-check-circle"
                          class="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0"
                        />
                        <span class="text-sm text-gray-600 dark:text-gray-300">{{ item }}</span>
                      </li>
                    </ul>
                    <UButton
                      v-if="step.button"
                      :to="step.button.to"
                      color="primary"
                      size="sm"
                      class="mt-4"
                    >
                      {{ step.button.text }}
                    </UButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 md:py-32 bg-gradient-to-br from-amber-600 via-amber-500 to-yellow-600">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">Ready to join EPISON?</h2>
        <p class="text-xl text-amber-100 mb-8 leading-relaxed">
          Become part of Nigeria's leading network of epidemiology professionals and advance your
          career.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            to="/membership/apply"
            size="xl"
            class="bg-white text-amber-600 hover:bg-gray-100 font-semibold"
          >
            Apply Now
          </UButton>
          <UButton
            to="/contact"
            size="xl"
            color="neutral"
            variant="outline"
            class="border-white text-white hover:bg-white hover:text-amber-600"
          >
            Contact Us
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
interface StepButton {
  text: string
  to: string
}

interface ApplicationStep {
  title: string
  description: string
  details?: string
  items?: string[]
  button?: StepButton
}

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

const steps: ApplicationStep[] = [
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

const _faqs = [
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
