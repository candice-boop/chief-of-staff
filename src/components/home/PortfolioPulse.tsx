import { Link } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { PORTFOLIOS } from '../../data/portfolios'
import { summarizePortfolio, STATUS_STYLES } from '../../lib/portfolioStatus'
import { ACCENT, type AccentColor } from '../../lib/theme'

export function PortfolioPulse() {
  const records = useStore((s) => s.records)

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="font-serif text-xl text-ink">Candice, Inc. at a Glance</h2>
        <Link to="/portfolio" className="text-[12.5px] text-charcoal/45 hover:text-ink transition-colors">
          View portfolio →
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
        {PORTFOLIOS.filter((p) => !p.parentId || p.id === 'mother-mogul').map((p) => {
          const summary = summarizePortfolio(p.id, records)
          const accent = ACCENT[p.color as AccentColor]
          return (
            <Link
              key={p.id}
              to={`/portfolio/${p.id}`}
              className="paper shrink-0 w-44 rounded-xl px-4 py-3.5 hover:shadow-sm transition-shadow"
            >
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${accent?.dot ?? 'bg-charcoal/40'} mb-2`} />
              <p className="text-[13.5px] text-ink font-medium leading-snug">{p.name}</p>
              <span className={`mt-2 inline-block text-[11px] px-2 py-0.5 rounded-full ${STATUS_STYLES[summary.status]}`}>
                {summary.status}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
