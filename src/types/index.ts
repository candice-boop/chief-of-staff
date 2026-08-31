// Core domain types for Candice, Inc.
// Designed so an AI Chief of Staff can later read, classify, and act on these records.

export type PortfolioAreaId =
  | 'cls-marketing'
  | 'kin-atlas'
  | 'fora'
  | 'hey-mom'
  | 'mother-mogul'
  | 'family'
  | 'personal'

export interface PortfolioArea {
  id: PortfolioAreaId
  name: string
  tagline: string
  /** Optional sub-areas, e.g. CLS Marketing -> Client Delivery / Business Development */
  subAreas?: SubArea[]
  /** Mother Mogul nests conceptually under Hey Mom but gets its own card/filter */
  parentId?: PortfolioAreaId
  color: string // token name used for accent styling
}

export interface SubArea {
  id: string
  name: string
}

export type RecordType = 'task' | 'decision' | 'waiting' | 'idea' | 'note'

export type ItemStatus =
  | 'inbox'
  | 'active'
  | 'today'
  | 'this-week'
  | 'waiting'
  | 'parked'
  | 'completed'
  | 'archived'

export type DeadlineType = 'hard' | 'committed' | 'target' | 'wish' | 'review' | null

export type Priority = 'high' | 'medium' | 'low'

export interface BaseRecord {
  id: string
  type: RecordType
  title: string
  description?: string
  portfolioArea?: PortfolioAreaId
  subArea?: string
  project?: string // project id
  status: ItemStatus
  priority?: Priority
  deadlineType?: DeadlineType
  deadlineDate?: string // ISO date
  targetDate?: string
  reviewByDate?: string
  estimatedEffort?: string // human string e.g. "90 min"
  nextAction?: string
  candiceRequired?: boolean
  aiCanHandle?: boolean
  waitingOn?: string // person / dependency name
  waitingSince?: string
  followUpDate?: string
  dependency?: string
  source?: 'manual' | 'ai' | 'email' | 'inbox'
  createdAt: string
  updatedAt: string
  completedAt?: string
  notes?: string
  order?: number
}

export interface TaskItem extends BaseRecord {
  type: 'task'
}

export interface DecisionItem extends BaseRecord {
  type: 'decision'
}

export interface WaitingItem extends BaseRecord {
  type: 'waiting'
  waitingOn: string
  requestedDate?: string
}

export type IdeaStatus = 'new' | 'worth-exploring' | 'parked' | 'promoted' | 'archived'

export interface IdeaItem extends BaseRecord {
  type: 'idea'
  ideaStatus: IdeaStatus
  capturedDate: string
}

export interface NoteItem extends BaseRecord {
  type: 'note'
}

export type AnyRecord = TaskItem | DecisionItem | WaitingItem | IdeaItem | NoteItem

/**
 * A patch object touching any field from any record variant, including a
 * change of `type` itself (e.g. promoting an idea into a task). `keyof
 * AnyRecord` on the union only yields fields common to every variant, and
 * intersecting the variants' Partials collapses `type` to `never` (the
 * literals can't intersect) — so this is declared as a flat, fully-optional
 * shape instead.
 */
export interface RecordPatch extends Partial<Omit<BaseRecord, 'id'>> {
  waitingOn?: string
  requestedDate?: string
  ideaStatus?: IdeaStatus
  capturedDate?: string
}

export interface Project {
  id: string
  title: string
  portfolioArea: PortfolioAreaId
  objective: string
  currentStatus: string
  milestone?: string
  targetDate?: string
  priority?: Priority
  notes?: string
}

export type InboxSourceKind = 'task' | 'brain-dump' | 'idea' | 'note' | 'pasted'

export interface InboxEntry {
  id: string
  rawText: string
  kind?: InboxSourceKind
  createdAt: string
  processed: boolean
}

export interface EmailAccount {
  id: string
  label: string // e.g. "CLS Marketing", "Personal"
  email: string
  connected: boolean
}

export interface Settings {
  protectedFamilyHours: { start: string; end: string }
  workRhythm: { label: string; start: string; end: string }[]
  autonomyMode: 'operator'
  calendarConnected: boolean
  emailAccounts: EmailAccount[]
}
