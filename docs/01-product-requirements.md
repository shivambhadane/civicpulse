# 01 — Product Requirements Document (PRD)

## 1. Problem Statement

Urban civic infrastructure management in Indian cities faces major challenges across grievance submission, tracking, and prioritization:

- **Fragmented Grievance Systems**: Citizens must navigate multiple disconnected municipal portals (CPGRAMS, local municipal apps like BBMP Sahaaya, BMC 1916, PMC, etc.), leading to confusion and low adoption.
- **Black-Hole Tracking**: Once a complaint is filed, citizens receive minimal or cryptic updates, creating distrust and frustration.
- **High Duplicate Noise**: Multiple residents report the exact same pothole or broken pipe independently because there is no shared geographic view of existing reports.
- **Lack of Geographic Context**: Traditional portals treat complaints as isolated text tickets rather than spatial problems tied to specific coordinates, neighborhoods, or transit corridors.
- **Individual vs Collective Voice**: Isolated complaints are easily ignored, whereas aggregated community support (e.g., 50 residents affected by the same sewage leak) is not captured.

---

## 2. Product Vision & Solution

**Civic Pulse** provides a single, map-centric civic platform where citizens can discover, report, and track local civic issues in real time. 

Key pillars of the solution:
1. **Interactive Map-First Interface**: View all active civic issues in your neighborhood on an interactive map.
2. **AI-Powered Assistance**: Automatic issue classification, severity assessment, and intelligent department routing from plain language descriptions and photos.
3. **Smart Duplicate & Nearby Issue Detection**: When a citizen attempts to file an issue, the platform highlights existing nearby reports, encouraging them to support existing complaints instead of duplicating.
4. **Community Support & Hotspot Detection**: High-density issue clusters automatically elevate to "Hotspot" status, drawing urgent municipal attention.
5. **Transparent Status Timeline**: Step-by-step progress tracking with distinct tagging for citizen reports, AI analysis, system triggers, and government resolution evidence.

---

## 3. Target User Personas

### Primary Persona: Indian Citizen (Mobile/Desktop Web User)
- **Goal**: Quickly report a civic issue on the go, check if it's already reported, support existing neighborhood issues, and track progress until fixed.
- **Key Needs**: Ultra-simple reporting (< 1 minute), automatic location detection, visual status updates, instant feedback.

### Secondary Persona: Municipal Department Official (Mocked for Hackathon / MVP)
- **Goal**: View categorized, geographically grouped civic complaints routed to their department (e.g., Road & Traffic, Sanitation, Water Works, Electricity).
- **Key Needs**: Filter by severity and hotspot status, update complaint status, upload resolution proof photos.

---

## 4. Foundational Product Principles

1. **AI Assists, Human Decides**: AI is advisory. It suggests categories, severity, and departments, but citizens can review and override choices before submission. AI never makes irreversible state decisions.
2. **Strict Data Source Distinction**: Information provided by citizens (`source: CITIZEN`) must be visually and structurally distinguished from official government updates (`source: GOVERNMENT`) and AI inferences (`source: AI`).
3. **Map-First Experience**: Location is the primary filter and context for every complaint.
4. **Community Collaboration Over Redundancy**: Upvoting/supporting an existing complaint carries equal weight to creating a new complaint, reducing ticket clutter while highlighting problem scale.
5. **Radical Transparency & Disclosures**: Because government backend integrations are simulated for the MVP, all government responses are clearly labeled as synthetic demo actions.
