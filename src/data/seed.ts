import type { AnyRecord, IdeaItem, InboxEntry, TaskItem, DecisionItem, WaitingItem, NoteItem } from '../types'
import { inDays, upcoming, todayISO } from '../lib/dates'

let counter = 0
const nextId = (prefix: string) => `${prefix}-${(++counter).toString().padStart(3, '0')}`

const createdAgo = (n: number) => inDays(-n)

function task(partial: Partial<TaskItem> & Pick<TaskItem, 'title' | 'portfolioArea' | 'status'>): TaskItem {
  return {
    id: nextId('task'),
    type: 'task',
    priority: 'medium',
    candiceRequired: false,
    aiCanHandle: false,
    createdAt: createdAgo(5),
    updatedAt: createdAgo(1),
    ...partial,
  }
}

function decision(partial: Partial<DecisionItem> & Pick<DecisionItem, 'title' | 'portfolioArea' | 'status'>): DecisionItem {
  return {
    id: nextId('dec'),
    type: 'decision',
    priority: 'high',
    candiceRequired: true,
    aiCanHandle: false,
    createdAt: createdAgo(4),
    updatedAt: createdAgo(1),
    ...partial,
  }
}

function waiting(partial: Partial<WaitingItem> & Pick<WaitingItem, 'title' | 'portfolioArea' | 'waitingOn'>): WaitingItem {
  return {
    id: nextId('wait'),
    type: 'waiting',
    status: 'waiting',
    priority: 'medium',
    createdAt: createdAgo(6),
    updatedAt: createdAgo(2),
    ...partial,
  }
}

function idea(partial: Partial<IdeaItem> & Pick<IdeaItem, 'title' | 'portfolioArea' | 'ideaStatus'>): IdeaItem {
  return {
    id: nextId('idea'),
    type: 'idea',
    status: 'parked',
    capturedDate: createdAgo(10),
    createdAt: createdAgo(10),
    updatedAt: createdAgo(10),
    ...partial,
  }
}

function note(partial: Partial<NoteItem> & Pick<NoteItem, 'title' | 'portfolioArea' | 'status'>): NoteItem {
  return {
    id: nextId('note'),
    type: 'note',
    createdAt: createdAgo(8),
    updatedAt: createdAgo(8),
    ...partial,
  }
}

// ---------------------------------------------------------------------------
// TODAY
// ---------------------------------------------------------------------------
const todayItems: AnyRecord[] = [
  task({
    title: 'Finish Kin Atlas onboarding flow',
    portfolioArea: 'kin-atlas',
    project: 'proj-kin-mvp',
    status: 'today',
    deadlineType: 'target',
    deadlineDate: todayISO,
    estimatedEffort: '90 min',
    candiceRequired: true,
    priority: 'high',
    notes: 'Final pass on empty states and copy before it goes to beta testers.',
    order: 1,
  }),
  task({
    title: 'Review client positioning deck',
    portfolioArea: 'cls-marketing',
    subArea: 'client-delivery',
    project: 'proj-cls-q3',
    status: 'today',
    deadlineType: 'committed',
    deadlineDate: todayISO,
    estimatedEffort: '45 min',
    candiceRequired: true,
    priority: 'high',
    order: 2,
  }),
  task({
    title: 'Approve travel options for the Johnson family',
    portfolioArea: 'fora',
    project: 'proj-fora-highseason',
    status: 'today',
    deadlineType: 'committed',
    deadlineDate: todayISO,
    candiceRequired: true,
    priority: 'medium',
    order: 3,
  }),
  task({
    title: 'Record voice memo outline for pilot episode',
    portfolioArea: 'mother-mogul',
    project: 'proj-mothermogul-s1',
    status: 'today',
    deadlineType: 'target',
    deadlineDate: todayISO,
    estimatedEffort: '30 min',
    candiceRequired: true,
    aiCanHandle: false,
    priority: 'medium',
    notes: 'Rough cut is fine — production can shape it later.',
    order: 4,
  }),
]

