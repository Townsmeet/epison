<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Hero -->
    <div class="relative bg-primary-700">
      <div class="absolute inset-0">
        <img
          class="w-full h-full object-cover opacity-10"
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
          alt="Office building"
        />
      </div>
      <div class="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Contact Us
        </h1>
        <p class="mt-6 text-xl text-primary-100 max-w-3xl">
          We'd love to hear from you. Get in touch with the EPISON team.
        </p>
      </div>
    </div>

    <!-- Contact Info -->
    <div class="bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-3 lg:gap-8">
          <div class="space-y-8">
            <div>
              <h2 class="text-2xl font-extrabold text-gray-900 dark:text-white">
                Contact Information
              </h2>
              <p class="mt-4 text-lg text-gray-500 dark:text-gray-400">
                Have questions or need more information? Reach out to us through any of these
                channels.
              </p>
            </div>

            <div class="space-y-6">
              <div class="flex">
                <div class="flex-shrink-0">
                  <UIcon name="i-heroicons-map-pin" class="h-6 w-6 text-primary-500" />
                </div>
                <div class="ml-3 text-base text-gray-500 dark:text-gray-400">
                  <p>EPISON Secretariat</p>
                  <p class="mt-1">
                    Department of Epidemiology and Medical Statistics,<br />
                    Faculty of Public Health,<br />
                    University of Ibadan,<br />
                    Ibadan, Nigeria
                  </p>
                </div>
              </div>

              <div class="flex">
                <div class="flex-shrink-0">
                  <UIcon name="i-heroicons-phone" class="h-6 w-6 text-primary-500" />
                </div>
                <div class="ml-3 text-base text-gray-500 dark:text-gray-400">
                  <p>+234 812 345 6789</p>
                  <p class="mt-1">Mon - Fri, 9am - 5pm WAT</p>
                </div>
              </div>

              <div class="flex">
                <div class="flex-shrink-0">
                  <UIcon name="i-heroicons-envelope" class="h-6 w-6 text-primary-500" />
                </div>
                <div class="ml-3 text-base text-gray-500 dark:text-gray-400">
                  <p>info@epison.org.ng</p>
                  <p class="mt-1">For general inquiries</p>
                </div>
              </div>

              <div class="flex">
                <div class="flex-shrink-0">
                  <UIcon name="i-heroicons-user-group" class="h-6 w-6 text-primary-500" />
                </div>
                <div class="ml-3 text-base text-gray-500 dark:text-gray-400">
                  <p>membership@epison.org.ng</p>
                  <p class="mt-1">For membership inquiries</p>
                </div>
              </div>

              <div class="flex">
                <div class="flex-shrink-0">
                  <UIcon name="i-heroicons-calendar" class="h-6 w-6 text-primary-500" />
                </div>
                <div class="ml-3 text-base text-gray-500 dark:text-gray-400">
                  <p>events@epison.org.ng</p>
                  <p class="mt-1">For event and conference inquiries</p>
                </div>
              </div>
            </div>

            <div class="flex space-x-6">
              <a href="#" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span class="sr-only">Facebook</span>
                <UIcon name="i-simple-icons-facebook" class="h-6 w-6" />
              </a>
              <a href="#" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span class="sr-only">Twitter</span>
                <UIcon name="i-simple-icons-x" class="h-6 w-6" />
              </a>
              <a href="#" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span class="sr-only">LinkedIn</span>
                <UIcon name="i-simple-icons-linkedin" class="h-6 w-6" />
              </a>
              <a href="#" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span class="sr-only">YouTube</span>
                <UIcon name="i-simple-icons-youtube" class="h-6 w-6" />
              </a>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="mt-12 lg:mt-0 lg:col-span-2">
            <div class="bg-white dark:bg-gray-800 py-8 px-6 shadow rounded-lg sm:px-10">
              <h2 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">
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
    </div>

    <!-- Map -->
    <div class="bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-8">Our Location</h2>
        <div class="rounded-lg overflow-hidden h-96 bg-gray-100 dark:bg-gray-800">
          <!-- Replace with your actual map embed code -->
          <div class="h-full w-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <div class="text-center p-6">
              <UIcon name="i-heroicons-map" class="h-12 w-12 mx-auto text-gray-400" />
              <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">Map Location</h3>
              <p class="mt-1 text-gray-500 dark:text-gray-400">
                Interactive map would be embedded here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ -->
    <div class="bg-gray-50 dark:bg-gray-800 py-16">
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
            Find answers to common questions about EPISON
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

            <div class="mt-10 text-center">
              <p class="text-base text-gray-500 dark:text-gray-400">
                Still have questions?{' '}
                <a
                  href="#contact-form"
                  class="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
                >
                  Contact our support team
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
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

const faqs = [
  {
    label: 'How can I become a member of EPISON?',
    content:
      'To become a member of EPISON, please visit our Membership page and follow the application process. You can choose from different membership categories based on your professional status.',
  },
  {
    label: 'When is the next EPISON conference?',
    content:
      'Information about upcoming conferences is available on our Conferences page. You can also subscribe to our newsletter to receive updates about future events.',
  },
  {
    label: 'How can I submit a research paper to EPISON?',
    content:
      'EPISON accepts research paper submissions for our annual conference and journal. Please check the Calls for Papers section on our website for submission guidelines and deadlines.',
  },
  {
    label: 'Does EPISON offer training programs?',
    content:
      'Yes, EPISON organizes various training programs, workshops, and webinars throughout the year. Visit our Events page or subscribe to our newsletter to stay updated on upcoming training opportunities.',
  },
  {
    label: 'How can I advertise a job opening on the EPISON website?',
    content:
      'EPISON members can post job openings on our website. Please contact us at info@epison.org.ng for more information about job postings and advertising rates.',
  },
  {
    label: 'How can I update my member profile?',
    content:
      'You can update your member profile by logging into your account on the EPISON website. If you encounter any issues, please contact our membership team at membership@epison.org.ng.',
  },
  {
    label: 'How can I volunteer for EPISON?',
    content:
      'EPISON welcomes volunteers to contribute to our various committees and activities. Please fill out the contact form with your areas of interest and expertise, and our volunteer coordinator will get in touch with you.',
  },
  {
    label: 'How can I make a donation to EPISON?',
    content:
      'EPISON appreciates donations to support our mission. Please contact us at info@epison.org.ng for information on how to make a contribution.',
  },
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
      color: 'green',
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
      color: 'red',
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>
