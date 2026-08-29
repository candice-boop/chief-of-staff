import type { AnyRecord } from '../../types'
import { useStore } from '../../store/useStore'
import { useUiStore } from '../../store/uiStore'
import { CompleteCheckbox } from '../shared/CompleteCheckbox'
import { DeadlineTag } from '../shared/DeadlineTag'
import { CandiceRequiredBadge } from '../shared/Badges'
import { daysFromToday, shortDateLabel } from '../../lib/dates'
import { STATUS_LABEL } from '../../lib/theme'

export function BacklogRow({ item }: { item: AnyRecord }) {
  const completeRecord = useStore((s) => s.completeRecord)
  const openRecord = useUiStore((s) => s.openRecord)
  const reviewDue = item.reviewByDate && (daysFromToday(item.reviewByDate) ?? 1) <= 0

  return (
    <div className="paper rounded-xl px-4 py-3.5 flex items-center gap-3">
      <CompleteCheckbox size="sm" done={false} onToggle={() => completeRecord(item.id)} />
      <button onClick={() => openRecord(item.id)} className="min-w-0 flex-1 text-left">
        <p className="text-[14.5px] text-ink truncate">{item.title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          <DeadlineTag deadlineType={item.deadlineType} date={item.deadlineDate ?? item.targetDate} />
          {item.type === 'waiting' && <span className="text-[12.5px] text-charcoal/50">Waiting on {item.waitingOn}</span>}
          {reviewDue && (
            <span className="text-[11px] uppercase tracking-wide text-dustyblue bg-dustyblue/10 rounded-full px-2 py-0.5">
              Review due{item.reviewByDate ? ` · ${shortDateLabel(item.reviewByDate)}` : ''}
            </span>
          )}
        </div>
      </button>
      {item.candiceRequired && <div className="hidden sm:block shrink-0"><CandiceRequiredBadge /></div>}
      <span className="hidden sm:block shrink-0 text-[11px] text-charcoal/35">{STATUS_LABEL[item.status]}</span>
    </div>
  )
}
