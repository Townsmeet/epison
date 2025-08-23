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
            Contact Us
          </span>
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          We'd love to hear from you. Get in touch with the EPISON team.
        </p>
      </div>
    </section>

    <!-- Contact Info & Form -->
    <section class="py-20 md:py-32 bg-gray-50/50 dark:bg-gray-900/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-3 lg:gap-12">
          <!-- Contact Information -->
          <div class="space-y-8">
            <div
              class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-gray-700/50 shadow-sm p-8"
            >
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Contact Information
              </h2>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                Have questions or need more information? Reach out to us through any of these
                channels.
              </p>

              <div class="space-y-6">
                <div class="flex items-start">
                  <div class="flex-shrink-0 mt-1">
                    <div
                      class="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white"
                    >
                      <UIcon name="i-heroicons-map-pin" class="h-5 w-5" />
                    </div>
                  </div>
                  <div class="ml-4 text-gray-600 dark:text-gray-300">
                    <p class="font-semibold text-gray-900 dark:text-white">EPISON Secretariat</p>
                    <p class="mt-1 text-sm leading-relaxed">
                      Department of Epidemiology and Medical Statistics,<br />
                      Faculty of Public Health,<br />
                      University of Ibadan,<br />
                      Ibadan, Nigeria
                    </p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div class="flex-shrink-0 mt-1">
                    <div
                      class="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white"
                    >
                      <UIcon name="i-heroicons-phone" class="h-5 w-5" />
                    </div>
                  </div>
                  <div class="ml-4 text-gray-600 dark:text-gray-300">
                    <p class="font-semibold text-gray-900 dark:text-white">+234 812 345 6789</p>
                    <p class="mt-1 text-sm">Mon - Fri, 9am - 5pm WAT</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div class="flex-shrink-0 mt-1">
                    <div
                      class="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white"
                    >
                      <UIcon name="i-heroicons-envelope" class="h-5 w-5" />
                    </div>
                  </div>
                  <div class="ml-4 text-gray-600 dark:text-gray-300">
                    <p class="font-semibold text-gray-900 dark:text-white">info@epison.org.ng</p>
                    <p class="mt-1 text-sm">For general inquiries</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div class="flex-shrink-0 mt-1">
                    <div
                      class="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white"
                    >
                      <UIcon name="i-heroicons-user-group" class="h-5 w-5" />
                    </div>
                  </div>
                  <div class="ml-4 text-gray-600 dark:text-gray-300">
                    <p class="font-semibold text-gray-900 dark:text-white">
                      membership@epison.org.ng
                    </p>
                    <p class="mt-1 text-sm">For membership inquiries</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div class="flex-shrink-0 mt-1">
                    <div
                      class="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white"
                    >
                      <UIcon name="i-heroicons-calendar" class="h-5 w-5" />
                    </div>
                  </div>
                  <div class="ml-4 text-gray-600 dark:text-gray-300">
                    <p class="font-semibold text-gray-900 dark:text-white">events@epison.org.ng</p>
                    <p class="mt-1 text-sm">For event and conference inquiries</p>
                  </div>
                </div>
              </div>

              <div class="flex space-x-4 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <a
                  href="#"
                  class="text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
                >
                  <span class="sr-only">Facebook</span>
                  <UIcon name="i-heroicons-globe-alt" class="h-6 w-6" />
                </a>
                <a
                  href="#"
                  class="text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
                >
                  <span class="sr-only">Twitter</span>
                  <UIcon name="i-heroicons-at-symbol" class="h-6 w-6" />
                </a>
                <a
                  href="#"
                  class="text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
                >
                  <span class="sr-only">LinkedIn</span>
                  <UIcon name="i-heroicons-building-office" class="h-6 w-6" />
                </a>
                <a
                  href="#"
                  class="text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
                >
                  <span class="sr-only">YouTube</span>
                  <UIcon name="i-heroicons-play" class="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="mt-12 lg:mt-0 lg:col-span-2">
            <div
              class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-gray-700/50 shadow-sm p-8"
            >
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Send us a message
              </h2>

              <UForm :state="form" class="space-y-6" @submit="onSubmit">
                <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <UFormGroup label="First name" name="firstName" required>
                    <UInput v-model="form.firstName" placeholder="John" />
                  </UFormGroup>

                  <UFormGroup label="Last name" name="lastName" required>
                    <UInput v-model="form.lastName" placeholder="Doe" />
                  </UFormGroup>

                  <UFormGroup label="Email" name="email" class="sm:col-span-2" required>
                    <UInput v-model="form.email" type="email" placeholder="you@example.com" />
                  </UFormGroup>

                  <UFormGroup label="Phone" name="phone" class="sm:col-span-2">
                    <UInput v-model="form.phone" type="tel" placeholder="+234 800 000 0000" />
                  </UFormGroup>

                  <UFormGroup label="Subject" name="subject" class="sm:col-span-2" required>
                    <USelect
                      v-model="form.subject"
                      :options="subjectOptions"
                      placeholder="Select a subject"
                    />
                  </UFormGroup>

                  <UFormGroup label="Message" name="message" class="sm:col-span-2" required>
                    <UTextarea
                      v-model="form.message"
                      :rows="6"
                      placeholder="How can we help you?"
                    />
                  </UFormGroup>

                  <div class="sm:col-span-2">
                    <div class="flex items-start">
                      <div class="flex items-center h-5">
                        <UCheckbox
                          v-model="form.newsletter"
                          name="newsletter"
                          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </div>
                      <div class="ml-3 text-sm">
                        <label for="newsletter" class="font-medium text-gray-700 dark:text-gray-300"
                          >Sign up for our newsletter</label
                        >
                        <p class="text-gray-500 dark:text-gray-400">
                          Get the latest news and updates from EPISON.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex justify-end">
                  <UButton type="submit" color="primary" :loading="isSubmitting" size="lg">
                    Send Message
                  </UButton>
                </div>
              </UForm>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Map -->
    <section class="py-20 md:py-32 bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Our Location
        </h2>
        <div
          class="rounded-2xl overflow-hidden h-96 bg-gray-100 dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div
            class="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800"
          >
            <div class="text-center p-6">
              <div
                class="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white mx-auto mb-4"
              >
                <UIcon name="i-heroicons-map" class="h-8 w-8" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                University of Ibadan
              </h3>
              <p class="mt-1 text-gray-600 dark:text-gray-400">
                Interactive map would be embedded here
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const isSubmitting = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: null,
  message: '',
  newsletter: false,
})

const subjectOptions = [
  'General Inquiry',
  'Membership',
  'Events & Conferences',
  'Partnerships',
  'Media & Press',
  'Website Feedback',
  'Other',
]

async function onSubmit() {
  try {
    isSubmitting.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Show success message
    useToast().add({
      title: 'Message sent',
      description: 'Thank you for contacting us. We will get back to you soon!',
      icon: 'i-heroicons-check-circle',
      color: 'success',
    })

    // Reset form
    Object.assign(form, {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: null,
      message: '',
      newsletter: false,
    })
  } catch (error) {
    console.error('Error submitting form:', error)
    useToast().add({
      title: 'Error',
      description: 'There was an error sending your message. Please try again later.',
      icon: 'i-heroicons-exclamation-circle',
      color: 'error',
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>
