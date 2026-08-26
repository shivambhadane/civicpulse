# 04 — System Architecture

This document describes the high-level architecture, data flows, technology stack, and component boundaries for **Civic Pulse**.

---

## 1. High-Level Architecture Diagram

```
                               ┌─────────────────────────┐
                               │     Browser / Client    │
                               │   Next.js React (App)   │
                               └────────────┬────────────┘
                                            │
                                            ▼
                               ┌─────────────────────────┐
                               │  Next.js Server / API   │
                               │     (Server Actions)    │
                               └────────────┬────────────┘
                                            │
               ┌────────────────────────────┼────────────────────────────┐
               │                            │                            │
               ▼                            ▼                            ▼
   ┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
   │      Mapbox API       │   │      OpenAI API       │   │     Supabase Cloud    │
   │                       │   │                       │   │                       │
   │  - Vector Tiles       │   │  - GPT-4o JSON        │   │  - PostgreSQL         │
   │  - Geocoding          │   │  - Text Embeddings    │   │  - PostGIS Extension  │
   │  - Reverse Geocoding  │   │  - Vision Analysis    │   │  - pgvector           │
   │                       │   │                       │   │  - Supabase Storage   │
   └───────────────────────┘   └───────────────────────┘   └───────────────────────┘
               │                            │                            │
               └────────────────────────────┼────────────────────────────┘
                                            │
                                            ▼
                               ┌─────────────────────────┐
                               │    Vercel Deployment    │
                               └─────────────────────────┘
```

---

## 2. Component Architecture & Tech Stack

### A. Frontend Layer
- **Framework**: Next.js 14+ with App Router (`/app`).
- **Language**: TypeScript (`strict: true`).
- **UI Components**: shadcn/ui built on Radix UI primitives.
- **Styling**: Tailwind CSS with dark mode / custom theme variables.
- **Icons**: Lucide React.
- **State Management**: React Hooks + URL search parameters (`nuqs` or native `useSearchParams`).

### B. Maps & Geospatial Engine
- **Map Library**: Mapbox GL JS with `react-map-gl`.
- **Geocoding**: Mapbox Geocoding API for address search and reverse geocoding.
- **Map Rendering**: Custom Mapbox vector tile styling with dynamic GEOJSON sources for complaints, clusters, and hotspot polygons.

### C. Backend API & Serverless Layer
- **API Engine**: Next.js Server Actions and API Routes (`app/api/*`).
- **Validation**: Zod schema validation on all incoming payloads and external API responses.
- **Architecture Constraint**: **NO MICROSERVICES FOR MVP**. The entire application operates as a single monolithic Next.js repository deployed to Vercel serverless edge nodes.

### D. Database & Storage Layer
- **Database**: Supabase PostgreSQL 15+.
- **Spatial Extension**: **PostGIS** for spatial coordinates, distance metrics (`ST_DWithin`), and polygon intersections.
- **Vector Extension**: **pgvector** for storing OpenAI text embeddings (`vector(1536)`) for semantic duplicate matching.
- **Object Storage**: Supabase Storage buckets for citizen upload photos and resolution proof media.

### E. AI Integration Layer
- **Provider**: OpenAI API (`gpt-4o` / `gpt-4o-mini` / `text-embedding-3-small`).
- **Execution**: All OpenAI calls are executed **server-side** within Next.js API routes or Server Actions. API keys are never exposed to the client browser.
- **Structured Output**: Uses Zod JSON schema mode to enforce deterministic structured JSON responses.

---

## 3. Key Data Flow Pipelines

### 1. Complaint Creation Flow
```
User Form Data (Text + Photo) 
  → Server Action 
  → OpenAI API (Classification + Severity) 
  → Supabase PostGIS (Spatial duplicate check <= 300m)
  → User Confirmation 
  → Insert into `complaints` table 
  → Revalidate Map state
```

### 2. Hotspot Calculation Flow
```
New Complaint / Support Action 
  → Trigger Spatial Density Query 
  → If count >= 5 complaints within 300m radius 
  → Upsert into `hotspots` table 
  → Broadcast Hotspot Layer Update on Mapbox
```
