import { db } from '../db'
import { member } from '../db/schema'

interface TaskResult {
  status: 'success' | 'error'
  results?: {
    deleted: boolean
  }
  error?: string
  timestamp: string
}

export default defineTask({
  meta: {
    name: 'clear-members',
    description: 'Deletes all members from the database (destructive)',
  },
  async run({ payload }) {
    console.log('[Task] Starting member deletion...')

    // Optional safeguard: require a flag in payload
    if (payload?.confirm !== true && payload?.confirm !== 'true') {
      console.log('[Task] Aborting. Please run with confirm=true payload.')
      return {
        result: {
          status: 'error',
          error: 'Must pass { confirm: true } in payload to execute this destructive task.',
          timestamp: new Date().toISOString(),
        },
      }
    }

    try {
      await db.delete(member)
      console.log('[Task] All members deleted successfully.')

      const result: TaskResult = {
        status: 'success',
        results: { deleted: true },
        timestamp: new Date().toISOString(),
      }
      return { result }
    } catch (error) {
      console.error('[Task] Member deletion failed:', error)
      const result: TaskResult = {
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      }
      return { result }
    }
  },
})
