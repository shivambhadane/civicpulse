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
  CheckCircle2,
  AlertCircle,
  Filter,
  LayoutDashboard,
  FileText,
  Map,
  LogOut,
  User,
  LogIn,
} from 'lucide-react';
import { Complaint, Category, Hotspot } from '@/types/database';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

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
  activeNavTab: 'overview' | 'my-reports' | 'map';
  onSelectNavTab: (tab: 'overview' | 'my-reports' | 'map') => void;
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
  activeNavTab,
  onSelectNavTab,
}: AppleMapsLeftPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocalityDropdown, setShowLocalityDropdown] = useState(false);

  const { user, logout } = useAuth();
  const router = useRouter();

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

  const handleLogout = async () => {
    await logout();
    router.push('/?auth=login');
  };

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="fixed left-4 top-4 z-30 hidden md:flex p-3 rounded-2xl bg-white/95 backdrop-blur-2xl border border-slate-200 text-slate-900 shadow-xl hover:bg-slate-50 transition-all pointer-events-auto items-center gap-2.5 font-medium text-xs"
        title="Expand Side Navigation"
      >
        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
          <MapPin className="w-4 h-4" />
        </div>
        <span className="font-bold font-display text-slate-900">City Hub</span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </button>
    );
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[340px] md:w-[360px] z-40 hidden md:flex bg-white/95 backdrop-blur-2xl border-r border-slate-200/90 shadow-2xl flex-col text-slate-900 pointer-events-auto transition-all duration-300 font-sans">
      {/* 1. Header & Logo */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black font-display tracking-tight text-slate-900 leading-none">
              Civic Pulse
            </h1>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              {user ? user.displayName || user.email : 'Pune civic workspace'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-900 transition-colors"
          title="Collapse Panel"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Primary navigation */}
      <div className="px-4 py-4 space-y-1.5 border-b border-slate-100">
        <button
          onClick={() => onSelectNavTab('overview')}
          className={`w-full px-4 py-3 rounded-full flex items-center gap-3 font-semibold text-xs transition-all ${
            activeNavTab === 'overview'
              ? 'bg-emerald-100 text-emerald-900 shadow-sm border border-emerald-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-emerald-600" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => onSelectNavTab('my-reports')}
          className={`w-full px-4 py-3 rounded-full flex items-center gap-3 font-semibold text-xs transition-all ${
            activeNavTab === 'my-reports'
              ? 'bg-emerald-100 text-emerald-900 shadow-sm border border-emerald-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>My Reports</span>
        </button>

        <button
          onClick={() => onSelectNavTab('map')}
          className={`w-full px-4 py-3 rounded-full flex items-center gap-3 font-semibold text-xs transition-all ${
            activeNavTab === 'map'
              ? 'bg-emerald-100 text-emerald-900 shadow-sm border border-emerald-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Map className="w-4 h-4 text-emerald-600" />
          <span>Map Explorer</span>
        </button>

      </div>

      {/* 3. Search & Locality Selector */}
      <div className="p-3 relative">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search locality or ward..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowLocalityDropdown(true);
            }}
            onFocus={() => setShowLocalityDropdown(true)}
            className="w-full bg-slate-100 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 font-medium transition-all"
          />
        </div>

        {/* Locality Autocomplete */}
        {showLocalityDropdown && (
          <div className="absolute left-3 right-3 top-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50">
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

      {/* 4. Live Reports List & Filters */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 px-1">
          <span>CATEGORIES & FILTERS ({hotspots.length} Hotspots)</span>
          <button
            onClick={onToggleHotspots}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
              showHotspots
                ? 'bg-rose-100 text-rose-700 border border-rose-200'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            <Flame className="w-3 h-3 text-rose-600" />
            <span>Hotspots</span>
          </button>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1 text-xs text-slate-500 pb-1">
          <button
            onClick={() => onSelectStatus('all')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
              selectedStatus === 'all' ? 'bg-slate-200 text-slate-900' : 'hover:text-slate-900'
            }`}
          >
            All Status
          </button>
          <button
            onClick={() => onSelectStatus('open')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
              selectedStatus === 'open' ? 'bg-amber-100 text-amber-800' : 'hover:text-slate-900'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => onSelectStatus('resolved')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
              selectedStatus === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'hover:text-slate-900'
            }`}
          >
            Resolved
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
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

        <div className="space-y-2 pt-2">
          {complaints.slice(0, 5).map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectComplaint(item)}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-emerald-500 cursor-pointer transition-all shadow-sm group"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[11px] font-bold text-slate-700 truncate">{item.title}</span>
                {getSeverityBadge(item)}
              </div>
              <p className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{item.location_name}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Footer CTA & Actions */}
      <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50/80">
        <button
          onClick={onOpenReportWizard}
          className="w-full py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report Issue</span>
        </button>

        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-2">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span className="truncate max-w-[120px]">{user ? user.displayName || user.email : 'Guest'}</span>
          </div>

          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-slate-500 hover:text-rose-600 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          ) : (
            <button
              onClick={() => router.push('/?auth=login')}
              className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-bold transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
