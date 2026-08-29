import { useEffect, useState } from 'react'
import { X, Check, RotateCcw, Trash2 } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { useUiStore } from '../../store/uiStore'
import { PortfolioTag } from './PortfolioTag'
import { DeadlineTag } from './DeadlineTag'
import { PROJECTS } from '../../data/projects'
import { STATUS_LABEL } from '../../lib/theme'
import { shortDateLabel } from '../../lib/dates'
import type { ItemStatus } from '../../types'

const STATUS_OPTIONS: ItemStatus[] = ['inbox', 'active', 'today', 'this-week', 'waiting', 'parked', 'completed', 'archived']

export function ItemDrawer() {
  const openRecordId = useUiStore((s) => s.openRecordId)
  const closeRecord = useUiStore((s) => s.closeRecord)
  const records = useStore((s) => s.records)
  const updateRecord = useStore((s) => s.updateRecord)
  const completeRecord = useStore((s) => s.completeRecord)
  const deleteRecord = useStore((s) => s.deleteRecord)

  const record = records.find((r) => r.id === openRecordId)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    setNotes(record?.notes ?? '')
  }, [record?.id, record?.notes])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeRecord()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeRecord])

  if (!record) return null

  const project = record.project ? PROJECTS.find((p) => p.id === record.project) : undefined
  const isDone = record.status === 'completed'

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Close"
        className="absolute inset-0 bg-ink/30 backdrop-blur-[1px]"
        onClick={closeRecord}
      />
      <div className="relative h-full w-full max-w-md bg-warmwhite shadow-2xl overflow-y-auto animate-in">
        <div className="flex items-start justify-between px-6 pt-6">
          <span className="text-[11px] uppercase tracking-wide text-charcoal/40">
            {record.type === 'decision' ? 'Decision' : record.type === 'waiting' ? 'Waiting item' : record.type === 'idea' ? 'Idea' : record.type === 'note' ? 'Note' : 'Task / Outcome'}
          </span>
          <button onClick={closeRecord} className="text-charcoal/40 hover:text-charcoal transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 pt-2 pb-8 space-y-6">
          <div>
            <h2 className="font-serif text-2xl leading-snug text-ink">{record.title}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <PortfolioTag area={record.portfolioArea} subArea={record.subArea} />
              {project && <span className="text-[13px] text-charcoal/50">· {project.title}</span>}
            </div>
          </div>

          {record.description && <p className="text-[14px] text-charcoal/70 leading-relaxed">{record.description}</p>}

          <div className="flex flex-wrap gap-3">
            <DeadlineTag deadlineType={record.deadlineType} date={record.deadlineDate ?? record.targetDate} />
            {record.reviewByDate && <span className="text-[13px] text-dustyblue">Review {shortDateLabel(record.reviewByDate)}</span>}
            {record.estimatedEffort && <span className="text-[13px] text-charcoal/50">~{record.estimatedEffort}</span>}
          </div>

          {record.candiceRequired && (
            <div className="rounded-lg bg-ink/5 px-3 py-2 text-[13px] text-ink/80">This needs Candice's judgment, not just execution.</div>
          )}

          {record.type === 'waiting' && (
            <div className="rounded-lg border border-sand bg-oat/40 p-4 space-y-2">
              <p className="text-[13px] text-charcoal/60">Waiting on</p>
              <p className="text-[15px] text-ink">{record.waitingOn}</p>
              {record.followUpDate && (
                <p className="text-[13px] text-charcoal/60">Follow up {shortDateLabel(record.followUpDate)}</p>
              )}
              <button
                onClick={() => updateRecord(record.id, { status: 'completed', completedAt: new Date().toISOString() })}
                className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-ink text-warmwhite px-3 py-1.5 text-[13px] font-medium"
              >
                <Check className="h-3.5 w-3.5" /> Mark received
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-[12px] uppercase tracking-wide text-charcoal/40">Status</span>
              <select
                value={record.status}
                onChange={(e) => updateRecord(record.id, { status: e.target.value as ItemStatus })}
                className="mt-1 w-full rounded-md border border-sand bg-warmwhite px-2 py-1.5 text-[14px] text-ink"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[12px] uppercase tracking-wide text-charcoal/40">Priority</span>
              <select
                value={record.priority ?? 'medium'}
                onChange={(e) => updateRecord(record.id, { priority: e.target.value as 'high' | 'medium' | 'low' })}
                className="mt-1 w-full rounded-md border border-sand bg-warmwhite px-2 py-1.5 text-[14px] text-ink capitalize"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-[12px] uppercase tracking-wide text-charcoal/40">Notes</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={() => updateRecord(record.id, { notes })}
              rows={4}
              placeholder="Context, links, anything worth remembering…"
              className="mt-1 w-full rounded-md border border-sand bg-warmwhite px-3 py-2 text-[14px] text-ink leading-relaxed focus:outline-none focus:ring-2 focus:ring-clay/30"
            />
          </label>

          <div className="flex items-center gap-3 pt-2">
            {!isDone ? (
              <button
                onClick={() => completeRecord(record.id)}
                className="inline-flex items-center gap-2 rounded-full bg-ink text-warmwhite px-4 py-2 text-[13px] font-medium"
              >
                <Check className="h-4 w-4" /> Mark complete
              </button>
            ) : (
              <button
                onClick={() => updateRecord(record.id, { status: 'active', completedAt: undefined })}
                className="inline-flex items-center gap-2 rounded-full border border-charcoal/20 px-4 py-2 text-[13px] font-medium text-charcoal/70"
              >
                <RotateCcw className="h-4 w-4" /> Reopen
              </button>
            )}
            <button
              onClick={() => {
                deleteRecord(record.id)
                closeRecord()
              }}
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[13px] text-charcoal/40 hover:text-terracotta transition-colors"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
