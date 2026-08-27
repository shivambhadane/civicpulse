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
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Resolved
        </span>
      );
    }
    switch (c.severity) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-rose-600" /> Critical
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Pending
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            Medium
          </span>
        );
      case 'LOW':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Low
          </span>
        );
    }
  };

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="fixed left-4 top-6 z-30 p-3.5 rounded-2xl bg-white/95 backdrop-blur-2xl border border-slate-200/90 text-slate-900 shadow-xl hover:bg-slate-50 transition-all pointer-events-auto flex items-center gap-2.5 font-medium text-xs"
        title="Expand Left Navigation Panel"
      >
        <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
          <MapPin className="w-4 h-4" />
        </div>
        <span className="font-bold font-display text-slate-900">City Hub</span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </button>
    );
  }

  return (
    <aside className="fixed left-4 top-4 bottom-4 w-full max-w-[360px] sm:max-w-[380px] z-30 bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-2xl rounded-[30px] flex flex-col text-slate-900 overflow-hidden pointer-events-auto transition-all duration-300">
      {/* 1. White Header with Green Accent Icon */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold font-display tracking-tight text-slate-900 flex items-center gap-2 leading-none">
              City Hub
              <span className="text-[9px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Portal
              </span>
            </h1>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Official Civic Grievances</p>
          </div>
        </div>

        <button
          onClick={() => setIsCollapsed(true)}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          title="Collapse Panel"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Light Search Input */}
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
            className="w-full bg-slate-100/90 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
          />
        </div>

        {/* Locality Autocomplete Dropdown */}
        {showLocalityDropdown && (
          <div className="absolute left-3 right-3 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
              Popular Localities
            </div>
            <div className="max-h-40 overflow-y-auto divide-y divide-slate-100">
              {filteredLocalities.map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectLocation(loc.lat, loc.lng, loc.name);
                    setSearchQuery(loc.name);
                    setShowLocalityDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {loc.name}
                  </span>
                  <span className="text-[10px] text-slate-400">Jump</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Green Report Button (Matching Screenshot "+ Report Issue") */}
      <div className="px-3 py-1.5">
        <button
          onClick={onOpenReportWizard}
          className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report Issue</span>
        </button>
      </div>

      {/* 4. Minimal Filter Category Chips */}
      <div className="px-3 py-2 border-b border-slate-100 space-y-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {CATEGORY_ICONS[cat.slug] || <Filter className="w-3 h-3" />}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Status Pills */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onSelectStatus('all')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-colors ${
                selectedStatus === 'all' ? 'bg-slate-200 text-slate-900' : 'hover:text-slate-900'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => onSelectStatus('open')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-colors ${
                selectedStatus === 'open' ? 'bg-slate-200 text-slate-900' : 'hover:text-slate-900'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => onSelectStatus('resolved')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-colors ${
                selectedStatus === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'hover:text-slate-900'
              }`}
            >
              Resolved
            </button>
          </div>

          <button
            onClick={onToggleHotspots}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
              showHotspots
                ? 'bg-rose-100 text-rose-700 border border-rose-200'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            <Flame className="w-3 h-3 text-rose-600" />
            <span>Hotspots</span>
          </button>
        </div>
      </div>

      {/* 5. Light Grievance Cards Feed (Matching Screenshot Cards) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-1 pt-1">
          <span>RECENT REPORTS ({complaints.length})</span>
          <span className="text-emerald-600 font-semibold">Live Feed</span>
        </div>

        {complaints.length > 0 ? (
          complaints.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectComplaint(item)}
              className="group cursor-pointer"
            >
              <div className="p-3.5 rounded-2xl bg-white hover:bg-slate-50/90 border border-slate-200/90 transition-all shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                    {CATEGORY_ICONS[item.category?.slug || 'roads-traffic']}
                    <span>{item.category?.name || 'Civic Issue'}</span>
                  </span>
                  {getSeverityBadge(item)}
                </div>

                <h3 className="text-xs font-bold text-slate-900 mb-1.5 group-hover:text-emerald-600 transition-colors line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-[11px] text-slate-500 flex items-center gap-1 mb-3">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{item.location_name}</span>
                </p>

                <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[11px]">
                  <div className="flex items-center gap-1 text-slate-600 font-semibold">
                    <Users className="w-3 h-3 text-emerald-600" />
                    <span>{item.supporters_count} affected</span>
                  </div>
                  <span className="text-emerald-700 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>View</span>
                    <ArrowRight className="w-3 h-3 text-emerald-600" />
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-slate-400 text-xs font-medium">
            No complaints match the selected criteria.
          </div>
        )}
      </div>

      {/* 6. Footer Telemetry */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-[10px] text-slate-500 font-medium">
        <span>{complaints.length} issues in active view</span>
        <span className="text-emerald-700 font-bold">{hotspots.length} Hotspots Identified</span>
      </div>
    </aside>
  );
}
