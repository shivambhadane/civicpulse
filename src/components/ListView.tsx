'use client';

import React from 'react';
import { Complaint } from '@/types/database';
import {
  CheckCircle2,
  Clock,
  Flame,
  ListOrdered,
  Sparkles,
  ThumbsUp,
  MapPin,
  TrendingUp,
  Megaphone,
} from 'lucide-react';
import Image from 'next/image';

interface ListViewProps {
  complaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
  onOpenReportWizard?: () => void;
  onSwitchToMapView?: () => void;
}

export default function ListView({
  complaints,
  onSelectComplaint,
  onOpenReportWizard,
  onSwitchToMapView,
}: ListViewProps) {
  const totalReports = complaints.length;
  const resolvedCount = complaints.filter((c) => c.status === 'RESOLVED').length;
  const pendingCount = complaints.filter((c) => c.status !== 'RESOLVED').length;
  const communityImpactPts = complaints.reduce((sum, c) => sum + c.supporters_count * 5, 35);

  const topHotspot = complaints.find((c) => c.supporters_count >= 5) || complaints[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-slate-900 font-sans">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Pune · Civic workspace</p>
          <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
            Your neighbourhood, at a glance
          </h2>
          <p className="text-sm text-slate-600 font-medium mt-1">
            Real-time civic engagement summary and live ward map.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {onSwitchToMapView && (
            <button
              onClick={onSwitchToMapView}
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 font-bold text-xs px-4 py-3 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
            <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Full Screen Map</span>
            </button>
          )}
          {onOpenReportWizard && (
            <button
              onClick={onOpenReportWizard}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 shrink-0 transition-all hover:scale-105"
            >
              <Megaphone className="w-4 h-4" />
              <span>New Report</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Bento Grid Layout - Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Total Reports */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Reports</span>
            <ListOrdered className="w-5 h-5 text-emerald-700" />
          </div>
          <div className="mt-3 text-3xl font-black font-display text-slate-900">{totalReports}</div>
        </div>

        {/* Card 2: Resolved */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Resolved</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-3 text-3xl font-black font-display text-emerald-600">{resolvedCount}</div>
        </div>

        {/* Card 3: Pending */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="mt-3 text-3xl font-black font-display text-amber-600">{pendingCount}</div>
        </div>

        {/* Card 4: Community Impact */}
        <div className="bg-gradient-to-tr from-emerald-700 to-teal-700 border border-emerald-600 rounded-2xl p-4 shadow-md text-white flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">Community Impact</span>
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div className="mt-3 text-3xl font-black font-display text-white relative z-10 flex items-baseline gap-1">
            {communityImpactPts} <span className="text-xs font-normal text-emerald-200">pts</span>
          </div>
        </div>
      </div>

      {/* 3. Main content: reports and the highest-impact issue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (lg:col-span-8): My Recent Reports */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>My Recent Reports</span>
            </h3>
            <span className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer">
              View All ({complaints.length})
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {complaints.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectComplaint(item)}
                className="p-4 sm:p-5 flex gap-4 hover:bg-slate-50/80 transition-colors group cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200/80 shrink-0 overflow-hidden relative">
                  {item.image_urls && item.image_urls.length > 0 ? (
                    <Image
                      src={item.image_urls[0]}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                      {item.title}
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
                        item.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      ● {item.status === 'RESOLVED' ? 'Resolved' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mb-1.5">{item.location_name}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                    <span>Category: {item.category?.name || 'Civic Issue'}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">{item.supporters_count} Supporters</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (lg:col-span-4): Nearby Hotspots Card */}
        <div className="lg:col-span-4 flex flex-col">
          {topHotspot && (
            <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm flex flex-col overflow-hidden h-full">
              <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-600 animate-pulse" />
                  <span>Nearby Hotspots</span>
                </h3>
                <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-[10px] font-bold border border-rose-200">
                  High Priority
                </span>
              </div>

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="w-full h-32 rounded-2xl bg-slate-900 relative overflow-hidden border border-slate-200 mb-3">
                    {topHotspot.image_urls && topHotspot.image_urls.length > 0 ? (
                      <Image
                        src={topHotspot.image_urls[0]}
                        alt={topHotspot.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-slate-900 to-slate-800 flex items-center justify-center text-rose-400 font-bold text-xs p-4 text-center">
                        🔥 Hotspot Zone ({topHotspot.supporters_count} citizens affected)
                      </div>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{topHotspot.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{topHotspot.location_name}</span>
                  </p>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[11px] text-slate-700 flex items-center gap-2 mt-3 font-medium">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>AI Insight: High civic traffic impact detected. Priority dispatch recommended.</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectComplaint(topHotspot)}
                  className="w-full border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold text-xs py-2.5 rounded-xl transition-colors flex justify-center items-center gap-2"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Support Issue ({topHotspot.supporters_count})</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
