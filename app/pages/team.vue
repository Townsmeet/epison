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
            Our Team
          </span>
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Meet the dedicated professionals driving epidemiological excellence in Nigeria
        </p>
      </div>
    </section>

    <!-- Team Grid -->
    <section class="py-20 md:py-32 bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(member, index) in teamMembers"
            :key="index"
            class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-gray-700/50 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div class="p-8">
              <div class="flex flex-col items-center text-center">
                <div class="relative mb-6">
                  <img
                    class="h-32 w-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
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
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ member.department }}</p>
                </div>

                <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {{ member.bio }}
                </p>

                <div class="flex space-x-3">
                  <div
                    class="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center"
                  >
                    <UIcon name="i-heroicons-envelope" class="h-4 w-4 text-gray-500" />
                  </div>
                  <div
                    class="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center"
                  >
                    <UIcon name="i-heroicons-phone" class="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>
            </div>

            <div
              class="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const teamMembers = [
  {
    name: 'Dr. Amina Bello',
    position: 'President',
    department: 'University of Ibadan',
    bio: 'Professor of Epidemiology with over 20 years of experience in infectious disease epidemiology and control.',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    name: 'Prof. Chukwuma Okoro',
    position: 'Vice President',
    department: 'University of Lagos',
    bio: 'Expert in non-communicable disease epidemiology and health systems research.',
    image: 'https://randomuser.me/api/portraits/men/42.jpg',
  },
  {
    name: 'Dr. Fatima Ibrahim',
    position: 'General Secretary',
    department: 'Ahmadu Bello University',
    bio: 'Specialist in maternal and child health epidemiology with extensive field experience.',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Dr. Emeka Nwosu',
    position: 'Treasurer',
    department: 'University of Nigeria, Nsukka',
    bio: 'Health economist and epidemiologist focusing on health financing and policy.',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Dr. Aisha Yusuf',
    position: 'Editor-in-Chief',
    department: 'Bayero University Kano',
    bio: 'Expert in infectious disease modeling and outbreak investigation.',
    image: 'https://randomuser.me/api/portraits/women/63.jpg',
  },
  {
    name: 'Dr. Olumide Adebayo',
    position: 'Publicity Secretary',
    department: 'Obafemi Awolowo University',
    bio: 'Specialist in health communication and behavioral epidemiology.',
    image: 'https://randomuser.me/api/portraits/men/54.jpg',
  },
]
</script>
