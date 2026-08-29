# Candice, Inc.

A private executive operating system — the persistent layer underneath an AI Chief
of Staff. It holds Today's priorities, decisions that need Candice, the week
ahead, what's waiting on other people, and everything safely parked for later,
across every business, client, and family responsibility.

This is v0.1: a single-user, local-first app seeded with realistic sample data
so the shape of the experience can be evaluated end to end.

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4 (warm neutral palette, Fraunces serif / Inter sans)
- Zustand, persisted to `localStorage`
- React Router

## Running it

```bash
npm install
npm run dev
```

## Structure

- `src/types` — the domain model (tasks, decisions, waiting items, ideas, notes, projects)
- `src/data` — portfolio areas, projects, and seed records
- `src/store` — persisted app state (`useStore`) and ephemeral UI state (`uiStore`)
- `src/lib/selectors.ts` — the logic that turns raw records into Home's Today /
  Needs Candice / This Week / Coming At Me / Waiting On / Safely Parked sections
- `src/pages` — Home, Portfolio, Backlog, Idea Bank, Inbox, Settings
- `src/components` — page-specific and shared UI

Calendar and Gmail integrations are architected as placeholders in Settings —
each requires explicit future authorization and isn't wired up in v0.1.
