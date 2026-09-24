import Anthropic from '@anthropic-ai/sdk'

const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined

export const aiEnabled = !!apiKey

// Experimental, local-only integration: this app runs via `npm run dev` on your
// machine and is never deployed publicly. `dangerouslyAllowBrowser` sends the
// API key straight from the browser, so it's visible in devtools/network
// requests to anyone with access to this browser session. That's an acceptable
// trade for a private, single-user local app — it would NOT be safe to ship a
// build like this publicly with a real key baked in. If this becomes permanent
// rather than an experiment, move the key behind a small local server instead.
export const anthropic = apiKey ? new Anthropic({ apiKey, dangerouslyAllowBrowser: true }) : null
