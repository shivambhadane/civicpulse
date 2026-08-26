# 06 — API Specification

This document details all Next.js API endpoints (`app/api/*`) for **Civic Pulse**, including request schemas, spatial parameters, AI routes, and response contracts.

---

## 1. Complaint Endpoints

### A. `POST /api/complaints`
- **Purpose**: Create a new civic complaint issue.
- **Authentication**: Optional for MVP (defaults to Anonymous/Synthetic User ID if unauthenticated).
- **Request Body**:
  ```json
  {
    "title": "Severe Pothole on Station Road",
    "description": "Deep hole near bus stop causing traffic backup and rim damage.",
    "latitude": 18.4575,
    "longitude": 73.8500,
    "location_name": "Station Road, Swargate, Pune",
    "category_id": "uuid-category-1",
    "image_urls": ["https://storage.supabase.co/pothole1.jpg"],
    "ai_category": "Roads & Maintenance",
    "ai_department": "Roads Department",
    "ai_confidence": 0.92
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "complaint-uuid-123",
      "status": "SUBMITTED",
      "supporters_count": 1,
      "created_at": "2026-08-26T23:00:00Z"
    }
  }
  ```

---

### B. `GET /api/complaints`
- **Purpose**: Query active complaints with optional spatial radius and category filtering.
- **Query Parameters**:
  - `lat` (number, optional): Center latitude.
  - `lng` (number, optional): Center longitude.
  - `radius` (number, optional): Search radius in meters (default 2000m).
  - `category_id` (string, optional): Filter by category.
  - `status` (string, optional): `SUBMITTED`, `IN_PROGRESS`, `RESOLVED`.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "count": 15,
    "data": [
      {
        "id": "complaint-uuid-123",
        "title": "Severe Pothole on Station Road",
        "latitude": 18.4575,
        "longitude": 73.8500,
        "severity": "HIGH",
        "status": "IN_PROGRESS",
        "supporters_count": 14
      }
    ]
  }
  ```

---

### C. `GET /api/complaints/:id`
- **Purpose**: Get detailed information for a single complaint, including full status timeline updates and supporter counts.
- **Response (200 OK)**: Returns full complaint object with embedded `updates` array and `supporters` count.

---

### D. `POST /api/complaints/:id/support`
- **Purpose**: Increment supporter count for an existing complaint ("I'm affected too").
- **Response (200 OK)**: Returns updated `supporters_count`.

---

### E. `GET /api/complaints/nearby`
- **Purpose**: Spatial radius query specifically for nearby duplicate detection prior to creating a new complaint.
- **Query Parameters**: `lat`, `lng`, `radius` (default `300`).
- **Response (200 OK)**: Array of nearby active complaints within radius.

---

## 2. AI Endpoints

### A. `POST /api/ai/classify`
- **Purpose**: Send issue description (and optional image URL) to OpenAI to extract category, severity rating, concise summary, and key tags.
- **Request Body**:
  ```json
  {
    "description": "Large garbage heap overflowing near street corner for 3 days",
    "image_url": "optional_image_url"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "category_slug": "sanitation-garbage",
      "severity": "HIGH",
      "summary": "Overflowing waste dumping near street corner",
      "tags": ["garbage", "sanitation", "public-health"]
    }
  }
  ```

---

### B. `POST /api/ai/similar`
- **Purpose**: Compare a candidate description against nearby complaints using embedding vector cosine similarity.
- **Request Body**:
  ```json
  {
    "description": "Garbage dump near Swargate corner",
    "nearby_complaint_ids": ["uuid-1", "uuid-2"]
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "has_similar": true,
    "matches": [
      {
        "complaint_id": "uuid-1",
        "similarity_score": 0.88,
        "reason": "Both complaints refer to overflowing garbage near Swargate corner."
      }
    ]
  }
  ```

---

### C. `POST /api/ai/route`
- **Purpose**: Recommend municipal department routing based on category, description, and location bounds.
- **Response (200 OK)**: Returns recommended department object, confidence score, and justification.

---

## 3. Hotspot & Reference Endpoints

### A. `GET /api/hotspots`
- **Purpose**: Fetch active hotspot cluster overlays for map rendering.

### B. `GET /api/categories` & `GET /api/departments`
- **Purpose**: Reference endpoints for UI dropdowns and filter panels.