// ---------------------------------------------------------------------------
// NEEDS CANDICE (decisions & judgment calls — not all are "today")
// ---------------------------------------------------------------------------
const needsCandiceItems: AnyRecord[] = [
  decision({
    title: 'Choose final Kin Atlas onboarding direction',
    portfolioArea: 'kin-atlas',
    project: 'proj-kin-mvp',
    status: 'active',
    deadlineType: 'target',
    deadlineDate: inDays(1),
    priority: 'high',
  }),
  decision({
    title: 'Approve client messaging recommendation',
    portfolioArea: 'cls-marketing',
    subArea: 'client-delivery',
    project: 'proj-cls-q3',
    status: 'active',
    deadlineType: 'committed',
    deadlineDate: inDays(1),
    priority: 'high',
  }),
  task({
    title: 'Respond to sensitive client question about scope',
    portfolioArea: 'cls-marketing',
    subArea: 'client-delivery',
    status: 'active',
    deadlineType: 'committed',
    deadlineDate: inDays(1),
    candiceRequired: true,
    priority: 'high',
    notes: 'Needs Candice\'s voice — not something to delegate.',
  }),
  decision({
    title: 'Pick guest for episode 3 from two strong candidates',
    portfolioArea: 'mother-mogul',
    project: 'proj-mothermogul-s1',
    status: 'active',
    deadlineType: 'review',
    reviewByDate: inDays(2),
    priority: 'medium',
  }),
]

// ---------------------------------------------------------------------------
// THIS WEEK
// ---------------------------------------------------------------------------
const thisWeekItems: AnyRecord[] = [
  task({
    title: 'Client strategy presentation',
    portfolioArea: 'cls-marketing',
    subArea: 'client-delivery',
    project: 'proj-cls-q3',
    status: 'this-week',
    deadlineType: 'committed',
    deadlineDate: upcoming('Thursday'),
    candiceRequired: true,
    priority: 'high',
    nextAction: 'Preparation needs to begin Tuesday',
  }),
  task({
    title: 'Complete onboarding MVP',
    portfolioArea: 'kin-atlas',
    project: 'proj-kin-mvp',
    status: 'this-week',
    deadlineType: 'target',
    deadlineDate: upcoming('Friday'),
    candiceRequired: false,
    aiCanHandle: false,
    priority: 'high',
  }),
  task({
    title: 'School paperwork due',
    portfolioArea: 'family',
    project: 'proj-family-schoolyear',
    status: 'this-week',
    deadlineType: 'hard',
    deadlineDate: upcoming('Friday'),
    candiceRequired: true,
    priority: 'medium',
  }),
  task({
    title: 'Align on pilot episode structure',
    portfolioArea: 'mother-mogul',
    project: 'proj-mothermogul-s1',
    status: 'this-week',
    deadlineType: 'target',
    deadlineDate: upcoming('Friday'),
    candiceRequired: true,
    priority: 'medium',
  }),
  task({
    title: 'Send follow-up to warm referral lead',
    portfolioArea: 'cls-marketing',
    subArea: 'business-development',
    status: 'this-week',
    deadlineType: 'target',
    deadlineDate: upcoming('Tuesday'),
    candiceRequired: true,
    priority: 'medium',
  }),
  task({
    title: 'Pre-trip check-in call with the Alvarez travelers',
    portfolioArea: 'fora',
    project: 'proj-fora-highseason',
    status: 'this-week',
    deadlineType: 'committed',
    deadlineDate: upcoming('Wednesday'),
    candiceRequired: true,
    priority: 'medium',
  }),
  task({
    title: 'Draft newsletter for Hey Mom audience',
    portfolioArea: 'hey-mom',
    project: 'proj-heymom-funnel',
    status: 'this-week',
    deadlineType: 'target',
    deadlineDate: upcoming('Monday'),
    candiceRequired: false,
    aiCanHandle: true,
    priority: 'low',
  }),
  task({
    title: 'Date night reservation — anniversary week',
    portfolioArea: 'personal',
    status: 'this-week',
    deadlineType: 'wish',
    deadlineDate: upcoming('Saturday'),
    candiceRequired: true,
    priority: 'low',
  }),
]

