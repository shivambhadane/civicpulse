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

export default function HomePage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [departments] = useState<Department[]>(INITIAL_DEPARTMENTS);

  // Filters & Views
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
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
    <main className="relative w-full h-screen overflow-hidden bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* 1. Full-Screen Dynamic Background Map Layer (Z-0) */}
      <div className="absolute inset-0 w-full h-full z-0">
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

      {/* 2. Floating Left Navigation Panel (Apple Maps Style) */}
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
      />

      {/* 3. Floating Right Dock Controls (Apple Maps Right Stack) */}
      <AppleMapsRightControls
        isOfficialMode={isOfficialMode}
        onToggleOfficialMode={() => setIsOfficialMode(!isOfficialMode)}
        onOpenActivityDrawer={() => setIsActivityDrawerOpen(true)}
        supportedCount={supportedIds.length}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
      />

      {/* 4. List View Overlay Panel (When View Mode is List) */}
      {viewMode === 'list' && (
        <div className="fixed inset-y-4 right-4 left-4 sm:left-[420px] z-20 overflow-hidden pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
          <div className="h-full bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-[30px] shadow-2xl overflow-y-auto p-5">
            <ListView
              complaints={filteredComplaints}
              onSelectComplaint={(c) => {
                setSelectedComplaint(c);
                setIsDetailModalOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* 5. Mock Government Official Floating Action Bar */}
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
    </main>
  );
}
