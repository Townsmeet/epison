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
          Join EPISON and become part of Nigeria's leading epidemiological community.
        </p>
      </div>
    </section>

    <!-- Membership Types -->
    <section class="py-20 md:py-32 bg-gray-50/50 dark:bg-gray-900/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          class="mb-6 p-4 bg-primary-50 dark:bg-gray-800/60 rounded-lg text-sm text-gray-700 dark:text-gray-300"
        >
          <p>
            We recommend the <span class="font-semibold">+IEA</span> options for broader
            professional benefits. IEA stands for
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
                  Regular Membership (+IEA)
                </h2>
              </div>
              <p class="mt-4 text-gray-500 dark:text-gray-400">
                Combined EPiSON membership with IEA for enhanced international benefits.
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
                    >IEA membership inclusion</span
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

          <!-- Early Career (Joint IEA & EPiSON) - Recommended -->
          <div
            class="overflow-hidden bg-white dark:bg-gray-800 border-2 border-primary-500/70 dark:border-primary-400/70 rounded-lg shadow-lg"
          >
            <div class="p-8">
              <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Early Career Membership (+IEA)
              </h2>
              <p class="mt-4 text-gray-500 dark:text-gray-400">
                Ideal for early career professionals seeking both EPiSON and IEA access.
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
                    >IEA membership inclusion</span
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
