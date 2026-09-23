import { useState } from 'react'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import type { IdeaItem } from '../../types'
import { useStore } from '../../store/useStore'
import { PortfolioTag } from '../shared/PortfolioTag'
import { pillarById } from '../../data/contentPillars'
import { shortDateLabel } from '../../lib/dates'

const CHANNEL_LABEL: Record<string, string> = { linkedin: 'LinkedIn', tiktok: 'TikTok', instagram: 'Instagram' }

const IDEA_STATUS_LABEL: Record<string, string> = {
  new: 'New',
  'worth-exploring': 'Worth exploring',
  parked: 'Parked',
  promoted: 'Promoted to project',
  archived: 'Archived',
}

const IDEA_STATUS_STYLE: Record<string, string> = {
  new: 'text-dustyblue bg-dustyblue/10',
  'worth-exploring': 'text-ochre bg-ochre/10',
  parked: 'text-charcoal/45 bg-charcoal/5',
  promoted: 'text-moss bg-moss/10',
  archived: 'text-charcoal/35 bg-charcoal/5',
}

export function IdeaCard({ idea, accentRotation }: { idea: IdeaItem; accentRotation: number }) {
  const updateRecord = useStore((s) => s.updateRecord)
  const [expanded, setExpanded] = useState(false)
  const pillar = pillarById(idea.contentPillarId)

  return (
    <div
      className="paper rounded-2xl p-5 flex flex-col"
      style={{ transform: `rotate(${accentRotation}deg)` }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={`text-[11px] px-2 py-0.5 rounded-full ${IDEA_STATUS_STYLE[idea.ideaStatus]}`}>
          {IDEA_STATUS_LABEL[idea.ideaStatus]}
        </span>
        <span className="text-[11px] text-charcoal/35 shrink-0">Captured {shortDateLabel(idea.capturedDate)}</span>
      </div>

      <h3 className="mt-3 font-serif text-lg text-ink leading-snug">{idea.title}</h3>
      {idea.description && (
        <p className={`mt-2 text-[13.5px] text-charcoal/60 leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>
          {idea.description}
        </p>
      )}
      {idea.description && idea.description.length > 120 && (
        <button onClick={() => setExpanded((e) => !e)} className="mt-1 text-left text-[12px] text-charcoal/40 hover:text-ink w-fit">
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}

      <div className="mt-3 flex items-center justify-between">
        <PortfolioTag area={idea.portfolioArea} subArea={idea.subArea} />
        {idea.reviewByDate && <span className="text-[12px] text-dustyblue">Revisit {shortDateLabel(idea.reviewByDate)}</span>}
      </div>

      {pillar && (
        <div className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-plum/10 px-2.5 py-1 text-[11.5px] text-plum">
          <Sparkles className="h-3 w-3" /> {CHANNEL_LABEL[pillar.channel]} · {pillar.name}
        </div>
      )}

      {idea.ideaStatus !== 'promoted' && idea.ideaStatus !== 'archived' && (
        <div className="mt-4 pt-3 border-t border-sand/70 flex items-center gap-2">
          <select
            value={idea.ideaStatus}
            onChange={(e) => updateRecord(idea.id, { ideaStatus: e.target.value as IdeaItem['ideaStatus'] })}
            className="rounded-full border border-sand bg-warmwhite px-2.5 py-1 text-[12px] text-charcoal/70"
          >
            <option value="new">New</option>
            <option value="worth-exploring">Worth exploring</option>
            <option value="parked">Parked</option>
          </select>
          <button
            onClick={() =>
              updateRecord(idea.id, {
                type: 'task',
                status: 'active',
                ideaStatus: 'promoted',
                priority: idea.priority ?? 'medium',
              })
            }
            className="ml-auto inline-flex items-center gap-1 rounded-full bg-ink text-warmwhite px-3 py-1.5 text-[12px] font-medium"
          >
            Promote <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
