import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { PortfolioArea } from '../../types'
import { useStore } from '../../store/useStore'
import { summarizePortfolio, STATUS_STYLES } from '../../lib/portfolioStatus'
import { ACCENT, type AccentColor } from '../../lib/theme'
import { PROJECTS } from '../../data/projects'
import { shortDateLabel } from '../../lib/dates'

export function PortfolioCard({ portfolio, large = false }: { portfolio: PortfolioArea; large?: boolean }) {
  const records = useStore((s) => s.records)
  const summary = summarizePortfolio(portfolio.id, records)
  const accent = ACCENT[portfolio.color as AccentColor]
  const milestone = PROJECTS.filter((p) => p.portfolioArea === portfolio.id).sort(
    (a, b) => (a.targetDate ?? '9999').localeCompare(b.targetDate ?? '9999'),
  )[0]

  return (
    <Link
      to={`/portfolio/${portfolio.id}`}
      className={`paper rounded-2xl p-6 flex flex-col hover:shadow-md transition-shadow ${large ? 'sm:col-span-2' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${accent?.dot ?? 'bg-charcoal/40'}`} />
            <h3 className="font-serif text-xl text-ink">{portfolio.name}</h3>
          </div>
          <p className="mt-0.5 text-[13px] text-charcoal/50">{portfolio.tagline}</p>
        </div>
        <span className={`shrink-0 text-[11px] px-2 py-0.5 rounded-full ${STATUS_STYLES[summary.status]}`}>{summary.status}</span>
      </div>

      <div className="mt-5 space-y-3 flex-1">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-charcoal/35">Current focus</p>
          <p className="text-[14.5px] text-ink mt-0.5">{summary.currentFocus?.title ?? 'Nothing pressing — steady state'}</p>
        </div>
        {milestone && (
          <div>
            <p className="text-[11px] uppercase tracking-wide text-charcoal/35">Next milestone</p>
            <p className="text-[14.5px] text-ink mt-0.5">
              {milestone.milestone}
              {milestone.targetDate && <span className="text-charcoal/45"> — {shortDateLabel(milestone.targetDate)}</span>}
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-sand/70 grid grid-cols-4 gap-2 text-center">
        <Stat label="This week" value={summary.thisWeekCount} />
        <Stat label="Needs you" value={summary.needsCandiceCount} />
        <Stat label="Waiting" value={summary.waitingCount} />
        <Stat label="Parked" value={summary.parkedCount} />
      </div>

      <div className="mt-4 flex items-center justify-end text-[12.5px] text-charcoal/40">
        View area <ArrowRight className="h-3.5 w-3.5 ml-1" />
      </div>
    </Link>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-[16px] font-serif text-ink">{value}</p>
      <p className="text-[10.5px] text-charcoal/40">{label}</p>
    </div>
  )
}
