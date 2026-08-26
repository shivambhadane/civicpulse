# 02 — MVP Scope & Feature Boundaries

To ensure rapid execution and deliver a fully functional, high-quality demonstration for the hackathon, **Civic Pulse** strictly defines feature priorities into P0 (Must Build), P1 (Nice to Have), and P2 (Out of Scope).

---

## 🟢 P0 — Core MVP (Must Build)

These features constitute the core product requirement for the hackathon version:

1. **Interactive Map Interface**:
   - Full-screen Mapbox GL map with custom color-coded pins for issue categories and status badges.
   - Interactive clustering for high-density areas.
   - User geolocation button and manual location selection pin.

2. **Issue Reporting Flow (Wizard)**:
   - Location selector (map click, GPS, address search).
   - Problem description input (text).
   - Photo attachment preview.
   - Category picker (with AI pre-selection).

3. **AI Assistance Engine (OpenAI)**:
   - Automatic category classification and severity rating (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
   - AI department recommendation with confidence score and reasoning.
   - Advisory review screen allowing user overrides.

4. **Geospatial Duplicate & Nearby Complaint Check**:
   - Automated check for complaints within a 300m radius of the selected location.
   - "Is this your issue?" prompt displaying nearby matching complaints.
   - "Support Existing Complaint" one-click action ("I'm affected too").

5. **Complaint Detail & Activity Page**:
   - Full complaint overview with location map, photos, severity badge, and supporter count.
   - Chronological status timeline tracking state changes (`SUBMITTED` → `UNDER_REVIEW` → `IN_PROGRESS` → `RESOLVED`).
   - Supporter counter and list.

6. **Hotspot Detection & Visualization**:
   - Automated grouping of high-density/high-severity complaints into Hotspots.
   - Map overlay for active hotspots.

7. **Search & Filter Drawer**:
   - Filter complaints by status (Open, In Progress, Resolved), category, and severity.
   - Address/locality search autocomplete.

8. **Mock Government Official Dashboard / Action Bar**:
   - Admin/Official toggle to simulate status updates (e.g. mark as `IN_PROGRESS`, add official comment, attach resolution photo).

9. **Responsive UI/UX**:
   - Mobile-first, sleek dark/light theme, high-contrast markers, modern typography and micro-animations.

---

## 🟡 P1 — Next Priority (Build Only If Time Allows)

1. **In-App Notification Drawer**: Toast notifications when a supported complaint changes status.
2. **Issue Follow / Bookmark**: Ability to save complaints to personal tracking drawer.
3. **Community Evidence Addition**: Allowing other citizens to attach additional photos to an open complaint.
4. **AI Hotspot Summary**: AI-generated summary paragraph of hotspot trends in a ward/zone.
5. **Voice Input**: Web Speech API for voice-to-text description input.

---

## 🔴 P2 — Strict Out of Scope (Do NOT Build)

The AI Coding Assistant (Antigravity) must **NEVER** attempt to build or integrate the following features for the MVP:

- ❌ Real Government API Integrations (CPGRAMS, BBMP, BMC, PMC, etc.)
- ❌ Aadhaar / PAN / Government Identity Verification
- ❌ Real SMS Gateway / Real Phone OTP verification
- ❌ Real Payment Gateway integrations
- ❌ Real Citizen Personal Identifiable Information (PII) harvesting
- ❌ Production WhatsApp / Telegram Bot Infrastructure
- ❌ Enterprise Government ERP systems
- ❌ Scraping protected government portals or undocumented government endpoints
