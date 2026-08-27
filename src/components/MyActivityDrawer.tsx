'use client';

import React, { useState } from 'react';
import { Complaint } from '@/types/database';
import { X, Activity, Users, ChevronRight, AlertCircle } from 'lucide-react';

interface MyActivityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  allComplaints: Complaint[];
  supportedIds: string[];
  userId: string;
  onSelectComplaint: (complaint: Complaint) => void;
}

export default function MyActivityDrawer({
  isOpen,
  onClose,
  allComplaints,
  supportedIds,
  userId,
  onSelectComplaint,
}: MyActivityDrawerProps) {
  const [activeTab, setActiveTab] = useState<'supported' | 'reported'>('supported');

  if (!isOpen) return null;

  const supportedComplaints = allComplaints.filter((c) => supportedIds.includes(c.id));
  const reportedComplaints = allComplaints.filter((c) => c.user_id === userId);

  const displayed = activeTab === 'supported' ? supportedComplaints : reportedComplaints;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white/95 backdrop-blur-2xl border-l border-slate-200 shadow-2xl flex flex-col text-slate-900 font-sans">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-base font-bold font-display text-slate-900">My Activity & Tracked Issues</h3>
                <p className="text-xs text-slate-500 font-mono">ID: {userId}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center border-b border-slate-100 bg-slate-50 p-1 text-xs">
            <button
              onClick={() => setActiveTab('supported')}
              className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                activeTab === 'supported'
                  ? 'bg-white text-emerald-800 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Supported Issues ({supportedComplaints.length})
            </button>

            <button
              onClick={() => setActiveTab('reported')}
              className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                activeTab === 'reported'
                  ? 'bg-white text-emerald-800 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Reports ({reportedComplaints.length})
            </button>
          </div>

          {/* Activity Cards List */}
          <div className="p-4 overflow-y-auto flex-1 space-y-3">
            {displayed.length > 0 ? (
              displayed.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectComplaint(item);
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-500 cursor-pointer transition-all bg-white shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                      {item.category?.name || 'Civic Issue'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        item.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : item.status === 'IN_PROGRESS'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      ● {item.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{item.description}</p>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-2 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-semibold">
                      <Users className="w-3 h-3 text-emerald-600" />
                      {item.supporters_count} supporters
                    </span>
                    <span className="text-emerald-700 flex items-center font-bold hover:underline">
                      View Timeline <ChevronRight className="w-3 h-3 text-emerald-600" />
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">
                  {activeTab === 'supported'
                    ? 'You have not supported any issues yet. Click "I\'m affected too" on map markers to track neighborhood grievances here!'
                    : 'You have not reported any issues yet. Click "+ Report Issue" to submit your first report!'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
