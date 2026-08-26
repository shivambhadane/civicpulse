# Backend & Database Rules — Civic Pulse

## API Standards
1. **Next.js App Router**: Route handlers belong in `app/api/...`. Use Server Actions for form submissions and mutations.
2. **Schema Validation**: Use **Zod** schemas to strictly validate all incoming request bodies and OpenAI structured outputs.
3. **Database Client**: Use Supabase JS Client (`@supabase/supabase-js` or `@supabase/ssr`).
4. **Spatial Database Operations**: Always use parameterized spatial SQL queries to avoid SQL injection.
5. **Error Handling**: Return consistent JSON responses `{ success: boolean, data?: any, error?: string }` with proper HTTP status codes (`400`, `401`, `404`, `500`).
