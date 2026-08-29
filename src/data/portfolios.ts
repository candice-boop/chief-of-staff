import type { PortfolioArea } from '../types'

export const PORTFOLIOS: PortfolioArea[] = [
  {
    id: 'cls-marketing',
    name: 'CLS Marketing',
    tagline: 'Consulting, strategy & client growth',
    color: 'clay',
    subAreas: [
      { id: 'client-delivery', name: 'Client Delivery' },
      { id: 'business-development', name: 'Business Development' },
    ],
  },
  {
    id: 'kin-atlas',
    name: 'Kin Atlas',
    tagline: 'Product, launch & operations',
    color: 'moss',
  },
  {
    id: 'fora',
    name: 'Fora',
    tagline: 'Travel advising & traveler care',
    color: 'ochre',
  },
  {
    id: 'hey-mom',
    name: 'Hey Mom! Quit Your Job',
    tagline: 'Strategy, content & audience',
    color: 'plum',
  },
  {
    id: 'mother-mogul',
    name: 'Mother Mogul',
    tagline: 'Podcast development & production',
    parentId: 'hey-mom',
    color: 'terracotta',
  },
  {
    id: 'family',
    name: 'Family',
    tagline: 'Kids, school & household logistics',
    color: 'dustyblue',
  },
  {
    id: 'personal',
    name: 'Personal',
    tagline: 'Friendships, marriage, wellness & self',
    color: 'sand-deep',
  },
]

export const portfolioById = (id?: string) => PORTFOLIOS.find((p) => p.id === id)
