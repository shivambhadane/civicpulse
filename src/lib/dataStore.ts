import { Complaint, Hotspot, ComplaintStatus, UpdateSource, NearbyComplaintMatch } from '@/types/database';
import { INITIAL_COMPLAINTS, INITIAL_HOTSPOTS, INITIAL_CATEGORIES, INITIAL_DEPARTMENTS } from './mockData';

const COMPLAINTS_KEY = 'civicpulse_complaints_v1';
const HOTSPOTS_KEY = 'civicpulse_hotspots_v1';
const USER_SUPPORTED_KEY = 'civicpulse_user_supported_v1';
const USER_ID_KEY = 'civicpulse_anonymous_user_id';

// Helper to get or generate anonymous persistent user ID
export function getOrCreateUserId(): string {
  if (typeof window === 'undefined') return 'synthetic-user-0000';
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = `synthetic-user-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}

export function getStoredComplaints(): Complaint[] {
  if (typeof window === 'undefined') return INITIAL_COMPLAINTS;
  const stored = localStorage.getItem(COMPLAINTS_KEY);
  if (!stored) {
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(INITIAL_COMPLAINTS));
    return INITIAL_COMPLAINTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_COMPLAINTS;
  }
}

export function saveComplaints(complaints: Complaint[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
}

export function getStoredHotspots(): Hotspot[] {
  if (typeof window === 'undefined') return INITIAL_HOTSPOTS;
  const stored = localStorage.getItem(HOTSPOTS_KEY);
  if (!stored) {
    localStorage.setItem(HOTSPOTS_KEY, JSON.stringify(INITIAL_HOTSPOTS));
    return INITIAL_HOTSPOTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_HOTSPOTS;
  }
}

export function saveHotspots(hotspots: Hotspot[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(HOTSPOTS_KEY, JSON.stringify(hotspots));
}

export function getSupportedComplaintIds(): string[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(USER_SUPPORTED_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function supportComplaintInStore(complaintId: string): Complaint | null {
  const complaints = getStoredComplaints();
  const index = complaints.findIndex(c => c.id === complaintId);
  if (index === -1) return null;

  const supported = getSupportedComplaintIds();
  if (!supported.includes(complaintId)) {
    supported.push(complaintId);
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_SUPPORTED_KEY, JSON.stringify(supported));
    }
  }

  complaints[index].supporters_count = (complaints[index].supporters_count || 0) + 1;
  complaints[index].updated_at = new Date().toISOString();

  const newUpdate = {
    id: `upd-sup-${Date.now()}`,
    complaint_id: complaintId,
    user_id: getOrCreateUserId(),
    status: complaints[index].status,
    message: `A neighborhood resident supported this issue ("I'm affected too"). Total supporters: ${complaints[index].supporters_count}.`,
    source: 'CITIZEN' as UpdateSource,
    created_at: new Date().toISOString(),
  };

  complaints[index].updates = [newUpdate, ...(complaints[index].updates || [])];

  saveComplaints(complaints);
  checkAndUpdateHotspots(complaints);
  return complaints[index];
}

export function addComplaintToStore(newComplaint: Partial<Complaint>): Complaint {
  const complaints = getStoredComplaints();
  const category = INITIAL_CATEGORIES.find(c => c.id === newComplaint.category_id || c.slug === newComplaint.ai_category) || INITIAL_CATEGORIES[0];
  const department = INITIAL_DEPARTMENTS.find(d => d.id === newComplaint.department_id) || INITIAL_DEPARTMENTS[0];

  const fullComplaint: Complaint = {
    id: `cmp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    user_id: getOrCreateUserId(),
    category_id: category.id,
    department_id: department.id,
    title: newComplaint.title || 'Civic Issue Report',
    description: newComplaint.description || '',
    latitude: newComplaint.latitude || 18.5204,
    longitude: newComplaint.longitude || 73.8567,
    location_name: newComplaint.location_name || 'Pune, Maharashtra',
    severity: newComplaint.severity || 'MEDIUM',
    status: 'SUBMITTED',
    ai_category: newComplaint.ai_category || category.name,
    ai_department: newComplaint.ai_department || department.name,
    ai_confidence: newComplaint.ai_confidence || 0.90,
    image_urls: newComplaint.image_urls || [],
    supporters_count: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category,
    department,
    updates: [
      {
        id: `upd-init-${Date.now()}`,
        complaint_id: `cmp-${Date.now()}`,
        status: 'SUBMITTED',
        message: 'Complaint submitted by citizen.',
        source: 'CITIZEN',
        created_at: new Date().toISOString(),
      },
      {
        id: `upd-ai-${Date.now()}`,
        complaint_id: `cmp-${Date.now()}`,
        status: 'UNDER_REVIEW',
        message: `AI classified issue as ${newComplaint.severity || 'MEDIUM'} severity and routed to ${department.name}.`,
        source: 'AI',
        created_at: new Date().toISOString(),
      },
    ],
  };

  const updatedComplaints = [fullComplaint, ...complaints];
  saveComplaints(updatedComplaints);
  checkAndUpdateHotspots(updatedComplaints);
  return fullComplaint;
}

