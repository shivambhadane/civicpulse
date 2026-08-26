# 08 — AI Architecture & Safety Rules

AI in **Civic Pulse** acts strictly as an **advisory assistant** to streamline issue submission, categorize complaints accurately, suggest municipal routing, and detect duplicate reports.

---

## 1. AI Processing Pipelines

### Pipeline 1: Issue Classification & Severity Assessment
- **Inputs**: User description text + optional photo asset.
- **Model**: OpenAI `gpt-4o` (or `gpt-4o-mini`) using Structured Outputs (`response_format: json_schema`).
- **Prompt Specification**:
  ```text
  You are an expert urban infrastructure classification AI for Indian municipalities.
  Analyze the provided issue description and image (if available).
  Return JSON matching the schema:
  - category_slug: String (one of: roads-traffic, sanitation-garbage, water-drainage, electricity-lighting, public-safety)
  - severity: String (one of: LOW, MEDIUM, HIGH, CRITICAL)
  - summary: String (concise, 1-sentence title summary)
  - tags: Array of strings
  ```
- **Output Schema**:
  ```json
  {
    "category_slug": "water-drainage",
    "severity": "HIGH",
    "summary": "Major water pipe leak causing street flooding",
    "tags": ["water leak", "drainage", "flooding"]
  }
  ```

---

### Pipeline 2: Department Recommendation & Routing
- **Inputs**: Issue category + text description + location neighborhood + municipal department registry.
- **Model**: OpenAI Structured JSON.
- **Logic**: Matches the problem domain to municipal departments (e.g. Pune Municipal Corporation / BBMP department structure).
- **Output Schema**:
  ```json
  {
    "department_code": "PMC_WATER_WORKS",
    "department_name": "Water Supply & Maintenance Department",
    "confidence_score": 0.95,
    "reasoning": "The issue involves a high-pressure main water pipe leak, which falls under Water Supply & Maintenance."
  }
  ```

---

### Pipeline 3: Hybrid Duplicate & Similar Issue Detection

To prevent duplicate complaints, Civic Pulse employs a **2-stage hybrid pipeline** combining PostGIS spatial filtering with semantic embedding matching:

```
Step 1: Spatial Filter (PostGIS)
   └─ Query complaints within 300 meters radius of submitted lat/lng.
         │
Step 2: Semantic Vector Match (pgvector / OpenAI Embeddings)
   └─ Generate embedding for candidate description using `text-embedding-3-small`.
   └─ Compute cosine similarity score against nearby complaints.
         │
Step 3: Threshold Evaluation
   └─ If similarity >= 0.75: Present top 3 matches to user:
      "Is your problem one of these existing complaints?"
```

> ⚠️ **Rule**: GPT alone does NOT decide duplicates. High spatial proximity combined with high vector similarity presents candidate matches to the **citizen** for final human confirmation.

---

## 2. AI Safety Principles & Guardrails

1. **Advisory Only**: AI suggestions (`category`, `severity`, `department`) are displayed on an interactive review screen prior to final submission. The user can override any AI decision.
2. **No Autonomous State Changes**: AI never changes complaint status (e.g., cannot mark as `RESOLVED`).
3. **No Fake Authority**: AI responses must NEVER claim or imply official government endorsement or verification.
4. **Data Privacy Safeguards**: Prompts must strip potential personal identifiers (phone numbers, full names) before sending payload to OpenAI APIs.
5. **Server-Side Validation**: All AI JSON payloads are validated using **Zod schemas** on the server. If an OpenAI call fails or returns malformed JSON, the application gracefully falls back to default manual selection.
