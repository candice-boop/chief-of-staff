// Static class-name maps so Tailwind's compiler can see every class literally.
// (Dynamic template strings like `bg-${color}` would be invisible to the scanner.)

export type AccentColor = 'clay' | 'moss' | 'ochre' | 'plum' | 'terracotta' | 'dustyblue' | 'sand-deep'

interface AccentClasses {
  dot: string
  text: string
  bg: string
  bgSoft: string
  border: string
  ring: string
}

export const ACCENT: Record<AccentColor, AccentClasses> = {
  clay: {
    dot: 'bg-clay',
    text: 'text-clay',
    bg: 'bg-clay',
    bgSoft: 'bg-clay/10',
    border: 'border-clay/30',
    ring: 'ring-clay/30',
  },
  moss: {
    dot: 'bg-moss',
    text: 'text-moss',
    bg: 'bg-moss',
    bgSoft: 'bg-moss/10',
    border: 'border-moss/30',
    ring: 'ring-moss/30',
  },
  ochre: {
    dot: 'bg-ochre',
    text: 'text-ochre',
    bg: 'bg-ochre',
    bgSoft: 'bg-ochre/10',
    border: 'border-ochre/30',
    ring: 'ring-ochre/30',
  },
  plum: {
    dot: 'bg-plum',
    text: 'text-plum',
    bg: 'bg-plum',
    bgSoft: 'bg-plum/10',
    border: 'border-plum/30',
    ring: 'ring-plum/30',
  },
  terracotta: {
    dot: 'bg-terracotta',
    text: 'text-terracotta',
    bg: 'bg-terracotta',
    bgSoft: 'bg-terracotta/10',
    border: 'border-terracotta/30',
    ring: 'ring-terracotta/30',
  },
  dustyblue: {
    dot: 'bg-dustyblue',
    text: 'text-dustyblue',
    bg: 'bg-dustyblue',
    bgSoft: 'bg-dustyblue/10',
    border: 'border-dustyblue/30',
    ring: 'ring-dustyblue/30',
  },
  'sand-deep': {
    dot: 'bg-sand-deep',
    text: 'text-sand-deep',
    bg: 'bg-sand-deep',
    bgSoft: 'bg-sand-deep/10',
    border: 'border-sand-deep/30',
    ring: 'ring-sand-deep/30',
  },
}

export const DEADLINE_LABEL: Record<string, string> = {
  hard: 'Hard deadline',
  committed: 'Committed',
  target: 'Target',
  wish: 'Wish',
  review: 'Review',
}

export const STATUS_LABEL: Record<string, string> = {
  inbox: 'Inbox',
  active: 'Active',
  today: 'Today',
  'this-week': 'This Week',
  waiting: 'Waiting',
  parked: 'Parked',
  completed: 'Completed',
  archived: 'Archived',
}
