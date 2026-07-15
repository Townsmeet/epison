import * as XLSX from 'xlsx'
import { db } from '../db'
import { member, memberHistory } from '../db/schema'
import { eq } from 'drizzle-orm'
import path from 'node:path'

interface ExcelMemberRow {
  'S/N': string | number
  Names: string
  Membership: string
  'E-Mail Address': string
  'Phone No.': string
  'Contact Address': string
  'Organization/\nInstitution': string
  Designation: string
}

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

function excelRowToMember(excelRow: ExcelMemberRow): ParsedMember | null {
  const {
    Names,
    Membership,
    'E-Mail Address': emailAddress,
    'Phone No.': phone,
    'Contact Address': address,
    'Organization/\nInstitution': org,
    Designation,
  } = excelRow

  if (!Names || Names.trim().length === 0) {
    return null
  }

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

export default defineTask({
  meta: {
    name: 'import-members',
    description: 'Import members from public/episonmembers.xlsx',
  },
  async run() {
    console.log('[Task] Starting member upload from Excel...')

    // We assume the file is in the root's public folder
    const filePath = path.resolve(process.cwd(), 'public/episonmembers.xlsx')

    let workbook
    try {
      workbook = XLSX.readFile(filePath)
    } catch (err) {
      console.error('[Task] Failed to read file:', err)
      return { result: { status: 'error', error: 'Could not read Excel file' } }
    }

    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]

    // Start reading from row 2 (index 1) to skip header, though sheet_to_json handles headers if specified
    // But since the first row is empty in our file, we might need range: 1 to skip it.
    const rows = XLSX.utils.sheet_to_json<ExcelMemberRow>(sheet, {
      raw: false,
      defval: null,
      range: 1, // Skips the first empty row so that Row 2 acts as the header
    })

    console.log(`[Task] Parsed ${rows.length} rows from Excel`)

    let total = 0
    let created = 0
    let skipped = 0
    const errors: { row: number; name: string | undefined; error: string }[] = []

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      if (!row) continue

      const memberData = excelRowToMember(row)
      if (!memberData) {
        skipped++
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
          errors.push({ row: i + 3, name: memberData.nameFirst, error: 'Email already exists' })
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
          notes: `Bulk upload from new Excel file at row ${i + 3}`,
          date: new Date(),
          createdAt: new Date(),
        })

        created++
        if (created % 50 === 0) console.log(`[Task] Uploaded ${created} members so far...`)
      } catch (err) {
        errors.push({
          row: i + 3,
          name: memberData.nameFirst,
          error: err instanceof Error ? err.message : String(err),
        })
        skipped++
      }
    }

    console.log(`\n[Task] Upload Summary:`)
    console.log(`[Task] Total rows with data: ${total}`)
    console.log(`[Task] Successfully created: ${created}`)
    console.log(`[Task] Skipped/Failed: ${skipped}`)

    if (errors.length > 0) {
      console.log(`[Task] Errors (first 5):`, errors.slice(0, 5))
    }

    return {
      result: {
        status: 'success',
        results: { total, created, skipped, errorsCount: errors.length },
        timestamp: new Date().toISOString(),
      },
    }
  },
})
