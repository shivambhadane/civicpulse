# 09 — UI & Screen Specifications

This document defines the 9 core user interface screens for **Civic Pulse**, specifying component structures, user interactions, data states, and mobile responsiveness.

---

## Screen 01: Landing & Interactive Map View

- **Purpose**: Main entry point displaying an interactive map of neighborhood civic issues, hotspots, and active filters.
- **Key Components**:
  - `MapboxView`: Full-screen interactive map with category pins and cluster badges.
  - `HeaderNav`: Brand logo, locality search bar, and "My Activity" drawer trigger.
  - `FilterBar`: Category chips (Roads, Garbage, Water, Lights) and status toggle (Open, Resolved).
  - `FloatingCTA`: Prominent "+ Report Issue" primary action button.
  - `ViewToggle`: Toggle between Map View and List View.
- **Mobile Behavior**: Search bar condenses into top sheet; Filter chips scroll horizontally.

---

## Screen 02: Report Issue Wizard

- **Purpose**: Step-by-step form for reporting a new civic issue.
- **Key Components**:
  - `StepProgress`: Visual step indicator (1. Location → 2. Details → 3. AI Review).
  - `PhotoUploader`: Drag-and-drop / mobile camera attachment preview.
  - `DescriptionTextarea`: Large input field with voice-to-text button.
- **Data Required**: Selected lat/lng, location address, text description, binary image file.

---

## Screen 03: Location Picker Modal

- **Purpose**: Precise coordinate selection.
- **Key Components**:
  - `InteractivePickerMap`: Draggable pin centered on screen crosshair.
  - `GPSButton`: "Use Current Location" button triggering browser Geolocation API.
  - `AddressAutocomplete`: Search box powered by Mapbox Geocoding.
- **User Action**: Citizen drags map pin to exact pothole/garbage dump coordinate and clicks "Confirm Location".

---

## Screen 04: AI Review & Customization Screen

- **Purpose**: Display AI categorization and department recommendation for citizen review.
- **Key Components**:
  - `AIInsightBadge`: "AI Processed" badge with confidence indicator.
  - `CategorySelector`: Auto-selected category dropdown with manual override.
  - `SeverityBadgePicker`: Color-coded severity toggle (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
  - `DepartmentCard`: Recommended department name, jurisdiction, and reasoning.
- **User Action**: Citizen reviews AI suggestions, makes any edits, and clicks "Continue".

---

## Screen 05: Existing / Nearby Issue Detection Screen

- **Purpose**: Highlight nearby active complaints to prevent duplicates.
- **Header Text**: *"Is this problem already reported near your location?"*
- **Key Components**:
  - `NearbyIssueCard`:
    - Photo preview
    - Title & location name (e.g. "Pothole on Station Road - 120m away")
    - Supporter count badge ("47 affected")
    - Current status badge ("Under Review")
    - Button: `[ I'm affected too ]`
  - `Divider`: "OR"
  - `CreateNewButton`: `[ Report a different problem ]`
- **User Action**: Click "I'm affected too" to upvote an existing report, OR click "Report a different problem" to proceed with a new creation.

---

## Screen 06: Complaint Detail & Timeline View

- **Purpose**: Comprehensive view of a single complaint's details, map location, supporters, and lifecycle history.
- **Key Components**:
  - `HeaderCard`: Title, severity pill, category icon, creation timestamp.
  - `MediaGallery`: Photo evidence slider.
  - `StatusTimeline`: Chronological step chart (`SUBMITTED` → `UNDER_REVIEW` → `IN_PROGRESS` → `RESOLVED`) with source badges (`CITIZEN`, `GOVERNMENT`, `AI`).
  - `SupportActionBar`: Supporter count display and "I'm affected too" action button.
  - `EvidenceSection`: List of community-uploaded photo proofs with "Add Evidence" modal.

---

## Screen 07: Hotspot Summary View Modal

- **Purpose**: Display aggregated details of a high-density civic issue cluster.
- **Key Components**:
  - `HotspotHeader`: Cluster title, total complaints count, affected citizen estimate.
  - `SeverityScoreBar`: Visual meter of aggregated severity.
  - `AssignedDepartmentCard`: Assigned municipal department and SLA target.
  - `GroupedComplaintsList`: Mini cards of complaints constituting the hotspot.

---

## Screen 08: My Activity Drawer

- **Purpose**: User's personal dashboard tracking reported complaints and supported issues.
- **Key Components**:
  - `Tabs`: "My Reports" | "Supported Issues".
  - `ActivityCard`: Quick status badge, latest update comment, and link to detail page.

---

## Screen 09: Mock Government Action Bar (Admin / Demo Tool)

- **Purpose**: Simulate municipal authority state changes for hackathon evaluation.
- **Key Components**:
  - `StatusDropdown`: Select target state (`IN_PROGRESS`, `RESOLVED`).
  - `OfficialCommentInput`: Textbox for official response message.
  - `ResolutionProofUpload`: File input for resolution photo proof.
  - `TriggerButton`: "Simulate Department Update".
