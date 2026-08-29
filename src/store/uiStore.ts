import { create } from 'zustand'

interface UiState {
  openRecordId: string | null
  openRecord: (id: string) => void
  closeRecord: () => void

  captureOpen: boolean
  setCaptureOpen: (v: boolean) => void

  searchOpen: boolean
  setSearchOpen: (v: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  openRecordId: null,
  openRecord: (id) => set({ openRecordId: id }),
  closeRecord: () => set({ openRecordId: null }),

  captureOpen: false,
  setCaptureOpen: (v) => set({ captureOpen: v }),

  searchOpen: false,
  setSearchOpen: (v) => set({ searchOpen: v }),
}))
