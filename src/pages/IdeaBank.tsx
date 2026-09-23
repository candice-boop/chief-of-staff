import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore'
import { PORTFOLIOS } from '../data/portfolios'
import { IdeaCard } from '../components/ideabank/IdeaCard'
import type { IdeaItem } from '../types'

const ROTATIONS = [-0.6, 0.5, -0.3, 0.7, -0.5, 0.3, -0.4, 0.6]

export function IdeaBank() {
  const records = useStore((s) => s.records)
  const [statusFilter, setStatusFilter] = useState('all')
  const [portfolioFilter, setPortfolioFilter] = useState('all')
  const [contentOnly, setContentOnly] = useState(false)

  const ideas = useMemo(() => {
    let list = records.filter((r): r is IdeaItem => r.type === 'idea')
    if (statusFilter !== 'all') list = list.filter((i) => i.ideaStatus === statusFilter)
    if (portfolioFilter !== 'all') list = list.filter((i) => i.portfolioArea === portfolioFilter)
    if (contentOnly) list = list.filter((i) => !!i.contentPillarId)
    return list.sort((a, b) => (b.capturedDate ?? '').localeCompare(a.capturedDate ?? ''))
  }, [records, statusFilter, portfolioFilter, contentOnly])

  const contentIdeaCount = useMemo(
    () => records.filter((r): r is IdeaItem => r.type === 'idea' && !!r.contentPillarId).length,
    [records],
  )

  return (
    <div>
      <header className="mb-8">
        <p className="text-[13px] text-charcoal/45">Idea Bank</p>
        <h1 className="mt-1 font-serif text-3xl text-ink">A safe place for interesting thoughts</h1>
        <p className="mt-1.5 text-[15px] text-charcoal/55">
          Ideas aren't commitments. Keep them here until one is worth becoming a project.
        </p>
      </header>

      <div className="mb-7 flex flex-wrap items-center gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-full border border-sand bg-warmwhite px-3 py-1.5 text-[12.5px] text-charcoal/70"
        >
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="worth-exploring">Worth exploring</option>
          <option value="parked">Parked</option>
          <option value="promoted">Promoted</option>
          <option value="archived">Archived</option>
        </select>
        <select
          value={portfolioFilter}
          onChange={(e) => setPortfolioFilter(e.target.value)}
          className="rounded-full border border-sand bg-warmwhite px-3 py-1.5 text-[12.5px] text-charcoal/70"
        >
          <option value="all">All portfolios</option>
          {PORTFOLIOS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => setContentOnly((v) => !v)}
          className={`rounded-full border px-3 py-1.5 text-[12.5px] transition-colors ${contentOnly ? 'border-plum bg-plum/10 text-plum' : 'border-sand bg-warmwhite text-charcoal/70'}`}
        >
          Content ideas ({contentIdeaCount})
        </button>
        <span className="ml-auto text-[12.5px] text-charcoal/40">{ideas.length} ideas</span>
      </div>

      {ideas.length === 0 ? (
        <p className="text-center text-[14px] text-charcoal/45 py-16">No ideas match these filters yet.</p>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [&>*]:mb-4 [&>*]:break-inside-avoid">
          {ideas.map((idea, i) => (
            <IdeaCard key={idea.id} idea={idea} accentRotation={ROTATIONS[i % ROTATIONS.length]} />
          ))}
        </div>
      )}
    </div>
  )
}
