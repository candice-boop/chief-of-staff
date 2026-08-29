import { NavLink, Outlet } from 'react-router-dom'
import { Home, LayoutGrid, Archive, Lightbulb, Inbox as InboxIcon, Search, Settings as SettingsIcon, Plus } from 'lucide-react'
import { useUiStore } from '../../store/uiStore'
import { useStore } from '../../store/useStore'
import { QuickCapture } from './QuickCapture'
import { GlobalSearch } from './GlobalSearch'
import { ItemDrawer } from '../shared/ItemDrawer'

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/portfolio', label: 'Portfolio', icon: LayoutGrid, end: false },
  { to: '/backlog', label: 'Backlog', icon: Archive, end: false },
  { to: '/ideas', label: 'Idea Bank', icon: Lightbulb, end: false },
  { to: '/inbox', label: 'Inbox', icon: InboxIcon, end: false },
]

export function AppShell() {
  const setCaptureOpen = useUiStore((s) => s.setCaptureOpen)
  const setSearchOpen = useUiStore((s) => s.setSearchOpen)
  const unprocessedCount = useStore((s) => s.inboxEntries.filter((e) => !e.processed).length)

  return (
    <div className="min-h-dvh flex bg-cream">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 lg:w-64 shrink-0 flex-col border-r border-sand/70 px-5 py-6">
        <div className="mb-8 px-1">
          <p className="font-serif text-xl text-ink">Candice, Inc.</p>
          <p className="text-[12px] text-charcoal/45 mt-0.5">Executive operating system</p>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] transition-colors ${
                  isActive ? 'bg-ink text-warmwhite' : 'text-charcoal/70 hover:bg-oat/60 hover:text-ink'
                }`
              }
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              {label}
              {label === 'Inbox' && unprocessedCount > 0 && (
                <span className="ml-auto text-[11px] text-charcoal/40">{unprocessedCount}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => setCaptureOpen(true)}
          className="mb-3 inline-flex items-center justify-center gap-2 rounded-full bg-ink text-warmwhite px-4 py-2.5 text-[13px] font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" /> Capture something
        </button>

        <div className="flex items-center gap-1 px-1">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-[13px] text-charcoal/50 hover:text-ink transition-colors"
          >
            <Search className="h-4 w-4" /> Search
          </button>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `ml-auto flex items-center gap-2 rounded-lg px-2 py-2 text-[13px] transition-colors ${
                isActive ? 'text-ink' : 'text-charcoal/50 hover:text-ink'
              }`
            }
          >
            <SettingsIcon className="h-4 w-4" />
          </NavLink>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between bg-cream/90 backdrop-blur border-b border-sand/70 px-4 py-3">
        <p className="font-serif text-lg text-ink">Candice, Inc.</p>
        <div className="flex items-center gap-1">
          <button onClick={() => setSearchOpen(true)} className="p-2 text-charcoal/60">
            <Search className="h-5 w-5" />
          </button>
          <NavLink to="/settings" className="p-2 text-charcoal/60">
            <SettingsIcon className="h-5 w-5" />
          </NavLink>
        </div>
      </div>

      <main className="flex-1 min-w-0 pt-14 pb-24 md:pt-0 md:pb-0">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-warmwhite border-t border-sand/70 px-2 py-2 flex items-center justify-around">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `flex flex-col items-center gap-0.5 px-2 py-1 text-[10.5px] ${isActive ? 'text-ink' : 'text-charcoal/45'}`}
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} />
            {label === 'Idea Bank' ? 'Ideas' : label}
          </NavLink>
        ))}
      </nav>

      {/* Mobile floating capture button */}
      <button
        onClick={() => setCaptureOpen(true)}
        className="md:hidden fixed bottom-20 right-4 z-30 flex items-center justify-center h-14 w-14 rounded-full bg-ink text-warmwhite shadow-lg"
        aria-label="Quick capture"
      >
        <Plus className="h-6 w-6" />
      </button>

      <QuickCapture />
      <GlobalSearch />
      <ItemDrawer />
    </div>
  )
}
