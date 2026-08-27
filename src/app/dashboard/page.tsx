'use client';

import React, { useState, useEffect } from 'react';
import GoogleMapView from '@/components/GoogleMapView';
import ListView from '@/components/ListView';
import AppleMapsLeftPanel from '@/components/AppleMapsLeftPanel';
import AppleMapsRightControls from '@/components/AppleMapsRightControls';
import ReportWizardModal from '@/components/ReportWizardModal';
import NearbyDetectionModal from '@/components/NearbyDetectionModal';
import ComplaintDetailModal from '@/components/ComplaintDetailModal';
import HotspotDetailModal from '@/components/HotspotDetailModal';
import MyActivityDrawer from '@/components/MyActivityDrawer';
import MockGovernmentActionBar from '@/components/MockGovernmentActionBar';

import { Complaint, Hotspot, Category, Department, NearbyComplaintMatch, ComplaintStatus } from '@/types/database';
import {
  getStoredComplaints,
  getStoredHotspots,
  getOrCreateUserId,
  getSupportedComplaintIds,
  supportComplaintInStore,
  updateComplaintStatusInStore,
  findNearbyComplaintsFromStore,
} from '@/lib/dataStore';
import { INITIAL_CATEGORIES, INITIAL_DEPARTMENTS } from '@/lib/mockData';
import { Bell, Home, Shield } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [departments] = useState<Department[]>(INITIAL_DEPARTMENTS);

  // Nav & Filter State
  const [activeNavTab, setActiveNavTab] = useState<'overview' | 'my-reports' | 'map' | 'analytics'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [isOfficialMode, setIsOfficialMode] = useState<boolean>(false);
  const [centerCoordinate, setCenterCoordinate] = useState<{ lat: number; lng: number } | undefined>(undefined);

  // User State
  const [userId, setUserId] = useState<string>('');
  const [supportedIds, setSupportedIds] = useState<string[]>([]);

  // Modals State
  const [isReportWizardOpen, setIsReportWizardOpen] = useState(false);
  const [isActivityDrawerOpen, setIsActivityDrawerOpen] = useState(false);

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [isHotspotModalOpen, setIsHotspotModalOpen] = useState(false);

  // Nearby Duplicate Check Modal State
  const [nearbyMatches, setNearbyMatches] = useState<NearbyComplaintMatch[]>([]);
  const [isNearbyModalOpen, setIsNearbyModalOpen] = useState(false);
  const [pendingWizardProceedCallback, setPendingWizardProceedCallback] = useState<(() => void) | null>(null);

  // Initialize data on mount
  useEffect(() => {
    const uid = getOrCreateUserId();
    setUserId(uid);
    setSupportedIds(getSupportedComplaintIds());

    // Fetch stored data
    setComplaints(getStoredComplaints());
    setHotspots(getStoredHotspots());
  }, []);

  // Refresh complaints list helper
  const refreshData = () => {
    setComplaints(getStoredComplaints());
    setHotspots(getStoredHotspots());
    setSupportedIds(getSupportedComplaintIds());
  };

  // Filtered Complaints
  const filteredComplaints = complaints.filter((item) => {
    if (selectedCategory !== 'all' && item.category?.slug !== selectedCategory && item.category_id !== selectedCategory) {
      return false;
    }
    if (selectedStatus === 'open' && (item.status === 'RESOLVED' || item.status === 'REJECTED')) {
      return false;
    }
    if (selectedStatus === 'resolved' && item.status !== 'RESOLVED') {
      return false;
    }
    if (selectedStatus !== 'all' && selectedStatus !== 'open' && selectedStatus !== 'resolved' && item.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  // Handle Nav Tab Selection
  const handleNavTabSelect = (tab: 'overview' | 'my-reports' | 'map' | 'analytics') => {
    setActiveNavTab(tab);
    if (tab === 'overview') {
      setViewMode('list');
    } else if (tab === 'map') {
      setViewMode('map');
    } else if (tab === 'my-reports') {
      setIsActivityDrawerOpen(true);
    }
  };

  // Handle Nearby Check Trigger from Wizard
  const handleTriggerNearbyCheck = async (
    lat: number,
    lng: number,
    description: string,
    callbackToProceed: () => void
  ) => {
    const nearby = findNearbyComplaintsFromStore(lat, lng, 300);

    if (nearby.length > 0) {
      try {
        const res = await fetch('/api/ai/similar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            description,
            nearby_complaints: nearby,
          }),
        });
        const data = await res.json();

        if (data.success && data.data?.has_similar && data.data?.matches?.length > 0) {
          const matchIds = data.data.matches.map((m: { complaint_id: string }) => m.complaint_id);
          const candidateDetails = nearby.filter((n) => matchIds.includes(n.id));

          setNearbyMatches(candidateDetails.length > 0 ? candidateDetails : nearby);
          setPendingWizardProceedCallback(() => callbackToProceed);
          setIsNearbyModalOpen(true);
          return;
        }
      } catch (e) {
        console.warn('Similarity check error:', e);
      }
    }

    callbackToProceed();
  };

  // Upvote Existing Complaint Action
  const handleSupportExisting = (complaintId: string) => {
    supportComplaintInStore(complaintId);
    refreshData();
    setIsNearbyModalOpen(false);
    setIsReportWizardOpen(false);

    const updated = getStoredComplaints().find((c) => c.id === complaintId);
    if (updated) {
      setSelectedComplaint(updated);
      setIsDetailModalOpen(true);
    }
  };

  // Support Complaint from Detail Modal
  const handleSupportFromDetail = (complaintId: string) => {
    const updated = supportComplaintInStore(complaintId);
    refreshData();
    if (updated) {
      setSelectedComplaint(updated);
    }
  };

  // Mock Government Official Update Action
  const handleOfficialUpdateStatus = (
    complaintId: string,
    status: ComplaintStatus,
    message: string,
    resolutionImg?: string
  ) => {
    const updated = updateComplaintStatusInStore(complaintId, status, message, resolutionImg);
    refreshData();
    if (selectedComplaint && selectedComplaint.id === complaintId && updated) {
      setSelectedComplaint(updated);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row overflow-x-hidden">
      {/* Mobile Header Bar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 h-14 bg-white border-b border-slate-200 shadow-sm md:hidden">
        <div className="flex items-center gap-2">
          <Link href="/" className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100">
            <Home className="w-4 h-4" />
          </Link>
          <span className="text-sm font-extrabold text-slate-950 font-display">Civic Pulse</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin" className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span>Admin</span>
          </Link>
          <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600">
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 1. Side Navigation Bar */}
      <AppleMapsLeftPanel
        complaints={filteredComplaints}
        hotspots={hotspots}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
        showHotspots={showHotspots}
        onToggleHotspots={() => setShowHotspots(!showHotspots)}
        onSelectComplaint={(c) => {
          setSelectedComplaint(c);
          setIsDetailModalOpen(true);
        }}
        onOpenReportWizard={() => setIsReportWizardOpen(true)}
        onSelectLocation={(lat, lng) => setCenterCoordinate({ lat, lng })}
        activeNavTab={activeNavTab}
        onSelectNavTab={handleNavTabSelect}
      />

      {/* 2. Right Floating Dock Controls */}
      <AppleMapsRightControls
        isOfficialMode={isOfficialMode}
        onToggleOfficialMode={() => setIsOfficialMode(!isOfficialMode)}
        onOpenActivityDrawer={() => setIsActivityDrawerOpen(true)}
        supportedCount={supportedIds.length}
        viewMode={viewMode}
        onToggleViewMode={(mode) => {
          setViewMode(mode);
          if (mode === 'list') setActiveNavTab('overview');
          else if (mode === 'map') setActiveNavTab('map');
        }}
      />

      {/* 3. Main Content Area */}
      <div className="flex-1 md:ml-[360px] min-h-screen relative bg-slate-50">
        {/* Full-Screen Map (Only active in 'map' view) */}
        {viewMode === 'map' ? (
          <div className="fixed inset-0 md:ml-[360px] z-0 overflow-hidden">
            <GoogleMapView
              complaints={filteredComplaints}
              hotspots={hotspots}
              selectedCategory={selectedCategory}
              selectedStatus={selectedStatus}
              showHotspots={showHotspots}
              onSelectComplaint={(c) => {
                setSelectedComplaint(c);
                setIsDetailModalOpen(true);
              }}
              onSelectHotspot={(h) => {
                setSelectedHotspot(h);
                setIsHotspotModalOpen(true);
              }}
              centerCoordinate={centerCoordinate}
            />
          </div>
        ) : (
          /* Clean White Dashboard View (Overview Mode - No Map Overlap) */
          <main className="w-full pt-20 md:pt-10 px-4 md:px-10 pb-12 z-10 bg-slate-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
              <ListView
                complaints={filteredComplaints}
                onSelectComplaint={(c) => {
                  setSelectedComplaint(c);
                  setIsDetailModalOpen(true);
                }}
                onOpenReportWizard={() => setIsReportWizardOpen(true)}
              />
            </div>
          </main>
        )}
      </div>

      {/* 4. Mock Government Official Floating Action Bar */}
      {isOfficialMode && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 pointer-events-auto">
          <MockGovernmentActionBar
            complaints={complaints}
            selectedComplaintId={selectedComplaint?.id}
            onUpdateStatus={handleOfficialUpdateStatus}
          />
        </div>
      )}

      {/* MODAL 1: Report Issue Wizard */}
      <ReportWizardModal
        isOpen={isReportWizardOpen}
        onClose={() => setIsReportWizardOpen(false)}
        categories={categories}
        departments={departments}
        onSubmitSuccess={(newComp) => {
          refreshData();
          setSelectedComplaint(newComp as Complaint);
          setIsDetailModalOpen(true);
        }}
        onTriggerNearbyCheck={handleTriggerNearbyCheck}
      />

      {/* MODAL 2: Existing / Nearby Issue Detection */}
      <NearbyDetectionModal
        isOpen={isNearbyModalOpen}
        onClose={() => setIsNearbyModalOpen(false)}
        matches={nearbyMatches}
        onSupportExisting={handleSupportExisting}
        onProceedWithNew={() => {
          setIsNearbyModalOpen(false);
          if (pendingWizardProceedCallback) {
            pendingWizardProceedCallback();
          }
        }}
      />

      {/* MODAL 3: Complaint Detail & Timeline View */}
      <ComplaintDetailModal
        complaint={selectedComplaint}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onSupport={handleSupportFromDetail}
        isSupportedByUser={selectedComplaint ? supportedIds.includes(selectedComplaint.id) : false}
      />

      {/* MODAL 4: Hotspot Summary View */}
      <HotspotDetailModal
        hotspot={selectedHotspot}
        isOpen={isHotspotModalOpen}
        onClose={() => setIsHotspotModalOpen(false)}
        constituentComplaints={complaints.filter(
          (c) => selectedHotspot && Math.abs(c.latitude - selectedHotspot.center_latitude) < 0.005
        )}
        onSelectComplaint={(c) => {
          setSelectedComplaint(c);
          setIsDetailModalOpen(true);
        }}
      />

      {/* DRAWER 5: My Activity Drawer */}
      <MyActivityDrawer
        isOpen={isActivityDrawerOpen}
        onClose={() => setIsActivityDrawerOpen(false)}
        allComplaints={complaints}
        supportedIds={supportedIds}
        userId={userId}
        onSelectComplaint={(c) => {
          setSelectedComplaint(c);
          setIsDetailModalOpen(true);
        }}
      />
    </div>
  );
}
