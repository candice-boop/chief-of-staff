import { useState } from 'react'
import { GripVertical } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { useUiStore } from '../../store/uiStore'
import { selectToday } from '../../lib/selectors'
import { PortfolioTag } from '../shared/PortfolioTag'
import { DeadlineTag } from '../shared/DeadlineTag'
import { CompleteCheckbox } from '../shared/CompleteCheckbox'
import { CandiceRequiredBadge, EffortTag } from '../shared/Badges'

export function TodaySection() {
  const records = useStore((s) => s.records)
  const completeRecord = useStore((s) => s.completeRecord)
  const reorder = useStore((s) => s.reorder)
  const openRecord = useUiStore((s) => s.openRecord)
  const items = selectToday(records)
  const [dragId, setDragId] = useState<string | null>(null)

  if (items.length === 0) {
    return (
      <section className="mb-10">
        <SectionHeading />
        <div className="paper rounded-2xl p-8 text-center">
          <p className="font-serif text-lg text-ink">Nothing pinned to today yet.</p>
          <p className="mt-1 text-[14px] text-charcoal/50">Pull something forward from This Week when you're ready.</p>
        </div>
      </section>
    )
  }

  function handleDrop(targetId: string) {
    if (!dragId || dragId === targetId) return
    const ids = items.map((i) => i.id)
    const from = ids.indexOf(dragId)
    const to = ids.indexOf(targetId)
    ids.splice(to, 0, ...ids.splice(from, 1))
    reorder(ids)
    setDragId(null)
  }

  return (
    <section className="mb-10">
      <SectionHeading />
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => setDragId(item.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(item.id)}
            onClick={() => openRecord(item.id)}
            className={`group paper rounded-2xl p-5 flex items-start gap-4 cursor-pointer hover:shadow-sm transition-shadow ${
              item.status === 'completed' ? 'opacity-50' : ''
            }`}
          >
            <CompleteCheckbox done={item.status === 'completed'} onToggle={() => completeRecord(item.id)} />
            <div className="min-w-0 flex-1">
              <p className={`font-serif text-lg sm:text-xl text-ink leading-snug ${item.status === 'completed' ? 'line-through' : ''}`}>
                {item.title}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <PortfolioTag area={item.portfolioArea} subArea={item.subArea} />
                <DeadlineTag deadlineType={item.deadlineType} date={item.deadlineDate} />
                <EffortTag effort={item.estimatedEffort} />
              </div>
              {item.notes && <p className="mt-2 text-[13.5px] text-charcoal/50">{item.notes}</p>}
              {item.candiceRequired && (
                <div className="mt-3">
                  <CandiceRequiredBadge />
                </div>
              )}
            </div>
            <GripVertical className="h-4 w-4 text-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity mt-1.5 shrink-0 cursor-grab" />
          </div>
        ))}
      </div>
    </section>
  )
}

function SectionHeading() {
  return (
    <div className="mb-4 flex items-baseline justify-between">
      <h2 className="font-serif text-xl text-ink">Today</h2>
      <span className="text-[12px] text-charcoal/40">The outcomes that matter most</span>
    </div>
  )
}
