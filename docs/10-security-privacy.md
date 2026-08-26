# 10 — Security, Privacy & Compliance Guidelines

This document sets forth mandatory security boundaries, privacy safeguards, and mock data compliance rules for **Civic Pulse**.

---

## 1. Absolute Out-of-Bound Rules (Prohibited Integrations)

To protect user privacy and strictly comply with hackathon ethics and Indian data protection standards, the AI Coding Assistant and developers must **STRICTLY PROHIBIT** implementing or integrating:

- ❌ **NO Real Aadhaar / PAN Verification**: Never collect, store, or validate real national identification numbers.
- ❌ **NO Real SMS / Phone OTP Services**: Never send real SMS text messages or collect real mobile phone numbers.
- ❌ **NO Real Payment Gateways**: Never process real currency or financial transactions.
- ❌ **NO Real Citizen PII Harvesting**: Never collect sensitive personal data such as home address numbers, biometric data, or financial status.
- ❌ **NO Live Government Credentials**: Never store or prompt for official government staff login credentials.
- ❌ **NO Unofficial Web Scraping or API Abuse**: Never scrape protected government portals (e.g. CPGRAMS, municipal websites) or hit undocumented government endpoints.

---

## 2. Synthetic & Mock Data Mandate

All data used for testing, demonstrations, and live hackathon evaluations must be synthetic:

- **Synthetic User Profiles**: Anonymous or mock citizen personas (e.g. `Citizen #1042`, `Priya Sharma (Demo User)`).
- **Synthetic Complaint Data**: Simulated civic issues (potholes, garbage, water leaks) created for demonstration purposes.
- **Synthetic Municipal Departments**: Mock department entries representing municipal entities (e.g., *Pune Municipal Corporation - Road Works*).
- **Simulated Government Responses**: Official responses and status updates are generated via the Mock Government Action Bar and tagged as `source: GOVERNMENT`.

---

## 3. Technical Security Implementations

### A. Server-Side OpenAI API Key Isolation
- `OPENAI_API_KEY` must **ONLY** exist in server-side environment variables (`.env.local` / Vercel Environment Variables).
- All calls to OpenAI are proxied through Next.js Server Actions or Server-side API routes (`/api/ai/*`). API keys must **NEVER** be exposed in client-side bundles or network calls.

### B. Input Sanitization & XSS Protection
- All user text inputs (descriptions, titles, comments) are sanitized on the server before database insertion using DOMPurify / Zod string stripping.
- HTML content is rendered using React's safe JSX escaping.

### C. SQL & Spatial Injection Protection
- All database queries use parameterized SQL via Supabase JS Client or Prisma ORM. Raw string concatenation in PostGIS spatial queries is strictly prohibited.

### D. File Upload Restrictions
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`.
- Maximum file size: **5 MB** per image.
- Image uploads are stored in public Supabase Storage buckets with randomized UUID filenames to prevent file traversal attacks.

### E. Rate Limiting
- Public API routes (`/api/complaints`, `/api/ai/*`) implement rate limiting via Upstash / Vercel KV or in-memory token bucket middleware to prevent denial of service and API abuse.

---

## 4. UI Disclosures & Honesty Banner

Every page footer and main modal MUST display the following clear disclosure banner:

> ℹ️ **Demonstration Disclosure**: Civic Pulse is an open-source civic technology hackathon demonstration. All government departments, status transitions, and official updates are simulated for demonstration purposes. This app is not an official municipal service portal.
