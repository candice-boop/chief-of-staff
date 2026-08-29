import { addDays, format, startOfDay, differenceInCalendarDays, parseISO, isValid } from 'date-fns'

export const today = startOfDay(new Date())

export const iso = (d: Date) => format(d, 'yyyy-MM-dd')

export const todayISO = iso(today)

export const inDays = (n: number) => iso(addDays(today, n))

const DAY_INDEX: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
}

/** ISO date string for the next upcoming occurrence of a weekday (today counts as 0 days out only if forceFuture is false) */
export function upcoming(dayName: keyof typeof DAY_INDEX, forceFuture = true): string {
  const target = DAY_INDEX[dayName]
  const cur = today.getDay()
  let diff = target - cur
  if (diff < 0 || (diff === 0 && forceFuture)) diff += 7
  return inDays(diff)
}

export function daysFromToday(dateStr?: string | null): number | null {
  if (!dateStr) return null
  const d = parseISO(dateStr)
  if (!isValid(d)) return null
  return differenceInCalendarDays(d, today)
}

export function weekdayLabel(dateStr?: string | null): string {
  if (!dateStr) return ''
  const d = parseISO(dateStr)
  if (!isValid(d)) return ''
  const diff = differenceInCalendarDays(d, today)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff === -1) return 'Yesterday'
  return format(d, 'EEEE')
}

export function shortDateLabel(dateStr?: string | null): string {
  if (!dateStr) return ''
  const d = parseISO(dateStr)
  if (!isValid(d)) return ''
  return format(d, 'MMM d')
}

export function relativeDayPhrase(dateStr?: string | null): string {
  const diff = daysFromToday(dateStr)
  if (diff === null) return ''
  if (diff === 0) return 'today'
  if (diff === 1) return 'tomorrow'
  if (diff === -1) return 'yesterday'
  if (diff > 1 && diff <= 6) return `in ${diff} days`
  if (diff < -1) return `${Math.abs(diff)} days ago`
  return format(parseISO(dateStr!), 'MMM d')
}
