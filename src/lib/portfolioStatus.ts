import type { AnyRecord, PortfolioAreaId } from '../types'
import { daysFromToday } from './dates'

export type PortfolioStatus = 'On track' | 'Needs attention' | 'At risk' | 'Paused'

export interface PortfolioSummary {
  areaId: PortfolioAreaId
  currentFocus?: AnyRecord
  thisWeekCount: number
  needsCandiceCount: number
  waitingCount: number
  parkedCount: number
  atRiskCount: number
  status: PortfolioStatus
}

function isOpen(r: AnyRecord) {
  return r.status !== 'completed' && r.status !== 'archived'
}

export function summarizePortfolio(areaId: PortfolioAreaId, records: AnyRecord[]): PortfolioSummary {
  const areaRecords = records.filter((r) => r.portfolioArea === areaId && isOpen(r))

  const thisWeek = areaRecords.filter((r) => r.status === 'this-week')
  const today = areaRecords.filter((r) => r.status === 'today')
  const needsCandice = areaRecords.filter((r) => r.candiceRequired)
  const waitingList = areaRecords.filter((r) => r.type === 'waiting' && r.status === 'waiting')
  const parked = areaRecords.filter((r) => r.status === 'parked' || r.status === 'active')

  const overdueHard = areaRecords.filter(
    (r) => r.deadlineType === 'hard' && (daysFromToday(r.deadlineDate) ?? 1) < 0,
  )
  const staleWaiting = waitingList.filter((r) => (daysFromToday(r.followUpDate) ?? 0) < -1)

  let status: PortfolioStatus = 'On track'
  if (overdueHard.length > 0) status = 'At risk'
  else if (staleWaiting.length > 0 || needsCandice.length >= 3) status = 'Needs attention'
  if (thisWeek.length === 0 && today.length === 0 && needsCandice.length === 0 && waitingList.length === 0 && areaRecords.length > 0) {
    status = 'Paused'
  }

  const currentFocus = [...today, ...thisWeek].sort((a, b) => {
    const pri = { high: 0, medium: 1, low: 2 }
    return pri[a.priority ?? 'medium'] - pri[b.priority ?? 'medium']
  })[0]

  return {
    areaId,
    currentFocus,
    thisWeekCount: thisWeek.length,
    needsCandiceCount: needsCandice.length,
    waitingCount: waitingList.length,
    parkedCount: parked.length,
    atRiskCount: overdueHard.length + staleWaiting.length,
    status,
  }
}

export const STATUS_STYLES: Record<PortfolioStatus, string> = {
  'On track': 'text-moss bg-moss/10',
  'Needs attention': 'text-ochre bg-ochre/10',
  'At risk': 'text-terracotta bg-terracotta/10',
  Paused: 'text-charcoal/50 bg-charcoal/5',
}
