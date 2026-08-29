import { portfolioById } from '../../data/portfolios'
import { ACCENT, type AccentColor } from '../../lib/theme'
import type { PortfolioAreaId } from '../../types'

export function PortfolioTag({ area, subArea }: { area?: PortfolioAreaId; subArea?: string }) {
  const portfolio = portfolioById(area)
  if (!portfolio) return null
  const accent = ACCENT[portfolio.color as AccentColor]
  const subName = subArea ? portfolio.subAreas?.find((s) => s.id === subArea)?.name : undefined

  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-charcoal/70">
      <span className={`h-1.5 w-1.5 rounded-full ${accent?.dot ?? 'bg-charcoal/40'}`} />
      {portfolio.name}
      {subName ? <span className="text-charcoal/40">· {subName}</span> : null}
    </span>
  )
}
