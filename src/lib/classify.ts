import { z } from 'zod'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { anthropic } from './anthropicClient'
import { PORTFOLIOS } from '../data/portfolios'
import { CONTENT_PILLARS } from '../data/contentPillars'
import type { PortfolioAreaId } from '../types'

const PORTFOLIO_IDS = PORTFOLIOS.map((p) => p.id) as [PortfolioAreaId, ...PortfolioAreaId[]]

const ClassificationSchema = z.object({
  type: z.enum(['task', 'idea', 'note']).describe('"idea" also covers content ideas'),
  title: z.string().describe('A short, clear title rewritten from the fragment'),
  portfolioArea: z.enum(PORTFOLIO_IDS).nullable().describe('Only set when reasonably confident'),
  subArea: z.string().nullable().describe("A sub-area id valid for the chosen portfolioArea, else null"),
  contentPillarId: z.string().nullable().describe('Set only when this is a content idea matching one of the pillars listed'),
  priority: z.enum(['high', 'medium', 'low']).nullable(),
})

export type ClassificationResult = z.infer<typeof ClassificationSchema>

export interface ClassifyUsage {
  inputTokens: number
  outputTokens: number
}

function buildContext(): string {
  const portfolioLines = PORTFOLIOS.map((p) => {
    const subs = p.subAreas?.map((s) => s.id).join(', ')
    return `- ${p.id}: ${p.name}${subs ? ` (sub-areas: ${subs})` : ''}`
  }).join('\n')
  const pillarLines = CONTENT_PILLARS.map(
    (c) => `- ${c.id}: [${c.portfolioArea} / ${c.channel}] ${c.name} — ${c.description}`,
  ).join('\n')
  return `Portfolio areas:\n${portfolioLines}\n\nContent pillars:\n${pillarLines}`
}

export async function classifyFragment(text: string): Promise<{ result: ClassificationResult; usage: ClassifyUsage }> {
  if (!anthropic) throw new Error('AI classification is not configured (missing VITE_ANTHROPIC_API_KEY).')

  const response = await anthropic.messages.parse({
    model: 'claude-opus-5',
    max_tokens: 1024,
    system: [
      'You triage one fragment of a personal/professional chief-of-staff debrief',
      'into a task, idea, or note, and tag it to the right business area.',
      '',
      buildContext(),
      '',
      'Rules:',
      '- Use "idea" for content ideas, and set contentPillarId when it clearly fits one of the pillars above.',
      '- Only set portfolioArea/subArea/contentPillarId when reasonably confident; otherwise use null.',
      '- Keep the title short: action-oriented for tasks, descriptive for ideas/notes.',
    ].join('\n'),
    messages: [{ role: 'user', content: text }],
    output_config: { format: zodOutputFormat(ClassificationSchema) },
  })

  if (!response.parsed_output) throw new Error('Could not parse a classification from the model response.')

  return {
    result: response.parsed_output,
    usage: { inputTokens: response.usage.input_tokens, outputTokens: response.usage.output_tokens },
  }
}
