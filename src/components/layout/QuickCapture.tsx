import { useEffect, useRef, useState } from 'react'
import { X, ArrowUp } from 'lucide-react'
import { useUiStore } from '../../store/uiStore'
import { useStore } from '../../store/useStore'

export function QuickCapture() {
  const open = useUiStore((s) => s.captureOpen)
  const setOpen = useUiStore((s) => s.setCaptureOpen)
  const addInboxCapture = useStore((s) => s.addInboxCapture)
  const [text, setText] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => ref.current?.focus(), 50)
    } else {
      setText('')
      setConfirmed(false)
    }
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      const typing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
      if (!typing && (e.key === 'c' || e.key === 'C')) {
        setOpen(true)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setOpen])

  function submit() {
    const trimmed = text.trim()
    if (!trimmed) return
    addInboxCapture(trimmed)
    setText('')
    setConfirmed(true)
    setTimeout(() => setOpen(false), 700)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center px-4 pt-24 sm:pt-4">
      <button aria-label="Close" className="absolute inset-0 bg-ink/35 backdrop-blur-[1px]" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-lg rounded-2xl bg-warmwhite shadow-2xl border border-sand p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] uppercase tracking-wide text-charcoal/40">Quick capture</span>
          <button onClick={() => setOpen(false)} className="text-charcoal/40 hover:text-charcoal">
            <X className="h-4 w-4" />
          </button>
        </div>
        {confirmed ? (
          <div className="py-6 text-center text-ink font-serif text-lg">Captured. Onward.</div>
        ) : (
          <>
            <textarea
              ref={ref}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit()
              }}
              placeholder="What's on your brain?"
              rows={4}
              className="w-full resize-none rounded-lg border border-sand bg-cream px-3 py-2.5 text-[15px] leading-relaxed text-ink placeholder:text-charcoal/35 focus:outline-none focus:ring-2 focus:ring-clay/30"
            />
            <div className="mt-3 flex items-center justify-between">
              <p className="text-[12px] text-charcoal/40">No need to organize it — just get it down.</p>
              <button
                onClick={submit}
                disabled={!text.trim()}
                className="inline-flex items-center gap-1.5 rounded-full bg-ink text-warmwhite px-4 py-2 text-[13px] font-medium disabled:opacity-30"
              >
                Capture <ArrowUp className="h-3.5 w-3.5 rotate-45" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
