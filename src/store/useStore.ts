import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AnyRecord, InboxEntry, ItemStatus, RecordPatch, Settings } from '../types'
import { ALL_RECORDS, INBOX_ENTRIES } from '../data/seed'
import { PROJECTS } from '../data/projects'
import { todayISO } from '../lib/dates'
import { splitDebrief } from '../lib/debrief'

interface StoreState {
  records: AnyRecord[]
  inboxEntries: InboxEntry[]
  projects: typeof PROJECTS
  settings: Settings

  // record actions
  updateRecord: (id: string, patch: RecordPatch) => void
  completeRecord: (id: string) => void
  setStatus: (id: string, status: ItemStatus) => void
  reorder: (ids: string[]) => void
  deleteRecord: (id: string) => void

  // inbox actions
  addInboxCapture: (rawText: string) => void
  addDebriefCapture: (rawText: string, period?: 'morning' | 'evening') => void
  processInboxEntry: (
    id: string,
    result: { record: RecordPatch & { type: AnyRecord['type']; title: string } } | { dismiss: true },
  ) => string | undefined

  // settings
  updateSettings: (patch: Partial<Settings>) => void
}

const nowISO = () => new Date().toISOString()

let idCounter = 1000
const genId = (prefix: string) => `${prefix}-${(idCounter++).toString(36)}`

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      records: ALL_RECORDS,
      inboxEntries: INBOX_ENTRIES,
      projects: PROJECTS,
      settings: {
        protectedFamilyHours: { start: '15:00', end: '20:00' },
        workRhythm: [
          { label: 'Focus work', start: '09:00', end: '13:00' },
          { label: 'Workout / Gevity', start: '13:00', end: '14:00' },
          { label: 'Wrap-up work', start: '14:00', end: '15:00' },
          { label: 'Protected family time', start: '15:00', end: '20:00' },
          { label: 'Optional evening work', start: '20:00', end: '22:30' },
        ],
        autonomyMode: 'operator',
        calendarConnected: false,
        gmailConnected: false,
      },

      updateRecord: (id, patch) =>
        set((state) => ({
          records: state.records.map((r) => (r.id === id ? ({ ...r, ...patch, updatedAt: nowISO() } as AnyRecord) : r)),
        })),

      completeRecord: (id) =>
        set((state) => ({
          records: state.records.map((r) =>
            r.id === id ? { ...r, status: 'completed', completedAt: nowISO(), updatedAt: nowISO() } : r,
          ),
        })),

      setStatus: (id, status) =>
        set((state) => ({
          records: state.records.map((r) => (r.id === id ? { ...r, status, updatedAt: nowISO() } : r)),
        })),

      reorder: (ids) =>
        set((state) => {
          const orderMap = new Map(ids.map((id, i) => [id, i]))
          return {
            records: state.records.map((r) => (orderMap.has(r.id) ? { ...r, order: orderMap.get(r.id) } : r)),
          }
        }),

      deleteRecord: (id) => set((state) => ({ records: state.records.filter((r) => r.id !== id) })),

      addInboxCapture: (rawText) =>
        set((state) => ({
          inboxEntries: [
            { id: genId('inbox'), rawText, createdAt: nowISO(), processed: false },
            ...state.inboxEntries,
          ],
        })),

      addDebriefCapture: (rawText, period) =>
        set((state) => {
          const created = nowISO()
          const fragments = splitDebrief(rawText).map((fragment) => ({
            id: genId('inbox'),
            rawText: fragment,
            kind: 'debrief' as const,
            debriefPeriod: period,
            createdAt: created,
            processed: false,
          }))
          return { inboxEntries: [...fragments, ...state.inboxEntries] }
        }),

      processInboxEntry: (id, result) => {
        const newId = 'dismiss' in result ? undefined : genId(result.record.type)
        set((state) => {
          const entry = state.inboxEntries.find((e) => e.id === id)
          if (!entry) return state
          const remaining = state.inboxEntries.map((e) => (e.id === id ? { ...e, processed: true } : e))
          if ('dismiss' in result) {
            return { inboxEntries: remaining }
          }
          const base = {
            id: newId,
            status: 'active' as ItemStatus,
            createdAt: nowISO(),
            updatedAt: nowISO(),
            source: 'inbox' as const,
            capturedDate: todayISO,
            ideaStatus: 'new' as const,
            ...result.record,
          }
          return {
            inboxEntries: remaining,
            records: [base as AnyRecord, ...state.records],
          }
        })
        return newId
      },

      updateSettings: (patch) => set((state) => ({ settings: { ...state.settings, ...patch } })),
    }),
    {
      name: 'candice-inc-store-v1',
    },
  ),
)