export function updateComplaintStatusInStore(
  complaintId: string, 
  newStatus: ComplaintStatus, 
  officialMessage: string, 
  resolutionImageUrl?: string
): Complaint | null {
  const complaints = getStoredComplaints();
  const index = complaints.findIndex(c => c.id === complaintId);
  if (index === -1) return null;

  complaints[index].status = newStatus;
  complaints[index].updated_at = new Date().toISOString();

  const newUpdate = {
    id: `upd-gov-${Date.now()}`,
    complaint_id: complaintId,
    user_id: 'official-gov-001',
    status: newStatus,
    message: officialMessage || `Municipal status updated to ${newStatus}.`,
    image_url: resolutionImageUrl || undefined,
    source: 'GOVERNMENT' as UpdateSource,
    created_at: new Date().toISOString(),
  };

  complaints[index].updates = [newUpdate, ...(complaints[index].updates || [])];

  saveComplaints(complaints);
  checkAndUpdateHotspots(complaints);
  return complaints[index];
}

// Distance calculation formula (Haversine in meters)
export function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function findNearbyComplaintsFromStore(lat: number, lng: number, radiusMeters: number = 300): NearbyComplaintMatch[] {
  const complaints = getStoredComplaints();
  const active = complaints.filter(c => c.status !== 'RESOLVED' && c.status !== 'REJECTED');

  return active
    .map(c => {
      const distance = getDistanceMeters(lat, lng, c.latitude, c.longitude);
      return {
        id: c.id,
        title: c.title,
        description: c.description,
        latitude: c.latitude,
        longitude: c.longitude,
        location_name: c.location_name,
        severity: c.severity,
        status: c.status,
        supporters_count: c.supporters_count,
        distance_meters: distance,
        image_urls: c.image_urls,
        created_at: c.created_at,
      };
    })
    .filter(c => c.distance_meters <= radiusMeters)
    .sort((a, b) => a.distance_meters - b.distance_meters);
}

function checkAndUpdateHotspots(complaints: Complaint[]) {
  const activeComplaints = complaints.filter(c => c.status !== 'RESOLVED' && c.status !== 'REJECTED');
  const hotspots = getStoredHotspots();

  for (let i = 0; i < activeComplaints.length; i++) {
    const c1 = activeComplaints[i];
    const neighbors = activeComplaints.filter(c2 => getDistanceMeters(c1.latitude, c1.longitude, c2.latitude, c2.longitude) <= 300);
    const totalSupporters = neighbors.reduce((acc, curr) => acc + (curr.supporters_count || 1), 0);

    if (neighbors.length >= 3 || totalSupporters >= 15) {
      const avgLat = neighbors.reduce((sum, n) => sum + n.latitude, 0) / neighbors.length;
      const avgLng = neighbors.reduce((sum, n) => sum + n.longitude, 0) / neighbors.length;

      const existingHsIndex = hotspots.findIndex(h => getDistanceMeters(avgLat, avgLng, h.center_latitude, h.center_longitude) <= 350);

      if (existingHsIndex >= 0) {
        hotspots[existingHsIndex].complaint_count = neighbors.length;
        hotspots[existingHsIndex].severity_score = neighbors.length * 2.5 + totalSupporters * 0.2;
        hotspots[existingHsIndex].updated_at = new Date().toISOString();
      } else {
        const newHotspot: Hotspot = {
          id: `hs-${Date.now()}-${i}`,
          title: `High Density Cluster (${c1.category?.name || 'Civic Issues'})`,
          category_id: c1.category_id,
          department_id: c1.department_id,
          center_latitude: avgLat,
          center_longitude: avgLng,
          radius_meters: 300,
          complaint_count: neighbors.length,
          severity_score: neighbors.length * 2.5 + totalSupporters * 0.2,
          status: 'ACTIVE',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          category: c1.category,
          department: c1.department,
        };
        hotspots.unshift(newHotspot);
      }
    }
  }

  saveHotspots(hotspots);
}
