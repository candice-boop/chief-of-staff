import { format } from 'date-fns'
import { today } from '../../lib/dates'

function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function HomeHeader() {
  return (
    <header className="mb-10">
      <p className="text-[13px] text-charcoal/45">{format(today, 'EEEE, MMMM d')}</p>
      <h1 className="mt-1 font-serif text-3xl sm:text-4xl text-ink">{greeting()}, Candice.</h1>
      <p className="mt-1.5 text-[15px] text-charcoal/55">Here's the shape of today.</p>
    </header>
  )
}
