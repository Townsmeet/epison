import { verifyAllPendingPayments } from '../utils/payment-verify'

interface TaskResult {
  status: 'success' | 'error'
  results?: {
    registrationsVerified: number
    membersVerified: number
    errors: number
  }
  error?: string
  timestamp: string
}

export default defineTask({
  async run() {
    console.log('[Task] Starting daily payment verification...')
    try {
      const results = await verifyAllPendingPayments()
      const result: TaskResult = {
        status: 'success',
        results,
        timestamp: new Date().toISOString(),
      }
      return { result }
    } catch (error) {
      console.error('[Task] Payment verification failed:', error)
      const result: TaskResult = {
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      }
      return { result }
    }
  },
})
