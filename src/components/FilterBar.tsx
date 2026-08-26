'use client';

import React from 'react';
import { Car, Trash2, Droplets, Zap, ShieldAlert, Layers, Flame, Map, List } from 'lucide-react';
import { Category } from '@/types/database';

interface FilterBarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  showHotspots: boolean;
  onToggleHotspots: () => void;
  viewMode: 'map' | 'list';
  onToggleViewMode: (mode: 'map' | 'list') => void;
  totalComplaints: number;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Car: <Car className="w-3.5 h-3.5" />,
  Trash2: <Trash2 className="w-3.5 h-3.5" />,
  Droplets: <Droplets className="w-3.5 h-3.5" />,
  Zap: <Zap className="w-3.5 h-3.5" />,
  ShieldAlert: <ShieldAlert className="w-3.5 h-3.5" />,
};

export default function FilterBar({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedStatus,
  onSelectStatus,
  showHotspots,
  onToggleHotspots,
  viewMode,
  onToggleViewMode,
  totalComplaints,
}: FilterBarProps) {
  return (
    <div className="w-full glass-panel border-b border-slate-800/80 px-4 py-2.5 z-30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            All Categories ({totalComplaints})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                selectedCategory === cat.slug
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {ICON_MAP[cat.icon_name] || <Layers className="w-3.5 h-3.5" />}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Status Filter & View Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Status Select */}
          <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-xl p-0.5">
            <button
              onClick={() => onSelectStatus('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                selectedStatus === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => onSelectStatus('open')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                selectedStatus === 'open' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => onSelectStatus('resolved')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                selectedStatus === 'resolved' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Resolved
            </button>
          </div>

          {/* Hotspots Toggle */}
          <button
            onClick={onToggleHotspots}
            className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all text-xs font-semibold ${
              showHotspots
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/10'
                : 'bg-slate-900/60 text-slate-500 border-slate-800'
            }`}
            title="Toggle active hotspot pulse rings"
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>Hotspots</span>
          </button>

          {/* Map vs List View Toggle */}
          <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-xl p-0.5">
            <button
              onClick={() => onToggleViewMode('map')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'map' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Map View"
            >
              <Map className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onToggleViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
