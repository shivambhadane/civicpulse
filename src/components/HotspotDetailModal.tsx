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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-rose-500/40 shadow-2xl shadow-rose-950/50 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-rose-500/30 bg-rose-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
              <Flame className="w-6 h-6 animate-pulse text-rose-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                Aggregated Hotspot Zone
              </span>
              <h3 className="text-base font-bold text-white">{hotspot.title}</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 text-center">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Complaints Count</span>
              <p className="text-xl font-bold font-display text-rose-400 mt-1">{hotspot.complaint_count}</p>
            </div>

            <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 text-center">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Affected Citizens</span>
              <p className="text-xl font-bold font-display text-cyan-400 mt-1">
                ~{hotspot.complaint_count * 8 + 15}
              </p>
            </div>

            <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 text-center">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Severity Weight</span>
              <p className="text-xl font-bold font-display text-amber-400 mt-1">
                {hotspot.severity_score.toFixed(1)} / 20.0
              </p>
            </div>
          </div>

          {/* Assigned Department Card */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-900/40 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Primary Assigned Department
              </span>
              <h4 className="text-xs font-bold text-cyan-300 mt-0.5">
                {hotspot.department?.name || 'Solid Waste Management (Sanitation)'}
              </h4>
            </div>
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/40">
              High Priority SLA (24h)
            </span>
          </div>

          {/* Constituent Complaints List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Grouped Complaints Constituting Hotspot ({constituentComplaints.length})
            </h4>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {constituentComplaints.length > 0 ? (
                constituentComplaints.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectComplaint(item);
                      onClose();
                    }}
                    className="glass-panel p-3 rounded-xl border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-colors flex items-center justify-between gap-3 bg-slate-900/50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 uppercase">
                          {item.severity}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate">{item.location_name}</span>
                      </div>
                      <h5 className="text-xs font-bold text-white truncate">{item.title}</h5>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                        <Users className="w-3 h-3 text-cyan-400" />
                        {item.supporters_count}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-500 hover:text-white" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 p-3">No active complaints loaded for this hotspot</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-rose-500/30 bg-slate-900/90 flex items-center justify-end">
          <button onClick={onClose} className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800">
            Close Hotspot Summary
          </button>
        </div>
      </div>
    </div>
  );
}
