import { useState } from 'react'
import { CheckSquare, Lightbulb, StickyNote, X, Inbox as InboxIcon } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useUiStore } from '../store/uiStore'
import { relativeDayPhrase } from '../lib/dates'

const KIND_HINT: Record<string, string> = {
  task: 'Looks like a task',
  'brain-dump': 'Brain dump',
  idea: 'Looks like an idea',
  note: 'Looks like a note',
  pasted: 'Pasted content',
}

export function Inbox() {
  const entries = useStore((s) => s.inboxEntries)
  const processInboxEntry = useStore((s) => s.processInboxEntry)
  const openRecord = useUiStore((s) => s.openRecord)
  const [text, setText] = useState('')
  const addInboxCapture = useStore((s) => s.addInboxCapture)

  const unprocessed = entries.filter((e) => !e.processed)

  function classify(id: string, rawText: string, type: 'task' | 'idea' | 'note') {
    const newId = processInboxEntry(id, {
      record:
        type === 'idea'
          ? { type: 'idea', title: rawText, ideaStatus: 'new' }
          : { type, title: rawText },
    })
    if (newId) openRecord(newId)
  }

  return (
    <div>
      <header className="mb-8">
        <p className="text-[13px] text-charcoal/45">Inbox</p>
        <h1 className="mt-1 font-serif text-3xl text-ink">Capture now, organize later</h1>
        <p className="mt-1.5 text-[15px] text-charcoal/55">
          Nothing here needs to be tidy. Process each into a task, idea, or note whenever you're ready.
        </p>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!text.trim()) return
          addInboxCapture(text.trim())
          setText('')
        }}
        className="mb-8 paper rounded-2xl p-4 flex items-center gap-3"
      >
        <InboxIcon className="h-4 w-4 text-charcoal/35 shrink-0" />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your brain?"
          className="flex-1 bg-transparent text-[14.5px] text-ink placeholder:text-charcoal/35 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="rounded-full bg-ink text-warmwhite px-4 py-1.5 text-[13px] font-medium disabled:opacity-30"
        >
          Add
        </button>
      </form>

      {unprocessed.length === 0 ? (
        <div className="paper rounded-2xl p-10 text-center">
          <p className="font-serif text-lg text-ink">Inbox zero.</p>
          <p className="mt-1 text-[14px] text-charcoal/50">Everything captured has been processed.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {unprocessed.map((entry) => (
            <div key={entry.id} className="paper rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[15px] text-ink leading-relaxed whitespace-pre-wrap">{entry.rawText}</p>
                <span className="shrink-0 text-[11.5px] text-charcoal/35">{relativeDayPhrase(entry.createdAt.slice(0, 10))}</span>
              </div>
              {entry.kind && <p className="mt-2 text-[12px] text-charcoal/35">{KIND_HINT[entry.kind]}</p>}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => classify(entry.id, entry.rawText, 'task')}
                  className="inline-flex items-center gap-1.5 rounded-full border border-sand px-3 py-1.5 text-[12.5px] text-charcoal/70 hover:border-charcoal/30 hover:text-ink transition-colors"
                >
                  <CheckSquare className="h-3.5 w-3.5" /> Make it a task
                </button>
                <button
                  onClick={() => classify(entry.id, entry.rawText, 'idea')}
                  className="inline-flex items-center gap-1.5 rounded-full border border-sand px-3 py-1.5 text-[12.5px] text-charcoal/70 hover:border-charcoal/30 hover:text-ink transition-colors"
                >
                  <Lightbulb className="h-3.5 w-3.5" /> Save as idea
                </button>
                <button
                  onClick={() => classify(entry.id, entry.rawText, 'note')}
                  className="inline-flex items-center gap-1.5 rounded-full border border-sand px-3 py-1.5 text-[12.5px] text-charcoal/70 hover:border-charcoal/30 hover:text-ink transition-colors"
                >
                  <StickyNote className="h-3.5 w-3.5" /> Keep as note
                </button>
                <button
                  onClick={() => processInboxEntry(entry.id, { dismiss: true })}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] text-charcoal/40 hover:text-terracotta transition-colors"
                >
                  <X className="h-3.5 w-3.5" /> Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {entries.some((e) => e.processed) && (
        <p className="mt-8 text-center text-[13px] text-charcoal/35">
          {entries.filter((e) => e.processed).length} earlier capture{entries.filter((e) => e.processed).length === 1 ? '' : 's'} already processed.
        </p>
      )}
    </div>
  )
}
