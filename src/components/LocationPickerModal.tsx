'use client';

import React, { useState, useEffect } from 'react';
import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { MapPin, Navigation, Check, X, AlertTriangle } from 'lucide-react';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLocation: (lat: number, lng: number, locationName: string) => void;
  initialLat?: number;
  initialLng?: number;
}

// Inner component executing reverse geocoding via google.maps.Geocoder JS API
function LocationPickerMapContent({
  onLocationChange,
}: {
  onLocationChange: (lat: number, lng: number, address: string) => void;
}) {
  const map = useMap();
  const geocodingLib = useMapsLibrary('geocoding');
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (geocodingLib) {
      setGeocoder(new geocodingLib.Geocoder());
    }
  }, [geocodingLib]);

  useEffect(() => {
    if (!map) return;

    const listener = map.addListener('idle', () => {
      const center = map.getCenter();
      if (!center) return;
      const lat = center.lat();
      const lng = center.lng();

      if (geocoder) {
        // Mandatory Requirement 2: Use google.maps.Geocoder JS API for reverse geocoding
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            onLocationChange(lat, lng, results[0].formatted_address);
          } else {
            onLocationChange(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          }
        });
      } else {
        onLocationChange(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [map, geocoder, onLocationChange]);

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation && map) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          map.panTo({ lat, lng });
          map.setZoom(16);
        },
        (err) => console.warn('Geolocation error:', err)
      );
    }
  };

  return (
    <>
      {/* Fixed Center Target Pin Overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center -mt-6">
        <div className="relative flex flex-col items-center animate-bounce">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500 border-2 border-white text-slate-950 flex items-center justify-center shadow-2xl shadow-cyan-500/50">
            <MapPin className="w-6 h-6 fill-current text-slate-950" />
          </div>
          <div className="w-3 h-3 bg-cyan-400 rotate-45 -mt-1 shadow-lg" />
        </div>
      </div>

      {/* GPS Button */}
      <button
        type="button"
        onClick={handleUseCurrentLocation}
        className="absolute bottom-4 right-4 z-10 flex items-center gap-2 px-3.5 py-2 rounded-xl glass-panel-interactive text-xs font-semibold text-cyan-300 shadow-xl"
      >
        <Navigation className="w-4 h-4 text-cyan-400" />
        <span>Use My GPS Location</span>
      </button>
    </>
  );
}

export default function LocationPickerModal({
  isOpen,
  onClose,
  onConfirmLocation,
  initialLat = 18.5204,
  initialLng = 73.8567,
}: LocationPickerModalProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const [currentLat, setCurrentLat] = useState(initialLat);
  const [currentLng, setCurrentLng] = useState(initialLng);
  const [locationName, setLocationName] = useState('Pune, Maharashtra');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl glass-panel rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              Pin-Drop Location Selector (Google Maps)
            </h3>
            <p className="text-xs text-slate-400">Drag map to position target pin directly over the civic defect</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Container */}
        <div className="relative flex-1 min-h-[380px]">
          {!apiKey || apiKey.trim() === '' ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center text-slate-300">
              <AlertTriangle className="w-8 h-8 text-amber-400 mb-2" />
              <p className="text-xs font-bold">Google Maps API Key Missing</p>
              <p className="text-[11px] text-slate-500 mt-1">Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local</p>
            </div>
          ) : (
            <APIProvider apiKey={apiKey}>
              <Map
                mapId="DEMO_MAP_ID"
                defaultCenter={{ lat: initialLat, lng: initialLng }}
                defaultZoom={15}
                colorScheme="DARK"
                gestureHandling="greedy"
                disableDefaultUI={false}
                zoomControl={true}
                style={{ width: '100%', height: '100%' }}
              >
                <LocationPickerMapContent
                  onLocationChange={(lat, lng, addr) => {
                    setCurrentLat(lat);
                    setCurrentLng(lng);
                    setLocationName(addr);
                  }}
                />
              </Map>
            </APIProvider>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full">
            <span className="text-[10px] uppercase font-semibold text-cyan-400 tracking-wider">
              Selected Location Address
            </span>
            <p className="text-xs text-slate-200 font-medium truncate mt-0.5">
              {locationName}
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
              className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-1.5 transition-all"
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
