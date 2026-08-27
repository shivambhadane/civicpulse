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
} from 'lucide-react';
import Image from 'next/image';

interface ListViewProps {
  complaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
}

export default function ListView({ complaints, onSelectComplaint }: ListViewProps) {
  const totalReports = complaints.length;
  const resolvedCount = complaints.filter((c) => c.status === 'RESOLVED').length;
  const pendingCount = complaints.filter((c) => c.status !== 'RESOLVED').length;
  const communityImpactPts = complaints.reduce((sum, c) => sum + c.supporters_count * 5, 35);

  const topHotspot = complaints.find((c) => c.supporters_count >= 5) || complaints[0];

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6 text-slate-900 font-sans">
      {/* 1. Citizen Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">Citizen Dashboard</h1>
          <p className="text-sm text-slate-500 font-medium">Your civic engagement summary and local insights.</p>
        </div>
      </div>

      {/* 2. Top Summary Stat Cards Grid (Matching User Screenshot) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Reports */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Reports</p>
            <p className="text-3xl font-extrabold font-display text-slate-900 mt-1">{totalReports}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <ListOrdered className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Resolved */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Resolved</p>
            <p className="text-3xl font-extrabold font-display text-emerald-600 mt-1">{resolvedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Pending */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending</p>
            <p className="text-3xl font-extrabold font-display text-amber-600 mt-1">{pendingCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Community Impact (Blue Highlight Card) */}
        <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-500 rounded-2xl p-4 shadow-md text-white flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-blue-100 uppercase tracking-wider">Community Impact</p>
            <p className="text-3xl font-extrabold font-display text-white mt-1">
              {communityImpactPts} <span className="text-xs font-normal text-blue-200">pts</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Main Content Split: My Recent Reports vs Nearby Hotspots */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): My Recent Reports */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>My Recent Reports</span>
            </h2>
            <span className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer">
              View All ({complaints.length})
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {complaints.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectComplaint(item)}
                className="py-3.5 flex items-center gap-3.5 hover:bg-slate-50/80 p-2 rounded-2xl transition-colors cursor-pointer group"
              >
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0 relative">
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

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                      {item.title}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      ● {item.status === 'RESOLVED' ? 'Resolved' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mb-1">{item.location_name}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400">
                    <span>Category: {item.category?.name || 'Civic Issue'}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">{item.supporters_count} Supporters</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (1/3): Nearby Hotspots Card (Matching Screenshot) */}
        {topHotspot && (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <h2 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-600 animate-pulse" />
                  <span>Nearby Hotspots</span>
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                  High Priority
                </span>
              </div>

              <p className="text-xs text-slate-500 mb-3">Urgent issues requiring community support in your zone.</p>

              {/* Map/Image Preview Box */}
              <div className="w-full h-32 rounded-2xl bg-slate-900 relative overflow-hidden mb-3 border border-slate-200">
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

              <h3 className="text-sm font-bold text-slate-900 mb-1">{topHotspot.title}</h3>
              <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{topHotspot.location_name}</span>
              </p>

              {/* AI Insight Pill */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-[11px] text-slate-700 flex items-center gap-2 mb-4 font-medium">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>AI Insight: High civic traffic impact detected. Priority dispatch recommended.</span>
              </div>
            </div>

            {/* Support CTA Button */}
            <button
              onClick={() => onSelectComplaint(topHotspot)}
              className="w-full py-2.5 px-4 rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>Support Issue ({topHotspot.supporters_count})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
