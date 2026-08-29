import { useMemo, useState } from 'react'
import { LayoutGrid, Rows3 } from 'lucide-react'
import { useStore } from '../store/useStore'
import { selectBacklog } from '../lib/selectors'
import { PORTFOLIOS, portfolioById } from '../data/portfolios'
import { PROJECTS } from '../data/projects'
import { BacklogRow } from '../components/backlog/BacklogRow'
import { ACCENT, type AccentColor } from '../lib/theme'
import { daysFromToday } from '../lib/dates'
import type { ItemStatus } from '../types'

type ViewMode = 'grouped' | 'kanban'

interface Filters {
  portfolio: string
  status: string
  deadlineType: string
  priority: string
  candiceOnly: boolean
  waitingOnly: boolean
  reviewDueOnly: boolean
  project: string
}

const DEFAULT_FILTERS: Filters = {
  portfolio: 'all',
  status: 'all',
  deadlineType: 'all',
  priority: 'all',
  candiceOnly: false,
  waitingOnly: false,
  reviewDueOnly: false,
  project: 'all',
}

const KANBAN_COLUMNS: { key: ItemStatus; label: string }[] = [
  { key: 'active', label: 'Active' },
  { key: 'waiting', label: 'Waiting' },
  { key: 'parked', label: 'Parked' },
]

