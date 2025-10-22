<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-teal-900/20"
  >
    <!-- Hero Section (Reusable) -->
    <HeroSection
      title="Contact Us"
      subtitle="We'd love to hear from you. Get in touch with the EPISON team."
    />

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
                      Department of Community Medicine,<br />
                      Univeristy of Abuja Teaching Hospital,<br />
                      Abuja, Nigeria.
                    </p>
                  </div>
                </div>

                <!-- <div class="flex items-start">
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
                </div> -->

                <div class="flex items-start">
                  <div class="flex-shrink-0 mt-1">
                    <div
                      class="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white"
                    >
                      <UIcon name="i-heroicons-envelope" class="h-5 w-5" />
                    </div>
                  </div>
                  <div class="ml-4 text-gray-600 dark:text-gray-300">
                    <p class="font-semibold text-gray-900 dark:text-white">
                      episonnigeria@gmail.com
                    </p>
                    <p class="mt-1 text-sm">For general inquiries</p>
                  </div>
                </div>
              </div>

              <div class="flex space-x-4 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <a
                  href="https://x.com/EPiSONNigeria"
                  class="text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
                >
                  <span class="sr-only">Twitter</span>
                  <UIcon name="i-heroicons-at-symbol" class="h-6 w-6" />
                </a>
                <a
                  href="https://www.linkedin.com/groups/12585259/"
                  class="text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
                >
                  <span class="sr-only">LinkedIn</span>
                  <UIcon name="i-heroicons-building-office" class="h-6 w-6" />
                </a>
                <a
                  href="https://www.instagram.com/episonnigeria/"
                  class="text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
                >
                  <span class="sr-only">Instagram</span>
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

              <UForm :schema="schema" :state="form" class="space-y-6" @submit="onSubmit">
                <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <UFormField label="First name" name="firstName" required>
                    <UInput v-model="form.firstName" placeholder="John" class="w-full" />
                  </UFormField>

                  <UFormField label="Last name" name="lastName" required>
                    <UInput v-model="form.lastName" placeholder="Doe" class="w-full" />
                  </UFormField>

                  <UFormField label="Email" name="email" required>
                    <UInput
                      v-model="form.email"
                      type="email"
                      placeholder="you@example.com"
                      class="w-full"
                    />
                  </UFormField>

                  <UFormField label="Phone" name="phone" required>
                    <UInput
                      v-model="form.phone"
                      type="tel"
                      placeholder="+234 800 000 0000"
                      class="w-full"
                    />
                  </UFormField>

                  <UFormField label="Subject" name="subject" class="sm:col-span-2" required>
                    <USelect
                      v-model="form.subject"
                      :items="subjectOptions"
                      placeholder="Select a subject"
                      class="w-full"
                    />
                  </UFormField>

                  <UFormField label="Message" name="message" class="sm:col-span-2" required>
                    <UTextarea
                      v-model="form.message"
                      :rows="6"
                      placeholder="How can we help you?"
                      class="w-full"
                    />
                  </UFormField>
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
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

const schema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(100, 'Last name is too long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(5, 'Please enter a valid phone number').max(30, 'Phone number is too long'),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message should be at least 10 characters'),
})
const isSubmitting = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: undefined,
  message: '',
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
    // Submit to server endpoint
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        subject: form.subject,
        message: form.message,
      },
    })

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
      subject: undefined,
      message: '',
    })
  } catch (error) {
    console.error('Error submitting form:', error)
    useToast().add({
      title: 'Error',
      description:
        (error as { data?: { statusMessage?: string } })?.data?.statusMessage ||
        (error instanceof Error
          ? error.message
          : 'There was an error sending your message. Please try again later.'),
      icon: 'i-heroicons-exclamation-circle',
      color: 'error',
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>
