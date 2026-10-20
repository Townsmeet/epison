<template>
  <div class="min-h-screen bg-[#f8f8f4] dark:bg-gray-950">
    <!-- Hero Section (Reusable) -->
    <HeroSection
      title="Membership"
      subtitle="Join EPISON and become part of Nigeria's leading epidemiological community."
    />

    <!-- Member Directory CTA -->
    <section class="border-b border-gray-200 bg-white py-7 dark:border-gray-800 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center space-x-4">
            <div
              class="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-users"
                class="w-6 h-6 text-primary-600 dark:text-primary-400"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Explore Our Member Directory
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Connect with our community of public health professionals across Nigeria
              </p>
            </div>
          </div>
          <UButton
            to="/members/directory"
            color="primary"
            variant="outline"
            size="lg"
            icon="i-heroicons-arrow-right"
            trailing
          >
            View Directory
          </UButton>
        </div>
      </div>
    </section>

    <!-- Membership Types -->
    <section class="py-16 md:py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          class="mb-6 rounded-2xl border border-primary-200/70 bg-white p-5 text-sm leading-relaxed text-gray-700 dark:border-primary-800 dark:bg-gray-900 dark:text-gray-300"
        >
          <p>
            We recommend the
            <span class="font-semibold">+International Epidemiological Association</span> options
            for broader professional benefits.
          </p>
        </div>

        <div class="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:mt-12 xl:grid-cols-4">
          <!-- Early Career (EPiSON only) -->
          <div
            class="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <div class="flex-grow p-6">
              <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Early Career Membership
              </h2>
              <p class="mt-4 text-gray-500 dark:text-gray-400">
                Individuals currently enrolled in a graduate or postgraduate course of study in a
                subject relevant to the field of epidemiology, or who have worked in the field of
                epidemiology for not more than 10 years.
              </p>
            </div>

            <div
              class="mt-auto border-t border-gray-100 bg-gray-50/80 p-5 dark:border-gray-700 dark:bg-gray-800/70"
            >
              <div class="mb-3">
                <span class="text-3xl font-bold text-gray-900 dark:text-white">₦15,000</span>
                <span class="text-gray-500 dark:text-gray-400">/year</span>
              </div>
              <UButton to="/membership/apply?type=early-career" block color="primary" size="md">
                Join Now
              </UButton>
            </div>
          </div>

          <!-- Early Career (Joint International Epidemiological Association & EPiSON) - Recommended -->
          <div
            class="flex h-full flex-col overflow-hidden rounded-2xl border-2 border-primary-500/70 bg-white shadow-lg dark:border-primary-400/70 dark:bg-gray-900"
          >
            <div class="flex-grow p-6">
              <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Early Career Membership (+International Epidemiological Association)
              </h2>
              <p class="mt-4 text-gray-500 dark:text-gray-400">
                Ideal for early career professionals seeking both EPiSON and International
                Epidemiological Association access.
              </p>
            </div>

            <div
              class="mt-auto border-t border-gray-100 bg-gray-50/80 p-5 dark:border-gray-700 dark:bg-gray-800/70"
            >
              <div class="mb-3">
                <span class="text-3xl font-bold text-gray-900 dark:text-white">₦40,000</span>
                <span class="text-gray-500 dark:text-gray-400">/year</span>
              </div>
              <UButton to="/membership/apply?type=early-career+iea" block color="primary" size="md">
                Join Now
              </UButton>
            </div>
          </div>

          <!-- Regular (EPiSON only) -->
          <div
            class="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <div class="flex-grow p-6">
              <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Regular Membership
              </h2>
              <p class="mt-4 text-gray-500 dark:text-gray-400">
                Individuals engaged in research, teaching or practice of epidemiology.
              </p>
            </div>

            <div
              class="mt-auto border-t border-gray-100 bg-gray-50/80 p-5 dark:border-gray-700 dark:bg-gray-800/70"
            >
              <div class="mb-3">
                <span class="text-3xl font-bold text-gray-900 dark:text-white">₦30,000</span>
                <span class="text-gray-500 dark:text-gray-400">/year</span>
              </div>
              <UButton to="/membership/apply?type=regular" block color="primary" size="md">
                Join Now
              </UButton>
            </div>
          </div>

          <!-- Regular (Joint IEA & EPiSON) - Recommended -->
          <div
            class="z-10 flex h-full flex-col overflow-hidden rounded-2xl border-2 border-primary-500 bg-white shadow-lg dark:border-primary-400 dark:bg-gray-900"
          >
            <div class="flex-grow p-6">
              <div class="flex justify-between items-center">
                <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  Regular Membership (+International Epidemiological Association)
                </h2>
              </div>
              <p class="mt-4 text-gray-500 dark:text-gray-400">
                Combined EPiSON membership with International Epidemiological Association for
                enhanced international benefits.
              </p>
            </div>

            <div
              class="mt-auto border-t border-gray-100 bg-gray-50/80 p-5 dark:border-gray-700 dark:bg-gray-800/70"
            >
              <div class="mb-3">
                <span class="text-3xl font-bold text-gray-900 dark:text-white">₦70,000</span>
                <span class="text-gray-500 dark:text-gray-400">/year</span>
              </div>
              <UButton to="/membership/apply?type=regular+iea" block color="primary" size="md">
                Join Now
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="bg-white py-16 dark:bg-gray-900 md:py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Benefits of EPISON Membership
          </h2>
          <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            Join our community of epidemiology professionals and enjoy these exclusive benefits.
          </p>
        </div>

        <div class="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Automatic International Epidemiological Association Membership -->
          <div
            class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div
              class="w-12 h-12 rounded-md bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-globe-alt"
                class="w-6 h-6 text-primary-600 dark:text-primary-400"
              />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Automatic International Epidemiological Association Membership
            </h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              Membership of EPISON automatically confers membership of the International
              Epidemiological Association.
            </p>
          </div>

          <!-- Networking and Knowledge Sharing -->
          <div
            class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div
              class="w-12 h-12 rounded-md bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-user-group"
                class="w-6 h-6 text-primary-600 dark:text-primary-400"
              />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Networking and Knowledge Sharing
            </h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              Provides a forum to interact and share experiences with other epidemiologists working
              in Nigeria and globally.
            </p>
          </div>

          <!-- Professional Contribution -->
          <div
            class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div
              class="w-12 h-12 rounded-md bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-briefcase"
                class="w-6 h-6 text-primary-600 dark:text-primary-400"
              />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Professional Contribution
            </h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              Enables members to contribute meaningfully to the practice of Epidemiology in Nigeria.
            </p>
          </div>

          <!-- Access to IEA Privileges -->
          <div
            class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div
              class="w-12 h-12 rounded-md bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-star"
                class="w-6 h-6 text-primary-600 dark:text-primary-400"
              />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Access to International Epidemiological Association Privileges
            </h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              As an International Epidemiological Association member, you are eligible to attend
              International Epidemiological Association conferences and aspire to elective offices,
              along with other member privileges.
            </p>
          </div>

          <!-- Publications and Resources -->
          <div
            class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div
              class="w-12 h-12 rounded-md bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-document-text"
                class="w-6 h-6 text-primary-600 dark:text-primary-400"
              />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Publications and Resources
            </h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              Access to newsletters, journals, and other publications by EPISON and its affiliate
              organizations like International Epidemiological Association.
            </p>
          </div>

          <!-- Conference Participation -->
          <div
            class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div
              class="w-12 h-12 rounded-md bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-calendar-days"
                class="w-6 h-6 text-primary-600 dark:text-primary-400"
              />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Conference Participation
            </h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              Participation in EPISON, International Epidemiological Association, and regional
              conferences or other events organized by them.
            </p>
          </div>

          <!-- Career Development -->
          <div
            class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div
              class="w-12 h-12 rounded-md bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-academic-cap"
                class="w-6 h-6 text-primary-600 dark:text-primary-400"
              />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Career Development
            </h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              Opportunities for career and professional capacity development through
              EPISON-organized workshops and international conferences.
            </p>
          </div>

          <!-- Voting Rights -->
          <div
            class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div
              class="w-12 h-12 rounded-md bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-hand-raised"
                class="w-6 h-6 text-primary-600 dark:text-primary-400"
              />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">Voting Rights</h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              Eligibility to vote and be voted for at EPISON Annual General Meetings.
            </p>
          </div>

          <!-- Collaborative Research -->
          <div
            class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div
              class="w-12 h-12 rounded-md bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-beaker"
                class="w-6 h-6 text-primary-600 dark:text-primary-400"
              />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Collaborative Research
            </h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              Participation in collaborative research with other members of EPISON and International
              Epidemiological Association at subnational, national, and global levels.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Existing Members Renewal Section -->
    <section class="py-16 bg-gradient-to-r from-primary-600 to-teal-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-white mb-4">Already a Member?</h2>
          <p class="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Renew your membership to continue enjoying EPISON benefits. All memberships follow a
            calendar year cycle and are due for renewal at the start of each year.
          </p>

          <UButton to="/membership/renew" color="neutral" size="xl" class="shadow-lg">
            <template #leading>
              <UIcon name="i-heroicons-arrow-path" class="w-5 h-5" />
            </template>
            Renew Your Membership
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// SEO Configuration
useSeoMeta({
  title: 'Membership - Join EPISON | Epidemiological Society of Nigeria',
  description:
    'Join the Epidemiological Society of Nigeria (EPISON) and become part of a professional community dedicated to advancing epidemiology in Nigeria. Early career and regular membership options available.',
  ogTitle: 'Membership - Join EPISON',
  ogDescription:
    "Become part of Nigeria's leading epidemiological community with benefits including IEA membership, professional development, and networking opportunities.",
  ogImage: 'https://epison.ng/hero.jpeg',
  ogUrl: 'https://epison.ng/membership',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Membership - Join EPISON',
  twitterDescription:
    "Become part of Nigeria's leading epidemiological community with benefits including IEA membership, professional development, and networking opportunities.",
  twitterImage: 'https://epison.ng/hero.jpeg',
})

defineOgImage({
  url: '/hero.jpeg',
  alt: 'Membership - Join EPISON',
})
</script>
