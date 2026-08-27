'use client';

import React from 'react';
import { Hotspot, Complaint } from '@/types/database';
import { Flame, X, Users, ArrowRight } from 'lucide-react';

interface HotspotDetailModalProps {
  hotspot: Hotspot | null;
  isOpen: boolean;
  onClose: () => void;
  constituentComplaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
}

export default function HotspotDetailModal({
  hotspot,
  isOpen,
  onClose,
  constituentComplaints,
  onSelectComplaint,
}: HotspotDetailModalProps) {
  if (!isOpen || !hotspot) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border border-rose-200 shadow-2xl shadow-rose-900/10 overflow-hidden flex flex-col max-h-[90vh] text-slate-900 font-sans">
        {/* Header */}
        <div className="px-6 py-4 border-b border-rose-200 bg-rose-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500 text-white shadow-sm">
              <Flame className="w-6 h-6 animate-pulse text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
                Aggregated Hotspot Zone
              </span>
              <h3 className="text-base font-bold font-display text-slate-900">{hotspot.title}</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Complaints Count</span>
              <p className="text-xl font-extrabold font-display text-rose-600 mt-1">{hotspot.complaint_count}</p>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Affected Citizens</span>
              <p className="text-xl font-extrabold font-display text-emerald-700 mt-1">
                ~{hotspot.complaint_count * 8 + 15}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Severity Weight</span>
              <p className="text-xl font-extrabold font-display text-amber-600 mt-1">
                {hotspot.severity_score.toFixed(1)} / 20.0
              </p>
            </div>
          </div>

          {/* Assigned Department Card */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Primary Assigned Department
              </span>
              <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                {hotspot.department?.name || 'Solid Waste Management (Sanitation)'}
              </h4>
            </div>
            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200">
              High Priority SLA (24h)
            </span>
          </div>

          {/* Constituent Complaints List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Grouped Complaints Constituting Hotspot ({constituentComplaints.length})
            </h4>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {constituentComplaints.length > 0 ? (
                constituentComplaints.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectComplaint(item);
                      onClose();
                    }}
                    className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 cursor-pointer transition-colors flex items-center justify-between gap-3 bg-white shadow-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-emerald-800 uppercase">
                          {item.severity}
                        </span>
                        <span className="text-[10px] text-slate-500 truncate">{item.location_name}</span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 truncate">{item.title}</h5>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
                        <Users className="w-3 h-3 text-emerald-600" />
                        {item.supporters_count}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 hover:text-slate-900" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 p-3 font-medium">No active complaints loaded for this hotspot</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end">
          <button onClick={onClose} className="px-5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors">
            Close Hotspot Summary
          </button>
        </div>
      </div>
    </div>
  );
}