// ---------------------------------------------------------------------------
// COMING AT ME (near-future items surfaced by proximity, computed in selectors
// too, but a few are seeded explicitly as notes/reviews that wouldn't
// otherwise surface as tasks)
// ---------------------------------------------------------------------------
const comingAtMeItems: AnyRecord[] = [
  task({
    title: "School birthday party — gift & RSVP",
    portfolioArea: 'family',
    status: 'active',
    deadlineType: 'committed',
    deadlineDate: upcoming('Saturday'),
    candiceRequired: true,
    priority: 'low',
  }),
  waiting({
    title: 'Proposal follow-up going stale',
    portfolioArea: 'cls-marketing',
    subArea: 'business-development',
    waitingOn: 'Prospective client — Meridian Co.',
    requestedDate: inDays(-6),
    followUpDate: upcoming('Friday'),
    priority: 'medium',
    notes: 'No response in 6 days — worth a nudge before it goes cold.',
  }),
  note({
    title: "Kin Atlas beta target needs next week's calendar protected",
    portfolioArea: 'kin-atlas',
    project: 'proj-kin-mvp',
    status: 'active',
    deadlineType: 'review',
    reviewByDate: inDays(6),
    priority: 'medium',
    notes: 'Block deep-work time now, before the week fills up.',
  }),
  task({
    title: 'Passport details due from Fora traveler',
    portfolioArea: 'fora',
    project: 'proj-fora-highseason',
    status: 'active',
    deadlineType: 'hard',
    deadlineDate: inDays(5),
    candiceRequired: false,
    priority: 'medium',
  }),
  task({
    title: "DJ's soccer registration closes",
    portfolioArea: 'family',
    status: 'active',
    deadlineType: 'hard',
    deadlineDate: inDays(4),
    candiceRequired: true,
    priority: 'medium',
  }),
  task({
    title: 'Flight booking deadline for fall offsite',
    portfolioArea: 'personal',
    status: 'active',
    deadlineType: 'target',
    deadlineDate: inDays(6),
    candiceRequired: true,
    priority: 'low',
  }),
]

// ---------------------------------------------------------------------------
// WAITING ON
// ---------------------------------------------------------------------------
const waitingItems: AnyRecord[] = [
  waiting({
    title: 'Client feedback on proposal',
    portfolioArea: 'cls-marketing',
    subArea: 'client-delivery',
    waitingOn: 'Sarah — client contact',
    requestedDate: inDays(-3),
    followUpDate: inDays(1),
    priority: 'high',
  }),
  waiting({
    title: 'Passport details',
    portfolioArea: 'fora',
    project: 'proj-fora-highseason',
    waitingOn: 'Alvarez family — travelers',
    requestedDate: inDays(-4),
    followUpDate: upcoming('Friday'),
    priority: 'medium',
  }),
  waiting({
    title: 'API access for partner integration',
    portfolioArea: 'kin-atlas',
    project: 'proj-kin-mvp',
    waitingOn: 'Kin Atlas engineering partner',
    requestedDate: inDays(-5),
    followUpDate: upcoming('Monday'),
    priority: 'medium',
  }),
  waiting({
    title: 'Guest confirmation for episode 4',
    portfolioArea: 'mother-mogul',
    project: 'proj-mothermogul-s1',
    waitingOn: "Guest's publicist",
    requestedDate: inDays(-7),
    followUpDate: upcoming('Monday'),
    priority: 'low',
  }),
  waiting({
    title: "Room-parent volunteer list",
    portfolioArea: 'family',
    project: 'proj-family-schoolyear',
    waitingOn: 'School PTA coordinator',
    requestedDate: inDays(-2),
    followUpDate: inDays(3),
    priority: 'low',
  }),
]

