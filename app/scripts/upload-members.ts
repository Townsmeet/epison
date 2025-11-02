import 'dotenv/config'
import XLSX from 'xlsx'
import { db } from '../../server/utils/drizzle'
import { member, memberHistory } from '../../server/db/schema'
import { eq } from 'drizzle-orm'

interface ExcelMemberRow {
  'S/N': string
  Names: string
  'Type Of\n Membership': string
  Affiliation: string
  Designation: string
  'Geo-Political Zone': string
  __EMPTY?: string // For some rows with missing designation
}

interface ParsedMember {
  title?: string
  nameFirst: string
  nameMiddle?: string
  nameFamily: string
  employer?: string
  position?: string
  geopoliticalZone?: string
  membershipType: string
  email: string
}

interface UploadStats {
  total: number
  created: number
  skipped: number
  errors: Array<{ row: number; name?: string; error: string }>
}

/**
 * Parse full name into title, first, middle, and family name
 */
function parseName(fullName: string): {
  title?: string
  first: string
  middle?: string
  family: string
} {
  const titlePrefixes = [
    'Prof.',
    'Dr',
    'Dr.',
    'Mr',
    'Mr.',
    'Mrs',
    'Mrs.',
    'Ms',
    'Ms.',
    'Engr',
    'Engr.',
    'Mal',
    'Mal.',
    'Haj',
    'Haj.',
    'Rev',
    'Rev.',
  ]

  let name = fullName.trim()
  let title: string | undefined

  // Extract title
  for (const prefix of titlePrefixes) {
    if (name.startsWith(prefix + ' ') || name.startsWith(prefix + '.')) {
      title = prefix.replace('.', '')
      name = name.substring(prefix.length).trim()
      break
    }
  }

  // Split name parts
  const parts = name.split(/\s+/).filter(p => p.length > 0)

  if (parts.length === 0) {
    return { title, first: name, family: name }
  } else if (parts.length === 1) {
    return { title, first: parts[0] || name, family: parts[0] || name }
  } else if (parts.length === 2) {
    return { title, first: parts[0] || name, family: parts[1] || name }
  } else {
    // First name is first part, last name is last part, middle is everything in between
    return {
      title,
      first: parts[0] || name,
      middle: parts.slice(1, -1).join(' '),
      family: parts[parts.length - 1] || name,
    }
  }
}

/**
 * Generate email from name if not provided
 */
function generateEmail(firstName: string, lastName: string): string {
  const cleanFirst = firstName.toLowerCase().replace(/[^a-z]/g, '')
  const cleanLast = lastName.toLowerCase().replace(/[^a-z]/g, '')

  return `${cleanFirst}.${cleanLast}@epison.ng`.toLowerCase()
}

/**
 * Normalize membership type
 */
function normalizeMembershipType(membershipType: string | undefined): string {
  if (!membershipType) return 'regular'

  const normalized = membershipType.trim()

  // Map ECE to early-career
  if (normalized === 'ECE') {
    return 'early-career'
  }

  // Map other variations
  const mapping: Record<string, string> = {
    regular: 'regular',
    'early career': 'early-career',
    'early-career': 'early-career',
    student: 'student',
    associate: 'associate',
  }

  const lower = normalized.toLowerCase()
  return mapping[lower] || normalized.toLowerCase()
}

/**
 * Normalize geopolitical zone
 */
function normalizeGeoPoliticalZone(zone: string | undefined): string | undefined {
  if (!zone || zone === 'Not Available' || zone === 'Not Applicable') {
    return undefined
  }

  const normalized = zone.trim()

  // Map variations
  const mapping: Record<string, string> = {
    'south south': 'South South',
    southsouth: 'South South',
    'south west': 'South West',
    southwest: 'South West',
    'south east': 'South East',
    southeast: 'South East',
    'north central': 'North Central',
    northcentral: 'North Central',
    'north west': 'North West',
    northwest: 'North West',
    'north east': 'North East',
    northeast: 'North East',
  }

  const lower = normalized.toLowerCase()
  return mapping[lower] || normalized
}

/**
 * Convert Excel row to member data
 */
function excelRowToMember(excelRow: ExcelMemberRow): ParsedMember | null {
  const {
    Names,
    'Type Of\n Membership': membershipType,
    Affiliation,
    Designation,
    'Geo-Political Zone': zone,
  } = excelRow

  if (!Names || Names.trim().length === 0) {
    return null
  }

  // Parse name
  const nameParts = parseName(Names)

  // Generate email
  const email = generateEmail(nameParts.first, nameParts.family)

  return {
    title: nameParts.title,
    nameFirst: nameParts.first,
    nameMiddle: nameParts.middle,
    nameFamily: nameParts.family,
    employer: Affiliation && Affiliation !== 'Not Available' ? Affiliation : undefined,
    position:
      (Designation || excelRow.__EMPTY) && (Designation || excelRow.__EMPTY) !== 'Not Available'
        ? Designation || excelRow.__EMPTY
        : undefined,
    geopoliticalZone: normalizeGeoPoliticalZone(zone),
    membershipType: normalizeMembershipType(membershipType),
    email,
  }
}

/**
 * Check if email already exists
 */
async function emailExists(email: string): Promise<boolean> {
  const existing = await db
    .select({ id: member.id })
    .from(member)
    .where(eq(member.email, email))
    .limit(1)

  return existing.length > 0
}

