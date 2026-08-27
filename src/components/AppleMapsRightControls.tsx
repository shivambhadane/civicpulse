'use client';

import React, { useState } from 'react';
import { Shield, UserCheck, Activity, Info, X, List, Map } from 'lucide-react';

interface AppleMapsRightControlsProps {
  isOfficialMode: boolean;
  onToggleOfficialMode: () => void;
  onOpenActivityDrawer: () => void;
  supportedCount: number;
  viewMode: 'map' | 'list';
  onToggleViewMode: (mode: 'map' | 'list') => void;
}

export default function AppleMapsRightControls({
  isOfficialMode,
  onToggleOfficialMode,
  onOpenActivityDrawer,
  supportedCount,
  viewMode,
  onToggleViewMode,
}: AppleMapsRightControlsProps) {
  const [showDisclosureInfo, setShowDisclosureInfo] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-30 flex flex-col items-end gap-2.5 pointer-events-auto">
      {/* Main Floating Tool Stack (White Minimal Right Dock) */}
      <div className="flex items-center gap-2 bg-white/95 backdrop-blur-2xl border border-slate-200/90 p-1.5 rounded-2xl shadow-xl">
        {/* View Mode Toggle Button (Map / List) */}
        <button
          onClick={() => onToggleViewMode(viewMode === 'map' ? 'list' : 'map')}
          className={`p-2.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold ${
            viewMode === 'list'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
          title="Toggle Map / List View"
        >
          {viewMode === 'map' ? (
            <>
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List View</span>
            </>
          ) : (
            <>
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">Map View</span>
            </>
          )}
        </button>

        {/* Activity Drawer Trigger */}
        <button
          onClick={onOpenActivityDrawer}
          className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          title="My Activity & Upvoted Issues"
        >
          <Activity className="w-4 h-4 text-emerald-600" />
          {supportedCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-sm">
              {supportedCount}
            </span>
          )}
        </button>

        {/* Mock Government Official Mode Toggle */}
        <button
          onClick={onToggleOfficialMode}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
            isOfficialMode
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm'
              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
          }`}
          title="Toggle Government Official Action Mode"
        >
          {isOfficialMode ? (
            <>
              <Shield className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span className="hidden sm:inline">Official Mode</span>
            </>
          ) : (
            <>
              <UserCheck className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Citizen Mode</span>
            </>
          )}
        </button>

        {/* Disclosure Toggle Pill */}
        <button
          onClick={() => setShowDisclosureInfo(!showDisclosureInfo)}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-amber-600 transition-colors"
          title="Hackathon Synthetic Data Notice"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Synthetic Disclosure Info Popup Card */}
      {showDisclosureInfo && (
        <div className="bg-white/95 backdrop-blur-2xl border border-amber-300 rounded-2xl p-3.5 max-w-sm text-xs text-amber-900 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <span className="font-bold text-amber-700 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-600" /> Hackathon Disclosure
            </span>
            <button
              onClick={() => setShowDisclosureInfo(false)}
              className="text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
            Civic Pulse is an open-source civic tech demonstration. All municipal departments, official status transitions, and resolution evidence are simulated for evaluation purposes.
          </p>
        </div>
      )}
    </div>
  );
}
