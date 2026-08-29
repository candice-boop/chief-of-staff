import { PORTFOLIOS } from '../data/portfolios'
import { PortfolioCard } from '../components/portfolio/PortfolioCard'

export function Portfolio() {
  const topLevel = PORTFOLIOS.filter((p) => !p.parentId)
  const motherMogul = PORTFOLIOS.find((p) => p.id === 'mother-mogul')!

  return (
    <div>
      <header className="mb-8">
        <p className="text-[13px] text-charcoal/45">Portfolio</p>
        <h1 className="mt-1 font-serif text-3xl text-ink">The major areas of Candice, Inc.</h1>
        <p className="mt-1.5 text-[15px] text-charcoal/55">Where things stand across every business and commitment.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {topLevel.map((p) => (
          <div key={p.id} className={p.id === 'cls-marketing' ? 'sm:col-span-2' : ''}>
            <PortfolioCard portfolio={p} />
            {p.id === 'hey-mom' && (
              <div className="mt-4 pl-4 border-l-2 border-terracotta/25">
                <p className="mb-2 text-[11px] uppercase tracking-wide text-charcoal/35">Nested within Hey Mom</p>
                <PortfolioCard portfolio={motherMogul} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
