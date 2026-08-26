'use client';

import React, { useState } from 'react';
import { MapPin, Search, UserCheck, Shield, PlusCircle, Activity } from 'lucide-react';

interface HeaderNavProps {
  onOpenReportWizard: () => void;
  onOpenActivityDrawer: () => void;
  isOfficialMode: boolean;
  onToggleOfficialMode: () => void;
  onSelectLocation: (lat: number, lng: number, name: string) => void;
  supportedCount: number;
}

const POPULAR_LOCALITIES = [
  { name: 'Swargate, Pune', lat: 18.5018, lng: 73.8580 },
  { name: 'Kothrud, Pune', lat: 18.5089, lng: 73.8267 },
  { name: 'Paud Road, Pune', lat: 18.5072, lng: 73.8150 },
  { name: 'Viman Nagar, Pune', lat: 18.5679, lng: 73.9143 },
  { name: 'Shivajinagar, Pune', lat: 18.5308, lng: 73.8474 },
  { name: 'Indiranagar, Bengaluru', lat: 12.9784, lng: 77.6408 },
  { name: 'Koramangala, Bengaluru', lat: 12.9352, lng: 77.6245 },
];

export default function HeaderNav({
  onOpenReportWizard,
  onOpenActivityDrawer,
  isOfficialMode,
  onToggleOfficialMode,
  onSelectLocation,
  supportedCount,
}: HeaderNavProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredLocations = POPULAR_LOCALITIES.filter(loc =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800 px-4 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 shadow-lg shadow-cyan-500/20">
            <MapPin className="w-5 h-5 text-white animate-bounce" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-2">
              Civic Pulse
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                AI Powered
              </span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">Map-Based Grievance & Accountability</p>
          </div>
        </div>

        {/* Locality Search Input */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search ward, locality or city (e.g., Kothrud, Swargate)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>

          {showDropdown && (
            <div className="absolute left-0 right-0 top-full mt-2 glass-panel rounded-xl border border-slate-700 shadow-2xl overflow-hidden z-50">
              <div className="p-2 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-900/60">
                Suggested Municipal Localities
              </div>
              <div className="max-h-48 overflow-y-auto divide-y divide-slate-800">
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((loc, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onSelectLocation(loc.lat, loc.lng, loc.name);
                        setSearchQuery(loc.name);
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-400 flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        {loc.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Jump to map</span>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-xs text-slate-500">No matching localities found</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Primary Report CTA */}
          <button
            onClick={onOpenReportWizard}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Issue</span>
          </button>

          {/* Activity Drawer Trigger */}
          <button
            onClick={onOpenActivityDrawer}
            className="relative p-2 rounded-xl glass-panel-interactive text-slate-300 hover:text-white transition-colors"
            title="My Activity Drawer"
          >
            <Activity className="w-4 h-4" />
            {supportedCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-slate-950">
                {supportedCount}
              </span>
            )}
          </button>

          {/* Mock Government Official Mode Toggle */}
          <button
            onClick={onToggleOfficialMode}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isOfficialMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/10'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Toggle Official Action Bar mode for hackathon simulation"
          >
            {isOfficialMode ? (
              <>
                <Shield className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="hidden sm:inline">Official Mode</span>
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Citizen Mode</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
