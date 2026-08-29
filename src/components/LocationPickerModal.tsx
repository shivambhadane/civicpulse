'use client';

import React, { useState, useEffect, useRef } from 'react';
import Map, { MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Navigation, Check, X, Search, Plus, Minus, RotateCcw } from 'lucide-react';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLocation: (lat: number, lng: number, locationName: string) => void;
  initialLat?: number;
  initialLng?: number;
}

// Reverse Geocoding Helper
async function fetchAddress(lat: number, lng: number, mapboxToken?: string): Promise<string> {
  if (mapboxToken && mapboxToken.startsWith('pk.')) {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}`
      );
      const data = await res.json();
      if (data?.features && data.features.length > 0) {
        return data.features[0].place_name;
      }
    } catch (e) {
      console.warn('Mapbox geocoding error:', e);
    }
  }

  // Fallback locality formatting
  if (Math.abs(lat - 18.5204) < 0.05 && Math.abs(lng - 73.8567) < 0.05) {
    return `Karve Road, Kothrud, Pune (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`;
  }
  return `Civic Defect Site (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`;
}

/**
 * Dynamic Interactive Canvas Vector Map Picker (Fallback Engine - Zero External API Keys Needed)
 */
function DynamicCanvasPicker({
  initialLat,
  initialLng,
  onLocationChange,
}: {
  initialLat: number;
  initialLng: number;
  onLocationChange: (lat: number, lng: number, address: string) => void;
}) {
  const [mapCenter, setMapCenter] = useState({ lat: initialLat, lng: initialLng });
  const [zoomLevel, setZoomLevel] = useState(15);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMapCenter({ lat: initialLat, lng: initialLng });
  }, [initialLat, initialLng]);

  // Debounced reverse geocoding on drag end
  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(async () => {
      const addr = await fetchAddress(mapCenter.lat, mapCenter.lng);
      if (isMounted) {
        onLocationChange(mapCenter.lat, mapCenter.lng, addr);
      }
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [mapCenter, onLocationChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
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

  const handleUseGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setMapCenter({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => console.warn('Geolocation error:', err)
      );
    }
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full h-full overflow-hidden bg-slate-950 select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Dynamic Vector Map Canvas Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pickerCanvasGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="1" />
              <circle cx="0" cy="0" r="1.5" fill="rgba(56, 189, 248, 0.35)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pickerCanvasGrid)" />
          {/* Vector Road Arteries */}
          <path d="M -100 250 Q 300 100 700 450 T 1500 250" fill="none" stroke="rgba(14, 165, 233, 0.35)" strokeWidth="24" strokeLinecap="round" />
          <path d="M 250 -50 Q 450 350 200 750" fill="none" stroke="rgba(14, 165, 233, 0.25)" strokeWidth="16" strokeLinecap="round" />
        </svg>
      </div>

      {/* Target Location Pin Overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center -mt-6 z-20">
        <div className="relative flex flex-col items-center animate-bounce">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500 border-2 border-white text-slate-950 flex items-center justify-center shadow-2xl shadow-cyan-500/50">
            <MapPin className="w-7 h-7 fill-current text-slate-950" />
          </div>
          <div className="w-3.5 h-3.5 bg-cyan-400 rotate-45 -mt-1 shadow-lg" />
        </div>
      </div>

      {/* Floating Controls */}
      <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2">
        <button
          type="button"
          onClick={handleUseGPS}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl glass-panel-interactive text-xs font-semibold text-cyan-300 shadow-xl border border-cyan-500/30"
        >
          <Navigation className="w-4 h-4 text-cyan-400" />
          <span>Use GPS Location</span>
        </button>

        <div className="flex items-center gap-1 glass-panel p-1 rounded-xl border border-slate-800 shadow-xl">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 1, 18))}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 1, 8))}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setMapCenter({ lat: initialLat, lng: initialLng });
              setZoomLevel(15);
            }}
            className="p-2 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LocationPickerModal({
  isOpen,
  onClose,
  onConfirmLocation,
  initialLat = 18.5204,
  initialLng = 73.8567,
}: LocationPickerModalProps) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const mapRef = useRef<MapRef>(null);

  const [currentLat, setCurrentLat] = useState(initialLat);
  const [currentLng, setCurrentLng] = useState(initialLng);
  const [locationName, setLocationName] = useState('Karve Road, Kothrud, Pune');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setCurrentLat(initialLat);
    setCurrentLng(initialLng);

    if (isOpen && mapRef.current) {
      const timer = setTimeout(() => {
        mapRef.current?.resize();
        mapRef.current?.flyTo({
          center: [initialLng, initialLat],
          zoom: 16,
          duration: 0,
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialLat, initialLng]);

  const isValidMapboxToken = (token?: string) => {
    if (!token || token.trim() === '') return false;
    return token.startsWith('pk.');
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (isValidMapboxToken(mapboxToken)) {
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxToken}`
        );
        const data = await res.json();
        if (data?.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          setCurrentLat(lat);
          setCurrentLng(lng);
          setLocationName(data.features[0].place_name);
          if (mapRef.current) {
            mapRef.current.flyTo({ center: [lng, lat], zoom: 16 });
          }
        }
      } catch (err) {
        console.warn('Mapbox search error:', err);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md font-sans">
      <div className="relative w-full max-w-3xl glass-panel rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              Interactive Location Pin Selector
            </h3>
            <p className="text-xs text-slate-400">Drag map to position target pin directly over the civic defect</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search area (e.g. Swargate, Pune)..."
                className="w-48 sm:w-56 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />
              <button type="submit" className="absolute right-2 top-2 text-slate-400 hover:text-white">
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Map Viewport Area */}
        <div className="relative flex-1 min-h-[380px] h-[380px] w-full bg-slate-950">
          {isValidMapboxToken(mapboxToken) ? (
            /* ENGINE 1: Mapbox GL JS Vector Engine */
            <>
              <Map
                ref={mapRef}
                mapboxAccessToken={mapboxToken}
                initialViewState={{
                  latitude: initialLat,
                  longitude: initialLng,
                  zoom: 16,
                }}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/dark-v11"
                onLoad={(evt) => {
                  evt.target.resize();
                }}
                onMoveEnd={async (evt) => {
                  const lat = evt.viewState.latitude;
                  const lng = evt.viewState.longitude;
                  setCurrentLat(lat);
                  setCurrentLng(lng);
                  const addr = await fetchAddress(lat, lng, mapboxToken);
                  setLocationName(addr);
                }}
              />

              {/* Target Pin Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center -mt-6 z-20">
                <div className="relative flex flex-col items-center animate-bounce">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500 border-2 border-white text-slate-950 flex items-center justify-center shadow-2xl shadow-cyan-500/50">
                    <MapPin className="w-6 h-6 fill-current text-slate-950" />
                  </div>
                  <div className="w-3 h-3 bg-cyan-400 rotate-45 -mt-1 shadow-lg" />
                </div>
              </div>
            </>
          ) : (
            /* ENGINE 2: Dynamic Canvas Vector Map Engine (Zero API Key Requirement) */
            <DynamicCanvasPicker
              initialLat={initialLat}
              initialLng={initialLng}
              onLocationChange={(lat, lng, addr) => {
                setCurrentLat(lat);
                setCurrentLng(lng);
                setLocationName(addr);
              }}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full">
            <span className="text-[10px] uppercase font-semibold text-cyan-400 tracking-wider">
              Target Location Address
            </span>
            <p className="text-xs text-slate-100 font-bold truncate mt-0.5">{locationName}</p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Lat: {currentLat.toFixed(5)}, Lng: {currentLng.toFixed(5)}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirmLocation(currentLat, currentLng, locationName);
                onClose();
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Location</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
