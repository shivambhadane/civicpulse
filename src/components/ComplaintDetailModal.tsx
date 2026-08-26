'use client';

import React, { useState } from 'react';
import { Complaint } from '@/types/database';
import { X, Users, MapPin, CheckCircle2, Shield, Sparkles, User, Calendar, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ComplaintDetailModalProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
  onSupport: (complaintId: string) => void;
  isSupportedByUser: boolean;
}

export default function ComplaintDetailModal({
  complaint,
  isOpen,
  onClose,
  onSupport,
  isSupportedByUser,
}: ComplaintDetailModalProps) {
  const [isFixVerified, setIsFixVerified] = useState(false);

  if (!isOpen || !complaint) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleSupportClick = () => {
    onSupport(complaint.id);
    triggerConfetti();
  };

  const handleVerifyFixClick = () => {
    setIsFixVerified(true);
    triggerConfetti();
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'GOVERNMENT':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
            <Shield className="w-3 h-3 text-amber-400" /> Official Response
          </span>
        );
      case 'AI':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" /> AI Inference
          </span>
        );
      case 'SYSTEM':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
            System Automation
          </span>
        );
      case 'CITIZEN':
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1">
            <User className="w-3 h-3 text-blue-400" /> Citizen Input
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl glass-panel rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                complaint.status === 'RESOLVED'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : complaint.status === 'IN_PROGRESS'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              {complaint.status.replace('_', ' ')}
            </span>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 uppercase border border-slate-700">
              Severity: {complaint.severity}
            </span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Title & Meta Header */}
          <div>
            <h2 className="text-xl font-bold font-display text-white">{complaint.title}</h2>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
                <MapPin className="w-3.5 h-3.5" />
                {complaint.location_name}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Reported {new Date(complaint.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                Assigned: {complaint.department?.name || complaint.ai_department || 'Municipal Corporation'}
              </span>
            </div>
          </div>

          {/* Photo Media Gallery */}
          {complaint.image_urls && complaint.image_urls.length > 0 && (
            <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-900/50 max-h-72">
              <img src={complaint.image_urls[0]} alt={complaint.title} className="w-full h-full object-cover max-h-72" />
            </div>
          )}

          {/* Description */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-900/40">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Issue Description</h4>
            <p className="text-sm text-slate-200 leading-relaxed">{complaint.description}</p>
          </div>

          {/* Community Support Counter & Upvote Action */}
          <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  {complaint.supporters_count} Affected Neighborhood Citizens
                </h4>
                <p className="text-xs text-slate-400">Upvoting increments issue urgency and triggers municipal hotspot escalation.</p>
              </div>
            </div>

            <button
              onClick={handleSupportClick}
              disabled={isSupportedByUser}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
                isSupportedByUser
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/25 hover:scale-105 active:scale-95'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSupportedByUser ? 'You Supported This Issue' : "I'm Affected Too"}</span>
            </button>
          </div>

          {/* Chronological Status Timeline (Source Tagged) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              Auditable Status Timeline & Action Log
            </h4>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {complaint.updates && complaint.updates.length > 0 ? (
                complaint.updates.map((update, idx) => (
                  <div key={update.id || idx} className="relative flex flex-col gap-1">
                    <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-cyan-500 ring-4 ring-slate-950" />

                    <div className="flex items-center gap-2">
                      {getSourceBadge(update.source)}
                      <span className="text-[11px] text-slate-500">
                        {new Date(update.created_at).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 font-medium mt-1">{update.message}</p>

                    {/* Official Resolution Photo Proof */}
                    {update.image_url && (
                      <div className="mt-2 rounded-xl overflow-hidden border border-emerald-500/40 max-w-sm">
                        <span className="text-[10px] bg-emerald-950/80 text-emerald-300 px-2 py-0.5 font-bold uppercase block border-b border-emerald-500/40">
                          Resolution Photo Proof
                        </span>
                        <img src={update.image_url} alt="Resolution Evidence" className="w-full h-40 object-cover" />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500">Initial submission record active</div>
              )}
            </div>
          </div>

          {/* Citizen Verification Section for Resolved Issues */}
          {complaint.status === 'RESOLVED' && (
            <div className="glass-panel p-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Official Fix Published
                </h4>
                <p className="text-xs text-slate-400">Did the municipal crew resolve this issue to your satisfaction?</p>
              </div>

              {isFixVerified ? (
                <span className="px-4 py-2 rounded-xl bg-emerald-500/30 text-emerald-200 text-xs font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Fix Verified by Citizen
                </span>
              ) : (
                <button
                  onClick={handleVerifyFixClick}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all"
                >
                  Verify Fix Satisfactory
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-end">
          <button onClick={onClose} className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
