# VĀC Workspace

Internal operating platform for VĀC • Conscious Communication: dashboard, projects, clients, finance, team, and the Client Onboarding console (merged from the former Onboarding app).

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/vac-workspace` — the single web app (React + Vite + wouter)
  - `src/pages/*Page.tsx` — Workspace sections (Dashboard, Projects, Clients, Finance, Team); data is currently in memory / `src/data`
  - `src/pages/onboarding/*` — Client Onboarding console (Overview, Sessions, Session detail, Strategic brief, New session, live questionnaire)
  - `src/components/onboarding/OnboardingLayout.tsx` — Workspace sidebar + onboarding secondary sidebar
  - `src/styles/onboarding.css` — scoped Onboarding design language (`.vac-onboarding`)
- `artifacts/api-server` — Express API: `/api/healthz`, `/api/sessions/*` (onboarding sessions, briefs, client/director emails, PDF report)
- `lib/db/src/schema` — Drizzle tables: `onboarding_sessions`, `strategic_briefs`
- `lib/api-spec/openapi.yaml` — API contract; run codegen after editing
- `artifacts/mockup-sandbox` — design sandbox (untouched)

## Routes (web)

- `/`, `/projects`, `/clients`, `/finance`, `/team`, `/vault`, `/settings` — Workspace
- `/onboarding` overview · `/onboarding/sessions` · `/onboarding/sessions/:id` · `/onboarding/sessions/:id/brief` · `/onboarding/new` · `/onboarding/flow/:id` (full screen, client facing)

## Architecture decisions

- Onboarding was merged in as a section of the Workspace, sharing one API server and one Postgres database.
- The Onboarding look (VĀC Green #7DB523, Rust #A44B1C, Bill Corporate wide, Space Mono labels) is kept on purpose and scoped to `.vac-onboarding`; it is the reference for restyling the other Workspace areas. The rest of the Workspace still uses its own tokens (terracotta primary, leaf green accent, Bill Corporate Narrow) from `src/index.css`.
- Strategic briefs now persist `readingSuggestions` and `industryContext` (previously generated but dropped on insert).
- Vite dev server proxies `/api` to `API_URL` (default `http://localhost:8080`) for running outside Replit.

## User preferences

- European Portuguese (PT-PT) for client-facing copy; never use dashes as punctuation in produced text.
- Keep the Onboarding visual language; other areas will be adapted to it on request.

## Gotchas

- After changing the DB schema run `pnpm --filter @workspace/db run push` (the merge added two jsonb columns to `strategic_briefs`).
- Building web artifacts needs `PORT` and `BASE_PATH` env vars (Replit sets them).
- `/api/sessions/:id/complete` inserts a brief with `onConflictDoNothing`, but `session_id` has no unique constraint yet, so completing twice creates duplicates.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
