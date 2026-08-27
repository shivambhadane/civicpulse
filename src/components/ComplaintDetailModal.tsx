'use client';

import React, { useState } from 'react';
import { Complaint } from '@/types/database';
import { X, Users, MapPin, CheckCircle2, Shield, Sparkles, User, Calendar, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import Image from 'next/image';

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
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
            <Shield className="w-3 h-3 text-amber-600" /> Official Response
          </span>
        );
      case 'AI':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-600" /> AI Inference
          </span>
        );
      case 'SYSTEM':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
            System Automation
          </span>
        );
      case 'CITIZEN':
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
            <User className="w-3 h-3 text-blue-600" /> Citizen Input
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-900 font-sans">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                complaint.status === 'RESOLVED'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : complaint.status === 'IN_PROGRESS'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-rose-100 text-rose-800 border border-rose-200'
              }`}
            >
              ● {complaint.status.replace('_', ' ')}
            </span>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 uppercase border border-slate-200">
              Severity: {complaint.severity}
            </span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Title & Meta Header */}
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900">{complaint.title}</h2>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                {complaint.location_name}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Reported {new Date(complaint.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                Assigned: {complaint.department?.name || complaint.ai_department || 'Municipal Corporation'}
              </span>
            </div>
          </div>

          {/* Photo Media Gallery */}
          {complaint.image_urls && complaint.image_urls.length > 0 && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 max-h-72 relative h-64">
              <Image src={complaint.image_urls[0]} alt={complaint.title} fill className="object-cover" />
            </div>
          )}

          {/* Submitted Issue Map Location Preview */}
          <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-4 relative flex flex-col justify-between min-h-[170px] shadow-lg">
            {/* Dynamic Vector Canvas Grid & Roads */}
            <div className="absolute inset-0 opacity-45 pointer-events-none">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="detailGridPattern" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1" />
                    <circle cx="0" cy="0" r="1.5" fill="rgba(56, 189, 248, 0.4)" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#detailGridPattern)" />
                <path d="M -50 120 Q 180 30 400 200 T 800 100" fill="none" stroke="rgba(14, 165, 233, 0.35)" strokeWidth="20" strokeLinecap="round" />
                <path d="M 180 -20 Q 300 200 150 500" fill="none" stroke="rgba(14, 165, 233, 0.25)" strokeWidth="14" strokeLinecap="round" />
              </svg>
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-slate-900/90 px-2.5 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400" />
                Submitted Report Location Map Preview
              </span>
              <span className="text-[10px] text-slate-400 font-mono bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-800">
                {complaint.latitude.toFixed(5)}°N, {complaint.longitude.toFixed(5)}°E
              </span>
            </div>

            <div className="relative z-10 my-3 flex justify-center">
              <div className="flex flex-col items-center animate-bounce">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500 border-2 border-white text-slate-950 flex items-center justify-center shadow-2xl shadow-cyan-500/50">
                  <MapPin className="w-6 h-6 fill-current text-slate-950" />
                </div>
                <div className="w-3 h-3 bg-cyan-400 rotate-45 -mt-1 shadow-md" />
              </div>
            </div>

            <div className="relative z-10 bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-200 font-bold truncate flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                {complaint.location_name}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Issue Description</h4>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">{complaint.description}</p>
          </div>

          {/* Community Support Counter & Upvote Action */}
          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  {complaint.supporters_count} Affected Neighborhood Citizens
                </h4>
                <p className="text-xs text-slate-600 font-medium">Upvoting increments issue urgency and triggers municipal hotspot escalation.</p>
              </div>
            </div>

            <button
              onClick={handleSupportClick}
              disabled={isSupportedByUser}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                isSupportedByUser
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:scale-105 active:scale-95'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSupportedByUser ? 'You Supported This Issue' : "I'm Affected Too"}</span>
            </button>
          </div>

          {/* Chronological Status Timeline (Source Tagged) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Auditable Status Timeline & Action Log
            </h4>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {complaint.updates && complaint.updates.length > 0 ? (
                complaint.updates.map((update, idx) => (
                  <div key={update.id || idx} className="relative flex flex-col gap-1">
                    <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white" />

                    <div className="flex items-center gap-2">
                      {getSourceBadge(update.source)}
                      <span className="text-[11px] text-slate-500 font-medium">
                        {new Date(update.created_at).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 font-semibold mt-1">{update.message}</p>

                    {/* Official Resolution Photo Proof */}
                    {update.image_url && (
                      <div className="mt-2 rounded-xl overflow-hidden border border-emerald-300 max-w-sm relative h-40">
                        <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 font-bold uppercase block z-10 relative">
                          Resolution Photo Proof
                        </span>
                        <Image src={update.image_url} alt="Resolution Evidence" fill className="object-cover" />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 font-medium">Initial submission record active</div>
              )}
            </div>
          </div>

          {/* Citizen Verification Section for Resolved Issues */}
          {complaint.status === 'RESOLVED' && (
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Official Fix Published
                </h4>
                <p className="text-xs text-slate-600 font-medium">Did the municipal crew resolve this issue to your satisfaction?</p>
              </div>

              {isFixVerified ? (
                <span className="px-4 py-2 rounded-xl bg-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-700" />
                  Fix Verified by Citizen
                </span>
              ) : (
                <button
                  onClick={handleVerifyFixClick}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
                >
                  Verify Fix Satisfactory
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end">
          <button onClick={onClose} className="px-5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
