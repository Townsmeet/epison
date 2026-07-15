import 'dotenv/config'
import { db } from '../../server/utils/drizzle'
import { member } from '../../server/db/schema'

async function clearMembers() {
  console.log('Starting member deletion...')
  try {
    await db.delete(member)
    console.log('All members successfully deleted from the database.')
    process.exit(0)
  } catch (error) {
    console.error('Failed to delete members:', error)
    process.exit(1)
  }
}

clearMembers()
