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
      {/* Main Floating Tool Stack (Apple Maps Right Dock) */}
      <div className="flex items-center gap-2 bg-[#12141d]/90 backdrop-blur-2xl border border-white/10 p-1.5 rounded-2xl shadow-2xl">
        {/* View Mode Toggle Button (Map / List) */}
        <button
          onClick={() => onToggleViewMode(viewMode === 'map' ? 'list' : 'map')}
          className={`p-2.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold ${
            viewMode === 'list'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
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
          className="relative p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          title="My Activity & Upvoted Issues"
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
              : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
          title="Toggle Government Official Action Mode"
        >
          {isOfficialMode ? (
            <>
              <Shield className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="hidden sm:inline font-bold">Official Mode</span>
            </>
          ) : (
            <>
              <UserCheck className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Citizen Mode</span>
            </>
          )}
        </button>

        {/* Disclosure Toggle Pill */}
        <button
          onClick={() => setShowDisclosureInfo(!showDisclosureInfo)}
          className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-amber-400 transition-colors"
          title="Hackathon Synthetic Data Notice"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Synthetic Disclosure Info Popup Card */}
      {showDisclosureInfo && (
        <div className="bg-[#181a26]/95 backdrop-blur-2xl border border-amber-500/40 rounded-2xl p-3.5 max-w-sm text-xs text-amber-200 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <Info className="w-4 h-4" /> Hackathon Disclosure
            </span>
            <button
              onClick={() => setShowDisclosureInfo(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-amber-200/90 leading-relaxed">
            Civic Pulse is an open-source civic tech demonstration. All municipal departments, official status transitions, and resolution evidence are simulated for hackathon evaluation.
          </p>
        </div>
      )}
    </div>
  );
}
