'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Compass,
  Plus,
  Minus,
  RotateCcw,
  Radio,
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

// Helper component to handle camera movement when centerCoordinate changes in Google Maps
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

/**
 * Dynamic Interactive Vector Canvas Map (Fallback & Enhanced Background Engine)
 * Renders an interactive, dynamic dark map simulation with vector grid, coordinates,
 * custom pin plotting, hotspot radial pulses, pan/zoom controls, and popups.
 */
function DynamicCanvasMapView({
  complaints,
  hotspots,
  showHotspots,
  onSelectComplaint,
  onSelectHotspot,
  centerCoordinate,
}: GoogleMapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mapCenter, setMapCenter] = useState({
    lat: centerCoordinate?.lat || 18.5204,
    lng: centerCoordinate?.lng || 73.8567,
  });
  const [zoomLevel, setZoomLevel] = useState(13);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activePopup, setActivePopup] = useState<Complaint | null>(null);

  // Update map center when prop changes
  useEffect(() => {
    if (centerCoordinate) {
      setMapCenter({ lat: centerCoordinate.lat, lng: centerCoordinate.lng });
    }
  }, [centerCoordinate]);

  // Convert Lat/Lng to pixel offsets relative to container center
  const coordToPixel = useMemo(() => {
    return (lat: number, lng: number) => {
      const scale = Math.pow(2, zoomLevel) * 80;
      const x = (lng - mapCenter.lng) * scale;
      const y = -(lat - mapCenter.lat) * scale;
      return { x, y };
    };
  }, [mapCenter, zoomLevel]);

  // Pan Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-popup') || (e.target as HTMLElement).closest('.map-control-btn')) {
      return;
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setDragStart({ x: e.clientX, y: e.clientY });

    const scale = Math.pow(2, zoomLevel) * 80;
    setMapCenter((prev) => ({
      lat: prev.lat + dy / scale,
      lng: prev.lng - dx / scale,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

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
        return { bg: 'bg-cyan-600', border: 'border-cyan-400', glow: 'shadow-cyan-500/50' };
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full h-full overflow-hidden bg-slate-950 select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* 1. Dynamic Vector Map Background SVG Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="gridPattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1" />
              <circle cx="0" cy="0" r="1.5" fill="rgba(56, 189, 248, 0.3)" />
            </pattern>
            <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(6, 182, 212, 0.15)" />
              <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridPattern)" />
          {/* Simulated River / Transport Arteries */}
          <path
            d="M -100 300 Q 400 100 800 500 T 1600 300"
            fill="none"
            stroke="rgba(14, 165, 233, 0.25)"
            strokeWidth="24"
            strokeLinecap="round"
          />
          <path
            d="M 200 -100 Q 500 400 900 900"
            fill="none"
            stroke="rgba(51, 65, 85, 0.5)"
            strokeWidth="8"
            strokeDasharray="8 6"
          />
        </svg>
      </div>

      {/* 2. Live Radar Scan Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-cyan-500/10 pointer-events-none animate-ping opacity-25" />

      {/* 3. Render Hotspot Radial Rings */}
      {showHotspots &&
        hotspots.map((hs) => {
          const { x, y } = coordToPixel(hs.center_latitude, hs.center_longitude);
          return (
            <div
              key={hs.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectHotspot(hs);
              }}
              style={{
                transform: `translate(calc(50vw + ${x}px - 50%), calc(50vh + ${y}px - 50%))`,
              }}
              className="absolute cursor-pointer group flex items-center justify-center pointer-events-auto"
            >
              <div className="absolute w-36 h-36 rounded-full bg-rose-500/20 border-2 border-rose-500/50 animate-pulse-ring pointer-events-none" />
              <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-950/90 border border-rose-500/70 text-rose-200 text-[11px] font-bold shadow-2xl shadow-rose-950 hover:scale-110 transition-transform">
                <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>HOTSPOT ({hs.complaint_count})</span>
              </div>
            </div>
          );
        })}

      {/* 4. Render Complaint Custom Markers */}
      {complaints.map((complaint) => {
        const { x, y } = coordToPixel(complaint.latitude, complaint.longitude);
        const colors = getMarkerColors(complaint);
        const iconKey = complaint.category?.slug || 'roads-traffic';

        return (
          <div
            key={complaint.id}
            onClick={(e) => {
              e.stopPropagation();
              setActivePopup(complaint);
            }}
            style={{
              transform: `translate(calc(50vw + ${x}px - 50%), calc(50vh + ${y}px - 50%))`,
            }}
            className="absolute cursor-pointer group pointer-events-auto"
          >
            <div className="relative flex flex-col items-center">
              {complaint.supporters_count > 1 && (
                <span className="absolute -top-2.5 -right-2.5 px-1.5 py-0.5 rounded-full bg-slate-900 text-cyan-300 text-[10px] font-bold border border-cyan-500/50 shadow-lg z-10">
                  +{complaint.supporters_count}
                </span>
              )}

              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white ${colors.bg} border-2 ${colors.border} shadow-xl ${colors.glow} group-hover:scale-125 transition-transform duration-200`}
              >
                {CATEGORY_ICONS[iconKey] || <MapPin className="w-4 h-4" />}
              </div>

              <div className={`w-2.5 h-2.5 rotate-45 -mt-1 ${colors.bg}`} />
            </div>
          </div>
        );
      })}

      {/* 5. Selected Pin Popup Preview Modal */}
      {activePopup && (
        <div
          style={{
            left: `calc(50vw + ${coordToPixel(activePopup.latitude, activePopup.longitude).x}px)`,
            top: `calc(50vh + ${coordToPixel(activePopup.latitude, activePopup.longitude).y - 120}px)`,
          }}
          className="absolute -translate-x-1/2 -translate-y-full z-40 interactive-popup pointer-events-auto animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="glass-panel rounded-2xl p-4 w-72 text-slate-100 shadow-2xl border border-cyan-500/30">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                {activePopup.category?.name || 'Civic Issue'}
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

            <h4 className="text-xs font-bold text-white mb-1.5 line-clamp-2">{activePopup.title}</h4>

            <p className="text-[11px] text-slate-400 mb-3 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{activePopup.location_name}</span>
            </p>

            <div className="flex items-center justify-between border-t border-slate-800/80 pt-2.5 mt-2">
              <div className="flex items-center gap-1 text-[11px] text-cyan-300 font-medium">
                <Users className="w-3.5 h-3.5" />
                <span>{activePopup.supporters_count} affected</span>
              </div>
              <button
                onClick={() => {
                  onSelectComplaint(activePopup);
                  setActivePopup(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[11px] font-bold flex items-center gap-1 shadow-lg shadow-cyan-500/20 transition-colors"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Map Telemetry & Controls Overlay (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col items-end gap-3 pointer-events-auto">
        {/* Telemetry Panel */}
        <div className="glass-panel px-3 py-2 rounded-xl text-[11px] font-mono text-slate-300 border border-slate-800 shadow-xl flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-bold">LIVE VECTOR MAP</span>
          </div>
          <span className="text-slate-600">|</span>
          <span>
            {mapCenter.lat.toFixed(4)}°N, {mapCenter.lng.toFixed(4)}°E
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">ZOOM {zoomLevel}x</span>
        </div>

        {/* Floating Zoom & Reset Buttons */}
        <div className="flex items-center gap-1.5 glass-panel p-1.5 rounded-2xl border border-slate-800 shadow-2xl">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 1, 18))}
            className="map-control-btn p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 1, 8))}
            className="map-control-btn p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setMapCenter({ lat: centerCoordinate?.lat || 18.5204, lng: centerCoordinate?.lng || 73.8567 });
              setZoomLevel(13);
            }}
            className="map-control-btn p-2 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
            title="Reset Map Center"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 7. Bottom Left Live Status Badge */}
      <div className="absolute bottom-6 left-6 z-20 hidden sm:flex items-center gap-2 glass-panel px-3.5 py-2 rounded-2xl border border-slate-800 shadow-xl pointer-events-auto">
        <Compass className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
        <div className="text-xs">
          <p className="font-bold text-white leading-tight">Civic Pulse Monitor</p>
          <p className="text-[10px] text-slate-400">{complaints.length} active civic issues in view</p>
        </div>
      </div>
    </div>
  );
}

export default function GoogleMapView(props: GoogleMapViewProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const [activePopup, setActivePopup] = useState<Complaint | null>(null);

  // If Google Maps API Key is not set or empty, fallback to the interactive dynamic canvas vector map!
  if (!apiKey || apiKey.trim() === '') {
    return <DynamicCanvasMapView {...props} />;
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
    <div className="relative w-full h-full overflow-hidden bg-slate-950">
      <APIProvider apiKey={apiKey}>
        <Map
          mapId="DEMO_MAP_ID"
          defaultCenter={{
            lat: props.centerCoordinate?.lat || 18.5204,
            lng: props.centerCoordinate?.lng || 73.8567,
          }}
          defaultZoom={13}
          colorScheme="DARK"
          gestureHandling="greedy"
          disableDefaultUI={false}
          zoomControl={true}
          style={{ width: '100%', height: '100%' }}
        >
          <MapCameraController center={props.centerCoordinate} />

          {/* Hotspot Radial Pulse Overlays */}
          {props.showHotspots &&
            props.hotspots.map((hs) => (
              <AdvancedMarker
                key={hs.id}
                position={{ lat: hs.center_latitude, lng: hs.center_longitude }}
                onClick={() => props.onSelectHotspot(hs)}
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
          {props.complaints.map((complaint) => {
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
                      props.onSelectComplaint(activePopup);
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
