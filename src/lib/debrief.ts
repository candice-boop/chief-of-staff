// Turns one rambling, dictated debrief transcript into discrete, reviewable fragments —
// so a stream-of-consciousness drive/walk recording becomes N one-tap Inbox cards
// instead of one wall of text.
export function splitDebrief(raw: string): string[] {
  const lines = raw
    .trim()
    .split(/\n+/)
    .flatMap((line) => (line.trim() ? line.trim().split(/(?<=[.!?])\s+(?=[A-Z(])/) : []))

  const fragments = lines.map((f) => f.trim()).filter((f) => f.split(/\s+/).length >= 3)

  return fragments.length > 0 ? fragments : [raw.trim()].filter(Boolean)
}
