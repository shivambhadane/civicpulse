# Security Rules — Civic Pulse

## Security & Safety Mandates
1. **No Secrets in Client Bundles**: Environment variables prefixed with `NEXT_PUBLIC_` must contain only safe public keys (e.g. Mapbox token, Supabase Anon key). `OPENAI_API_KEY` and Supabase Service Role keys must stay private to the server.
2. **Synthetic Data Integrity**: All government updates and official responses must be generated via synthetic admin controls and explicitly tagged with `source: GOVERNMENT`.
3. **No Real PII**: Never prompt for or store real Aadhaar, PAN, phone numbers, or credit card details.
4. **Disclosures**: Maintain clear UI disclosures indicating that government integrations are simulated for hackathon demonstration.
