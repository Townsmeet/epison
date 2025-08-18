<template>
  <div class="py-12 bg-white dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          Membership
        </h1>
        <p
          class="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
        >
          Join EPISON and become part of Nigeria's leading epidemiological community.
        </p>
      </div>

      <!-- Membership Types -->
      <div class="mt-16">
        <div class="grid grid-cols-1 gap-8 mt-8 xl:mt-12 lg:grid-cols-3">
          <!-- Regular Member -->
          <div
            class="overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
          >
            <div class="p-8">
              <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Regular Member
              </h2>
              <p class="mt-4 text-gray-500 dark:text-gray-400">
                For professionals in the field of epidemiology and public health.
              </p>

              <div class="mt-8">
                <span class="text-4xl font-bold text-gray-900 dark:text-white">₦25,000</span>
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

          <!-- Student Member -->
          <div
            class="overflow-hidden bg-white dark:bg-gray-800 border-2 border-primary-500 dark:border-primary-400 rounded-lg shadow-lg transform scale-105 z-10"
          >
            <div class="p-8">
              <div class="flex justify-between items-center">
                <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  Student Member
                </h2>
                <span class="px-3 py-1 text-sm font-medium text-white bg-primary-500 rounded-full"
                  >Popular</span
                >
              </div>
              <p class="mt-4 text-gray-500 dark:text-gray-400">
                For students pursuing degrees in epidemiology or related fields.
              </p>

              <div class="mt-8">
                <span class="text-4xl font-bold text-gray-900 dark:text-white">₦10,000</span>
                <span class="text-gray-500 dark:text-gray-400">/year</span>
              </div>

              <ul class="mt-8 space-y-4">
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500" />
                  <span class="mx-4 text-gray-700 dark:text-gray-300"
                    >Discounted conference rates</span
                  >
                </li>
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500" />
                  <span class="mx-4 text-gray-700 dark:text-gray-300"
                    >Access to mentorship program</span
                  >
                </li>
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500" />
                  <span class="mx-4 text-gray-700 dark:text-gray-300"
                    >Student research opportunities</span
                  >
                </li>
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500" />
                  <span class="mx-4 text-gray-700 dark:text-gray-300"
                    >Access to all EPISON events</span
                  >
                </li>
              </ul>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-700">
              <UButton to="/membership/apply?type=student" block color="primary" size="lg">
                Join Now
              </UButton>
            </div>
          </div>

          <!-- Institutional Member -->
          <div
            class="overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
          >
            <div class="p-8">
              <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Institutional Member
              </h2>
              <p class="mt-4 text-gray-500 dark:text-gray-400">
                For organizations supporting epidemiology and public health.
              </p>

              <div class="mt-8">
                <span class="text-4xl font-bold text-gray-900 dark:text-white">₦100,000</span>
                <span class="text-gray-500 dark:text-gray-400">/year</span>
              </div>

              <ul class="mt-8 space-y-4">
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500" />
                  <span class="mx-4 text-gray-700 dark:text-gray-300">Up to 5 staff members</span>
                </li>
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500" />
                  <span class="mx-4 text-gray-700 dark:text-gray-300"
                    >Organization profile on our website</span
                  >
                </li>
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500" />
                  <span class="mx-4 text-gray-700 dark:text-gray-300"
                    >Event sponsorship opportunities</span
                  >
                </li>
              </ul>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-700">
              <UButton to="/membership/apply?type=institutional" block color="primary" size="lg">
                Join Now
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Benefits Section -->
      <div class="mt-24">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Benefits of Membership
          </h2>
          <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            Join our community of epidemiology professionals and enjoy these exclusive benefits.
          </p>
        </div>

        <div class="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div
              class="w-12 h-12 rounded-md bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-academic-cap"
                class="w-6 h-6 text-primary-600 dark:text-primary-400"
              />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Professional Development
            </h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              Access to workshops, webinars, and training programs to enhance your skills and
              knowledge.
            </p>
          </div>

          <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div
              class="w-12 h-12 rounded-md bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-user-group"
                class="w-6 h-6 text-primary-600 dark:text-primary-400"
              />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">Networking</h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              Connect with fellow epidemiologists and public health professionals across Nigeria.
            </p>
          </div>

          <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div
              class="w-12 h-12 rounded-md bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-document-text"
                class="w-6 h-6 text-primary-600 dark:text-primary-400"
              />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Research Opportunities
            </h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              Participate in collaborative research projects and access funding opportunities.
            </p>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="mt-24 bg-primary-50 dark:bg-gray-800 rounded-2xl p-8 sm:p-12">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Ready to join EPISON?
          </h2>
          <p class="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Become a member today and start enjoying the benefits of being part of Nigeria's leading
            epidemiological society.
          </p>
          <div class="mt-8 flex justify-center">
            <UButton
              to="/membership/apply"
              size="xl"
              color="primary"
              class="px-8 py-3 text-base font-medium"
            >
              Apply for Membership
            </UButton>
          </div>
        </div>
      </div>
    </div>
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
