import { useMemo, useState } from 'react'
import { useStore } from '../../store/useStore'
import { useUiStore } from '../../store/uiStore'
import { selectThisWeek, lifeBucket } from '../../lib/selectors'
import { weekdayLabel } from '../../lib/dates'
import { PortfolioTag } from '../shared/PortfolioTag'
import { CandiceRequiredBadge } from '../shared/Badges'

type Filter = 'all' | 'work' | 'family-personal'

export function ThisWeekSection() {
  const records = useStore((s) => s.records)
  const openRecord = useUiStore((s) => s.openRecord)
  const [filter, setFilter] = useState<Filter>('all')

  const items = useMemo(() => {
    const all = selectThisWeek(records)
    if (filter === 'all') return all
    return all.filter((i) => lifeBucket(i.portfolioArea) === filter)
  }, [records, filter])

  const groups = useMemo(() => {
    const map = new Map<string, typeof items>()
    for (const item of items) {
      const key = weekdayLabel(item.deadlineDate ?? item.targetDate) || 'This week'
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(item)
    }
    return Array.from(map.entries())
  }, [items])

  return (
    <section className="mb-10">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-serif text-xl text-ink">This Week</h2>
        <div className="flex items-center gap-1 rounded-full bg-oat/60 p-1">
          {(['all', 'work', 'family-personal'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-[12.5px] transition-colors ${
                filter === f ? 'bg-warmwhite text-ink shadow-sm' : 'text-charcoal/50 hover:text-ink'
              }`}
            >
              {f === 'all' ? 'All' : f === 'work' ? 'Work' : 'Family / Personal'}
            </button>
          ))}
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="paper rounded-2xl p-6 text-center text-[14px] text-charcoal/50">Nothing filed for this week yet.</div>
      ) : (
        <div className="space-y-5">
          {groups.map(([day, dayItems]) => (
            <div key={day}>
              <p className="text-[12px] uppercase tracking-wide text-charcoal/40 mb-2">{day}</p>
              <div className="space-y-2">
                {dayItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => openRecord(item.id)}
                    className="w-full paper rounded-xl px-4 py-3.5 text-left hover:bg-oat/30 transition-colors flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-[15px] text-ink leading-snug">{item.title}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <PortfolioTag area={item.portfolioArea} subArea={item.subArea} />
                        {item.nextAction && <span className="text-[12.5px] text-ochre">{item.nextAction}</span>}
                      </div>
                    </div>
                    {item.candiceRequired && (
                      <div className="shrink-0 hidden sm:block">
                        <CandiceRequiredBadge />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
