<template>
  <div>
    <!-- Settings Navigation -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Sidebar Navigation -->
      <div class="lg:col-span-1">
        <nav class="space-y-1">
          <button
            v-for="section in settingSections"
            :key="section.id"
            :class="[
              'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              activeSection === section.id
                ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
            ]"
            @click="activeSection = section.id"
          >
            <UIcon :name="section.icon" class="w-5 h-5 mr-3" />
            {{ section.name }}
          </button>
        </nav>
      </div>

      <!-- Settings Content -->
      <div class="lg:col-span-3">
        <!-- General Settings -->
        <div v-if="activeSection === 'general'" class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">General Settings</h3>
          </div>
          <div class="p-6 space-y-6">
            <UFormGroup label="Organization Name" name="orgName">
              <UInput v-model="settings.general.orgName" />
            </UFormGroup>

            <UFormGroup label="Contact Email" name="contactEmail">
              <UInput v-model="settings.general.contactEmail" type="email" />
            </UFormGroup>

            <UFormGroup label="Phone Number" name="phone">
              <UInput v-model="settings.general.phone" />
            </UFormGroup>

            <UFormGroup label="Address" name="address">
              <UTextarea v-model="settings.general.address" />
            </UFormGroup>

            <UFormGroup label="Website" name="website">
              <UInput v-model="settings.general.website" />
            </UFormGroup>

            <div class="flex justify-end">
              <UButton color="primary" @click="saveSettings('general')"> Save Changes </UButton>
            </div>
          </div>
        </div>

        <!-- Email Settings -->
        <div v-if="activeSection === 'email'" class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Email Settings</h3>
          </div>
          <div class="p-6 space-y-6">
            <UFormGroup label="SMTP Server" name="smtpServer">
              <UInput v-model="settings.email.smtpServer" />
            </UFormGroup>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormGroup label="SMTP Port" name="smtpPort">
                <UInput v-model="settings.email.smtpPort" type="number" />
              </UFormGroup>

              <UFormGroup label="Encryption" name="encryption">
                <USelect
                  v-model="settings.email.encryption"
                  :options="[
                    { label: 'None', value: 'none' },
                    { label: 'TLS', value: 'tls' },
                    { label: 'SSL', value: 'ssl' },
                  ]"
                />
              </UFormGroup>
            </div>

            <UFormGroup label="Username" name="smtpUsername">
              <UInput v-model="settings.email.smtpUsername" />
            </UFormGroup>

            <UFormGroup label="Password" name="smtpPassword">
              <UInput v-model="settings.email.smtpPassword" type="password" />
            </UFormGroup>

            <UFormGroup label="From Email" name="fromEmail">
              <UInput v-model="settings.email.fromEmail" type="email" />
            </UFormGroup>

            <UFormGroup label="From Name" name="fromName">
              <UInput v-model="settings.email.fromName" />
            </UFormGroup>

            <div class="flex justify-between">
              <UButton color="neutral" variant="outline" @click="testEmailConnection">
                Test Connection
              </UButton>
              <UButton color="primary" @click="saveSettings('email')"> Save Changes </UButton>
            </div>
          </div>
        </div>

        <!-- Payment Settings -->
        <div v-if="activeSection === 'payment'" class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Payment Settings</h3>
          </div>
          <div class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Paystack Settings -->
              <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="font-medium text-gray-900 dark:text-white">Paystack</h4>
                  <UToggle v-model="settings.payment.paystack.enabled" />
                </div>
                <div class="space-y-4">
                  <UFormGroup label="Public Key" name="paystackPublicKey">
                    <UInput v-model="settings.payment.paystack.publicKey" />
                  </UFormGroup>
                  <UFormGroup label="Secret Key" name="paystackSecretKey">
                    <UInput v-model="settings.payment.paystack.secretKey" type="password" />
                  </UFormGroup>
                </div>
              </div>

              <!-- Flutterwave Settings -->
              <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="font-medium text-gray-900 dark:text-white">Flutterwave</h4>
                  <UToggle v-model="settings.payment.flutterwave.enabled" />
                </div>
                <div class="space-y-4">
                  <UFormGroup label="Public Key" name="flutterwavePublicKey">
                    <UInput v-model="settings.payment.flutterwave.publicKey" />
                  </UFormGroup>
                  <UFormGroup label="Secret Key" name="flutterwaveSecretKey">
                    <UInput v-model="settings.payment.flutterwave.secretKey" type="password" />
                  </UFormGroup>
                </div>
              </div>
            </div>

            <UFormGroup label="Default Currency" name="currency">
              <USelect
                v-model="settings.payment.currency"
                :options="[
                  { label: 'Nigerian Naira (NGN)', value: 'NGN' },
                  { label: 'US Dollar (USD)', value: 'USD' },
                  { label: 'British Pound (GBP)', value: 'GBP' },
                ]"
              />
            </UFormGroup>

            <div class="flex justify-end">
              <UButton color="primary" @click="saveSettings('payment')"> Save Changes </UButton>
            </div>
          </div>
        </div>

        <!-- Security Settings -->
        <div
          v-if="activeSection === 'security'"
          class="bg-white dark:bg-gray-800 rounded-lg shadow"
        >
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Security Settings</h3>
          </div>
          <div class="p-6 space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Add an extra layer of security to admin accounts
                </p>
              </div>
              <UToggle v-model="settings.security.twoFactorAuth" />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">Force Password Reset</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Require users to reset passwords periodically
                </p>
              </div>
              <UToggle v-model="settings.security.forcePasswordReset" />
            </div>

            <UFormGroup label="Session Timeout (minutes)" name="sessionTimeout">
              <UInput v-model="settings.security.sessionTimeout" type="number" />
            </UFormGroup>

            <UFormGroup label="Maximum Login Attempts" name="maxLoginAttempts">
              <UInput v-model="settings.security.maxLoginAttempts" type="number" />
            </UFormGroup>

            <div class="flex justify-end">
              <UButton color="primary" @click="saveSettings('security')"> Save Changes </UButton>
            </div>
          </div>
        </div>

        <!-- Notification Settings -->
        <div
          v-if="activeSection === 'notifications'"
          class="bg-white dark:bg-gray-800 rounded-lg shadow"
        >
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Notification Settings
            </h3>
          </div>
          <div class="p-6 space-y-6">
            <div
              v-for="notification in notificationTypes"
              :key="notification.key"
              class="flex items-center justify-between"
            >
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">{{ notification.title }}</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ notification.description }}
                </p>
              </div>
              <UToggle v-model="settings.notifications[notification.key]" />
            </div>

            <div class="flex justify-end">
              <UButton color="primary" @click="saveSettings('notifications')">
                Save Changes
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const activeSection = ref('general')

