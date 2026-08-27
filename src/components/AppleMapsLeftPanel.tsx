'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Search,
  PlusCircle,
  Car,
  Trash2,
  Droplets,
  Zap,
  ShieldAlert,
  Flame,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Users,
  CheckCircle2,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { Complaint, Category, Hotspot } from '@/types/database';

interface AppleMapsLeftPanelProps {
  complaints: Complaint[];
  hotspots: Hotspot[];
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  showHotspots: boolean;
  onToggleHotspots: () => void;
  onSelectComplaint: (complaint: Complaint) => void;
  onOpenReportWizard: () => void;
  onSelectLocation: (lat: number, lng: number, name: string) => void;
}

const POPULAR_LOCALITIES = [
  { name: 'Swargate, Pune', lat: 18.5018, lng: 73.858 },
  { name: 'Kothrud, Pune', lat: 18.5089, lng: 73.8267 },
  { name: 'Paud Road, Pune', lat: 18.5072, lng: 73.815 },
  { name: 'Viman Nagar, Pune', lat: 18.5679, lng: 73.9143 },
  { name: 'Shivajinagar, Pune', lat: 18.5308, lng: 73.8474 },
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'roads-traffic': <Car className="w-4 h-4" />,
  'sanitation-garbage': <Trash2 className="w-4 h-4" />,
  'water-drainage': <Droplets className="w-4 h-4" />,
  'electricity-lighting': <Zap className="w-4 h-4" />,
  'public-safety': <ShieldAlert className="w-4 h-4" />,
};

export default function AppleMapsLeftPanel({
  complaints,
  hotspots,
  categories,
  selectedCategory,
  onSelectCategory,
  selectedStatus,
  onSelectStatus,
  showHotspots,
  onToggleHotspots,
  onSelectComplaint,
  onOpenReportWizard,
  onSelectLocation,
}: AppleMapsLeftPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocalityDropdown, setShowLocalityDropdown] = useState(false);

  const filteredLocalities = POPULAR_LOCALITIES.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSeverityBadge = (c: Complaint) => {
    if (c.status === 'RESOLVED') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> RESOLVED
        </span>
      );
    }
    switch (c.severity) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-rose-400" /> CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            MEDIUM
          </span>
        );
      case 'LOW':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            LOW
          </span>
        );
    }
  };

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="fixed left-4 top-6 z-30 p-3.5 rounded-2xl bg-[#13151f]/90 backdrop-blur-2xl border border-white/10 text-white shadow-2xl hover:bg-slate-800 transition-all pointer-events-auto flex items-center gap-2 font-medium text-xs"
        title="Expand Left Navigation Panel"
      >
        <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
          <MapPin className="w-3.5 h-3.5" />
        </div>
        <span className="font-bold font-display">Civic Pulse</span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </button>
    );
  }

  return (
    <aside className="fixed left-4 top-4 bottom-4 w-full max-w-[360px] sm:max-w-[390px] z-30 bg-[#12141d]/95 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[30px] flex flex-col text-slate-100 overflow-hidden pointer-events-auto transition-all duration-300">
      {/* 1. Header with Collapse Toggle */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <MapPin className="w-4 h-4 text-white" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <h1 className="text-base font-bold font-display tracking-tight text-white flex items-center gap-2 leading-none">
              Civic Pulse
              <span className="text-[9px] uppercase font-semibold px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                AI Map
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 mt-1">Indian Civic Grievances</p>
          </div>
        </div>

        <button
          onClick={() => setIsCollapsed(true)}
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Collapse Panel"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Location Search Bar (Apple Maps Input Style) */}
      <div className="p-3 pb-2 relative">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search locality or ward (e.g. Swargate)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowLocalityDropdown(true);
            }}
            onFocus={() => setShowLocalityDropdown(true)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
        </div>

        {/* Locality Autocomplete Popup */}
        {showLocalityDropdown && (
          <div className="absolute left-3 right-3 top-full mt-1.5 bg-[#181a26] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900/80">
              Popular Localities
            </div>
            <div className="max-h-40 overflow-y-auto divide-y divide-slate-800/60">
              {filteredLocalities.map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectLocation(loc.lat, loc.lng, loc.name);
                    setSearchQuery(loc.name);
                    setShowLocalityDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-400 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    {loc.name}
                  </span>
                  <span className="text-[10px] text-slate-500">Jump</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Primary Action CTA Button */}
      <div className="px-3 py-1.5">
        <button
          onClick={onOpenReportWizard}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report Civic Issue</span>
        </button>
      </div>

      {/* 4. Category Filter Pills */}
      <div className="px-3 py-2 border-b border-slate-800/80 space-y-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {CATEGORY_ICONS[cat.slug] || <Filter className="w-3 h-3" />}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Status Pills */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onSelectStatus('all')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-colors ${
                selectedStatus === 'all' ? 'bg-slate-800 text-cyan-300' : 'hover:text-slate-200'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => onSelectStatus('open')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-colors ${
                selectedStatus === 'open' ? 'bg-slate-800 text-cyan-300' : 'hover:text-slate-200'
              }`}
            >
              Open
            </button>
            <button
              onClick={() => onSelectStatus('resolved')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-colors ${
                selectedStatus === 'resolved' ? 'bg-slate-800 text-emerald-300' : 'hover:text-slate-200'
              }`}
            >
              Resolved
            </button>
          </div>

          <button
            onClick={onToggleHotspots}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
              showHotspots
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-slate-900 text-slate-500'
            }`}
          >
            <Flame className="w-3 h-3 text-rose-400" />
            <span>Hotspots</span>
          </button>
        </div>
      </div>

      {/* 5. Scrollable Active Issue Cards Feed (Apple Maps Route List Style) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-slate-800/40">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 px-1 pt-1">
          <span>NEARBY GRIEVANCES ({complaints.length})</span>
          <span className="text-cyan-400">Live Map Sync</span>
        </div>

        {complaints.length > 0 ? (
          complaints.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectComplaint(item)}
              className="pt-2.5 group cursor-pointer"
            >
              <div className="p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-cyan-500/40 transition-all shadow-md">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                    {CATEGORY_ICONS[item.category?.slug || 'roads-traffic']}
                    <span>{item.category?.name || 'Civic Issue'}</span>
                  </span>
                  {getSeverityBadge(item)}
                </div>

                <h3 className="text-xs font-bold text-white mb-1.5 group-hover:text-cyan-300 transition-colors line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-[11px] text-slate-400 flex items-center gap-1 mb-3">
                  <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span className="truncate">{item.location_name}</span>
                </p>

                <div className="flex items-center justify-between border-t border-slate-800/60 pt-2 text-[11px]">
                  <div className="flex items-center gap-1 text-cyan-300 font-medium">
                    <Users className="w-3 h-3" />
                    <span>{item.supporters_count} affected</span>
                  </div>
                  <span className="text-slate-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Preview</span>
                    <ArrowRight className="w-3 h-3 text-cyan-400" />
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-slate-500 text-xs">
            No complaints match the selected filter criteria.
          </div>
        )}
      </div>

      {/* 6. Footer Telemetry */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-[10px] text-slate-400">
        <span>{complaints.length} issues in active view</span>
        <span className="text-cyan-400 font-semibold">{hotspots.length} Hotspots Identified</span>
      </div>
    </aside>
  );
}
