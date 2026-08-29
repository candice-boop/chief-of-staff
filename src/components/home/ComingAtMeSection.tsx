import { AlertCircle } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { useUiStore } from '../../store/uiStore'
import { selectComingAtMe } from '../../lib/selectors'
import { relativeDayPhrase } from '../../lib/dates'
import { PortfolioTag } from '../shared/PortfolioTag'

export function ComingAtMeSection() {
  const records = useStore((s) => s.records)
  const openRecord = useUiStore((s) => s.openRecord)
  const items = selectComingAtMe(records)

  if (items.length === 0) return null

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-ochre" strokeWidth={1.75} />
        <h2 className="font-serif text-xl text-ink">Coming At Me</h2>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {items.map((item) => {
          const due = item.deadlineDate ?? item.reviewByDate ?? item.followUpDate
          return (
            <button
              key={item.id}
              onClick={() => openRecord(item.id)}
              className="paper rounded-xl px-4 py-3 text-left hover:bg-oat/30 transition-colors"
            >
              <p className="text-[14px] text-ink leading-snug">{item.title}</p>
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <PortfolioTag area={item.portfolioArea} subArea={item.subArea} />
                <span className="shrink-0 text-[12px] text-ochre">{relativeDayPhrase(due)}</span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
