'use client';

import React from 'react';
import { Complaint } from '@/types/database';
import { Users, ArrowRight, AlertTriangle } from 'lucide-react';

interface ListViewProps {
  complaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
}

export default function ListView({ complaints, onSelectComplaint }: ListViewProps) {
  if (complaints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
        <AlertTriangle className="w-10 h-10 text-slate-600 mb-3" />
        <h3 className="text-base font-bold text-white">No Complaints Found</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          Try clearing your filters or select a different category to view active civic grievances.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {complaints.map(item => (
        <div
          key={item.id}
          onClick={() => onSelectComplaint(item)}
          className="glass-panel-interactive rounded-2xl p-4 flex flex-col justify-between cursor-pointer border border-slate-800 hover:border-cyan-500/40 transition-all"
        >
          <div>
            {/* Header badges */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {item.category?.name || 'Civic Issue'}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  item.status === 'RESOLVED'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : item.status === 'IN_PROGRESS'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {item.status.replace('_', ' ')}
              </span>
            </div>

            {/* Media image if present */}
            {item.image_urls && item.image_urls.length > 0 && (
              <div className="rounded-xl overflow-hidden mb-3 h-36 border border-slate-800">
                <img src={item.image_urls[0]} alt={item.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Title & Description */}
            <h3 className="text-sm font-bold text-white line-clamp-2 mb-1">{item.title}</h3>
            <p className="text-xs text-slate-400 line-clamp-2 mb-3">{item.description}</p>
          </div>

          {/* Footer Metadata */}
          <div className="border-t border-slate-800/80 pt-3 mt-2 flex items-center justify-between text-xs">
            <span className="text-cyan-400 font-semibold flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {item.supporters_count} affected
            </span>
            <span className="text-slate-400 hover:text-white flex items-center gap-1 font-semibold text-[11px]">
              View Details <ArrowRight className="w-3 h-3 text-cyan-400" />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
