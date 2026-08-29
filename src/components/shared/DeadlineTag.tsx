import { relativeDayPhrase, daysFromToday } from '../../lib/dates'
import type { DeadlineType } from '../../types'

const STYLES: Record<string, string> = {
  hard: 'text-terracotta',
  committed: 'text-charcoal/80',
  target: 'text-charcoal/60',
  wish: 'text-charcoal/45 italic',
  review: 'text-dustyblue',
}

const LABEL: Record<string, string> = {
  hard: 'Due',
  committed: 'Committed',
  target: 'Target',
  wish: 'Someday',
  review: 'Review',
}

export function DeadlineTag({
  deadlineType,
  date,
}: {
  deadlineType?: DeadlineType
  date?: string
}) {
  if (!deadlineType || !date) return null
  const overdue = deadlineType !== 'wish' && (daysFromToday(date) ?? 0) < 0
  const phrase = relativeDayPhrase(date)

  return (
    <span className={`text-[13px] ${STYLES[deadlineType] ?? 'text-charcoal/60'}`}>
      {LABEL[deadlineType]} {phrase}
      {overdue && deadlineType === 'target' ? <span className="text-charcoal/40"> · no rush, revisit</span> : null}
    </span>
  )
}