// ---------------------------------------------------------------------------
// SAFELY PARKED — plentiful, low-urgency backlog across every portfolio.
// This is what makes "nothing else needs attention" feel true.
// ---------------------------------------------------------------------------
const parkedTitles: { title: string; portfolioArea: AnyRecord['portfolioArea']; subArea?: string }[] = [
  { title: 'Refresh CLS Marketing case studies page', portfolioArea: 'cls-marketing', subArea: 'business-development' },
  { title: 'Explore retainer pricing model v2', portfolioArea: 'cls-marketing', subArea: 'business-development' },
  { title: 'Reconnect with former client for referral', portfolioArea: 'cls-marketing', subArea: 'business-development' },
  { title: 'Organize client onboarding templates', portfolioArea: 'cls-marketing', subArea: 'client-delivery' },
  { title: 'Audit last quarter\'s deliverables for a case study', portfolioArea: 'cls-marketing', subArea: 'client-delivery' },
  { title: 'Update CLS brand deck with new results', portfolioArea: 'cls-marketing' },
  { title: 'Research analytics tooling for Kin Atlas dashboard', portfolioArea: 'kin-atlas' },
  { title: 'Draft beta-tester welcome email sequence', portfolioArea: 'kin-atlas' },
  { title: 'Explore App Store listing copy options', portfolioArea: 'kin-atlas' },
  { title: 'List open questions for engineering partner', portfolioArea: 'kin-atlas' },
  { title: 'Sketch pricing tiers for post-beta launch', portfolioArea: 'kin-atlas' },
  { title: 'Review competitor onboarding flows', portfolioArea: 'kin-atlas' },
  { title: 'Confirm autumn group-trip minimums', portfolioArea: 'fora' },
  { title: 'Update preferred-partner hotel list', portfolioArea: 'fora' },
  { title: 'Send seasonal check-in to past travelers', portfolioArea: 'fora' },
  { title: 'Organize travel insurance reference sheet', portfolioArea: 'fora' },
  { title: 'Research new advisor certification course', portfolioArea: 'fora' },
  { title: 'Outline signature course curriculum', portfolioArea: 'hey-mom' },
  { title: 'Batch-write three Hey Mom Instagram captions', portfolioArea: 'hey-mom' },
  { title: 'Explore live-workshop format for spring', portfolioArea: 'hey-mom' },
  { title: 'Review audience survey responses', portfolioArea: 'hey-mom' },
  { title: 'Refresh lead-magnet PDF design', portfolioArea: 'hey-mom' },
  { title: 'Build guest outreach tracker', portfolioArea: 'mother-mogul' },
  { title: 'Draft show notes template', portfolioArea: 'mother-mogul' },
  { title: 'Research podcast hosting platforms', portfolioArea: 'mother-mogul' },
  { title: 'Sketch season 1 episode arc', portfolioArea: 'mother-mogul' },
  { title: 'Order fall clothes for kids', portfolioArea: 'family' },
  { title: 'Schedule dentist checkups for both kids', portfolioArea: 'family' },
  { title: 'Plan Court\'s birthday celebration', portfolioArea: 'family' },
  { title: 'Research after-school activity options', portfolioArea: 'family' },
  { title: 'Set up shared family calendar reminders', portfolioArea: 'family' },
  { title: 'Sort donation pile in the garage', portfolioArea: 'personal' },
  { title: 'Book annual physical', portfolioArea: 'personal' },
  { title: 'Plan weekend trip with friends', portfolioArea: 'personal' },
  { title: 'Research closet reorganization system', portfolioArea: 'personal' },
  { title: 'Write anniversary card list for the year', portfolioArea: 'personal' },
  { title: 'Look into a standing desk for the home office', portfolioArea: 'personal' },
  { title: 'Consolidate old client contracts into shared drive', portfolioArea: 'cls-marketing', subArea: 'client-delivery' },
]

const parkedItems: AnyRecord[] = parkedTitles.map((p) =>
  task({
    title: p.title,
    portfolioArea: p.portfolioArea,
    subArea: p.subArea,
    status: 'parked',
    priority: 'low',
    deadlineType: null,
    createdAt: createdAgo(Math.floor(Math.random() * 40) + 5),
  }),
)

// A few items with an arrived review-by date, to surface in Backlog
const reviewDueItems: AnyRecord[] = [
  task({
    title: 'Reconsider Fora niche focus for next season',
    portfolioArea: 'fora',
    status: 'active',
    deadlineType: 'review',
    reviewByDate: inDays(-1),
    priority: 'low',
  }),
  task({
    title: 'Revisit CLS Marketing retainer minimums',
    portfolioArea: 'cls-marketing',
    subArea: 'business-development',
    status: 'active',
    deadlineType: 'review',
    reviewByDate: todayISO,
    priority: 'medium',
  }),
]

