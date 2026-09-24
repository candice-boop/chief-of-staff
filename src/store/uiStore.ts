import { create } from 'zustand'

interface UiState {
  openRecordId: string | null
  openRecord: (id: string) => void
  closeRecord: () => void

  captureOpen: boolean
  setCaptureOpen: (v: boolean) => void

  searchOpen: boolean
  setSearchOpen: (v: boolean) => void

  // Running tally of AI classification usage for this browser session only —
  // deliberately not persisted, so it resets on reload and never pretends to
  // be real billing data. It exists purely so usage can be watched live.
  aiUsage: { calls: number; inputTokens: number; outputTokens: number }
  recordAiUsage: (usage: { inputTokens: number; outputTokens: number }) => void
}

export const useUiStore = create<UiState>((set) => ({
  openRecordId: null,
  openRecord: (id) => set({ openRecordId: id }),
  closeRecord: () => set({ openRecordId: null }),

  captureOpen: false,
  setCaptureOpen: (v) => set({ captureOpen: v }),

  searchOpen: false,
  setSearchOpen: (v) => set({ searchOpen: v }),

  aiUsage: { calls: 0, inputTokens: 0, outputTokens: 0 },
  recordAiUsage: (usage) =>
    set((state) => ({
      aiUsage: {
        calls: state.aiUsage.calls + 1,
        inputTokens: state.aiUsage.inputTokens + usage.inputTokens,
        outputTokens: state.aiUsage.outputTokens + usage.outputTokens,
      },
    })),
}))
