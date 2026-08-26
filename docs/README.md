# Civic Pulse Documentation

Welcome to the official documentation repository for **Civic Pulse**. This directory serves as the single source of truth for product vision, technical architecture, user journeys, data models, and implementation boundaries.

---

## 📍 Project Overview

**Civic Pulse** is a map-based civic issue reporting and community accountability platform designed to make reporting, tracking, and resolving urban civic problems simpler, transparent, and actionable for citizens in Indian cities.

- **Primary Goal**: Empower citizens to report civic grievances (potholes, garbage dumps, broken streetlights, water leakages) on an interactive map, aggregate community support, detect emerging local hotspots, and transparently track resolution progress.
- **Core Journey**: 
  `Citizen` → `Discover issue` → `Report or support existing issue` → `AI Classification & Severity` → `AI Department Routing` → `Track Status Timeline` → `Resolution Proof` → `Citizen Verification`.

---

## 🛠 Core Technology Stack

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14+ (App Router), React, TypeScript | Application framework and UI logic |
| **Styling & UI** | Tailwind CSS, shadcn/ui, Lucide Icons | Modern, high-contrast, responsive UI components |
| **Maps & Geospatial** | Mapbox GL JS, react-map-gl | Interactive map, custom markers, heatmap & cluster overlays |
| **Database & GIS** | Supabase (PostgreSQL + PostGIS + pgvector) | Relational storage, 2D spatial queries (`ST_DWithin`), vector search |
| **Storage** | Supabase Storage | Media assets, citizen photo evidence & resolution proofs |
| **AI Integration** | OpenAI API (GPT-4o / Codex) | Structured classification, severity scoring, department routing, duplicate detection |
| **Deployment** | Vercel | Production hosting, edge network, serverless API routes |

---

## 📚 Core Documentation Index

This repository uses a structured 10-document core hierarchy for MVP implementation:

| Doc # | Document Name | Description |
| :---: | :--- | :--- |
| `01` | [Product Requirements](01-product-requirements.md) | Vision, target audience, core problems, and foundational product principles. |
| `02` | [MVP Scope](02-mvp-scope.md) | P0 must-haves, P1 nice-to-haves, and P2 strict out-of-scope features. |
| `03` | [User Journeys](03-user-journeys.md) | Step-by-step golden paths for citizens and mock government actors. |
| `04` | [System Architecture](04-system-architecture.md) | High-level data flow, technology integrations, and serverless architecture. |
| `05` | [Database Schema](05-database-schema.md) | PostgreSQL tables, spatial indexes, PostGIS types, and relationship schemas. |
| `06` | [API Specification](06-api-specification.md) | Endpoint definitions, request/response formats, validation, and error states. |
| `07` | [Map & Geospatial](07-map-geospatial.md) | Mapbox layer definitions, spatial radius queries, clustering, and hotspots. |
| `08` | [AI Architecture](08-ai-architecture.md) | OpenAI pipeline for categorization, department routing, and duplicate matching. |
| `09` | [UI Screen Specifications](09-ui-screen-specifications.md) | UX specs, component structures, and state management for all 9 core screens. |
| `10` | [Security & Privacy](10-security-privacy.md) | Mock data policy, PII guidelines, API key safety, and safety boundaries. |

---

## 🤖 Instructions for AI Agents (Antigravity)

When working on this codebase:
1. **Read First**: Always review `01-product-requirements.md`, `02-mvp-scope.md`, `04-system-architecture.md`, and `10-security-privacy.md` before making architectural or feature changes.
2. **Scope Enforcement**: Strictly adhere to P0 features in `02-mvp-scope.md`. Do **NOT** implement P2 features (real Aadhaar, real OTP, real government APIs).
3. **Data Authenticity**: All government interactions are simulated/mocked for demo purposes. Maintain source tagging on updates (`CITIZEN`, `GOVERNMENT`, `SYSTEM`, `AI`).
4. **Agent Rules**: Refer to workspace rules in `.agents/rules/` for coding patterns and boundaries.