// ---------------------------------------------------------------------------
// IDEAS
// ---------------------------------------------------------------------------
export const IDEAS: IdeaItem[] = [
  idea({
    title: 'Quarterly "State of Your Business" report for CLS clients',
    description: 'A short, beautifully designed recap deliverable — could become a signature touch.',
    portfolioArea: 'cls-marketing',
    ideaStatus: 'worth-exploring',
    priority: 'medium',
  }),
  idea({
    title: 'Referral partner program with light incentives',
    description: 'Formalize what already happens informally with a few trusted partners.',
    portfolioArea: 'cls-marketing',
    ideaStatus: 'new',
  }),
  idea({
    title: 'Kin Atlas family "memory vault" feature',
    description: 'A private, shared space for family memories tied to milestones.',
    portfolioArea: 'kin-atlas',
    ideaStatus: 'worth-exploring',
    priority: 'high',
    reviewByDate: inDays(30),
  }),
  idea({
    title: 'Kin Atlas + school calendar auto-import',
    description: 'Could remove a huge chunk of manual family data entry.',
    portfolioArea: 'kin-atlas',
    ideaStatus: 'new',
  }),
  idea({
    title: 'Fora "first-timer" trip concierge package',
    description: 'A guided, higher-touch package specifically for first-time luxury travelers.',
    portfolioArea: 'fora',
    ideaStatus: 'worth-exploring',
  }),
  idea({
    title: 'Small-group hosted trip once a year',
    portfolioArea: 'fora',
    ideaStatus: 'parked',
  }),
  idea({
    title: 'Hey Mom book — proposal outline',
    description: 'Could anchor the whole platform if the timing is ever right.',
    portfolioArea: 'hey-mom',
    ideaStatus: 'worth-exploring',
    priority: 'medium',
  }),
  idea({
    title: 'Live monthly Q&A for Hey Mom community',
    portfolioArea: 'hey-mom',
    ideaStatus: 'new',
  }),
  idea({
    title: 'Mother Mogul live taping event',
    description: 'Once the show has traction — a live recording with a small ticketed audience.',
    portfolioArea: 'mother-mogul',
    ideaStatus: 'parked',
  }),
  idea({
    title: 'Mother Mogul x Hey Mom cross-promotion series',
    portfolioArea: 'mother-mogul',
    ideaStatus: 'new',
  }),
  idea({
    title: 'Family "Sunday reset" ritual',
    description: 'Meal prep, calendars, and laundry in one light Sunday block.',
    portfolioArea: 'family',
    ideaStatus: 'worth-exploring',
  }),
  idea({
    title: 'Annual family travel tradition',
    portfolioArea: 'personal',
    ideaStatus: 'new',
  }),
  idea({
    title: 'Capsule wardrobe experiment',
    portfolioArea: 'personal',
    ideaStatus: 'parked',
  }),
]

// ---------------------------------------------------------------------------
// INBOX — unprocessed captures
// ---------------------------------------------------------------------------
export const INBOX_ENTRIES: InboxEntry[] = [
  {
    id: nextId('inbox'),
    rawText: "Call the orthodontist back about DJ's retainer",
    kind: 'task',
    createdAt: inDays(0),
    processed: false,
  },
  {
    id: nextId('inbox'),
    rawText:
      "Been thinking about the Kin Atlas pricing — what if beta users got a lifetime founding-member rate instead of a normal trial? Might be a stronger hook than a generic discount. Worth modeling out before we finalize the launch page.",
    kind: 'brain-dump',
    createdAt: inDays(0),
    processed: false,
  },
  {
    id: nextId('inbox'),
    rawText: 'Idea: a “behind the scenes” bonus feed for Mother Mogul subscribers',
    kind: 'idea',
    createdAt: inDays(-1),
    processed: false,
  },
  {
    id: nextId('inbox'),
    rawText: 'Court needs new cleats before the season starts — check sizing',
    kind: 'task',
    createdAt: inDays(-1),
    processed: false,
  },
  {
    id: nextId('inbox'),
    rawText:
      'Pasted from email: "Hi Candice, following up on the Q3 proposal — would love to find 20 minutes this week if you have room. Let me know what works!" — Meridian Co.',
    kind: 'pasted',
    createdAt: inDays(-2),
    processed: false,
  },
  {
    id: nextId('inbox'),
    rawText: 'Note to self: the 2-3pm wrap-up block keeps getting eaten by calls — worth protecting harder',
    kind: 'note',
    createdAt: inDays(-2),
    processed: false,
  },
]

export const ALL_RECORDS: AnyRecord[] = [
  ...todayItems,
  ...needsCandiceItems,
  ...thisWeekItems,
  ...comingAtMeItems,
  ...waitingItems,
  ...parkedItems,
  ...reviewDueItems,
  ...IDEAS,
]
