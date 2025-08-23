<template>
  <div class="bg-white dark:bg-gray-900">
    <!-- Hero Section -->
    <section
      class="relative min-h-[70vh] flex items-center bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden"
    >
      <div class="absolute inset-0 opacity-20">
        <div
          class="absolute top-20 left-10 w-72 h-72 bg-blue-100 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
        />
        <div
          class="absolute top-40 right-10 w-72 h-72 bg-indigo-100 dark:bg-indigo-900/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          style="animation-delay: 2s"
        />
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="max-w-4xl">
          <div
            class="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm mb-8"
          >
            <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Privacy Policy</span>
          </div>

          <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
            <span class="block text-gray-900 dark:text-white leading-none">Privacy</span>
            <span
              class="block bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent leading-none"
            >
              Policy
            </span>
          </h1>

          <div class="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-8" />

          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
            Your privacy is important to us. This policy explains how we collect, use, and protect
            your information.
          </p>
        </div>
      </div>
    </section>

    <!-- Privacy Policy Content -->
    <section class="py-20 md:py-32 bg-white dark:bg-gray-900">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="prose prose-lg dark:prose-invert max-w-none">
          <p class="text-gray-600 dark:text-gray-300 mb-8">
            <strong>Last updated:</strong> August 2024
          </p>

          <div class="space-y-12">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Information We Collect
              </h2>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                We collect information you provide directly to us, such as when you create an
                account, register for events, or contact us. This may include:
              </p>
              <ul class="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li>Name, email address, and contact information</li>
                <li>Professional credentials and affiliations</li>
                <li>Payment information for membership and events</li>
                <li>Communications with us</li>
              </ul>
            </div>

            <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                How We Use Your Information
              </h2>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul class="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li>Provide and maintain our services</li>
                <li>Process membership applications and renewals</li>
                <li>Send you updates about events and activities</li>
                <li>Respond to your inquiries and provide support</li>
                <li>Improve our website and services</li>
              </ul>
            </div>

            <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Information Sharing
              </h2>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to third
                parties without your consent, except as described in this policy. We may share
                information with trusted partners who assist us in operating our website and
                conducting our business.
              </p>
            </div>

            <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Data Security</h2>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                We implement appropriate security measures to protect your personal information
                against unauthorized access, alteration, disclosure, or destruction. However, no
                method of transmission over the internet is 100% secure.
              </p>
            </div>

            <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Rights</h2>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul class="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li>Access and update your personal information</li>
                <li>Request deletion of your data</li>
                <li>Opt out of marketing communications</li>
                <li>Request a copy of your data</li>
              </ul>
            </div>

            <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at
                privacy@epison.org or write to us at our registered address.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Privacy policy page
</script>
