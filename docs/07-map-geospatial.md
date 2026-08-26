# 07 — Map & Geospatial Specifications

This document governs the map component, Mapbox integration, PostGIS spatial queries, clustering logic, and geospatial layers for **Civic Pulse**.

---

## 1. Spatial Technology Stack

- **Map Rendering**: Mapbox GL JS (`react-map-gl` wrapper).
- **Map Style**: Dark / Custom High-Contrast Vector map style tailored for urban visibility.
- **Geographic Database**: Supabase PostgreSQL + **PostGIS** extension.
- **Spatial Reference System**: WGS 84 (`SRID 4326`).

---

## 2. Core Spatial Operations & PostGIS Queries

### A. Find Complaints Within Radius (e.g. 300m for Duplicate Check)
```sql
SELECT 
    id, 
    title, 
    description, 
    latitude, 
    longitude, 
    severity, 
    status,
    ST_Distance(
        location_geometry, 
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
    ) AS distance_meters
FROM complaints
WHERE ST_DWithin(
    location_geometry::geography, 
    ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, 
    $3 -- radius in meters (e.g., 300)
)
AND status != 'RESOLVED'
ORDER BY distance_meters ASC;
```

### B. Hotspot Cluster Area Query
```sql
SELECT 
    ST_Centroid(ST_Collect(location_geometry)) AS center_point,
    COUNT(*) AS total_complaints,
    SUM(CASE WHEN severity = 'CRITICAL' THEN 3 WHEN severity = 'HIGH' THEN 2 ELSE 1 END) AS severity_score
FROM complaints
WHERE status IN ('SUBMITTED', 'UNDER_REVIEW', 'IN_PROGRESS')
GROUP BY ST_SnapToGrid(location_geometry, 0.003); -- Approx ~300m grid cell
```

---

## 3. Map Layers Hierarchy

The Mapbox map MUST render layers in the following z-index stack order:

1. **Base Tile Layer**: Mapbox Streets / Custom Dark style background.
2. **Hotspot Polygon Layer**: Semi-transparent red/orange pulse circles representing high-density issue hotspots (`radius_meters` scaled).
3. **Complaint Cluster Layer**: Numeric badges aggregating pins at low zoom levels (<14).
4. **Complaint Pins (Unclustered Points)**: Custom SVG markers color-coded by category icon and status rim:
   - 🔴 **Red**: `CRITICAL` / `HIGH` Severity
   - 🟠 **Orange**: `MEDIUM` Severity
   - 🟡 **Yellow**: `LOW` Severity
   - 🟢 **Green**: `RESOLVED`
5. **Selected Pin Highlight**: Enlarged marker with pulsating aura.
6. **User Location Marker**: Blue GPS dot displaying citizen's current coordinates.

---

## 4. Location Picker & Geocoding

- **Address Search**: Integrated Mapbox Geocoding Search input allowing users to type localities (e.g., *"Kothrud, Pune"*, *"Indiranagar, Bengaluru"*).
- **Reverse Geocoding**: When a user drags the map pin during issue reporting, automatically call Mapbox Reverse Geocoding API to resolve `lat`/`lng` into a human-readable address (`location_name`).
