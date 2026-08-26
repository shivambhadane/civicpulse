'use client';

import React, { useState, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { Complaint, Hotspot } from '@/types/database';
import {
  Car,
  Trash2,
  Droplets,
  Zap,
  ShieldAlert,
  Users,
  ArrowRight,
  Flame,
  MapPin,
  AlertTriangle,
} from 'lucide-react';

interface GoogleMapViewProps {
  complaints: Complaint[];
  hotspots: Hotspot[];
  selectedCategory: string;
  selectedStatus: string;
  showHotspots: boolean;
  onSelectComplaint: (complaint: Complaint) => void;
  onSelectHotspot: (hotspot: Hotspot) => void;
  centerCoordinate?: { lat: number; lng: number };
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'roads-traffic': <Car className="w-4 h-4" />,
  'sanitation-garbage': <Trash2 className="w-4 h-4" />,
  'water-drainage': <Droplets className="w-4 h-4" />,
  'electricity-lighting': <Zap className="w-4 h-4" />,
  'public-safety': <ShieldAlert className="w-4 h-4" />,
};

// Helper component to handle camera movement when centerCoordinate changes
function MapCameraController({ center }: { center?: { lat: number; lng: number } }) {
  const map = useMap();

  useEffect(() => {
    if (map && center) {
      map.panTo({ lat: center.lat, lng: center.lng });
      map.setZoom(14);
    }
  }, [map, center]);

  return null;
}

export default function GoogleMapView({
  complaints,
  hotspots,
  showHotspots,
  onSelectComplaint,
  onSelectHotspot,
  centerCoordinate,
}: GoogleMapViewProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const [activePopup, setActivePopup] = useState<Complaint | null>(null);

  // Mandatory Requirement 1: If API key is missing or empty, render clear configuration warning state
  if (!apiKey || apiKey.trim() === '') {
    return (
      <div className="relative w-full h-[calc(100vh-110px)] flex flex-col items-center justify-center p-6 bg-slate-950 text-slate-100 text-center">
        <div className="glass-panel p-8 rounded-3xl max-w-lg border border-amber-500/40 shadow-2xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold font-display text-white">Google Maps API Key Missing</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The environment variable <code className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300 font-mono">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> is not configured.
          </p>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 text-left font-mono space-y-1">
            <p className="text-slate-300 font-bold">To activate Google Maps:</p>
            <p>1. Create <code className="text-cyan-400">.env.local</code> in project root</p>
            <p>2. Add: <code className="text-cyan-400">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here</code></p>
            <p>3. Restart dev server: <code className="text-cyan-400">npm run dev</code></p>
          </div>
        </div>
      </div>
    );
  }

  const getMarkerColors = (c: Complaint) => {
    if (c.status === 'RESOLVED') {
      return { bg: 'bg-emerald-600', border: 'border-emerald-400', glow: 'shadow-emerald-500/50' };
    }
    switch (c.severity) {
      case 'CRITICAL':
        return { bg: 'bg-rose-600', border: 'border-rose-400', glow: 'shadow-rose-500/50' };
      case 'HIGH':
        return { bg: 'bg-orange-600', border: 'border-orange-400', glow: 'shadow-orange-500/50' };
      case 'MEDIUM':
        return { bg: 'bg-amber-600', border: 'border-amber-400', glow: 'shadow-amber-500/50' };
      case 'LOW':
      default:
        return { bg: 'bg-blue-600', border: 'border-blue-400', glow: 'shadow-blue-500/50' };
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-110px)] overflow-hidden bg-slate-950">
      <APIProvider apiKey={apiKey}>
        <Map
          mapId="DEMO_MAP_ID"
          defaultCenter={{
            lat: centerCoordinate?.lat || 18.5204,
            lng: centerCoordinate?.lng || 73.8567,
          }}
          defaultZoom={13}
          colorScheme="DARK"
          gestureHandling="greedy"
          disableDefaultUI={false}
          zoomControl={true}
          style={{ width: '100%', height: '100%' }}
        >
          <MapCameraController center={centerCoordinate} />

          {/* Hotspot Radial Pulse Overlays */}
          {showHotspots &&
            hotspots.map((hs) => (
              <AdvancedMarker
                key={hs.id}
                position={{ lat: hs.center_latitude, lng: hs.center_longitude }}
                onClick={() => onSelectHotspot(hs)}
              >
                <div className="relative group cursor-pointer flex items-center justify-center">
                  <div className="absolute w-24 h-24 rounded-full bg-rose-500/20 border-2 border-rose-500/40 animate-pulse-ring pointer-events-none" />
                  <div className="relative flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-950/90 border border-rose-500/60 text-rose-200 text-[10px] font-bold shadow-xl shadow-rose-950/80 hover:scale-110 transition-transform">
                    <Flame className="w-3 h-3 text-rose-400 animate-pulse" />
                    <span>HOTSPOT ({hs.complaint_count})</span>
                  </div>
                </div>
              </AdvancedMarker>
            ))}

          {/* Complaint Custom Markers */}
          {complaints.map((complaint) => {
            const colors = getMarkerColors(complaint);
            const iconKey = complaint.category?.slug || 'roads-traffic';

            return (
              <AdvancedMarker
                key={complaint.id}
                position={{ lat: complaint.latitude, lng: complaint.longitude }}
                onClick={() => setActivePopup(complaint)}
              >
                <div className="relative group cursor-pointer flex flex-col items-center">
                  {complaint.supporters_count > 1 && (
                    <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-slate-900 text-cyan-400 text-[10px] font-bold border border-cyan-500/40 shadow-lg z-10">
                      +{complaint.supporters_count}
                    </span>
                  )}

                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white ${colors.bg} border-2 ${colors.border} shadow-lg ${colors.glow} group-hover:scale-125 transition-transform duration-200`}
                  >
                    {CATEGORY_ICONS[iconKey] || <MapPin className="w-4 h-4" />}
                  </div>

                  <div className={`w-2 h-2 rotate-45 -mt-1 ${colors.bg}`} />
                </div>
              </AdvancedMarker>
            );
          })}

          {/* Selected Complaint Popup Preview */}
          {activePopup && (
            <InfoWindow
              position={{ lat: activePopup.latitude, lng: activePopup.longitude }}
              onCloseClick={() => setActivePopup(null)}
              headerDisabled={true}
            >
              <div className="glass-panel rounded-2xl p-3.5 max-w-xs text-slate-100 shadow-2xl border border-slate-700/80">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                    {activePopup.category?.name || 'Civic Grievance'}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      activePopup.status === 'RESOLVED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : activePopup.status === 'IN_PROGRESS'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {activePopup.status.replace('_', ' ')}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white mb-1 line-clamp-2">{activePopup.title}</h4>

                <p className="text-[11px] text-slate-400 mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span className="truncate">{activePopup.location_name}</span>
                </p>

                <div className="flex items-center justify-between border-t border-slate-800 pt-2 mt-2">
                  <div className="flex items-center gap-1 text-[11px] text-cyan-300 font-medium">
                    <Users className="w-3 h-3" />
                    <span>{activePopup.supporters_count} affected</span>
                  </div>
                  <button
                    onClick={() => {
                      onSelectComplaint(activePopup);
                      setActivePopup(null);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
}
