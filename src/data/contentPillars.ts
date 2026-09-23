import type { PortfolioAreaId } from '../types'

// Starting draft — edit freely as the actual content strategy per business sharpens.
export type ContentChannel = 'linkedin' | 'tiktok' | 'instagram'

export interface ContentPillar {
  id: string
  portfolioArea: PortfolioAreaId
  channel: ContentChannel
  name: string
  description: string
}

export const CONTENT_PILLARS: ContentPillar[] = [
  // Hey Mom — LinkedIn
  {
    id: 'heymom-mental-load',
    portfolioArea: 'hey-mom',
    channel: 'linkedin',
    name: 'The mental load nobody puts on the org chart',
    description: 'Naming the invisible work of working motherhood.',
  },
  {
    id: 'heymom-redesigning-work',
    portfolioArea: 'hey-mom',
    channel: 'linkedin',
    name: 'Redesigning work for real life',
    description: 'What it would take for workplaces to actually fit working parents.',
  },
  {
    id: 'heymom-behind-the-career',
    portfolioArea: 'hey-mom',
    channel: 'linkedin',
    name: 'Behind the portfolio career',
    description: 'Building Hey Mom in public — wins, stalls, and lessons.',
  },
  {
    id: 'heymom-community',
    portfolioArea: 'hey-mom',
    channel: 'linkedin',
    name: 'Reader & community voices',
    description: 'Stories and wins from the Hey Mom community.',
  },

  // Mother Mogul — TikTok
  {
    id: 'mm-guest-clips',
    portfolioArea: 'mother-mogul',
    channel: 'tiktok',
    name: 'Guest highlight clips',
    description: 'Punchy, quotable moments pulled from each episode.',
  },
  {
    id: 'mm-behind-mic',
    portfolioArea: 'mother-mogul',
    channel: 'tiktok',
    name: 'Behind the mic',
    description: 'Process, prep, and the making of the podcast.',
  },
  {
    id: 'mm-burnout-takes',
    portfolioArea: 'mother-mogul',
    channel: 'tiktok',
    name: 'Quick takes on burnout & reinvention',
    description: 'Fast opinions tied to episode themes.',
  },

  // Kin Atlas — Instagram
  {
    id: 'ka-mental-load-travel',
    portfolioArea: 'kin-atlas',
    channel: 'instagram',
    name: 'The mental load of family travel',
    description: 'Naming what family trip-planning actually takes.',
  },
  {
    id: 'ka-real-trips',
    portfolioArea: 'kin-atlas',
    channel: 'instagram',
    name: 'Real trips, real moms',
    description: 'Traveler stories and lived examples.',
  },
  {
    id: 'ka-build-in-public',
    portfolioArea: 'kin-atlas',
    channel: 'instagram',
    name: 'Building Kin Atlas in public',
    description: 'App progress, decisions, and what is coming.',
  },
]

export const pillarsForArea = (area?: PortfolioAreaId) =>
  area ? CONTENT_PILLARS.filter((p) => p.portfolioArea === area) : []

export const pillarById = (id?: string) => CONTENT_PILLARS.find((p) => p.id === id)
