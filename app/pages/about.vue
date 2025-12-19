<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-teal-900/20"
  >
    <!-- Hero Section (Reusable) -->
    <HeroSection
      title="About EPiSON"
      subtitle="The Epidemiological Society of Nigeria (EPiSON) was registered in 2010 and enjoys joint membership with the International Epidemiological Association (IEA). We are dedicated to advancing epidemiological practice, research, and teaching throughout Nigeria."
    />

    <!-- Main Goals Section -->
    <section class="py-20 md:py-32 bg-gray-50/50 dark:bg-gray-900/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="max-w-3xl mx-auto text-center mb-16">
          <div
            class="inline-flex items-center space-x-2 px-4 py-2 bg-primary-50/80 dark:bg-primary-900/20 backdrop-blur-sm rounded-full border border-primary-200/50 dark:border-primary-700/50 shadow-sm mb-6"
          >
            <div class="w-2 h-2 bg-primary-500 rounded-full" />
            <span class="text-sm font-medium text-primary-700 dark:text-primary-300"
              >Our Goals</span
            >
          </div>
          <h2
            class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
          >
            Main Goals of
            <span
              class="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent"
            >
              the Society
            </span>
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            EPiSON is committed to advancing epidemiology through collaboration, innovation, and
            excellence in practice.
          </p>
        </div>

        <!-- Goals Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(goal, index) in goals"
            :key="index"
            class="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-300"
          >
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0">
                <div
                  class="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                >
                  <UIcon :name="goal.icon" class="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {{ goal.title }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {{ goal.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Membership Section -->
    <section class="py-20 md:py-32 bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div class="relative order-2 lg:order-1">
            <div
              class="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-700"
            >
              <img
                class="w-full h-96 object-cover"
                src="/about.png"
                alt="Multidisciplinary health professionals"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            <!-- Floating badge -->
            <div
              class="absolute -top-4 -left-4 z-20 bg-gradient-to-r from-primary-500 to-blue-500 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg"
            >
              Since 2010
            </div>
          </div>

          <div class="order-1 lg:order-2">
            <div
              class="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50/80 dark:bg-blue-900/20 backdrop-blur-sm rounded-full border border-blue-200/50 dark:border-blue-700/50 shadow-sm mb-6"
            >
              <div class="w-2 h-2 bg-blue-500 rounded-full" />
              <span class="text-sm font-medium text-blue-700 dark:text-blue-300">Our Members</span>
            </div>
            <h2
              class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
            >
              Multidisciplinary
              <span
                class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                Community
              </span>
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              EPiSON currently has members spread across all states in Nigeria. Our membership is
              drawn from a wide range of disciplines, including {{ disciplines.join(', ') }} (among
              others), creating a rich, collaborative environment for epidemiological advancement.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Leadership -->
    <section class="py-20 md:py-32 bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="max-w-2xl mb-20">
          <div
            class="inline-flex items-center space-x-2 px-4 py-2 bg-green-50/80 dark:bg-green-900/20 backdrop-blur-sm rounded-full border border-green-200/50 dark:border-green-700/50 shadow-sm mb-6"
          >
            <div class="w-2 h-2 bg-green-500 rounded-full" />
            <span class="text-sm font-medium text-green-700 dark:text-green-300">Leadership</span>
          </div>
          <h2
            class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
          >
            Executive
            <span class="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent"
              >Committee</span
            >
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Meet the dedicated professionals leading EPISON towards excellence in epidemiology.
          </p>
        </div>

        <!-- Leadership Grid -->
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(member, index) in leadership"
            :key="index"
            class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-gray-700/50 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div class="p-8">
              <div class="flex flex-col items-center text-center">
                <div class="relative mb-6">
                  <img
                    class="h-28 w-28 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                    :src="member.image"
                    :alt="member.name"
                  />
                  <div
                    class="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg"
                  >
                    {{ index + 1 }}
                  </div>
                </div>

                <div class="space-y-2 mb-4">
                  <h3
                    class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
                  >
                    {{ member.name }}
                  </h3>
                  <p class="text-primary-600 dark:text-primary-400 font-semibold">
                    {{ member.position }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ member.institution }}</p>
                </div>

                <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {{ member.bio }}
                </p>
              </div>
            </div>

            <!-- Subtle hover effect -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Board of Trustees -->
    <section class="py-20 md:py-32 bg-gray-50/50 dark:bg-gray-900/50 relative overflow-hidden">
      <!-- Subtle background pattern -->
      <div class="absolute inset-0 opacity-5">
        <div
          class="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mix-blend-multiply filter blur-3xl"
        />
        <div
          class="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full mix-blend-multiply filter blur-3xl"
        />
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="max-w-2xl mb-20">
          <div
            class="inline-flex items-center space-x-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm mb-6"
          >
            <div class="w-2 h-2 bg-orange-500 rounded-full" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Governance</span>
          </div>
          <h2
            class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
          >
            Board of
            <span class="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"
              >Trustees</span
            >
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Distinguished professionals providing strategic oversight and governance to ensure
            EPISON's mission and vision are fulfilled.
          </p>
        </div>

        <!-- Board of Trustees Grid -->
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(trustee, index) in boardOfTrustees"
            :key="index"
            class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-gray-700/50 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div class="p-8">
              <div class="flex flex-col items-center text-center">
                <div class="relative mb-6">
                  <img
                    class="h-24 w-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                    :src="trustee.image"
                    :alt="trustee.name"
                  />
                  <div
                    class="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg"
                  >
                    {{ index + 1 }}
                  </div>
                </div>

                <div class="space-y-2 mb-4">
                  <h3
                    class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
                  >
                    {{ trustee.name }}
                  </h3>
                  <p class="text-orange-600 dark:text-orange-400 font-semibold">
                    {{ trustee.position }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ trustee.institution }}</p>
                </div>

                <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {{ trustee.bio }}
                </p>
              </div>
            </div>

            <!-- Subtle hover effect -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section
      class="py-20 md:py-32 bg-gradient-to-br from-primary-600 via-primary-500 to-blue-600 relative overflow-hidden"
    >
      <!-- Decorative elements -->
      <div class="absolute inset-0 opacity-10">
        <div
          class="absolute top-20 left-20 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"
        />
        <div
          class="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"
        />
      </div>

      <div class="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Ready to make a difference?
        </h2>
        <p class="text-xl text-primary-100 mb-8 leading-relaxed max-w-2xl mx-auto">
          Become part of a growing community of public health professionals dedicated to advancing
          epidemiology in Nigeria.
        </p>

        <div
          class="inline-flex items-center space-x-3 px-8 py-4 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <div class="flex -space-x-2">
            <div
              class="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full border-2 border-white"
            />
            <div
              class="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white"
            />
            <div
              class="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-white"
            />
          </div>
          <span class="text-gray-700 font-medium">Join 1000+ members</span>
          <NuxtLink
            to="/membership"
            class="text-primary-600 font-semibold hover:underline group-hover:translate-x-1 transition-transform"
          >
            Join EPISON →
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// SEO Configuration
useSeoMeta({
  title: 'About EPISON - Epidemiological Society of Nigeria',
  description:
    'Learn about the Epidemiological Society of Nigeria (EPISON), registered in 2010 with joint membership in the International Epidemiological Association. Meet our leadership and discover our goals for advancing epidemiology in Nigeria.',
  ogTitle: 'About EPISON - Epidemiological Society of Nigeria',
  ogDescription:
    "Discover EPISON's mission to advance epidemiological practice, research, and teaching throughout Nigeria since 2010.",
  ogImage: 'https://epison.ng/hero.jpeg',
  ogUrl: 'https://epison.ng/about',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'About EPISON - Epidemiological Society of Nigeria',
  twitterDescription:
    "Discover EPISON's mission to advance epidemiological practice, research, and teaching throughout Nigeria since 2010.",
  twitterImage: 'https://epison.ng/hero.jpeg',
})

