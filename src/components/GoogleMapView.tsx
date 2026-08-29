'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Map, { Marker, Popup, NavigationControl, MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
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
  Plus,
  Minus,
  RotateCcw,
  Radio,
} from 'lucide-react';

interface MapViewProps {
  complaints: Complaint[];
  hotspots: Hotspot[];
  selectedCategory: string;
  selectedStatus: string;
  showHotspots: boolean;
  onSelectComplaint: (complaint: Complaint) => void;
  onSelectHotspot: (hotspot: Hotspot) => void;
  centerCoordinate?: { lat: number; lng: number };
  mapTheme?: 'light' | 'dark';
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'roads-traffic': <Car className="w-4 h-4" />,
  'sanitation-garbage': <Trash2 className="w-4 h-4" />,
  'water-drainage': <Droplets className="w-4 h-4" />,
  'electricity-lighting': <Zap className="w-4 h-4" />,
  'public-safety': <ShieldAlert className="w-4 h-4" />,
};

/**
 * Dynamic Interactive Vector Canvas Map (Light/Dark Fallback Engine)
 */
function DynamicCanvasMapView({
  complaints,
  hotspots,
  showHotspots,
  onSelectComplaint,
  onSelectHotspot,
  centerCoordinate,
  mapTheme = 'light',
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mapCenter, setMapCenter] = useState({
    lat: centerCoordinate?.lat || 18.5204,
    lng: centerCoordinate?.lng || 73.8567,
  });
  const [zoomLevel, setZoomLevel] = useState(13);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activePopup, setActivePopup] = useState<Complaint | null>(null);

  const isLight = mapTheme === 'light';

  useEffect(() => {
    if (centerCoordinate) {
      setMapCenter({ lat: centerCoordinate.lat, lng: centerCoordinate.lng });
    }
  }, [centerCoordinate]);

  const coordToPixel = useMemo(() => {
    return (lat: number, lng: number) => {
      const scale = Math.pow(2, zoomLevel) * 80;
      const x = (lng - mapCenter.lng) * scale;
      const y = -(lat - mapCenter.lat) * scale;
      return { x, y };
    };
  }, [mapCenter, zoomLevel]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest('.interactive-popup') ||
      (e.target as HTMLElement).closest('.map-control-btn')
    ) {
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
      return { bg: 'bg-emerald-600', border: 'border-emerald-400', glow: 'shadow-emerald-500/30' };
    }
    switch (c.severity) {
      case 'CRITICAL':
        return { bg: 'bg-rose-600', border: 'border-rose-400', glow: 'shadow-rose-500/30' };
      case 'HIGH':
        return { bg: 'bg-amber-600', border: 'border-amber-400', glow: 'shadow-amber-500/30' };
      case 'MEDIUM':
        return { bg: 'bg-yellow-600', border: 'border-yellow-400', glow: 'shadow-yellow-500/30' };
      case 'LOW':
      default:
        return { bg: 'bg-slate-900', border: 'border-slate-700', glow: 'shadow-slate-500/30' };
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full h-full overflow-hidden select-none transition-colors duration-300 ${
        isLight ? 'bg-[#f8fafc]' : 'bg-slate-950'
      } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
    >
      {/* Light/Dark Canvas SVG Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="gridPattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke={isLight ? "rgba(148, 163, 184, 0.25)" : "rgba(56, 189, 248, 0.12)"}
                strokeWidth="1"
              />
              <circle cx="0" cy="0" r="1.5" fill={isLight ? "rgba(100, 116, 139, 0.4)" : "rgba(56, 189, 248, 0.3)"} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridPattern)" />
          <path
            d="M -100 300 Q 400 100 800 500 T 1600 300"
            fill="none"
            stroke={isLight ? "rgba(203, 213, 225, 0.7)" : "rgba(14, 165, 233, 0.25)"}
            strokeWidth="24"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Hotspots */}
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
              <div className="absolute w-36 h-36 rounded-full bg-rose-500/15 border-2 border-rose-500/40 animate-pulse-ring pointer-events-none" />
              <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-rose-300 text-rose-700 text-[11px] font-bold shadow-xl hover:scale-110 transition-transform">
                <Flame className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                <span>HOTSPOT ({hs.complaint_count})</span>
              </div>
            </div>
          );
        })}

      {/* Complaints */}
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
            className="absolute cursor-pointer group pointer-events-auto z-10"
          >
            <div className="relative flex flex-col items-center">
              {complaint.supporters_count > 1 && (
                <span className="absolute -top-2.5 -right-2.5 px-1.5 py-0.5 rounded-full bg-slate-900 text-emerald-400 text-[10px] font-bold border border-slate-700 shadow-md z-10">
                  +{complaint.supporters_count}
                </span>
              )}

              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white ${colors.bg} border-2 ${colors.border} shadow-md ${colors.glow} group-hover:scale-125 transition-transform duration-200`}
              >
                {CATEGORY_ICONS[iconKey] || <MapPin className="w-4 h-4" />}
              </div>

              <div className={`w-2.5 h-2.5 rotate-45 -mt-1 ${colors.bg}`} />
            </div>
          </div>
        );
      })}

      {/* Active Popup Card */}
      {activePopup && (
        <div
          style={{
            left: `calc(50vw + ${coordToPixel(activePopup.latitude, activePopup.longitude).x}px)`,
            top: `calc(50vh + ${coordToPixel(activePopup.latitude, activePopup.longitude).y - 120}px)`,
          }}
          className="absolute -translate-x-1/2 -translate-y-full z-40 interactive-popup pointer-events-auto animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="bg-white rounded-2xl p-4 w-72 text-slate-900 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                {activePopup.category?.name || 'Civic Issue'}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  activePopup.status === 'RESOLVED'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                {activePopup.status.replace('_', ' ')}
              </span>
            </div>

            <h4 className="text-xs font-bold text-slate-900 mb-1.5 line-clamp-2">{activePopup.title}</h4>

            <p className="text-[11px] text-slate-500 mb-3 flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{activePopup.location_name}</span>
            </p>

            <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 mt-2">
              <div className="flex items-center gap-1 text-[11px] text-slate-600 font-semibold">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>{activePopup.supporters_count} supporters</span>
              </div>
              <button
                onClick={() => {
                  onSelectComplaint(activePopup);
                  setActivePopup(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-[11px] font-bold flex items-center gap-1 shadow-md transition-colors"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Footer Info & Controls */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col items-end gap-3 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl text-[11px] font-mono text-slate-700 border border-slate-200 shadow-lg flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-600">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-bold">VECTOR MAP CANVAS</span>
          </div>
          <span className="text-slate-300">|</span>
          <span>
            {mapCenter.lat.toFixed(4)}°N, {mapCenter.lng.toFixed(4)}°E
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xl">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 1, 18))}
            className="map-control-btn p-2 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 1, 8))}
            className="map-control-btn p-2 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setMapCenter({ lat: centerCoordinate?.lat || 18.5204, lng: centerCoordinate?.lng || 73.8567 });
              setZoomLevel(13);
            }}
            className="map-control-btn p-2 rounded-xl text-slate-600 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
            title="Reset Map Center"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Primary Mapbox GL JS Vector Map Component (Supports Light & Dark Themes)
 */
export default function GoogleMapView(props: MapViewProps) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const mapRef = useRef<MapRef>(null);
  const [activePopup, setActivePopup] = useState<Complaint | null>(null);

  const mapTheme = props.mapTheme || 'light';
  const mapStyleUrl = mapTheme === 'light' ? 'mapbox://styles/mapbox/light-v11' : 'mapbox://styles/mapbox/dark-v11';

  // Pan camera when centerCoordinate changes
  useEffect(() => {
    if (mapRef.current && props.centerCoordinate) {
      mapRef.current.flyTo({
        center: [props.centerCoordinate.lng, props.centerCoordinate.lat],
        zoom: 14,
        duration: 2000,
      });
    }
  }, [props.centerCoordinate]);

  const isValidMapboxToken = (token?: string) => {
    if (!token || token.trim() === '') return false;
    return token.startsWith('pk.');
  };

  // Fallback to Canvas Vector Map if Mapbox token is missing
  if (!isValidMapboxToken(mapboxToken)) {
    return <DynamicCanvasMapView {...props} mapTheme={mapTheme} />;
  }

  const getMarkerColors = (c: Complaint) => {
    if (c.status === 'RESOLVED') {
      return { bg: 'bg-emerald-600', border: 'border-emerald-400', glow: 'shadow-emerald-500/30' };
    }
    switch (c.severity) {
      case 'CRITICAL':
        return { bg: 'bg-rose-600', border: 'border-rose-400', glow: 'shadow-rose-500/30' };
      case 'HIGH':
        return { bg: 'bg-amber-600', border: 'border-amber-400', glow: 'shadow-amber-500/30' };
      case 'MEDIUM':
        return { bg: 'bg-yellow-600', border: 'border-yellow-400', glow: 'shadow-yellow-500/30' };
      case 'LOW':
      default:
        return { bg: 'bg-slate-900', border: 'border-slate-700', glow: 'shadow-slate-500/30' };
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-50">
      <Map
        ref={mapRef}
        mapboxAccessToken={mapboxToken}
        initialViewState={{
          latitude: props.centerCoordinate?.lat || 18.5204,
          longitude: props.centerCoordinate?.lng || 73.8567,
          zoom: 13,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyleUrl}
        attributionControl={false}
      >
        <NavigationControl position="bottom-right" showCompass={true} />

        {/* Hotspot Radial Pulse Markers */}
        {props.showHotspots &&
          props.hotspots.map((hs) => (
            <Marker
              key={hs.id}
              latitude={hs.center_latitude}
              longitude={hs.center_longitude}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                props.onSelectHotspot(hs);
              }}
            >
              <div className="relative group cursor-pointer flex items-center justify-center">
                <div className="absolute w-24 h-24 rounded-full bg-rose-500/15 border-2 border-rose-500/40 animate-pulse-ring pointer-events-none" />
                <div className="relative flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-rose-300 text-rose-700 text-[10px] font-bold shadow-lg hover:scale-110 transition-transform">
                  <Flame className="w-3 h-3 text-rose-600 animate-pulse" />
                  <span>HOTSPOT ({hs.complaint_count})</span>
                </div>
              </div>
            </Marker>
          ))}

        {/* Complaint Markers */}
        {props.complaints.map((complaint) => {
          const colors = getMarkerColors(complaint);
          const iconKey = complaint.category?.slug || 'roads-traffic';

          return (
            <Marker
              key={complaint.id}
              latitude={complaint.latitude}
              longitude={complaint.longitude}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setActivePopup(complaint);
              }}
            >
              <div className="relative group cursor-pointer flex flex-col items-center z-10">
                {complaint.supporters_count > 1 && (
                  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-slate-900 text-emerald-400 text-[10px] font-bold border border-slate-700 shadow-md z-10">
                    +{complaint.supporters_count}
                  </span>
                )}

                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white ${colors.bg} border-2 ${colors.border} shadow-md ${colors.glow} group-hover:scale-125 transition-transform duration-200`}
                >
                  {CATEGORY_ICONS[iconKey] || <MapPin className="w-4 h-4" />}
                </div>

                <div className={`w-2 h-2 rotate-45 -mt-1 ${colors.bg}`} />
              </div>
            </Marker>
          );
        })}

        {/* Active Complaint Popup */}
        {activePopup && (
          <Popup
            latitude={activePopup.latitude}
            longitude={activePopup.longitude}
            anchor="bottom"
            onClose={() => setActivePopup(null)}
            closeButton={false}
            className="mapbox-custom-popup"
          >
            <div className="bg-white rounded-2xl p-3.5 max-w-xs text-slate-900 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                  {activePopup.category?.name || 'Civic Grievance'}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    activePopup.status === 'RESOLVED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {activePopup.status.replace('_', ' ')}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 mb-1 line-clamp-2">{activePopup.title}</h4>

              <p className="text-[11px] text-slate-500 mb-2 flex items-center gap-1 font-medium">
                <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="truncate">{activePopup.location_name}</span>
              </p>

              <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-2">
                <div className="flex items-center gap-1 text-[11px] text-slate-600 font-semibold">
                  <Users className="w-3 h-3 text-emerald-600" />
                  <span>{activePopup.supporters_count} supporters</span>
                </div>
                <button
                  onClick={() => {
                    props.onSelectComplaint(activePopup);
                    setActivePopup(null);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-white text-[11px] font-bold flex items-center gap-1 transition-colors shadow-sm"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
