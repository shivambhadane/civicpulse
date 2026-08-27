'use client';

import React, { useState } from 'react';
import { Complaint, ComplaintStatus } from '@/types/database';
import { Shield, CheckCircle2, Loader2, Image as ImageIcon } from 'lucide-react';

interface MockGovernmentActionBarProps {
  complaints: Complaint[];
  selectedComplaintId?: string;
  onUpdateStatus: (complaintId: string, status: ComplaintStatus, message: string, resolutionImg?: string) => void;
}

export default function MockGovernmentActionBar({
  complaints,
  selectedComplaintId,
  onUpdateStatus,
}: MockGovernmentActionBarProps) {
  const [complaintId, setComplaintId] = useState(selectedComplaintId || (complaints[0]?.id || ''));
  const [status, setStatus] = useState<ComplaintStatus>('IN_PROGRESS');
  const [message, setMessage] = useState('');
  const [resolutionImg, setResolutionImg] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const handleUploadResolutionPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setResolutionImg(data.data.url);
      }
    } catch (err) {
      console.error('Resolution photo upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSimulateUpdate = () => {
    if (!complaintId) return;

    setIsSimulating(true);
    const msg = message || `Official response: Municipal status updated to ${status}. Work logged by duty officer.`;
    onUpdateStatus(complaintId, status, msg, resolutionImg || undefined);

    setIsSimulating(false);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 4000);
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-2xl border border-amber-300 rounded-3xl p-4 z-30 shadow-2xl text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Banner Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-600 animate-pulse" />
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Mock Municipal Government Action Bar (Official Simulation Tool)
            </span>
          </div>
          {successToast && (
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-xl animate-in fade-in">
              ✓ Municipal Status Updated! Tagged source: GOVERNMENT
            </span>
          )}
        </div>

        {/* Action Controls Form */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          {/* Target Complaint Dropdown */}
          <div className="sm:col-span-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Complaint</label>
            <select
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:border-amber-500"
            >
              {complaints.map((c) => (
                <option key={c.id} value={c.id}>
                  [{c.status}] {c.title.substring(0, 30)}...
                </option>
              ))}
            </select>
          </div>

          {/* New Status Select */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Update Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:border-amber-500"
            >
              <option value="UNDER_REVIEW">UNDER REVIEW</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          {/* Official Response Note */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Official Response Note</label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g., Crew assigned for asphalt patching..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:border-amber-500"
            />
          </div>

          {/* Resolution Proof Upload & Action CTA */}
          <div className="flex items-end gap-2">
            <label className="flex-1 px-3.5 py-2 rounded-xl border border-amber-300 bg-amber-50/80 hover:bg-amber-100/90 text-amber-950 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer truncate shadow-sm transition-all">
              {isUploading ? (
                <Loader2 className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
              ) : resolutionImg ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <ImageIcon className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <span className="truncate">{resolutionImg ? 'Image Added' : 'Add Image'}</span>
              <input type="file" accept="image/*" onChange={handleUploadResolutionPhoto} className="hidden" />
            </label>

            <button
              onClick={handleSimulateUpdate}
              disabled={isSimulating || !complaintId}
              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 font-bold text-white shadow-md shadow-amber-500/20 shrink-0 transition-all"
            >
              Simulate Action
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
