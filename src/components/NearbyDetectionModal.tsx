'use client';

import React from 'react';
import { NearbyComplaintMatch } from '@/types/database';
import { AlertTriangle, Users, CheckCircle, PlusCircle, X } from 'lucide-react';
import Image from 'next/image';

interface NearbyDetectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  matches: NearbyComplaintMatch[];
  onSupportExisting: (complaintId: string) => void;
  onProceedWithNew: () => void;
}

export default function NearbyDetectionModal({
  isOpen,
  onClose,
  matches,
  onSupportExisting,
  onProceedWithNew,
}: NearbyDetectionModalProps) {
  if (!isOpen || matches.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900 font-sans animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-amber-200 bg-amber-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-white shadow-sm">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-slate-900">Is this problem already reported?</h3>
              <p className="text-xs text-amber-800 font-medium">
                Found {matches.length} active complaint{matches.length > 1 ? 's' : ''} within 300m of your pin
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Candidate Duplicate Cards List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <p className="text-xs text-slate-600 font-medium">
            Upvoting existing complaints consolidates neighborhood voice and escalates urgency without clogging municipal departments with duplicate tickets:
          </p>

          {matches.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-slate-50"
            >
              {/* Media Thumbnail */}
              {item.image_urls && item.image_urls.length > 0 ? (
                <div className="w-full sm:w-20 h-20 rounded-xl overflow-hidden border border-slate-200 relative shrink-0">
                  <Image src={item.image_urls[0]} alt={item.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-full sm:w-20 h-20 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-500 text-xs shrink-0 font-medium">
                  No Image
                </div>
              )}

              {/* Info Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {item.distance_meters}m away
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {item.status.replace('_', ' ')}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.description}</p>

                <div className="flex items-center gap-3 mt-2 text-[11px] text-emerald-700 font-bold">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-emerald-600" />
                    {item.supporters_count} affected citizens
                  </span>
                </div>
              </div>

              {/* Action Upvote Button */}
              <button
                onClick={() => onSupportExisting(item.id)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 shrink-0 transition-all"
              >
                <CheckCircle className="w-4 h-4" />
                <span>I&apos;m Affected Too</span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer OR Divider & Proceed Action */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500 font-medium text-center sm:text-left">
            Is your problem completely distinct from these existing reports?
          </span>

          <button
            onClick={onProceedWithNew}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-200 text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>Report as a Different Issue</span>
          </button>
        </div>
      </div>
    </div>
  );
}
