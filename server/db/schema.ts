import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).default(false).notNull(),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow().notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow().notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: integer('access_token_expires_at', {
    mode: 'timestamp',
  }),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', {
    mode: 'timestamp',
  }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow().notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow().notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

// Members schema (EPISON)
// Captures all fields collected during the application process as well as membership lifecycle metadata
export const member = sqliteTable('member', {
  // Core
  id: text('id').primaryKey(),

  // Personal Information
  title: text('title'),
  nameFamily: text('name_family').notNull(),
  nameMiddle: text('name_middle'),
  nameFirst: text('name_first').notNull(),
  sex: text('sex'), // 'Male' | 'Female' or free text
  dob: text('dob'), // ISO date string
  address: text('address'),
  state: text('state'), // Nigerian state
  telephone: text('telephone'),
  fax: text('fax'),
  email: text('email').notNull().unique(),
  avatar: text('avatar'), // S3 key or URL to the member's profile image

  // Employment & Education
  position: text('position'),
  employer: text('employer'), // full address allowed
  department: text('department'),
  qualifications: text('qualifications'),
  experience: text('experience'),

  // Languages
  motherTongue: text('mother_tongue'),
  otherLanguagesJson: text('other_languages_json'), // JSON-encoded string[]
  otherLanguageText: text('other_language_text'),

  // Areas of Expertise
  expertiseDescription: text('expertise_description'),
  expertiseOther: text('expertise_other'),

  // Employment Classification
  agency: text('agency'), // constrained in app layer
  typeOfWork: text('type_of_work'),
  typeOfWorkOther: text('type_of_work_other'),
  retiredSince: text('retired_since'), // optional

  // Membership Details
  membershipType: text('membership_type'), // e.g., 'regular', 'regular iea', 'early-career', etc.
  status: text('status'), // 'pending' | 'active' | 'expired' | 'suspended'
  joinedDate: text('joined_date'), // ISO date string
  expiryDate: text('expiry_date'), // ISO date string
  fees: integer('fees'), // in NGN
  paymentReference: text('payment_reference'),

  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow().notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

// Member Publications (uploaded filenames/paths)
export const memberPublication = sqliteTable('member_publication', {
  id: text('id').primaryKey(),
  memberId: text('member_id')
    .notNull()
    .references(() => member.id, { onDelete: 'cascade' }),
  filename: text('filename').notNull(),
  // Optionally store a URL or storage key if needed in future
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow().notNull(),
})

// Member Expertise selections (normalized list of selected areas)
export const memberExpertise = sqliteTable('member_expertise', {
  id: text('id').primaryKey(),
  memberId: text('member_id')
    .notNull()
    .references(() => member.id, { onDelete: 'cascade' }),
  label: text('label').notNull(), // e.g., 'Infectious Disease'
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow().notNull(),
})

// Membership lifecycle history (status changes, renewals, etc.)
export const memberHistory = sqliteTable('member_history', {
  id: text('id').primaryKey(),
  memberId: text('member_id')
    .notNull()
    .references(() => member.id, { onDelete: 'cascade' }),
  action: text('action').notNull(), // human-readable summary
  type: text('type').notNull(), // 'renewal' | 'status_change' | 'creation' | others
  date: integer('date', { mode: 'timestamp' }).defaultNow().notNull(),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow().notNull(),
})

// ===== Events Feature: Core =====
export const event = sqliteTable('event', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  type: text('type').notNull(), // conference | workshop | webinar | seminar | symposium
  status: text('status').notNull(), // draft | published | registration_open | registration_closed | ongoing | completed | cancelled
  startDate: text('start_date').notNull(),
  endDate: text('end_date'),
  location: text('location').notNull(),
  capacity: integer('capacity'),
  description: text('description'),
  bannerUrl: text('banner_url'),
  membersOnly: integer('members_only', { mode: 'boolean' }).default(false).notNull(),
  collectsSubmissions: integer('collects_submissions', { mode: 'boolean' })
    .default(false)
    .notNull(),
  theme: text('theme'), // Event theme (single)
  subthemes: text('subthemes'), // Comma-separated subthemes (CSV string)
  submissionGuidelines: text('submission_guidelines'), // Markdown string
  submissionDatesJson: text('submission_dates_json'), // Dates array as JSON string
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow().notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const eventTicket = sqliteTable('event_ticket', {
  id: text('id').primaryKey(),
  eventId: text('event_id')
    .notNull()
    .references(() => event.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  price: integer('price').notNull(), // amount in kobo
  quantity: integer('quantity').notNull(),
  salesStart: text('sales_start'),
  salesEnd: text('sales_end'),
  description: text('description'),
  isPublic: integer('is_public', { mode: 'boolean' }).default(true).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow().notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

// ===== Events Feature: Sponsors/Speakers/Media =====
export const eventSponsor = sqliteTable('event_sponsor', {
  id: text('id').primaryKey(),
  eventId: text('event_id')
    .notNull()
    .references(() => event.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  tier: text('tier'), // platinum | gold | silver | bronze | partner | string
  logoUrl: text('logo_url').notNull(),
  website: text('website'),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow().notNull(),
})

export const eventSpeaker = sqliteTable('event_speaker', {
  id: text('id').primaryKey(),
  eventId: text('event_id')
    .notNull()
    .references(() => event.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  title: text('title'),
  org: text('org'),
  photoUrl: text('photo_url'),
  bio: text('bio'),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow().notNull(),
})

export const eventMedia = sqliteTable('event_media', {
  id: text('id').primaryKey(),
  eventId: text('event_id')
    .notNull()
    .references(() => event.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  caption: text('caption'),
  type: text('type'), // image | video
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow().notNull(),
})

export const eventCommitteeMember = sqliteTable('event_committee_member', {
  id: text('id').primaryKey(),
  eventId: text('event_id')
    .notNull()
    .references(() => event.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  role: text('role'),
  email: text('email'),
  phone: text('phone'),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow().notNull(),
})

export const eventRegistration = sqliteTable('event_registration', {
  id: text('id').primaryKey(),
  eventId: text('event_id')
    .notNull()
    .references(() => event.id, { onDelete: 'cascade' }),
  attendeeName: text('attendee_name').notNull(),
  attendeeEmail: text('attendee_email').notNull(),

  // Attendee category independent from ticket
  category: text('category'), // Member | Non-Member | Student | Speaker | Sponsor

  // Ticket relationship (optional) and commercial snapshots
  ticketId: text('ticket_id').references(() => eventTicket.id, { onDelete: 'set null' }),
  ticketName: text('ticket_name'),
  unitPrice: integer('unit_price'), // in kobo
  quantity: integer('quantity').default(1).notNull(),
  currency: text('currency').default('NGN').notNull(),
  totalAmount: integer('total_amount').default(0).notNull(), // in kobo

  // Payment lifecycle
  paymentStatus: text('payment_status').default('Pending').notNull(), // Pending | Paid | Cancelled | Refunded
  reference: text('reference'),
  paymentProvider: text('payment_provider'), // e.g., 'paystack'
  paymentMetaJson: text('payment_meta_json'), // raw provider payload (JSON string)
  paidAt: integer('paid_at', { mode: 'timestamp' }),
  refundedAt: integer('refunded_at', { mode: 'timestamp' }),

  // Audit
  registeredAt: integer('registered_at', { mode: 'timestamp' }).defaultNow().notNull(),
  notes: text('notes'),
})

export const abstractSubmission = sqliteTable('abstract_submission', {
  id: text('id').primaryKey(),
  eventId: text('event_id')
    .notNull()
    .references(() => event.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  abstract: text('abstract').notNull(),
  authorsJson: text('authors_json').notNull(), // JSON string of string[]
  correspondingAuthorName: text('corresponding_author_name').notNull(),
  correspondingAuthorEmail: text('corresponding_author_email').notNull(),
  correspondingAuthorAffiliation: text('corresponding_author_affiliation').notNull(),
  correspondingAuthorPhone: text('corresponding_author_phone'),
  keywordsJson: text('keywords_json').notNull(), // JSON string of string[]
  category: text('category').notNull(), // oral | poster | workshop
  notes: text('notes'),
  submissionDate: integer('submission_date', { mode: 'timestamp' }).defaultNow().notNull(),
  status: text('status').default('pending').notNull(), // pending | under_review | accepted | rejected | revision_required
  reviewerComments: text('reviewer_comments'),
})

// ===== Event Reviews =====
// Stores reviews and ratings submitted by event attendees
export const eventReview = sqliteTable('event_review', {
  id: text('id').primaryKey(),
  eventId: text('event_id')
    .notNull()
    .references(() => event.id, { onDelete: 'cascade' }),
  registrationId: text('registration_id')
    .notNull()
    .references(() => eventRegistration.id, { onDelete: 'cascade' }),
  attendeeEmail: text('attendee_email').notNull(),
  attendeeName: text('attendee_name').notNull(),
  rating: integer('rating').notNull(), // 1-5 stars
  reviewText: text('review_text'),
  reviewToken: text('review_token').notNull().unique(),
  tokenUsed: integer('token_used', { mode: 'boolean' }).default(false).notNull(),
  submittedAt: integer('submitted_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow().notNull(),
})

// ===== Activities (Audit Log) =====
// Lightweight activity log that powers the Admin dashboard's Recent Activity
// and the /admin/activities page. These are created automatically from user actions.
export const activityLog = sqliteTable('activity_log', {
  id: text('id').primaryKey(),
  // High-level category shown in UI filters
  // e.g. 'Registration' | 'Payment' | 'Event' | 'Membership'
  type: text('type').notNull(),
  // Title and description rendered in the cards/list
  title: text('title').notNull(),
  description: text('description'),
  // Presentation details used by the UI
  icon: text('icon'), // e.g. i-heroicons-user-plus
  iconColor: text('icon_color'), // e.g. text-green-500
  // Who performed the action (optional for system actions)
  actorId: text('actor_id').references(() => user.id, { onDelete: 'set null' }),
  // Optional linkage to a domain entity for deep links
  entityType: text('entity_type'), // e.g. 'event' | 'member' | 'registration' | 'payment'
  entityId: text('entity_id'),
  // Arbitrary JSON serialized as text for extensibility
  metadata: text('metadata'),
  // Timestamp displayed in UI (time ago)
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow().notNull(),
})
