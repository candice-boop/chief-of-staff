import { Sparkles } from 'lucide-react'

export function CandiceRequiredBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-ink text-warmwhite px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase">
      Candice required
    </span>
  )
}

export function AiCanHandleBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-moss/10 text-moss px-2.5 py-0.5 text-[11px] font-medium tracking-wide">
      <Sparkles className="h-3 w-3" strokeWidth={2} />
      AI can help
    </span>
  )
}

export function EffortTag({ effort }: { effort?: string }) {
  if (!effort) return null
  return <span className="text-[13px] text-charcoal/50">~{effort}</span>
}
