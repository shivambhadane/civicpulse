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

  const supportedComplaints = allComplaints.filter(c => supportedIds.includes(c.id));
  const reportedComplaints = allComplaints.filter(c => c.user_id === userId);

  const displayed = activeTab === 'supported' ? supportedComplaints : reportedComplaints;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-base font-bold text-white">My Activity & Tracked Issues</h3>
                <p className="text-xs text-slate-400 font-mono">ID: {userId}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center border-b border-slate-800 bg-slate-950/50 p-1 text-xs">
            <button
              onClick={() => setActiveTab('supported')}
              className={`flex-1 py-2 rounded-xl font-bold transition-colors ${
                activeTab === 'supported'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Supported Issues ({supportedComplaints.length})
            </button>

            <button
              onClick={() => setActiveTab('reported')}
              className={`flex-1 py-2 rounded-xl font-bold transition-colors ${
                activeTab === 'reported'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              My Reports ({reportedComplaints.length})
            </button>
          </div>

          {/* Activity Cards List */}
          <div className="p-4 overflow-y-auto flex-1 space-y-3">
            {displayed.length > 0 ? (
              displayed.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectComplaint(item);
                    onClose();
                  }}
                  className="glass-panel p-3.5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all bg-slate-900/60"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 uppercase">
                      {item.category?.name || 'Civic Issue'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        item.status === 'RESOLVED'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : item.status === 'IN_PROGRESS'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white line-clamp-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{item.description}</p>

                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 mt-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-cyan-400" />
                      {item.supporters_count} supporters
                    </span>
                    <span className="text-cyan-400 flex items-center font-semibold hover:underline">
                      View Timeline <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">
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
