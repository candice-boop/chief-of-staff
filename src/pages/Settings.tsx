import { useState, type ReactNode } from 'react'
import { Calendar, Mail, ShieldCheck, Lock, Plus, X } from 'lucide-react'
import { useStore } from '../store/useStore'

const OPERATOR_CAN = ['Read', 'Organize', 'Summarize', 'Classify', 'Prioritize', 'Prepare', 'Draft', 'Recommend', 'Maintain the backlog']
const REQUIRES_APPROVAL = ['Sending emails', 'Booking or purchasing anything', 'Messaging clients or partners', 'Changing calendar events other people see']

export function Settings() {
  const settings = useStore((s) => s.settings)
  const updateSettings = useStore((s) => s.updateSettings)
  const addEmailAccount = useStore((s) => s.addEmailAccount)
  const removeEmailAccount = useStore((s) => s.removeEmailAccount)
  const [addingAccount, setAddingAccount] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newEmail, setNewEmail] = useState('')

  function submitNewAccount() {
    if (!newLabel.trim() || !newEmail.trim()) return
    addEmailAccount(newLabel.trim(), newEmail.trim())
    setNewLabel('')
    setNewEmail('')
    setAddingAccount(false)
  }

  return (
    <div className="max-w-2xl">
      <header className="mb-8">
        <p className="text-[13px] text-charcoal/45">Settings</p>
        <h1 className="mt-1 font-serif text-3xl text-ink">How Candice, Inc. runs</h1>
        <p className="mt-1.5 text-[15px] text-charcoal/55">Preferences that shape how work gets planned around your life.</p>
      </header>

      <section className="mb-10">
        <h2 className="font-serif text-xl text-ink mb-1">Protected family time</h2>
        <p className="text-[13.5px] text-charcoal/50 mb-4">This block is treated as unavailable when future scheduling logic runs.</p>
        <div className="paper rounded-xl p-4 flex items-center gap-3">
          <input
            type="time"
            value={settings.protectedFamilyHours.start}
            onChange={(e) => updateSettings({ protectedFamilyHours: { ...settings.protectedFamilyHours, start: e.target.value } })}
            className="rounded-md border border-sand bg-warmwhite px-2 py-1.5 text-[14px]"
          />
          <span className="text-charcoal/40">to</span>
          <input
            type="time"
            value={settings.protectedFamilyHours.end}
            onChange={(e) => updateSettings({ protectedFamilyHours: { ...settings.protectedFamilyHours, end: e.target.value } })}
            className="rounded-md border border-sand bg-warmwhite px-2 py-1.5 text-[14px]"
          />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-serif text-xl text-ink mb-1">Primary work rhythm</h2>
        <p className="text-[13.5px] text-charcoal/50 mb-4">A preference, not a rule — the day can flex around it.</p>
        <div className="paper rounded-xl divide-y divide-sand/70 overflow-hidden">
          {settings.workRhythm.map((block, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <span className="text-[14px] text-ink">{block.label}</span>
              <span className="text-[13px] text-charcoal/45">
                {block.start} – {block.end}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-serif text-xl text-ink mb-1">Connected sources</h2>
        <p className="text-[13.5px] text-charcoal/50 mb-4">
          Nothing connects automatically. Each source requires your explicit authorization, one account at a time.
        </p>
        <div className="space-y-3">
          <ConnectionRow
            icon={<Calendar className="h-4.5 w-4.5" />}
            title="Google Calendar"
            description="Understand true availability, surface preparation needs, and protect focus blocks. The calendar stays the source of truth for time — nothing here replaces it."
            connected={settings.calendarConnected}
          />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-serif text-xl text-ink mb-1">Email accounts</h2>
        <p className="text-[13.5px] text-charcoal/50 mb-4">
          Add every inbox that matters — across CLS Marketing, the other businesses, and personal — so nothing gets missed.
          Read-only access to surface important messages, commitments, deadlines, and follow-ups. No automated sending in v0.1.
        </p>
        <div className="space-y-3">
          {settings.emailAccounts.map((account) => (
            <div key={account.id} className="paper rounded-xl p-4 flex items-start gap-4">
              <div className="mt-0.5 text-charcoal/50">
                <Mail className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[14.5px] text-ink font-medium">{account.label}</p>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full ${account.connected ? 'text-moss bg-moss/10' : 'text-charcoal/45 bg-charcoal/5'}`}
                  >
                    {account.connected ? 'Connected' : 'Not connected'}
                  </span>
                </div>
                <p className="mt-1 text-[13px] text-charcoal/50">{account.email}</p>
              </div>
              <button
                disabled
                title="Coming in a future version"
                className="shrink-0 rounded-full border border-sand px-3 py-1.5 text-[12.5px] text-charcoal/40 cursor-not-allowed"
              >
                Connect
              </button>
              <button
                onClick={() => removeEmailAccount(account.id)}
                title="Remove this account"
                className="shrink-0 rounded-full p-1.5 text-charcoal/35 hover:text-terracotta transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}

          {settings.emailAccounts.length === 0 && (
            <div className="paper rounded-xl p-4 text-[13.5px] text-charcoal/45">No email accounts added yet.</div>
          )}

          {addingAccount ? (
            <div className="paper rounded-xl p-4 flex flex-wrap items-center gap-2">
              <input
                autoFocus
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Label, e.g. Fora"
                className="min-w-0 flex-1 rounded-md border border-sand bg-warmwhite px-2.5 py-1.5 text-[14px]"
              />
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="name@example.com"
                onKeyDown={(e) => e.key === 'Enter' && submitNewAccount()}
                className="min-w-0 flex-[1.5] rounded-md border border-sand bg-warmwhite px-2.5 py-1.5 text-[14px]"
              />
              <button
                onClick={submitNewAccount}
                disabled={!newLabel.trim() || !newEmail.trim()}
                className="rounded-full bg-ink text-warmwhite px-3.5 py-1.5 text-[12.5px] font-medium disabled:opacity-30"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setAddingAccount(false)
                  setNewLabel('')
                  setNewEmail('')
                }}
                className="rounded-full px-3 py-1.5 text-[12.5px] text-charcoal/45 hover:text-ink transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAddingAccount(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-sand px-3.5 py-1.5 text-[12.5px] text-charcoal/60 hover:border-charcoal/30 hover:text-ink transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Add email account
            </button>
          )}
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="h-5 w-5 text-moss" strokeWidth={1.5} />
          <h2 className="font-serif text-xl text-ink">Autonomy: Operator Mode</h2>
        </div>
        <p className="text-[13.5px] text-charcoal/50 mb-4">
          The system can think and prepare on your behalf. Anything that reaches the outside world still waits for you.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="paper rounded-xl p-4">
            <p className="text-[12px] uppercase tracking-wide text-charcoal/35 mb-2">Handled automatically</p>
            <ul className="space-y-1.5">
              {OPERATOR_CAN.map((c) => (
                <li key={c} className="text-[13.5px] text-charcoal/70">{c}</li>
              ))}
            </ul>
          </div>
          <div className="paper rounded-xl p-4">
            <p className="text-[12px] uppercase tracking-wide text-charcoal/35 mb-2">Always needs your approval</p>
            <ul className="space-y-1.5">
              {REQUIRES_APPROVAL.map((c) => (
                <li key={c} className="text-[13.5px] text-charcoal/70">{c}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-3 text-[12.5px] text-charcoal/40">Per-action autonomy controls are coming in a future version.</p>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-1">
          <Lock className="h-5 w-5 text-charcoal/50" strokeWidth={1.5} />
          <h2 className="font-serif text-xl text-ink">Privacy</h2>
        </div>
        <p className="text-[13.5px] text-charcoal/55 leading-relaxed">
          This is a private, single-user application. Nothing here is shared or exposed publicly. Candice, Inc. never assumes
          access to financial accounts, text messages, client Slack environments, or calendars it hasn't been explicitly
          granted.
        </p>
      </section>
    </div>
  )
}

function ConnectionRow({
  icon,
  title,
  description,
  connected,
}: {
  icon: ReactNode
  title: string
  description: string
  connected: boolean
}) {
  return (
    <div className="paper rounded-xl p-4 flex items-start gap-4">
      <div className="mt-0.5 text-charcoal/50">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-[14.5px] text-ink font-medium">{title}</p>
          <span className={`text-[11px] px-2 py-0.5 rounded-full ${connected ? 'text-moss bg-moss/10' : 'text-charcoal/45 bg-charcoal/5'}`}>
            {connected ? 'Connected' : 'Not connected'}
          </span>
        </div>
        <p className="mt-1 text-[13px] text-charcoal/50 leading-relaxed">{description}</p>
      </div>
      <button
        disabled
        title="Coming in a future version"
        className="shrink-0 rounded-full border border-sand px-3 py-1.5 text-[12.5px] text-charcoal/40 cursor-not-allowed"
      >
        Connect
      </button>
    </div>
  )
}
