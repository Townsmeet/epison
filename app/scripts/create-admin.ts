import { randomBytes } from 'crypto'
import { createAuthClient } from 'better-auth/vue'

// Generate a random password
function generatePassword(length = 9): string {
  return randomBytes(length).toString('hex')
}

const authClient = createAuthClient({
  // Use environment variable or default to local development URL
  baseURL: 'http://localhost:3000/api/auth',
})

interface CreateAdminOptions {
  name: string
  email: string
}

async function createAdminAccount({ name, email }: CreateAdminOptions) {
  // Generate a strong random password
  const password = generatePassword()

  console.log(`Creating admin account for ${email}...`)

  try {
    // Create the admin user using authClient
    console.log('Creating admin user with email:', email)

    const { error } = await authClient.signUp.email({
      email,
      password,
      name,
    })

    if (error) {
      console.error('Error response:', error)
      throw new Error(`Failed to create admin account: ${error.message}`)
    }

    console.log('Admin account created successfully!')
    console.log('Email:', email)
    console.log('Password:', password)

    // Prepare the output
    const credentials = {
      email,
      password,
      name,
      createdAt: new Date().toISOString(),
    }

    return credentials
  } catch (error) {
    console.error('Error creating admin account:')
    console.error(error instanceof Error ? error.message : 'Unknown error')
    process.exit(1)
  }
}

// Parse command line arguments
async function main() {
  const args = process.argv.slice(2)

  if (args.length < 2) {
    console.log('Usage: ts-node create-admin.ts <name> <email>')
    console.log('Example: ts-node create-admin.ts "Admin User" admin@example.com')
    process.exit(1)
  }

  const name = args[0]
  const email = args[1]

  if (!name || !email) {
    console.error('Error: Both name and email are required')
    process.exit(1)
  }

  await createAdminAccount({
    name: name,
    email: email,
  })
}

// Run the script
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Script failed:', error)
    process.exit(1)
  })
