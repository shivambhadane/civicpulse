'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Complaint, ComplaintStatus } from '@/types/database';
import { getStoredComplaints, updateComplaintStatusInStore, getStoredHotspots } from '@/lib/dataStore';
import {
  Building2,
  CheckCircle2,
  Clock,
  Filter,
  ArrowLeft,
  Flame,
  Search,
  MapPin,
  Send,
  AlertTriangle,
} from 'lucide-react';
import Image from 'next/image';

export default function AdminPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected complaint for status update modal
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);
  const [updateStatus, setUpdateStatus] = useState<ComplaintStatus>('IN_PROGRESS');
  const [updateNote, setUpdateNote] = useState<string>('');
  const [resolutionPhoto, setResolutionPhoto] = useState<string>('');

  useEffect(() => {
    setComplaints(getStoredComplaints());
  }, []);

  const refreshData = () => {
    setComplaints(getStoredComplaints());
  };

  const filtered = complaints.filter((c) => {
    if (selectedDepartment !== 'all' && c.department_id !== selectedDepartment && c.ai_department !== selectedDepartment) {
      return false;
    }
    if (selectedStatus !== 'all' && c.status !== selectedStatus) {
      return false;
    }
    if (
      searchQuery &&
      !c.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.location_name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const totalGrievances = complaints.length;
  const criticalCount = complaints.filter((c) => c.severity === 'CRITICAL' && c.status !== 'RESOLVED').length;
  const pendingCount = complaints.filter((c) => c.status !== 'RESOLVED').length;
  const resolvedCount = complaints.filter((c) => c.status === 'RESOLVED').length;
  const hotspotsCount = getStoredHotspots().length;

  const handleApplyStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComplaint) return;

    updateComplaintStatusInStore(
      activeComplaint.id,
      updateStatus,
      updateNote || `Official status updated to ${updateStatus}`,
      resolutionPhoto || undefined
    );

    refreshData();
    setActiveComplaint(null);
    setUpdateNote('');
    setResolutionPhoto('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* 1. Header Navigation */}
      <header className="fixed top-0 w-full z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Citizen Dashboard</span>
          </Link>
          <div className="h-5 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-xs">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold font-display text-white">Municipal Official Portal</h1>
              <p className="text-[10px] text-slate-400">Ward Engineer & Dispatch Console</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Dispatch Node
          </span>
        </div>
      </header>

      {/* 2. Main Admin Dashboard Area */}
      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto space-y-6">
        {/* Metric Cards Header */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
              <span>ACTIVE QUEUE</span>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-3xl font-black font-display text-white">{totalGrievances}</div>
            <div className="text-[11px] text-slate-500">{pendingCount} pending action</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-rose-400">
              <span>CRITICAL ALERTS</span>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-3xl font-black font-display text-rose-400">{criticalCount}</div>
            <div className="text-[11px] text-slate-500">Requires SLA dispatch</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-emerald-400">
              <span>RESOLVED ISSUES</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-black font-display text-emerald-400">{resolvedCount}</div>
            <div className="text-[11px] text-slate-500">Community verified</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-amber-400">
              <span>HOTSPOT ZONES</span>
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-black font-display text-amber-400">{hotspotsCount}</div>
            <div className="text-[11px] text-slate-500">Clustered grievances</div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Filter by title or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Filter className="w-4 h-4" />
              <span>Dept:</span>
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Departments</option>
              <option value="dept-1">Roads & Maintenance</option>
              <option value="dept-2">Solid Waste Management</option>
              <option value="dept-3">Water & Drainage</option>
              <option value="dept-4">Electrical & Lighting</option>
              <option value="dept-5">Public Safety</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Statuses</option>
              <option value="SUBMITTED font-bold">SUBMITTED</option>
              <option value="UNDER_REVIEW">UNDER_REVIEW</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>
        </div>

        {/* Grievance Management Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-sm font-bold text-white font-display">Official Triage & Action Queue</h2>
            <span className="text-xs text-slate-400 font-medium">Showing {filtered.length} complaints</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Grievance</th>
                  <th className="px-6 py-3.5">Department</th>
                  <th className="px-6 py-3.5">Severity</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Supporters</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 overflow-hidden relative shrink-0 border border-slate-700">
                          {item.image_urls && item.image_urls.length > 0 ? (
                            <Image src={item.image_urls[0]} alt={item.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500">
                              <MapPin className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white max-w-xs truncate">{item.title}</div>
                          <div className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>{item.location_name}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {item.department?.name || item.ai_department || 'Municipal Dept'}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.severity === 'CRITICAL'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : item.severity === 'HIGH'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.severity}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.status === 'RESOLVED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : item.status === 'IN_PROGRESS'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-bold text-emerald-400">
                      {item.supporters_count} votes
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setActiveComplaint(item);
                          setUpdateStatus(item.status);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Official Status Update Modal */}
      {activeComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white font-display">Update Officer Status</h3>
                <p className="text-xs text-slate-400 mt-0.5">{activeComplaint.title}</p>
              </div>
              <button
                onClick={() => setActiveComplaint(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleApplyStatusUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">New Workflow Status</label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value as ComplaintStatus)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="UNDER_REVIEW">UNDER_REVIEW (Assigned to Field Team)</option>
                  <option value="IN_PROGRESS">IN_PROGRESS (Team On-Site)</option>
                  <option value="RESOLVED">RESOLVED (Issue Fixed & Closed)</option>
                  <option value="REJECTED">REJECTED (Invalid or Out of Scope)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Official Resolution Note</label>
                <textarea
                  rows={3}
                  placeholder="Provide status update details or field engineer notes..."
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Resolution Image URL (Optional proof)
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={resolutionPhoto}
                  onChange={(e) => setResolutionPhoto(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveComplaint(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Save Status Change</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
