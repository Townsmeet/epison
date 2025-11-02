// Member-specific Types
export interface MemberListItem {
  id: string
  nameFirst: string
  nameFamily: string
  email: string
  membershipType: string
  status: string
  joinedDate: string
  expiryDate: string
  fees: number
  avatar?: string
  paymentReference?: string
}

export interface MemberDetail {
  id: string
  // Personal Information
  title?: string
  nameFamily: string
  nameMiddle?: string
  nameFirst: string
  sex?: string
  dob?: string
  address?: string
  geopoliticalZone?:
    | 'South South'
    | 'South West'
    | 'South East'
    | 'North Central'
    | 'North West'
    | 'North East'
    | 'Not Applicable'
  telephone?: string
  fax?: string
  email: string
  avatar?: string

  // Employment & Education
  position?: string
  employer?: string
  department?: string
  qualifications?: string
  experience?: string

  // Languages
  motherTongue?: string
  otherLanguages: string[]
  otherLanguageText?: string

  // Areas of Expertise
  expertiseDescription?: string
  expertise: string[]
  expertiseOther?: string

  // Employment Classification
  agency?: string
  typeOfWork?: string
  typeOfWorkOther?: string
  retiredSince?: string

  // Membership Details
  membershipType: string
  status: string
  joinedDate: string
  expiryDate: string
  fees: number
  paymentReference?: string

  // Related data
  publications: string[]

  // Timestamps
  createdAt: string
  updatedAt: string
}

export interface CreateMemberRequest {
  // Personal Information
  title?: string
  nameFamily: string
  nameMiddle?: string
  nameFirst: string
  sex?: string
  dob?: string
  address?: string
  geopoliticalZone?:
    | 'South South'
    | 'South West'
    | 'South East'
    | 'North Central'
    | 'North West'
    | 'North East'
    | 'Not Applicable'
  telephone?: string
  fax?: string
  email: string
  avatar?: string

  // Employment & Education
  position?: string
  employer?: string
  department?: string
  qualifications?: string
  experience?: string

  // Languages
  motherTongue?: string
  otherLanguages?: string[]
  otherLanguageText?: string

  // Areas of Expertise
  expertiseDescription?: string
  expertise?: string[]
  expertiseOther?: string

  // Employment Classification
  agency?: string
  typeOfWork?: string
  typeOfWorkOther?: string
  retiredSince?: string

  // Membership Details
  membershipType: string
  fees: number
  paymentReference?: string

  // Related data
  publications?: string[]
}

export interface UpdateMemberRequest extends Partial<Omit<CreateMemberRequest, 'id'>> {
  id?: string
  avatar?: string
}

export interface MemberActionRequest {
  reason?: string
  notes?: string
  paymentReference?: string
  period?: string
}

export interface MemberStats {
  total: number
  byStatus: Record<string, number>
  byType: Record<string, number>
  recentJoins: number
  expiringThisMonth: number
}

// Query parameters for member list
export interface MemberListQuery {
  page?: number
  limit?: number
  search?: string
  status?: string
  type?: string
  sortBy?: 'name' | 'joinedDate' | 'expiryDate' | 'status'
  sortOrder?: 'asc' | 'desc'
}