defineOgImage({
  url: '/hero.jpeg',
  alt: 'About EPISON - Epidemiological Society of Nigeria',
})

const goals = [
  {
    icon: 'i-heroicons-users',
    title: 'Facilitate Communication',
    description:
      'Foster communication and cooperation among multidisciplinary individuals engaged in the practice, research, and teaching of epidemiology throughout Nigeria.',
  },
  {
    icon: 'i-heroicons-beaker',
    title: 'Develop Methods',
    description:
      'Engage in the development and use of epidemiological methods in all fields of health, including social, community, and preventive medicine.',
  },
  {
    icon: 'i-heroicons-chart-bar',
    title: 'Collect & Analyze',
    description:
      'Collect and analyze information on effective epidemiological methods and strategies to advance the field.',
  },
  {
    icon: 'i-heroicons-light-bulb',
    title: 'Promote Strategies',
    description:
      'Promote effective strategies through the exchange of information and ideas among members and stakeholders.',
  },
  {
    icon: 'i-heroicons-heart',
    title: 'Encourage Volunteerism',
    description:
      'Encourage volunteerism in support of epidemiology and public health initiatives across Nigeria.',
  },
  {
    icon: 'i-heroicons-cog',
    title: 'Practical Implementation',
    description:
      'Provide the means by which epidemiological methods can be effectively put into practice for better health outcomes.',
  },
]

const disciplines = [
  'Medicine',
  'Veterinary Medicine',
  'Pharmacy',
  'Laboratory Science',
  'Statistics',
  'Sociology',
  'Parasitology',
  'Nursing',
]

