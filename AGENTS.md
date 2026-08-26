# Civic Pulse — Agent Instructions

## Read First
- @docs/README.md
- @docs/02-mvp-scope.md
- @docs/04-system-architecture.md

## Core Stack
- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
- **Maps**: Mapbox GL JS (`react-map-gl`)
- **Database**: Supabase PostgreSQL, PostGIS, pgvector
- **AI**: OpenAI API (`gpt-4o`, `text-embedding-3-small`)
- **Hosting**: Vercel

## Core Instructions & Rules
1. **Framework Discipline**: Do not introduce new unapproved frameworks or external libraries without user confirmation.
2. **Scope Boundaries**: Strictly adhere to P0 MVP scope in `@docs/02-mvp-scope.md`. Do not build P2 features (real Aadhaar, real OTP, real payments, live government APIs).
3. **No Real Government Systems**: Do not attempt to query, scrape, or integrate real government systems. All official interactions must be synthetic/mocked.
4. **API Key Isolation**: Never expose `OPENAI_API_KEY` or Supabase service keys to the client browser.
5. **AI Principles**: AI features must remain strictly advisory. AI outputs must be server-side validated using Zod.
6. **Map Priority**: The map is the primary interface of the application. Keep it responsive, performant, and visual.
7. **Golden Path First**: Always prioritize keeping the primary citizen journey fully functional.
