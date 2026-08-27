# Civic Pulse

> Map-based civic issue reporting and community accountability platform.

Civic Pulse is an AI-assisted platform enabling citizens in Indian urban areas to report infrastructure issues, aggregate community support, detect duplicate complaints using spatial vector matching, and track resolution progress with full transparency.

---

## Key Capabilities

- **Interactive Spatial Map**: Real-world issue discovery, category markers, dynamic cluster badges, and hotspot zones.
- **AI Classification & Routing**: OpenAI-powered categorization, severity scoring, and municipal department routing.
- **Duplicate Prevention**: PostGIS radius searching (300m) + `pgvector` semantic matching to highlight existing reports ("I'm affected too").
- **Community Hotspots**: Automated escalation of high-density issue clusters drawing municipal focus.
- **Auditable Timelines**: Transparent status progression with source-tagged updates (`CITIZEN`, `GOVERNMENT`, `SYSTEM`, `AI`).

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS |
| **Maps** | Mapbox GL JS / `@vis.gl/react-google-maps` |
| **Database & GIS** | Supabase PostgreSQL, PostGIS, pgvector |
| **AI Integration** | OpenAI API (`gpt-4o` Structured Outputs, embeddings) |
| **Hosting** | Vercel |

---

## Documentation

Full project specifications are maintained in the [`docs/`](docs/README.md) directory:

- [`01-product-requirements.md`](docs/01-product-requirements.md) — Product vision, user personas, and principles.
- [`02-mvp-scope.md`](docs/02-mvp-scope.md) — MVP feature boundaries (P0, P1, P2).
- [`03-user-journeys.md`](docs/03-user-journeys.md) — Step-by-step citizen & official golden paths.
- [`04-system-architecture.md`](docs/04-system-architecture.md) — Technical architecture and data flows.
- [`05-database-schema.md`](docs/05-database-schema.md) — Database DDL, PostGIS queries, and vector indexes.
- [`06-api-specification.md`](docs/06-api-specification.md) — REST API endpoint schemas and contracts.
- [`07-map-geospatial.md`](docs/07-map-geospatial.md) — Spatial layers, radius queries, and clustering.
- [`08-ai-architecture.md`](docs/08-ai-architecture.md) — Classification, routing, and duplicate algorithms.
- [`09-ui-screen-specifications.md`](docs/09-ui-screen-specifications.md) — Specifications for all 9 application screens.
- [`10-security-privacy.md`](docs/10-security-privacy.md) — Security policies, key isolation, and privacy rules.

Workspace instructions for AI agents are defined in [`AGENTS.md`](AGENTS.md) and [`.agents/rules/`](.agents/rules/).

---

## Quickstart

### 1. Clone & Install

```bash
git clone https://github.com/shivambhadane/civicpulse.git
cd civicpulse
npm install
```

### 2. Environment Setup

Create `.env.local`:

```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`.

---

## Disclosure

Civic Pulse is an open-source civic technology project. All government interactions, department routing, and official status transitions are synthetic simulations designed for demonstration purposes.