export function Backlog() {
  const records = useStore((s) => s.records)
  const [view, setView] = useState<ViewMode>('grouped')
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)

  const items = useMemo(() => {
    let base = selectBacklog(records)
    if (filters.portfolio !== 'all') base = base.filter((i) => i.portfolioArea === filters.portfolio)
    if (filters.status !== 'all') base = base.filter((i) => i.status === filters.status)
    if (filters.deadlineType !== 'all') base = base.filter((i) => i.deadlineType === filters.deadlineType)
    if (filters.priority !== 'all') base = base.filter((i) => (i.priority ?? 'medium') === filters.priority)
    if (filters.project !== 'all') base = base.filter((i) => i.project === filters.project)
    if (filters.candiceOnly) base = base.filter((i) => i.candiceRequired)
    if (filters.waitingOnly) base = base.filter((i) => i.type === 'waiting')
    if (filters.reviewDueOnly) base = base.filter((i) => i.reviewByDate && (daysFromToday(i.reviewByDate) ?? 1) <= 0)
    return base
  }, [records, filters])

  const grouped = useMemo(() => {
    const map = new Map<string, typeof items>()
    for (const item of items) {
      const key = item.portfolioArea ?? 'unassigned'
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(item)
    }
    return Array.from(map.entries()).sort((a, b) => {
      const ai = PORTFOLIOS.findIndex((p) => p.id === a[0])
      const bi = PORTFOLIOS.findIndex((p) => p.id === b[0])
      return ai - bi
    })
  }, [items])

  const reviewDueCount = items.filter((i) => i.reviewByDate && (daysFromToday(i.reviewByDate) ?? 1) <= 0).length

  return (
    <div>
      <header className="mb-6">
        <p className="text-[13px] text-charcoal/45">Backlog</p>
        <h1 className="mt-1 font-serif text-3xl text-ink">Everything captured, organized and calm</h1>
        <p className="mt-1.5 text-[15px] text-charcoal/55">{items.length} items held safely — nothing forgotten, nothing urgent.</p>
      </header>

      {reviewDueCount > 0 && (
        <div className="mb-5 rounded-xl bg-dustyblue/10 px-4 py-3 text-[13.5px] text-dustyblue">
          {reviewDueCount} item{reviewDueCount === 1 ? '' : 's'} reached its review date — worth a fresh look.
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Select
          value={filters.portfolio}
          onChange={(v) => setFilters((f) => ({ ...f, portfolio: v }))}
          options={[{ value: 'all', label: 'All portfolios' }, ...PORTFOLIOS.map((p) => ({ value: p.id, label: p.name }))]}
        />
        <Select
          value={filters.project}
          onChange={(v) => setFilters((f) => ({ ...f, project: v }))}
          options={[{ value: 'all', label: 'All projects' }, ...PROJECTS.map((p) => ({ value: p.id, label: p.title }))]}
        />
        <Select
          value={filters.status}
          onChange={(v) => setFilters((f) => ({ ...f, status: v }))}
          options={[
            { value: 'all', label: 'All statuses' },
            { value: 'inbox', label: 'Inbox' },
            { value: 'active', label: 'Active' },
            { value: 'waiting', label: 'Waiting' },
            { value: 'parked', label: 'Parked' },
          ]}
        />
        <Select
          value={filters.deadlineType}
          onChange={(v) => setFilters((f) => ({ ...f, deadlineType: v }))}
          options={[
            { value: 'all', label: 'Any deadline type' },
            { value: 'hard', label: 'Hard' },
            { value: 'committed', label: 'Committed' },
            { value: 'target', label: 'Target' },
            { value: 'wish', label: 'Wish' },
            { value: 'review', label: 'Review' },
          ]}
        />
        <Select
          value={filters.priority}
          onChange={(v) => setFilters((f) => ({ ...f, priority: v }))}
          options={[
            { value: 'all', label: 'Any priority' },
            { value: 'high', label: 'High priority' },
            { value: 'medium', label: 'Medium priority' },
            { value: 'low', label: 'Low priority' },
          ]}
        />
        <Toggle label="Candice required" active={filters.candiceOnly} onClick={() => setFilters((f) => ({ ...f, candiceOnly: !f.candiceOnly }))} />
        <Toggle label="Waiting only" active={filters.waitingOnly} onClick={() => setFilters((f) => ({ ...f, waitingOnly: !f.waitingOnly }))} />
        <Toggle label="Review due" active={filters.reviewDueOnly} onClick={() => setFilters((f) => ({ ...f, reviewDueOnly: !f.reviewDueOnly }))} />

        <div className="ml-auto flex items-center gap-1 rounded-full bg-oat/60 p-1">
          <button
            onClick={() => setView('grouped')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] transition-colors ${view === 'grouped' ? 'bg-warmwhite text-ink shadow-sm' : 'text-charcoal/50'}`}
          >
            <Rows3 className="h-3.5 w-3.5" /> Grouped
          </button>
          <button
            onClick={() => setView('kanban')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] transition-colors ${view === 'kanban' ? 'bg-warmwhite text-ink shadow-sm' : 'text-charcoal/50'}`}
          >
            <LayoutGrid className="h-3.5 w-3.5" /> Kanban
          </button>
        </div>
      </div>

      {view === 'grouped' ? (
        <div className="space-y-8">
          {grouped.map(([areaId, groupItems]) => {
            const portfolio = portfolioById(areaId)
            const accent = portfolio ? ACCENT[portfolio.color as AccentColor] : undefined
            return (
              <section key={areaId}>
                <div className="mb-3 flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${accent?.dot ?? 'bg-charcoal/40'}`} />
                  <p className="text-[13px] font-medium text-ink">{portfolio?.name ?? 'Unassigned'}</p>
                  <span className="text-[12px] text-charcoal/35">{groupItems.length}</span>
                </div>
                <div className="space-y-2">
                  {groupItems.map((item) => (
                    <BacklogRow key={item.id} item={item} />
                  ))}
                </div>
              </section>
            )
          })}
          {items.length === 0 && <p className="text-center text-[14px] text-charcoal/45 py-10">Nothing matches these filters.</p>}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          {KANBAN_COLUMNS.map((col) => (
            <div key={col.key}>
              <p className="mb-3 text-[12px] uppercase tracking-wide text-charcoal/40">{col.label}</p>
              <div className="space-y-2">
                {items
                  .filter((i) => i.status === col.key)
                  .map((item) => (
                    <BacklogRow key={item.id} item={item} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-full border border-sand bg-warmwhite px-3 py-1.5 text-[12.5px] text-charcoal/70"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

function Toggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-[12.5px] border transition-colors ${
        active ? 'bg-ink text-warmwhite border-ink' : 'border-sand text-charcoal/60 hover:border-charcoal/30'
      }`}
    >
      {label}
    </button>
  )
}