const leadership = [
  {
    name: 'Dr. Matthew Ashikeni',
    position: 'President',
    institution: 'Baze University Abuja',
    bio: 'Chief Consultant PH Physician/ Former Executive Secretary FCT Primary Health Care Board/Health Administration with over 35 years experience.',
    image: '/excomembers/president.jpeg',
  },
  {
    name: 'Prof. Charles Tobin-West',
    position: '1st Vice President',
    institution: 'University of Port Harcourt ',
    bio: 'Professor and Consultant Community Health Physician.',
    image: '/excomembers/1st-vice-president.jpeg',
  },
  {
    name: 'Dr. John Oladejo',
    position: '2nd Vice President',
    institution: 'Nigeria Centre for Disease Control and Prevention',
    bio: 'Director Special Duties at the Nigeria Centre for Disease Control and Prevention.',
    image: '/excomembers/2nd-vice-president.jpeg',
  },
  {
    name: 'Prof. Nonye Egenti',
    position: 'Secretary General',
    institution: 'University of Abuja',
    bio: 'Professor and Consultant Community Health Physician.',
    image: '/excomembers/secretary-general.jpeg',
  },
  {
    name: 'Prof. Bernadine Nsa Ekpenyong',
    position: 'Assistant Secretary',
    institution: 'University of Calabar',
    bio: 'Professor and unit Head, Epidemiology & Biostatistics Unit, Department of Public Health, UNICAL, Public Health Epidemiologist, Consultant Optometrist, Editor and Researcher',
    image: '/excomembers/assistant-secretary.jpeg',
  },
  {
    name: 'Dr. Obinna Kelvin Esimogu',
    position: 'Financial Secretary',
    institution: 'Federal Ministry of Labour and Employment',
    bio: 'Lead Epidemiologist, and Occupational Safety and Health Inspector of Factories, Factories Inspectorate Division FMLE Hqrs Abuja. Expertise in infectious and occupational disease modelling, with over 18 years experience.',
    image: '/excomembers/financial-secretary.jpeg',
  },
  {
    name: 'Fatimah Ahmed',
    position: 'Treasurer',
    institution: 'FCT Public Health Department, Health Service and Environment Secretariat',
    bio: 'Epidemiologist FCT State Disease Surveillance and Notification Officer with over 20 years of field experience PHEM-IC',
    image: '/excomembers/treasurer.jpeg',
  },
  {
    name: 'Dr Nnenna N. U Oji',
    position: 'Public Relations Officer',
    institution: 'Department of Community Medicine, University of Abuja Teaching Hospital',
    bio: 'Senior Registrar, Department of Community Medicine interested in health systems strengthening, geriatric care and implementation research.',
    image: '/excomembers/pro.jpeg',
  },
  {
    name: 'Dr. Oladayo David Awoyale',
    position: 'Auditor 2',
    institution: 'Sydani Group',
    bio: 'Field Epidemiologists, Researcher, Infectious Disease Modeller, PHEOC Expert, EDCTP Epi-Fellow. MPH | NFELTP',
    image: '/excomembers/auditor2.jpeg',
  },
  {
    name: 'Prof. Jonathan Chi Daboer',
    position: 'Editor in chief, JEPISON',
    institution: 'University of Jos and Jos University Teaching Hospital',
    bio: 'Professor and Consultant Public Health Physician.',
    image: '/excomembers/editor-in-chief.jpeg',
  },
  {
    name: 'Prof. Soter Ameh',
    position: 'Ex officio 2',
    institution: 'University of Calabar',
    bio: 'Public Health/Community Physician and Epidemiologist.',
    image: '/excomembers/ex-officio2.jpeg',
  },
]

const boardOfTrustees = [
  {
    name: 'Prof. Oladele Olujimi Kale',
    position: 'Chairman, Board of Trustees',
    institution: 'University of Ibadan',
    bio: 'Retired Professor on Public Health and Community Medicine & Consultant Community Physician.',
    image: '/botmembers/oladele-kale.jpg',
  },
  {
    name: 'Prof. Michael Chiemeli Asuzu ',
    position: 'Trustee',
    institution: 'University of Ibadan',
    bio: 'Retired professor and consultant of Disciplinary Public Health and Community Medicine',
    image: '/botmembers/michael-asuzu.jpeg',
  },
  {
    name: 'Prof. Ekanem E. Ekanem',
    position: 'Trustee',
    institution: 'Babcock University',
    bio: 'Professor of Epidemiology. Executive Director, The Centre for Epidemiologic Research & Training, Ikorodu, Lagos.',
    image: '/botmembers/ekanem.png',
  },
  {
    name: 'Prof. Sunday Aremu Omilabu',
    position: 'Trustee',
    institution: 'University of Lagos',
    bio: 'Professor of Medical Virology, Hospital and Consultant Virologist.',
    image: '/botmembers/sunday-aremu.jpeg',
  },
]
</script>
