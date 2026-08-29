import type { AnyRecord, PortfolioAreaId, WaitingItem } from '../types'
import { daysFromToday } from './dates'

const isOpen = (r: AnyRecord) => r.status !== 'completed' && r.status !== 'archived'

export function selectToday(records: AnyRecord[]): AnyRecord[] {
  return records
    .filter((r) => isOpen(r) && r.status === 'today')
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
}

export function selectNeedsCandice(records: AnyRecord[]): AnyRecord[] {
  return records
    .filter((r) => isOpen(r) && r.candiceRequired && !['waiting', 'parked', 'today'].includes(r.status))
    .sort((a, b) => {
      const pri = { high: 0, medium: 1, low: 2 }
      const ap = pri[a.priority ?? 'medium']
      const bp = pri[b.priority ?? 'medium']
      if (ap !== bp) return ap - bp
      return (daysFromToday(a.deadlineDate ?? a.reviewByDate) ?? 999) - (daysFromToday(b.deadlineDate ?? b.reviewByDate) ?? 999)
    })
    .slice(0, 6)
}

export function selectThisWeek(records: AnyRecord[]): AnyRecord[] {
  return records
    .filter((r) => isOpen(r) && r.status === 'this-week')
    .sort((a, b) => (daysFromToday(a.deadlineDate ?? a.targetDate) ?? 999) - (daysFromToday(b.deadlineDate ?? b.targetDate) ?? 999))
}

const FAMILY_PERSONAL: PortfolioAreaId[] = ['family', 'personal']

export function lifeBucket(area?: PortfolioAreaId): 'work' | 'family-personal' {
  return area && FAMILY_PERSONAL.includes(area) ? 'family-personal' : 'work'
}

/** A wait that's gone quiet long enough to be worth flagging, not just tracking. */
function isGoingStale(r: AnyRecord): boolean {
  if (r.type !== 'waiting') return false
  const askedDaysAgo = daysFromToday(r.requestedDate)
  return askedDaysAgo !== null && askedDaysAgo <= -5
}

export function selectComingAtMe(records: AnyRecord[]): AnyRecord[] {
  const candidates = records.filter((r) => {
    if (!isOpen(r) || r.status === 'today' || r.status === 'this-week') return false
    // Decisions/approvals already surface in Needs Candice, and ordinary
    // waiting items already live in Waiting On — Coming At Me is for what
    // isn't being watched anywhere else yet, plus waits going quiet.
    if (r.candiceRequired) return false
    if (r.type === 'waiting' && r.status === 'waiting' && !isGoingStale(r)) return false
    const d = daysFromToday(r.deadlineDate ?? r.reviewByDate ?? r.followUpDate)
    return d !== null && d >= -1 && d <= 7
  })
  return candidates
    .sort((a, b) => (daysFromToday(a.deadlineDate ?? a.reviewByDate ?? a.followUpDate) ?? 999) - (daysFromToday(b.deadlineDate ?? b.reviewByDate ?? b.followUpDate) ?? 999))
    .slice(0, 6)
}

export function selectWaiting(records: AnyRecord[]): WaitingItem[] {
  return records
    .filter((r): r is WaitingItem => r.type === 'waiting' && r.status === 'waiting')
    .sort((a, b) => (daysFromToday(a.followUpDate) ?? 999) - (daysFromToday(b.followUpDate) ?? 999))
}

export function selectSafelyParked(records: AnyRecord[]): AnyRecord[] {
  return records.filter((r) => isOpen(r) && (r.status === 'parked' || r.status === 'active') && r.type !== 'idea')
}

export function selectReviewDue(records: AnyRecord[]): AnyRecord[] {
  return records.filter((r) => isOpen(r) && r.reviewByDate && (daysFromToday(r.reviewByDate) ?? 1) <= 0)
}

export function selectBacklog(records: AnyRecord[]): AnyRecord[] {
  return records.filter((r) => isOpen(r) && r.type !== 'idea' && !['today', 'this-week'].includes(r.status))
}
