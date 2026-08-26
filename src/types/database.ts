export type UserRole = 'CITIZEN' | 'OFFICIAL' | 'ADMIN';
export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ComplaintStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
export type UpdateSource = 'CITIZEN' | 'GOVERNMENT' | 'SYSTEM' | 'AI';
export type HotspotStatus = 'ACTIVE' | 'ADDRESSING' | 'RESOLVED';

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon_name: string;
  description?: string | null;
  default_department_id?: string | null;
  created_at: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  contact_email?: string | null;
  jurisdiction_bounds?: Record<string, unknown> | null;
  created_at: string;
}

export interface Complaint {
  id: string;
  user_id?: string | null;
  category_id?: string | null;
  department_id?: string | null;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  location_name: string;
  severity: SeverityLevel;
  status: ComplaintStatus;
  ai_category?: string | null;
  ai_department?: string | null;
  ai_confidence?: number | null;
  image_urls: string[];
  embedding?: number[] | null;
  supporters_count: number;
  created_at: string;
  updated_at: string;
  // Expanded relations
  category?: Category | null;
  department?: Department | null;
  updates?: ComplaintUpdate[];
}

export interface ComplaintSupporter {
  id: string;
  complaint_id: string;
  user_id: string;
  created_at: string;
}

export interface ComplaintUpdate {
  id: string;
  complaint_id: string;
  user_id?: string | null;
  status: ComplaintStatus;
  message: string;
  image_url?: string | null;
  source: UpdateSource;
  created_at: string;
}

export interface ComplaintEvidence {
  id: string;
  complaint_id: string;
  user_id?: string | null;
  image_url: string;
  description?: string | null;
  source: UpdateSource;
  created_at: string;
}

export interface Hotspot {
  id: string;
  title: string;
  category_id?: string | null;
  department_id?: string | null;
  center_latitude: number;
  center_longitude: number;
  radius_meters: number;
  complaint_count: number;
  severity_score: number;
  status: HotspotStatus;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  department?: Department | null;
}

export interface NearbyComplaintMatch {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  location_name: string;
  severity: SeverityLevel;
  status: ComplaintStatus;
  supporters_count: number;
  distance_meters: number;
  similarity_score?: number;
  image_urls: string[];
  created_at: string;
}
