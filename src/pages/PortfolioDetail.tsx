import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useUiStore } from '../store/uiStore'
import { PORTFOLIOS } from '../data/portfolios'
import { PROJECTS } from '../data/projects'
import { summarizePortfolio, STATUS_STYLES } from '../lib/portfolioStatus'
import { ACCENT, type AccentColor, STATUS_LABEL } from '../lib/theme'
import { DeadlineTag } from '../components/shared/DeadlineTag'
import { CompleteCheckbox } from '../components/shared/CompleteCheckbox'
import { shortDateLabel } from '../lib/dates'
import type { PortfolioAreaId } from '../types'

export function PortfolioDetail() {
  const { areaId } = useParams<{ areaId: string }>()
  const portfolio = PORTFOLIOS.find((p) => p.id === areaId)
  const records = useStore((s) => s.records)
  const completeRecord = useStore((s) => s.completeRecord)
  const openRecord = useUiStore((s) => s.openRecord)
  const [subFilter, setSubFilter] = useState<string | 'all'>('all')

  const areaRecords = useMemo(
    () =>
      records.filter(
        (r) =>
          r.portfolioArea === areaId &&
          r.type !== 'idea' &&
          r.status !== 'completed' &&
          r.status !== 'archived' &&
          (subFilter === 'all' || r.subArea === subFilter),
      ),
    [records, areaId, subFilter],
  )

  if (!portfolio) {
    return (
      <div>
        <p className="text-charcoal/60">Area not found.</p>
        <Link to="/portfolio" className="text-clay">
          Back to Portfolio
        </Link>
      </div>
    )
  }

  const summary = summarizePortfolio(portfolio.id as PortfolioAreaId, records)
  const accent = ACCENT[portfolio.color as AccentColor]
  const projects = PROJECTS.filter((p) => p.portfolioArea === portfolio.id)

  const groups: { key: string; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: 'this-week', label: 'This Week' },
    { key: 'waiting', label: 'Waiting' },
    { key: 'active', label: 'Active / Backlog' },
    { key: 'parked', label: 'Parked' },
  ]

  return (
    <div>
      <Link to="/portfolio" className="inline-flex items-center gap-1.5 text-[13px] text-charcoal/50 hover:text-ink mb-6">
        <ArrowLeft className="h-3.5 w-3.5" /> All areas
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${accent?.dot ?? 'bg-charcoal/40'}`} />
          <h1 className="font-serif text-3xl text-ink">{portfolio.name}</h1>
          <span className={`text-[11px] px-2 py-0.5 rounded-full ${STATUS_STYLES[summary.status]}`}>{summary.status}</span>
        </div>
        <p className="mt-1.5 text-[15px] text-charcoal/55">{portfolio.tagline}</p>

        {portfolio.subAreas && (
          <div className="mt-4 flex items-center gap-1 rounded-full bg-oat/60 p-1 w-fit">
            <button
              onClick={() => setSubFilter('all')}
              className={`rounded-full px-3 py-1 text-[12.5px] transition-colors ${subFilter === 'all' ? 'bg-warmwhite text-ink shadow-sm' : 'text-charcoal/50'}`}
            >
              All
            </button>
            {portfolio.subAreas.map((s) => (
              <button
                key={s.id}
                onClick={() => setSubFilter(s.id)}
                className={`rounded-full px-3 py-1 text-[12.5px] transition-colors ${subFilter === s.id ? 'bg-warmwhite text-ink shadow-sm' : 'text-charcoal/50'}`}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}
      </header>

      {projects.length > 0 && (
        <section className="mb-8 grid gap-3 sm:grid-cols-2">
          {projects.map((p) => (
            <div key={p.id} className="paper rounded-xl p-4">
              <p className="text-[11px] uppercase tracking-wide text-charcoal/35">Project</p>
              <p className="text-[15px] text-ink mt-0.5">{p.title}</p>
              <p className="text-[13px] text-charcoal/55 mt-1">{p.currentStatus}</p>
              {p.milestone && (
                <p className="text-[12.5px] text-charcoal/40 mt-1.5">
                  {p.milestone}
                  {p.targetDate && ` — ${shortDateLabel(p.targetDate)}`}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      <div className="space-y-8">
        {groups.map(({ key, label }) => {
          const items = areaRecords.filter((r) => r.status === key)
          if (items.length === 0) return null
          return (
            <section key={key}>
              <p className="mb-3 text-[12px] uppercase tracking-wide text-charcoal/40">{label}</p>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="paper rounded-xl px-4 py-3.5 flex items-center gap-3">
                    <CompleteCheckbox size="sm" done={false} onToggle={() => completeRecord(item.id)} />
                    <button onClick={() => openRecord(item.id)} className="min-w-0 flex-1 text-left">
                      <p className="text-[14.5px] text-ink truncate">{item.title}</p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3">
                        <DeadlineTag deadlineType={item.deadlineType} date={item.deadlineDate ?? item.reviewByDate} />
                        {item.type === 'waiting' && <span className="text-[12.5px] text-charcoal/50">{item.waitingOn}</span>}
                      </div>
                    </button>
                    <span className="shrink-0 text-[11px] text-charcoal/35">{STATUS_LABEL[item.status]}</span>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
        {areaRecords.length === 0 && (
          <p className="text-center text-[14px] text-charcoal/45 py-10">Nothing active here right now.</p>
        )}
      </div>
    </div>
  )
}