const settingSections = [
  { id: 'general', name: 'General', icon: 'i-heroicons-cog-6-tooth' },
  { id: 'email', name: 'Email', icon: 'i-heroicons-envelope' },
  { id: 'payment', name: 'Payment', icon: 'i-heroicons-credit-card' },
  { id: 'security', name: 'Security', icon: 'i-heroicons-shield-check' },
  { id: 'notifications', name: 'Notifications', icon: 'i-heroicons-bell' },
]

const settings = ref({
  general: {
    orgName: 'Epidemiological Society of Nigeria (EPISON)',
    contactEmail: 'info@epison.org.ng',
    phone: '+234 1 234 5678',
    address: 'Lagos, Nigeria',
    website: 'https://epison.org.ng',
  },
  email: {
    smtpServer: 'smtp.gmail.com',
    smtpPort: 587,
    encryption: 'tls',
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: 'noreply@epison.org.ng',
    fromName: 'EPISON',
  },
  payment: {
    currency: 'NGN',
    paystack: {
      enabled: true,
      publicKey: '',
      secretKey: '',
    },
    flutterwave: {
      enabled: false,
      publicKey: '',
      secretKey: '',
    },
  },
  security: {
    twoFactorAuth: false,
    forcePasswordReset: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
  },
  notifications: {
    newRegistration: true,
    paymentReceived: true,
    eventReminder: true,
    systemUpdates: false,
    securityAlerts: true,
  },
})

const notificationTypes: Array<{
  key: keyof typeof settings.value.notifications
  title: string
  description: string
}> = [
  {
    key: 'newRegistration',
    title: 'New Registrations',
    description: 'Get notified when someone registers for an event',
  },
  {
    key: 'paymentReceived',
    title: 'Payment Received',
    description: 'Get notified when payments are received',
  },
  {
    key: 'eventReminder',
    title: 'Event Reminders',
    description: 'Send reminders for upcoming events',
  },
  {
    key: 'systemUpdates',
    title: 'System Updates',
    description: 'Get notified about system maintenance and updates',
  },
  {
    key: 'securityAlerts',
    title: 'Security Alerts',
    description: 'Get notified about security-related events',
  },
]

function saveSettings(section: string) {
  useToast().add({
    title: 'Settings saved',
    description: `${section.charAt(0).toUpperCase() + section.slice(1)} settings have been updated`,
    color: 'success',
  })
}

function testEmailConnection() {
  useToast().add({
    title: 'Testing connection',
    description: 'Email connection test in progress...',
    color: 'info',
  })

  // Simulate test
  setTimeout(() => {
    useToast().add({
      title: 'Connection successful',
      description: 'Email configuration is working correctly',
      color: 'success',
    })
  }, 2000)
}
</script>
