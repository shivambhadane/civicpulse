-- Enable PostGIS & Vector extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table DDLs
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'CITIZEN' CHECK (role IN ('CITIZEN', 'OFFICIAL', 'ADMIN')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon_name TEXT NOT NULL,
    description TEXT,
    default_department_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    code TEXT UNIQUE NOT NULL,
    contact_email TEXT,
    jurisdiction_bounds GEOMETRY(Polygon, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Foreign Key reference from categories to default_department_id
ALTER TABLE categories 
ADD CONSTRAINT fk_categories_default_dept 
FOREIGN KEY (default_department_id) REFERENCES departments(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    category_id UUID REFERENCES categories(id),
    department_id UUID REFERENCES departments(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    location_geometry GEOMETRY(Point, 4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)) STORED,
    location_name TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    status TEXT NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'REJECTED')),
    ai_category TEXT,
    ai_department TEXT,
    ai_confidence DOUBLE PRECISION,
    image_urls TEXT[] DEFAULT '{}',
    embedding vector(1536),
    supporters_count INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS complaint_supporters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(complaint_id, user_id)
);

CREATE TABLE IF NOT EXISTS complaint_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    status TEXT NOT NULL CHECK (status IN ('SUBMITTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'REJECTED')),
    message TEXT NOT NULL,
    image_url TEXT,
    source TEXT NOT NULL CHECK (source IN ('CITIZEN', 'GOVERNMENT', 'SYSTEM', 'AI')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS complaint_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    image_url TEXT NOT NULL,
    description TEXT,
    source TEXT NOT NULL DEFAULT 'CITIZEN' CHECK (source IN ('CITIZEN', 'GOVERNMENT', 'SYSTEM', 'AI')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hotspots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category_id UUID REFERENCES categories(id),
    department_id UUID REFERENCES departments(id),
    center_latitude DOUBLE PRECISION NOT NULL,
    center_longitude DOUBLE PRECISION NOT NULL,
    center_geometry GEOMETRY(Point, 4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(center_longitude, center_latitude), 4326)) STORED,
    radius_meters DOUBLE PRECISION DEFAULT 300.0,
    complaint_count INTEGER DEFAULT 1,
    severity_score DOUBLE PRECISION DEFAULT 1.0,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ADDRESSING', 'RESOLVED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spatial & Vector Indexes
CREATE INDEX IF NOT EXISTS idx_complaints_location_geo ON complaints USING GIST (location_geometry);
CREATE INDEX IF NOT EXISTS idx_hotspots_center_geo ON hotspots USING GIST (center_geometry);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON complaints(category_id);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON complaints(created_at DESC);

-- SEED DATA: Departments
INSERT INTO departments (id, name, code, contact_email) VALUES
('d1111111-1111-1111-1111-111111111111', 'Roads & Traffic Department', 'PMC_ROADS', 'roads@pmc.gov.in'),
('d2222222-2222-2222-2222-222222222222', 'Solid Waste Management (Sanitation)', 'PMC_SANITATION', 'sanitation@pmc.gov.in'),
('d3333333-3333-3333-3333-333333333333', 'Water Supply & Sewerage Board', 'PMC_WATER', 'water@pmc.gov.in'),
('d4444444-4444-4444-4444-444444444444', 'Electrical & Street Lighting', 'PMC_ELECTRICAL', 'lights@pmc.gov.in'),
('d5555555-5555-5555-5555-555555555555', 'Public Safety & Infrastructure Enforcement', 'PMC_SAFETY', 'safety@pmc.gov.in')
ON CONFLICT (code) DO NOTHING;

-- SEED DATA: Categories
INSERT INTO categories (id, name, slug, icon_name, description, default_department_id) VALUES
('c1111111-1111-1111-1111-111111111111', 'Roads & Potholes', 'roads-traffic', 'Car', 'Potholes, broken asphalt, damaged footpaths, and dangerous road craters', 'd1111111-1111-1111-1111-111111111111'),
('c2222222-2222-2222-2222-222222222222', 'Garbage & Sanitation', 'sanitation-garbage', 'Trash2', 'Overflowing dumpsters, illegal dumping, uncollected household waste', 'd2222222-2222-2222-2222-222222222222'),
('c3333333-3333-3333-3333-333333333333', 'Water & Drainage Leakage', 'water-drainage', 'Droplets', 'Burst water pipes, clogged storm sewers, sewage leakage, street flooding', 'd3333333-3333-3333-3333-333333333333'),
('c4444444-4444-4444-4444-444444444444', 'Streetlights & Electricity', 'electricity-lighting', 'Zap', 'Broken streetlights, hanging power lines, unlit dark pedestrian passages', 'd4444444-4444-4444-4444-444444444444'),
('c5555555-5555-5555-5555-555555555555', 'Public Safety Hazards', 'public-safety', 'ShieldAlert', 'Uncovered manholes, fallen tree branches, hazardous construction debris', 'd5555555-5555-5555-5555-555555555555')
ON CONFLICT (slug) DO NOTHING;

-- SEED DATA: Demo Users
INSERT INTO users (id, email, full_name, role) VALUES
('u1111111-1111-1111-1111-111111111111', 'priya.sharma@demo.org', 'Priya Sharma', 'CITIZEN'),
('u2222222-2222-2222-2222-222222222222', 'rahul.deshmukh@demo.org', 'Rahul Deshmukh', 'CITIZEN'),
('u3333333-3333-3333-3333-333333333333', 'official.pmc@demo.org', 'Officer V. K. Kulkarni', 'OFFICIAL')
ON CONFLICT (email) DO NOTHING;

-- RPC FUNCTION: Find Nearby Complaints within Radius
CREATE OR REPLACE FUNCTION find_nearby_complaints(
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    radius_meters DOUBLE PRECISION DEFAULT 300.0
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    location_name TEXT,
    severity TEXT,
    status TEXT,
    supporters_count INT,
    distance_meters DOUBLE PRECISION,
    image_urls TEXT[],
    created_at TIMESTAMPTZ
)
LANGUAGE sql
AS $$
    SELECT 
        c.id, 
        c.title, 
        c.description, 
        c.latitude, 
        c.longitude, 
        c.location_name,
        c.severity, 
        c.status,
        c.supporters_count,
        ST_Distance(
            c.location_geometry::geography, 
            ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
        ) AS distance_meters,
        c.image_urls,
        c.created_at
    FROM complaints c
    WHERE ST_DWithin(
        c.location_geometry::geography, 
        ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography, 
        radius_meters
    )
    AND c.status != 'RESOLVED'
    ORDER BY distance_meters ASC;
$$;
