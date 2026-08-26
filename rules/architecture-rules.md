# Architecture Rules — Civic Pulse

## Core Stack
- **Frontend**: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS, shadcn/ui.
- **Maps**: Mapbox GL JS (`react-map-gl`).
- **Database**: Supabase PostgreSQL + PostGIS + pgvector.
- **AI**: OpenAI API (`gpt-4o` for structured JSON output, `text-embedding-3-small` for semantic search).
- **Deployment**: Vercel.

## Architectural Boundaries
1. **Monolith Rule**: No microservices for MVP. The app must be built as a clean monolithic Next.js repository.
2. **Server-Side AI Execution**: All OpenAI calls must occur in server-side API routes or Server Actions. Never expose `OPENAI_API_KEY` on the client.
3. **Data Source Tagging**: Every status update or audit event must record `source: CITIZEN | GOVERNMENT | SYSTEM | AI`.
4. **Spatial Queries**: Use PostGIS functions (`ST_DWithin`, `ST_MakePoint`) for spatial operations.
