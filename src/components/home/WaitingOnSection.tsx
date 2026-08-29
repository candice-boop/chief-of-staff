import { Check } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { useUiStore } from '../../store/uiStore'
import { selectWaiting } from '../../lib/selectors'
import { shortDateLabel, relativeDayPhrase } from '../../lib/dates'
import { PortfolioTag } from '../shared/PortfolioTag'

export function WaitingOnSection() {
  const records = useStore((s) => s.records)
  const completeRecord = useStore((s) => s.completeRecord)
  const openRecord = useUiStore((s) => s.openRecord)
  const items = selectWaiting(records)

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="font-serif text-xl text-ink">Waiting On</h2>
        <span className="text-[12px] text-charcoal/40">Someone else has the next move</span>
      </div>

      {items.length === 0 ? (
        <div className="paper rounded-2xl p-6 text-center text-[14px] text-charcoal/50">Nothing outstanding right now.</div>
      ) : (
        <div className="space-y-2.5">
          {items.map((item) => (
            <div key={item.id} className="paper rounded-xl px-4 py-3.5 flex items-center gap-3">
              <button onClick={() => openRecord(item.id)} className="min-w-0 flex-1 text-left">
                <p className="text-[14.5px] text-ink truncate">{item.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12.5px] text-charcoal/50">
                  <span>{item.waitingOn}</span>
                  <PortfolioTag area={item.portfolioArea} subArea={item.subArea} />
                  {item.requestedDate && <span>Asked {shortDateLabel(item.requestedDate)}</span>}
                  {item.followUpDate && <span className="text-ochre">Follow up {relativeDayPhrase(item.followUpDate)}</span>}
                </div>
              </button>
              <button
                onClick={() => completeRecord(item.id)}
                title="Mark received"
                className="shrink-0 flex items-center gap-1.5 rounded-full border border-charcoal/15 px-2.5 py-1.5 text-[12px] text-charcoal/60 hover:border-charcoal/30 hover:text-ink transition-colors"
              >
                <Check className="h-3.5 w-3.5" /> Received
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
