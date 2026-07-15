import 'dotenv/config'
import XLSX from 'xlsx'
import { db } from '../../server/utils/drizzle'
import { member, memberHistory } from '../../server/db/schema'
import { eq } from 'drizzle-orm'
import path from 'node:path'

interface ParsedMember {
  title?: string
  nameFirst: string
  nameMiddle?: string
  nameFamily: string
  employer?: string
  position?: string
  membershipType: string
  email: string
  telephone?: string
  address?: string
}

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

  for (const prefix of titlePrefixes) {
    if (name.startsWith(prefix + ' ') || name.startsWith(prefix + '.')) {
      title = prefix.replace('.', '')
      name = name.substring(prefix.length).trim()
      break
    }
  }

  const parts = name.split(/\s+/).filter(p => p.length > 0)
  if (parts.length === 0) {
    return { title, first: name, family: name }
  } else if (parts.length === 1) {
    return { title, first: parts[0] || name, family: parts[0] || name }
  } else if (parts.length === 2) {
    return { title, first: parts[0] || name, family: parts[1] || name }
  } else {
    return {
      title,
      first: parts[0] || name,
      middle: parts.slice(1, -1).join(' '),
      family: parts[parts.length - 1] || name,
    }
  }
}

function generateEmail(firstName: string, lastName: string): string {
  const cleanFirst = firstName.toLowerCase().replace(/[^a-z]/g, '')
  const cleanLast = lastName.toLowerCase().replace(/[^a-z]/g, '')
  return `${cleanFirst}.${cleanLast}@epison.ng`.toLowerCase()
}

function normalizeMembershipType(membershipType: string | undefined): string {
  if (!membershipType) return 'regular'
  const normalized = membershipType.trim().toLowerCase()
  const mapping: Record<string, string> = {
    regular: 'regular',
    'early career': 'early-career',
    'early-career': 'early-career',
    student: 'student',
    associate: 'associate',
    fellow: 'fellow',
  }
  return mapping[normalized] || normalized
}

function excelRowToMember(
  excelRow: Record<string | number, string | undefined>
): ParsedMember | null {
  const Names = excelRow['Names'] || excelRow[1] // If accessed by array index or name
  if (!Names || typeof Names !== 'string' || Names.trim().length === 0 || Names === 'Names') {
    return null
  }

  const Membership = excelRow['Membership'] || excelRow[2]
  const emailAddress = excelRow['E-Mail Address'] || excelRow[3]
  const phone = excelRow['Phone No.'] || excelRow[4]
  const address = excelRow['Contact Address'] || excelRow[5]
  const org = excelRow['Organization/\nInstitution'] || excelRow[6]
  const Designation = excelRow['Designation'] || excelRow[7]

  const nameParts = parseName(Names)
  const email = emailAddress?.trim() || generateEmail(nameParts.first, nameParts.family)

  return {
    title: nameParts.title,
    nameFirst: nameParts.first,
    nameMiddle: nameParts.middle,
    nameFamily: nameParts.family,
    employer: org && org !== 'Not Available' ? org.trim() : undefined,
    position: Designation && Designation !== 'Not Available' ? Designation.trim() : undefined,
    membershipType: normalizeMembershipType(Membership),
    email: email.toLowerCase(),
    telephone: phone?.toString().trim(),
    address: address?.trim(),
  }
}

async function run() {
  console.log('Starting member upload from Excel...')
  const filePath = path.resolve(process.cwd(), 'public/episonmembers.xlsx')

  let workbook
  try {
    workbook = XLSX.readFile(filePath)
  } catch (err) {
    console.error('Failed to read file:', err)
    process.exit(1)
  }

  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]

  // Use header: 1 to get raw array rows, so we can map them reliably since the header is on row 2
  const rows = XLSX.utils.sheet_to_json<Record<string | number, string | undefined>>(sheet, {
    header: 1,
  })

  console.log(`Parsed ${rows.length} raw rows from Excel`)

  let total = 0
  let created = 0
  let skipped = 0
  const errors: { row: number; name: string | undefined; error: string }[] = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    if (!row || row.length === 0) continue

    const memberData = excelRowToMember(row)
    if (!memberData) {
      continue
    }

    total++
    const memberId = `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const now = new Date()
    const joinedDate = now.toISOString().split('T')[0]
    const expiryDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
      .toISOString()
      .split('T')[0]

    try {
      const existing = await db
        .select({ id: member.id })
        .from(member)
        .where(eq(member.email, memberData.email))
        .limit(1)
      if (existing.length > 0) {
        errors.push({ row: i + 1, name: memberData.nameFirst, error: 'Email already exists' })
        skipped++
        continue
      }

      await db.insert(member).values({
        id: memberId,
        title: memberData.title,
        nameFamily: memberData.nameFamily,
        nameMiddle: memberData.nameMiddle,
        nameFirst: memberData.nameFirst,
        email: memberData.email,
        telephone: memberData.telephone,
        address: memberData.address,
        position: memberData.position,
        employer: memberData.employer,
        membershipType: memberData.membershipType,
        status: 'active',
        joinedDate,
        expiryDate,
        fees: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      await db.insert(memberHistory).values({
        id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        memberId,
        action: 'Member uploaded from Excel',
        type: 'creation',
        notes: `Bulk upload from new Excel file at row ${i + 1}`,
        date: new Date(),
        createdAt: new Date(),
      })

      created++
      if (created % 50 === 0) console.log(`Uploaded ${created} members so far...`)
    } catch (err) {
      errors.push({
        row: i + 1,
        name: memberData.nameFirst,
        error: err instanceof Error ? err.message : String(err),
      })
      skipped++
    }
  }

  console.log(`\nUpload Summary:`)
  console.log(`Total records found: ${total}`)
  console.log(`Successfully created: ${created}`)
  console.log(`Skipped/Failed: ${skipped}`)

  if (errors.length > 0) {
    console.log(`Errors (first 5):`, errors.slice(0, 5))
  }
  process.exit(0)
}

run()