/**
 * Parse the Excel file and return an array of member data
 */
function parseExcelFile(filePath: string): ExcelMemberRow[] {
  console.log(`Reading Excel file: ${filePath}`)

  const workbook = XLSX.readFile(filePath)
  const sheetName = workbook.SheetNames[0]

  if (!sheetName) {
    throw new Error('No sheet found in Excel file')
  }

  const sheet = workbook.Sheets[sheetName]

  if (!sheet) {
    throw new Error(`Sheet ${sheetName} not found in workbook`)
  }

  console.log(`Found sheet: ${sheetName}`)

  const rows = XLSX.utils.sheet_to_json<ExcelMemberRow>(sheet, {
    raw: false,
    defval: null,
  })

  console.log(`Parsed ${rows.length} rows from Excel`)

  return rows
}

/**
 * Upload a single member to the database
 */
async function uploadMember(
  memberData: ParsedMember,
  rowNumber: number,
  stats: UploadStats
): Promise<void> {
  const memberId = `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // Set dates
  const now = new Date()
  const joinedDate = now.toISOString().split('T')[0]
  const expiryDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
    .toISOString()
    .split('T')[0]

  // Check if email already exists
  try {
    if (await emailExists(memberData.email)) {
      stats.errors.push({
        row: rowNumber,
        name: `${memberData.nameFirst} ${memberData.nameFamily}`,
        error: 'Email already exists in database',
      })
      stats.skipped++
      return
    }
  } catch (error) {
    console.error(`Error checking for existing member: ${error}`)
    stats.errors.push({
      row: rowNumber,
      name: `${memberData.nameFirst} ${memberData.nameFamily}`,
      error: 'Database check failed',
    })
    stats.skipped++
    return
  }

  // Insert member
  try {
    await db.insert(member).values({
      id: memberId,
      // Personal Information
      title: memberData.title,
      nameFamily: memberData.nameFamily,
      nameMiddle: memberData.nameMiddle,
      nameFirst: memberData.nameFirst,
      email: memberData.email,
      geopoliticalZone: memberData.geopoliticalZone as
        | 'South South'
        | 'South West'
        | 'South East'
        | 'North Central'
        | 'North West'
        | 'North East'
        | 'Not Applicable'
        | undefined,

      // Employment & Education
      position: memberData.position,
      employer: memberData.employer,

      // Membership Details
      membershipType: memberData.membershipType,
      status: 'active',
      joinedDate,
      expiryDate,
      fees: 0, // Default fee

      // Set defaults for required fields
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Create initial history entry
    await db.insert(memberHistory).values({
      id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      memberId,
      action: 'Member uploaded from Excel',
      type: 'creation',
      notes: `Bulk upload from Excel file at row ${rowNumber}`,
      date: new Date(),
      createdAt: new Date(),
    })

    stats.created++
    console.log(
      `✓ Uploaded: ${memberData.nameFirst} ${memberData.nameFamily} (${memberData.email})`
    )
  } catch (error) {
    console.error(`Error inserting member: ${error}`)
    stats.errors.push({
      row: rowNumber,
      name: `${memberData.nameFirst} ${memberData.nameFamily}`,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    stats.skipped++
  }
}

/**
 * Main upload function
 */
async function uploadMembersFromExcel(filePath: string): Promise<void> {
  console.log('Starting member upload from Excel...\n')

  const stats: UploadStats = {
    total: 0,
    created: 0,
    skipped: 0,
    errors: [],
  }

  try {
    // Parse the Excel file
    const excelRows = parseExcelFile(filePath)

    console.log(`\nProcessing ${excelRows.length} rows...\n`)

    // Process each row
    for (let i = 0; i < excelRows.length; i++) {
      const excelRow = excelRows[i]

      if (!excelRow) {
        continue
      }

      const memberData = excelRowToMember(excelRow)

      if (!memberData) {
        stats.skipped++
        continue
      }

      stats.total++
      await uploadMember(memberData, i + 2, stats) // +2 because Excel is 1-indexed and has headers
    }

    // Print summary
    console.log('\n' + '='.repeat(60))
    console.log('Upload Summary')
    console.log('='.repeat(60))
    console.log(`Total rows with data: ${stats.total}`)
    console.log(`Successfully created: ${stats.created}`)
    console.log(`Skipped/Failed: ${stats.skipped}`)

    if (stats.errors.length > 0) {
      console.log('\nErrors:')
      stats.errors.forEach((err, idx) => {
        console.log(`${idx + 1}. Row ${err.row}: ${err.error} (${err.name || 'No name'})`)
      })
    }

    console.log('='.repeat(60))
  } catch (error) {
    console.error('Error during upload:', error)
    throw error
  }
}

/**
 * Main entry point
 */
async function main() {
  const args = process.argv.slice(2)

  if (args.length < 1) {
    console.log('Usage: pnpm run upload-members <excel-file-path>')
    console.log('Example: pnpm run upload-members public/episonmembers.xlsx')
    process.exit(1)
  }

  const filePath = args[0]

  if (!filePath) {
    console.error('Error: File path is required')
    process.exit(1)
  }

  try {
    await uploadMembersFromExcel(filePath)
    console.log('\n✓ Upload completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('\n✗ Upload failed:', error)
    process.exit(1)
  }
}

// Run the script
main()
