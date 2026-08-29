import { ChevronRight } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { useUiStore } from '../../store/uiStore'
import { selectNeedsCandice } from '../../lib/selectors'
import { PortfolioTag } from '../shared/PortfolioTag'
import { relativeDayPhrase } from '../../lib/dates'

const TYPE_LABEL: Record<string, string> = {
  decision: 'Decision',
  task: 'Needs you',
  waiting: 'Waiting',
  note: 'Review',
}

export function NeedsCandiceSection() {
  const records = useStore((s) => s.records)
  const openRecord = useUiStore((s) => s.openRecord)
  const items = selectNeedsCandice(records)

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="font-serif text-xl text-ink">Needs Candice</h2>
        <span className="text-[12px] text-charcoal/40">Decisions & judgment calls</span>
      </div>

      {items.length === 0 ? (
        <div className="paper rounded-2xl p-6 text-center text-[14px] text-charcoal/50">
          Nothing is waiting on your judgment right now.
        </div>
      ) : (
        <div className="paper rounded-2xl divide-y divide-sand/70 overflow-hidden">
          {items.map((item) => {
            const due = item.deadlineDate ?? item.reviewByDate
            return (
              <button
                key={item.id}
                onClick={() => openRecord(item.id)}
                className="w-full flex flex-col gap-1.5 px-5 py-4 text-left hover:bg-oat/40 transition-colors sm:flex-row sm:items-center sm:gap-3"
              >
                <div className="flex items-center justify-between gap-2 sm:contents">
                  <span className="shrink-0 text-[10.5px] uppercase tracking-wide text-clay/80 border border-clay/25 rounded-full px-2 py-0.5">
                    {TYPE_LABEL[item.type] ?? 'Needs you'}
                  </span>
                  {due && <span className="shrink-0 text-[12.5px] text-charcoal/40 sm:hidden">{relativeDayPhrase(due)}</span>}
                </div>
                <p className="text-[14.5px] text-ink sm:flex-1 sm:min-w-0 sm:truncate">{item.title}</p>
                <div className="flex items-center justify-between gap-2 sm:contents">
                  <PortfolioTag area={item.portfolioArea} subArea={item.subArea} />
                  <div className="flex items-center gap-2 shrink-0">
                    {due && <span className="hidden sm:inline text-[12.5px] text-charcoal/40">{relativeDayPhrase(due)}</span>}
                    <ChevronRight className="h-4 w-4 text-charcoal/25" />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
