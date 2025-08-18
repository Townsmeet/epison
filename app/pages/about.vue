<template>
  <div class="bg-white dark:bg-gray-900">
    <!-- Hero -->
    <div class="relative bg-primary-700">
      <div class="absolute inset-0">
        <img
          class="w-full h-full object-cover opacity-10"
          src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
          alt="Public health professionals working"
        />
      </div>
      <div class="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          About EPISON
        </h1>
        <p class="mt-6 text-xl text-primary-100 max-w-3xl">
          Advancing the science and practice of epidemiology for better health outcomes in Nigeria.
        </p>
      </div>
    </div>

    <!-- Mission and Vision -->
    <div class="py-16 bg-white dark:bg-gray-900 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div class="mb-8 lg:mb-0">
            <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white">Our Mission</h2>
            <div class="mt-6 text-gray-500 dark:text-gray-300 space-y-6">
              <p>
                To promote the study and practice of epidemiology in Nigeria through capacity
                building, research, advocacy, and collaboration with relevant stakeholders to
                improve public health outcomes.
              </p>
            </div>

            <h2 class="mt-16 text-3xl font-extrabold text-gray-900 dark:text-white">Our Vision</h2>
            <div class="mt-6 text-gray-500 dark:text-gray-300 space-y-6">
              <p>
                To be the leading professional body in Nigeria for the advancement of
                epidemiological practice and its application to public health challenges.
              </p>
            </div>
          </div>
          <div class="lg:mt-0 lg:pl-8">
            <img
              class="relative mx-auto rounded-lg shadow-xl"
              src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
              alt="Public health teamwork"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Core Values -->
    <div class="bg-gray-50 dark:bg-gray-800 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2
            class="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase"
          >
            Values
          </h2>
          <p
            class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            Our Core Values
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
            Guiding principles that define who we are and how we operate
          </p>
        </div>

        <div class="mt-10">
          <div class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            <div v-for="(value, index) in values" :key="index" class="relative">
              <dt>
                <div
                  class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white"
                >
                  <UIcon :name="value.icon" class="h-6 w-6" />
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  {{ value.title }}
                </p>
              </dt>
              <dd class="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                {{ value.description }}
              </dd>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Leadership -->
    <div class="py-16 bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center mb-12">
          <h2
            class="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase"
          >
            Leadership
          </h2>
          <p
            class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            Executive Committee
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
            Meet the dedicated professionals leading EPISON
          </p>
        </div>

        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(member, index) in leadership"
            :key="index"
            class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
          >
            <div class="px-6 py-8 sm:p-10 sm:pb-6">
              <div class="flex items-center">
                <img class="h-24 w-24 rounded-full" :src="member.image" :alt="member.name" />
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                    {{ member.name }}
                  </h3>
                  <p class="text-primary-600 dark:text-primary-400">{{ member.position }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ member.institution }}</p>
                </div>
              </div>
              <div class="mt-6">
                <p class="text-sm text-gray-500 dark:text-gray-300">{{ member.bio }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- History -->
    <div class="bg-gray-50 dark:bg-gray-800 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center mb-12">
          <h2
            class="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase"
          >
            Our Story
          </h2>
          <p
            class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            Our History
          </p>
        </div>

        <div class="relative">
          <!-- Timeline -->
          <div class="relative">
            <div
              class="absolute left-4 h-full w-0.5 bg-gray-300 dark:bg-gray-600"
              aria-hidden="true"
            />

            <ul class="space-y-8">
              <li v-for="(event, index) in history" :key="index" class="relative">
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <div
                      class="flex items-center justify-center h-8 w-8 rounded-full bg-primary-500 text-white"
                    >
                      <UIcon name="i-heroicons-check" class="h-4 w-4" />
                    </div>
                  </div>
                  <div class="ml-6">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                      {{ event.year }}: {{ event.title }}
                    </h3>
                    <p class="mt-2 text-gray-600 dark:text-gray-300">
                      {{ event.description }}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="bg-primary-700">
      <div class="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
          <span class="block">Ready to make a difference?</span>
          <span class="block">Join EPISON today.</span>
        </h2>
        <p class="mt-4 text-lg leading-6 text-primary-100">
          Become part of a growing community of public health professionals dedicated to advancing
          epidemiology in Nigeria.
        </p>
        <UButton
          to="/membership"
          size="xl"
          class="mt-8 w-full bg-white text-primary-600 hover:bg-gray-100 sm:w-auto"
        >
          Join Now
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const values = [
  {
    icon: 'i-heroicons-light-bulb',
    title: 'Excellence',
    description:
      'We are committed to the highest standards in epidemiological practice and research.',
  },
  {
    icon: 'i-heroicons-scale',
    title: 'Integrity',
    description: 'We uphold the highest ethical standards in all our activities and relationships.',
  },
  {
    icon: 'i-heroicons-users',
    title: 'Collaboration',
    description: 'We believe in the power of partnerships to achieve our public health goals.',
  },
  {
    icon: 'i-heroicons-light-bulb',
    title: 'Innovation',
    description: 'We embrace new ideas and approaches to address public health challenges.',
  },
  {
    icon: 'i-heroicons-globe-alt',
    title: 'Equity',
    description: 'We are committed to reducing health disparities and promoting health equity.',
  },
  {
    icon: 'i-heroicons-academic-cap',
    title: 'Professionalism',
    description: 'We maintain the highest standards of professional conduct and competence.',
  },
]

const leadership = [
  {
    name: 'Dr. Amina Bello',
    position: 'President',
    institution: 'University of Ibadan',
    bio: 'Professor of Epidemiology with over 20 years of experience in infectious disease epidemiology and control.',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    name: 'Prof. Chukwuma Okoro',
    position: 'Vice President',
    institution: 'University of Lagos',
    bio: 'Expert in non-communicable disease epidemiology and health systems research.',
    image: 'https://randomuser.me/api/portraits/men/42.jpg',
  },
  {
    name: 'Dr. Fatima Ibrahim',
    position: 'General Secretary',
    institution: 'Ahmadu Bello University',
    bio: 'Specialist in maternal and child health epidemiology with extensive field experience.',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Dr. Emeka Nwosu',
    position: 'Treasurer',
    institution: 'University of Nigeria, Nsukka',
    bio: 'Health economist and epidemiologist focusing on health financing and policy.',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Dr. Aisha Yusuf',
    position: 'Editor-in-Chief',
    institution: 'Bayero University Kano',
    bio: 'Expert in infectious disease modeling and outbreak investigation.',
    image: 'https://randomuser.me/api/portraits/women/63.jpg',
  },
  {
    name: 'Dr. Olumide Adebayo',
    position: 'Publicity Secretary',
    institution: 'Obafemi Awolowo University',
    bio: 'Specialist in health communication and behavioral epidemiology.',
    image: 'https://randomuser.me/api/portraits/men/54.jpg',
  },
]

const history = [
  {
    year: '1995',
    title: 'Founding of EPISON',
    description:
      'The Epidemiological Society of Nigeria was established by a group of public health professionals to promote epidemiology in Nigeria.',
  },
  {
    year: '1998',
    title: 'First Scientific Conference',
    description:
      'Successfully organized the first annual scientific conference in Lagos, bringing together epidemiologists from across the country.',
  },
  {
    year: '2005',
    title: 'Journal Launch',
    description:
      'Launched the Nigerian Journal of Epidemiology, a peer-reviewed publication for epidemiological research.',
  },
  {
    year: '2012',
    title: 'International Collaboration',
    description:
      'Established partnerships with international epidemiological associations for knowledge exchange and capacity building.',
  },
  {
    year: '2020',
    title: 'COVID-19 Response',
    description:
      "Played a key role in Nigeria's COVID-19 response through research, training, and policy advice.",
  },
  {
    year: '2023',
    title: 'New Headquarters',
    description:
      'Inaugurated the EPISON secretariat in Abuja to better serve members across Nigeria.',
  },
]
</script>
