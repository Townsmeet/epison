import 'dotenv/config'
import { db } from '../../server/utils/drizzle'
import { member } from '../../server/db/schema'
import { eq } from 'drizzle-orm'

async function updateMemberTypes() {
  console.log('Starting member type update...')

  try {
    // 1. Update early-career to early-career+iea
    console.log('Updating "early-career" to "early-career+iea"...')
    const earlyCareerResult = await db
      .update(member)
      .set({ membershipType: 'early-career+iea' })
      .where(eq(member.membershipType, 'early-career'))
      .returning({ id: member.id, email: member.email })

    console.log(`Updated ${earlyCareerResult.length} early-career members.`)

    // 2. Update regular to regular+iea
    console.log('Updating "regular" to "regular+iea"...')
    const regularResult = await db
      .update(member)
      .set({ membershipType: 'regular+iea' })
      .where(eq(member.membershipType, 'regular'))
      .returning({ id: member.id, email: member.email })

    console.log(`Updated ${regularResult.length} regular members.`)

    console.log('Update completed successfully!')
  } catch (error) {
    console.error('Error updating member types:', error)
    process.exit(1)
  }
}

updateMemberTypes()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Script failed:', error)
    process.exit(1)
  })
