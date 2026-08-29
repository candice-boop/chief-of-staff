import { Link } from 'react-router-dom'
import { ShieldCheck, ArrowRight } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { selectSafelyParked } from '../../lib/selectors'

export function SafelyParkedSection() {
  const records = useStore((s) => s.records)
  const count = selectSafelyParked(records).length

  return (
    <section className="mb-4">
      <Link
        to="/backlog"
        className="group flex items-center gap-4 rounded-2xl bg-oat/50 border border-sand/70 px-6 py-5 hover:bg-oat/70 transition-colors"
      >
        <ShieldCheck className="h-6 w-6 text-moss shrink-0" strokeWidth={1.5} />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] text-ink">
            <span className="font-medium">{count} things</span> are safely parked.
          </p>
          <p className="text-[13px] text-charcoal/50">Nothing else needs your attention right now.</p>
        </div>
        <ArrowRight className="h-4 w-4 text-charcoal/30 group-hover:translate-x-0.5 transition-transform shrink-0" />
      </Link>
    </section>
  )
}
