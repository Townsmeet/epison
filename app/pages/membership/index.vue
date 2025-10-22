<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-teal-900/20"
  >
    <!-- Hero Section (Reusable) -->
    <HeroSection
      title="Membership"
      subtitle="Join EPISON and become part of Nigeria's leading epidemiological community."
    />

    <!-- Member Directory CTA -->
    <section class="py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
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
    <section class="py-20 md:py-32 bg-gray-50/50 dark:bg-gray-900/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          class="mb-6 p-4 bg-primary-50 dark:bg-gray-800/60 rounded-lg text-sm text-gray-700 dark:text-gray-300"
        >
          <p>
            We recommend the
            <span class="font-semibold">+International Epidemiological Association</span> options
            for broader professional benefits. International Epidemiological Association stands for
            <span class="italic">International Epidemiological Association</span>.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-8 mt-8 xl:mt-12 lg:grid-cols-4">
          <!-- Regular (EPiSON only) -->
          <div
            class="overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
          >
            <div class="p-8">
              <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Regular Membership
              </h2>
              <p class="mt-4 text-gray-500 dark:text-gray-400">
                For professionals in the field of epidemiology and public health.
              </p>

              <div class="mt-8">
                <span class="text-4xl font-bold text-gray-900 dark:text-white">₦30,000</span>
                <span class="text-gray-500 dark:text-gray-400">/year</span>
              </div>

              <ul class="mt-8 space-y-4">
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500" />
                  <span class="mx-4 text-gray-700 dark:text-gray-300"
                    >Access to all EPISON events</span
                  >
                </li>
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500" />
                  <span class="mx-4 text-gray-700 dark:text-gray-300"
                    >Subscription to EPISON journal</span
                  >
                </li>
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500" />
                  <span class="mx-4 text-gray-700 dark:text-gray-300"
                    >Networking opportunities</span
                  >
                </li>
              </ul>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-700">
              <UButton to="/membership/apply?type=regular" block color="primary" size="lg">
                Join Now
              </UButton>
            </div>
          </div>

          <!-- Regular (Joint IEA & EPiSON) - Recommended -->
          <div
            class="overflow-hidden bg-white dark:bg-gray-800 border-2 border-primary-500 dark:border-primary-400 rounded-lg shadow-lg transform scale-105 z-10"
          >
            <div class="p-8">
              <div class="flex justify-between items-center">
                <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  Regular Membership (+International Epidemiological Association)
                </h2>
              </div>
              <p class="mt-4 text-gray-500 dark:text-gray-400">
                Combined EPiSON membership with International Epidemiological Association for
                enhanced international benefits.
              </p>

              <div class="mt-8">
                <span class="text-4xl font-bold text-gray-900 dark:text-white">₦50,000</span>
                <span class="text-gray-500 dark:text-gray-400">/year</span>
              </div>

              <ul class="mt-8 space-y-4">
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500" />
                  <span class="mx-4 text-gray-700 dark:text-gray-300">All EPiSON benefits</span>
                </li>
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500" />
                  <span class="mx-4 text-gray-700 dark:text-gray-300"
                    >International Epidemiological Association membership inclusion</span
                  >
                </li>
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500" />
                  <span class="mx-4 text-gray-700 dark:text-gray-300"
                    >International networking</span
                  >
                </li>
              </ul>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-700">
              <UButton to="/membership/apply?type=regular+iea" block color="primary" size="lg">
                Join Now
              </UButton>
            </div>
          </div>

          <!-- Early Career (Joint International Epidemiological Association & EPiSON) - Recommended -->
          <div
            class="overflow-hidden bg-white dark:bg-gray-800 border-2 border-primary-500/70 dark:border-primary-400/70 rounded-lg shadow-lg"
          >
            <div class="p-8">
              <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Early Career Membership (+International Epidemiological Association)
              </h2>
              <p class="mt-4 text-gray-500 dark:text-gray-400">
                Ideal for early career professionals seeking both EPiSON and International
                Epidemiological Association access.
              </p>

              <div class="mt-8">
                <span class="text-4xl font-bold text-gray-900 dark:text-white">₦20,000</span>
                <span class="text-gray-500 dark:text-gray-400">/year</span>
              </div>

              <ul class="mt-8 space-y-4">
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500" />
                  <span class="mx-4 text-gray-700 dark:text-gray-300">All EPiSON benefits</span>
                </li>
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500" />
                  <span class="mx-4 text-gray-700 dark:text-gray-300"
                    >International Epidemiological Association membership inclusion</span
                  >
                </li>
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500" />
                  <span class="mx-4 text-gray-700 dark:text-gray-300"
                    >International networking</span
                  >
                </li>
              </ul>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-700">
              <UButton to="/membership/apply?type=early-career+iea" block color="primary" size="lg">
                Join Now
              </UButton>
            </div>
          </div>

          <!-- Early Career (EPiSON only) -->
          <div
            class="overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
          >
            <div class="p-8">
              <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Early Career Membership
              </h2>
              <p class="mt-4 text-gray-500 dark:text-gray-400">
                For early career professionals in epidemiology and public health.
              </p>

              <div class="mt-8">
                <span class="text-4xl font-bold text-gray-900 dark:text-white">₦15,000</span>
                <span class="text-gray-500 dark:text-gray-400">/year</span>
              </div>

              <ul class="mt-8 space-y-4">
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500" />
                  <span class="mx-4 text-gray-700 dark:text-gray-300">Access to EPiSON events</span>
                </li>
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500" />
                  <span class="mx-4 text-gray-700 dark:text-gray-300"
                    >Mentorship opportunities</span
                  >
                </li>
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500" />
                  <span class="mx-4 text-gray-700 dark:text-gray-300">Networking</span>
                </li>
              </ul>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-700">
              <UButton to="/membership/apply?type=early-career" block color="primary" size="lg">
                Join Now
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-20 md:py-32">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              Epidemiological Association (International Epidemiological Association).
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
              organizations like International Epidemiological Association and AfEA.
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
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Membership - EPISON',
  meta: [
    {
      name: 'description',
      content:
        'Join the Epidemiological Society of Nigeria (EPISON) and become part of a professional community dedicated to advancing epidemiology in Nigeria.',
    },
  ],
})
</script>
