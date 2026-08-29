import { Check } from 'lucide-react'

export function CompleteCheckbox({
  done,
  onToggle,
  size = 'md',
}: {
  done: boolean
  onToggle: () => void
  size?: 'sm' | 'md'
}) {
  const dim = size === 'sm' ? 'h-5 w-5' : 'h-6 w-6'
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      aria-label={done ? 'Mark incomplete' : 'Mark complete'}
      aria-pressed={done}
      className={`${dim} shrink-0 rounded-full border flex items-center justify-center transition-colors duration-150 ${
        done ? 'bg-charcoal border-charcoal' : 'border-charcoal/25 hover:border-charcoal/50 bg-warmwhite'
      }`}
    >
      {done && <Check className="h-3.5 w-3.5 text-warmwhite" strokeWidth={3} />}
    </button>
  )
}
