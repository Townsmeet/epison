import { ref, readonly } from 'vue'

export interface PaystackPaymentOptions {
  email: string
  amount: number // in Naira
  reference?: string
  metadata?: Record<string, unknown>
  onSuccess?: (reference: string) => void
  onCancel?: () => void
  onError?: (error: Error) => void
}

// Minimal Paystack typings to avoid `any`
interface PaystackResponse {
  reference: string
}

interface PaystackSetupOptions {
  key: string
  email: string
  amount: number
  ref: string
  metadata?: Record<string, unknown>
  callback: (response: PaystackResponse) => void
  onCancel: () => void
}

interface PaystackPop {
  setup(options: PaystackSetupOptions): { openIframe: () => void }
}

export const usePaystack = () => {
  const toast = useToast()
  const config = useRuntimeConfig()

  const isLoading = ref(false)

  async function loadPaystackScript(): Promise<void> {
    if (typeof window === 'undefined') return
    const w = window as Window & { PaystackPop?: PaystackPop }
    if (w.PaystackPop) return

    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://js.paystack.co/v1/inline.js'
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Paystack'))
      document.head.appendChild(script)
    })
  }

  async function initializePayment(
    options: PaystackPaymentOptions
  ): Promise<{ reference: string }> {
    return new Promise((resolve, reject) => {
      ;(async () => {
        try {
          isLoading.value = true

          // Validation
          if (!options.email) {
            const error = new Error('Email is required')
            options.onError?.(error)
            toast.add({
              title: 'Email required',
              description: 'Enter your email to continue to payment.',
              color: 'warning',
            })
            return reject(error)
          }

          if (!options.amount || options.amount <= 0) {
            const error = new Error('Invalid amount')
            options.onError?.(error)
            toast.add({
              title: 'Invalid amount',
              description: 'Amount must be greater than zero.',
              color: 'warning',
            })
            return reject(error)
          }

          // Load Paystack script
          await loadPaystackScript()

          // Get public key
          const publicKey = config.public.paystackKey
          if (!publicKey) {
            const error = new Error('Paystack public key not configured')
            options.onError?.(error)
            toast.add({
              title: 'Configuration error',
              description: 'Paystack public key not found. Please contact support.',
              color: 'error',
            })
            return reject(error)
          }

          // Generate reference if not provided
          const reference =
            options.reference || `EPISON-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

          // Initialize Paystack
          const w = window as Window & { PaystackPop?: PaystackPop }
          const handler = w.PaystackPop!.setup({
            key: publicKey,
            email: options.email,
            amount: options.amount * 100, // Convert to kobo
            ref: reference,
            metadata: options.metadata || {},
            callback: (response: PaystackResponse) => {
              toast.add({
                title: 'Payment successful',
                description: `Reference: ${response.reference}`,
                color: 'success',
              })
              options.onSuccess?.(response.reference)
              resolve({ reference: response.reference })
            },
            onCancel: () => {
              const error = new Error('Payment cancelled by user')
              options.onCancel?.()
              toast.add({
                title: 'Payment cancelled',
                color: 'info',
              })
              reject(error)
            },
          })

          handler.openIframe()
        } catch (error) {
          console.error('Paystack initialization error:', error)
          const err = error as Error
          options.onError?.(err)
          toast.add({
            title: 'Payment error',
            description: 'Could not start payment. Please try again.',
            color: 'error',
          })
          reject(err)
        } finally {
          isLoading.value = false
        }
      })()
    })
  }

  return {
    initializePayment,
    isLoading: readonly(isLoading),
  }
}
