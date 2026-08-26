# Civic Pulse

Map-Based Civic Issue Reporting and Community Accountability Platform

Civic Pulse is an AI-assisted, map-centric civic reporting and accountability platform designed for Indian urban environments. It enables citizens to report local infrastructure issues, aggregate neighborhood support, automatically detect duplicate complaints using geospatial and vector similarity matching, route issues to municipal departments, and track resolution timelines with complete transparency.

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Documentation Index](#documentation-index)
- [Agent & Workspace Rules](#agent--workspace-rules)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Configuration](#environment-configuration)
  - [Database Setup](#database-setup)
  - [Local Installation](#local-installation)
- [API Endpoints Overview](#api-endpoints-overview)
- [Safety, Privacy, and Disclosures](#safety-privacy-and-disclosures)

---

## Executive Summary

Urban civic grievance management in Indian municipalities often suffers from fragmented portals, lack of spatial context, black-hole tracking, and overwhelming ticket duplication. Civic Pulse addresses these challenges by providing:

1. **Map-First Entry Point**: All reports, active clusters, and hotspots are anchored to real-world coordinates on an interactive map.
2. **AI-Assisted Workflow**: OpenAI-powered issue classification, severity assessment, and intelligent municipal department routing from natural language descriptions and photos.
3. **Geospatial Duplicate Prevention**: PostGIS radius search combined with semantic vector embeddings to detect nearby open complaints, prompting citizens to support existing tickets rather than creating duplicates.
4. **Community Support Aggregation**: High-density issue clusters automatically escalate into Hotspots, drawing urgent municipal attention based on collective citizen voice.
5. **Auditable Lifecycle Tracking**: Clear chronological status timelines distinguishing citizen inputs, AI inferences, system automations, and government responses.

---

## Core Features

- **Interactive Map Discovery**: View neighborhood complaints, category-coded markers, dynamic cluster badges, and hotspot zones powered by Mapbox GL JS.
- **Issue Reporting Wizard**: Multi-step reporting flow with precise pin-drop location selection, reverse geocoding, photo upload preview, and description input.
- **AI Classification and Severity**: Automatic categorization across civic domains (Roads, Sanitation, Water, Electricity, Safety) and severity rating (Low, Medium, High, Critical).
- **AI Department Recommendation**: Intelligent routing suggestions matching complaints to municipal department boundaries with confidence scoring.
- **Hybrid Duplicate Detection**: Spatial proximity filtering (300-meter radius via PostGIS `ST_DWithin`) and semantic embedding similarity (`pgvector` cosine distance) to present "Is this your issue?" options.
- **Community Support Mechanism**: "I'm affected too" one-click action to upvote existing complaints and increment issue weight.
- **Hotspot Visualization**: Automated identification and map rendering of high-density, high-severity problem areas.
- **Mock Government Action Panel**: Administrative controls to simulate official status transitions (Submitted -> Under Review -> In Progress -> Resolved) with resolution photo proof.

---

## Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 14+ (App Router), React, TypeScript | Application framework and component rendering |
| **UI and Styling** | Tailwind CSS, shadcn/ui, Lucide Icons | Responsive UI components and layout system |
| **Maps and Geospatial** | Mapbox GL JS, react-map-gl | Interactive vector mapping and spatial visualization |
| **Database** | Supabase PostgreSQL 15+ | Relational data persistence and user management |
| **Geospatial Database** | PostGIS Extension | 2D spatial coordinates, radius filtering (`ST_DWithin`), centroids |
| **Vector Engine** | pgvector Extension | Storage and cosine similarity search for 1536-dimensional OpenAI embeddings |
| **Object Storage** | Supabase Storage | File storage for citizen complaint photos and resolution evidence |
| **AI Processing** | OpenAI API (GPT-4o, text-embedding-3-small) | Structured JSON classification, severity rating, routing, and embeddings |
| **Hosting and Deployment** | Vercel | Serverless edge deployment and API route hosting |

---

## System Architecture

Civic Pulse operates as a monolithic Next.js application leveraging serverless API routes and server actions for backend execution.

```
                            Browser / Client
                                   │
                                   ▼
                          Next.js App Router
                                   │
             ┌─────────────────────┼─────────────────────┐
             │                     │                     │
             ▼                     ▼                     ▼
        Mapbox GL             OpenAI API          Supabase Cloud
    (Vector Tiles)       (Classification &      (PostgreSQL + PostGIS
                          Vector Embeddings)      + pgvector + Storage)
             │                     │                     │
             └─────────────────────┼─────────────────────┘
                                   │
                                   ▼
                           Vercel Deployment
```

All external API interactions (OpenAI API requests, Supabase database connections) are executed server-side. Private API keys are strictly hidden from client-side JavaScript bundles.

---

## Documentation Index

Comprehensive documentation is organized within the `docs/` directory:

- `docs/README.md`: Master documentation index and navigation guide.
- `docs/01-product-requirements.md`: Product vision, problem definition, user personas, and core principles.
- `docs/02-mvp-scope.md`: Detailed MVP scope boundaries defining P0 (must-build), P1 (nice-to-have), and P2 (strictly out of scope).
- `docs/03-user-journeys.md`: Step-by-step golden path flowcharts for citizens and mock municipal officials.
- `docs/04-system-architecture.md`: In-depth architecture specification, technology stack integration, and data flows.
- `docs/05-database-schema.md`: PostgreSQL schema DDL, PostGIS geometry fields, vector columns, indexes, and source tagging rules.
- `docs/06-api-specification.md`: REST API endpoint schemas, query parameters, payload contracts, and response formats.
- `docs/07-map-geospatial.md`: Mapbox layer specifications, PostGIS spatial queries, clustering logic, and reverse geocoding.
- `docs/08-ai-architecture.md`: OpenAI processing pipelines, prompt schemas, hybrid duplicate detection algorithm, and AI safety guardrails.
- `docs/09-ui-screen-specifications.md`: Detailed component layout, data requirements, and interactions across all 9 primary application screens.
- `docs/10-security-privacy.md`: Technical security policies, input sanitization, file upload rules, and synthetic data compliance.

---

## Agent & Workspace Rules

This repository incorporates structured workspace rules for AI coding agents under `.agents/rules/` and `AGENTS.md`:

- `AGENTS.md`: High-level coding constitution and primary reference guide.
- `.agents/rules/project-rules.md`: General agent workflow, document reading sequence, and scope constraints.
- `.agents/rules/architecture-rules.md`: Technology boundaries and serverless architecture rules.
- `.agents/rules/frontend-rules.md`: UI/UX, Tailwind CSS, shadcn/ui, and Mapbox visual guidelines.
- `.agents/rules/backend-rules.md`: Next.js App Router API rules, Zod schema validation, and spatial SQL standards.
- `.agents/rules/security-rules.md`: API key isolation, synthetic data rules, and disclosure mandates.

---

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- A Supabase project with PostGIS and pgvector extensions enabled
- Mapbox Access Token
- OpenAI API Key

### Environment Configuration

Create a `.env.local` file in the project root:

```env
# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Mapbox Configuration
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_public_token

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration (Server-Side Only)
OPENAI_API_KEY=your_openai_api_key
```

### Database Setup

1. Execute the SQL DDL script provided in `docs/05-database-schema.md` inside your Supabase SQL Editor.
2. Verify that PostGIS and pgvector extensions are activated:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;
```

### Local Installation

```bash
# Clone the repository
git clone https://github.com/shivambhadane/civicpulse.git
cd civicpulse

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open `http://localhost:3000` in your browser to access the application.

---

## API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/complaints` | Create a new complaint |
| `GET` | `/api/complaints` | Fetch complaints with spatial/category filters |
| `GET` | `/api/complaints/:id` | Fetch complaint details and timeline history |
| `POST` | `/api/complaints/:id/support` | Increment supporter count for a complaint |
| `GET` | `/api/complaints/nearby` | Query complaints within a specified radius (default 300m) |
| `GET` | `/api/hotspots` | Fetch active hotspot cluster overlays |
| `POST` | `/api/ai/classify` | Process issue description/image via OpenAI for category and severity |
| `POST` | `/api/ai/similar` | Compute embedding similarity against nearby complaints |
| `POST` | `/api/ai/route` | Compute department recommendation and confidence score |

---

## Safety, Privacy, and Disclosures

### Synthetic Data Policy

Civic Pulse strictly enforces a synthetic data policy:
- No collection or verification of real government identity numbers (Aadhaar, PAN).
- No integration with live government portals, CPGRAMS APIs, or internal municipal infrastructure.
- No real SMS gateway, phone OTP, or financial payment gateway operations.
- All user profiles, complaints, and government status updates used in demonstration environments are synthetic.

### Project Disclosure Notice

Civic Pulse is an open-source civic technology hackathon project. All municipal departments, official status transitions, and resolution responses within the application are simulated for demonstration and proof-of-concept purposes.