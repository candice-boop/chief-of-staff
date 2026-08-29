import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { useUiStore } from '../../store/uiStore'
import { useStore } from '../../store/useStore'
import { PortfolioTag } from '../shared/PortfolioTag'
import { STATUS_LABEL } from '../../lib/theme'

export function GlobalSearch() {
  const open = useUiStore((s) => s.searchOpen)
  const setOpen = useUiStore((s) => s.setSearchOpen)
  const openRecord = useUiStore((s) => s.openRecord)
  const records = useStore((s) => s.records)
  const [q, setQ] = useState('')
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) setTimeout(() => ref.current?.focus(), 50)
    else setQ('')
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      const typing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
      if (!typing && e.key === '/') {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setOpen])

  const results = useMemo(() => {
    if (!q.trim()) return []
    const needle = q.toLowerCase()
    return records
      .filter((r) => r.title.toLowerCase().includes(needle) || r.description?.toLowerCase().includes(needle) || r.notes?.toLowerCase().includes(needle))
      .slice(0, 20)
  }, [q, records])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-24">
      <button aria-label="Close" className="absolute inset-0 bg-ink/35 backdrop-blur-[1px]" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-xl rounded-2xl bg-warmwhite shadow-2xl border border-sand overflow-hidden">
        <div className="flex items-center gap-2.5 border-b border-sand px-4 py-3">
          <Search className="h-4 w-4 text-charcoal/40" />
          <input
            ref={ref}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search everything…"
            className="flex-1 bg-transparent text-[15px] text-ink placeholder:text-charcoal/35 focus:outline-none"
          />
          <button onClick={() => setOpen(false)} className="text-charcoal/40 hover:text-charcoal">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {q.trim() && results.length === 0 && (
            <p className="px-4 py-6 text-center text-[14px] text-charcoal/40">Nothing found for "{q}"</p>
          )}
          {results.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                openRecord(r.id)
                setOpen(false)
              }}
              className="w-full text-left px-4 py-3 hover:bg-oat/50 transition-colors border-b border-sand/60 last:border-0"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[14px] text-ink">{r.title}</span>
                <span className="text-[11px] uppercase tracking-wide text-charcoal/35 shrink-0">{STATUS_LABEL[r.status]}</span>
              </div>
              <div className="mt-1">
                <PortfolioTag area={r.portfolioArea} subArea={r.subArea} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
