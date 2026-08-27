'use client';

import React, { useState, useEffect } from 'react';
import DisclosureBanner from '@/components/DisclosureBanner';
import HeaderNav from '@/components/HeaderNav';
import FilterBar from '@/components/FilterBar';
import GoogleMapView from '@/components/GoogleMapView';
import ListView from '@/components/ListView';
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
  const filteredComplaints = complaints.filter(item => {
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
          // Found duplicate candidates! Present Screen 05 modal
          const matchIds = data.data.matches.map((m: { complaint_id: string }) => m.complaint_id);
          const candidateDetails = nearby.filter(n => matchIds.includes(n.id));

          setNearbyMatches(candidateDetails.length > 0 ? candidateDetails : nearby);
          setPendingWizardProceedCallback(() => callbackToProceed);
          setIsNearbyModalOpen(true);
          return;
        }
      } catch (e) {
        console.warn('Similarity check error:', e);
      }
    }

    // No duplicate found, proceed directly to Step 3 AI review
    callbackToProceed();
  };

  // Upvote Existing Complaint Action
  const handleSupportExisting = (complaintId: string) => {
    supportComplaintInStore(complaintId);
    refreshData();
    setIsNearbyModalOpen(false);
    setIsReportWizardOpen(false);

    // Open detail page for supported complaint
    const updated = getStoredComplaints().find(c => c.id === complaintId);
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
    <main className="relative w-full h-screen overflow-hidden bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* 1. Full-Screen Dynamic Background Map Engine */}
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

      {/* 2. Floating UI Controls Container (Glassmorphism Stack) */}
      <div className="relative z-10 h-full flex flex-col justify-between pointer-events-none">
        <div>
          {/* Top Hackathon Synthetic Disclosure Banner */}
          <div className="pointer-events-auto">
            <DisclosureBanner />
          </div>

          {/* Primary Navigation Header */}
          <div className="pointer-events-auto">
            <HeaderNav
              onOpenReportWizard={() => setIsReportWizardOpen(true)}
              onOpenActivityDrawer={() => setIsActivityDrawerOpen(true)}
              isOfficialMode={isOfficialMode}
              onToggleOfficialMode={() => setIsOfficialMode(!isOfficialMode)}
              onSelectLocation={(lat, lng) => setCenterCoordinate({ lat, lng })}
              supportedCount={supportedIds.length}
            />
          </div>

          {/* Category & Status Filter Bar */}
          <div className="pointer-events-auto">
            <FilterBar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedStatus={selectedStatus}
              onSelectStatus={setSelectedStatus}
              showHotspots={showHotspots}
              onToggleHotspots={() => setShowHotspots(!showHotspots)}
              viewMode={viewMode}
              onToggleViewMode={setViewMode}
              totalComplaints={filteredComplaints.length}
            />
          </div>
        </div>

        {/* List View Glassmorphism Overlay (When View Mode is toggled to List) */}
        {viewMode === 'list' && (
          <div className="flex-1 max-w-4xl w-full mx-auto p-4 overflow-hidden pointer-events-auto animate-in fade-in slide-in-from-bottom-6 duration-200">
            <div className="h-full glass-panel rounded-3xl border border-slate-700/80 shadow-2xl overflow-y-auto p-4">
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

        {/* Mock Government Official Action Bar (Visible when Official Mode toggled) */}
        {isOfficialMode && (
          <div className="pointer-events-auto">
            <MockGovernmentActionBar
              complaints={complaints}
              selectedComplaintId={selectedComplaint?.id}
              onUpdateStatus={handleOfficialUpdateStatus}
            />
          </div>
        )}
      </div>

      {/* MODAL 1: Report Issue Wizard (Screen 02, 03, 04) */}
      <ReportWizardModal
        isOpen={isReportWizardOpen}
        onClose={() => setIsReportWizardOpen(false)}
        categories={categories}
        departments={departments}
        onSubmitSuccess={newComp => {
          refreshData();
          setSelectedComplaint(newComp as Complaint);
          setIsDetailModalOpen(true);
        }}
        onTriggerNearbyCheck={handleTriggerNearbyCheck}
      />

      {/* MODAL 2: Existing / Nearby Issue Detection (Screen 05) */}
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

      {/* MODAL 3: Complaint Detail & Timeline View (Screen 06) */}
      <ComplaintDetailModal
        complaint={selectedComplaint}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onSupport={handleSupportFromDetail}
        isSupportedByUser={selectedComplaint ? supportedIds.includes(selectedComplaint.id) : false}
      />

      {/* MODAL 4: Hotspot Summary View (Screen 07) */}
      <HotspotDetailModal
        hotspot={selectedHotspot}
        isOpen={isHotspotModalOpen}
        onClose={() => setIsHotspotModalOpen(false)}
        constituentComplaints={complaints.filter(
          c => selectedHotspot && Math.abs(c.latitude - selectedHotspot.center_latitude) < 0.005
        )}
        onSelectComplaint={c => {
          setSelectedComplaint(c);
          setIsDetailModalOpen(true);
        }}
      />

      {/* DRAWER 5: My Activity Drawer (Screen 08) */}
      <MyActivityDrawer
        isOpen={isActivityDrawerOpen}
        onClose={() => setIsActivityDrawerOpen(false)}
        allComplaints={complaints}
        supportedIds={supportedIds}
        userId={userId}
        onSelectComplaint={c => {
          setSelectedComplaint(c);
          setIsDetailModalOpen(true);
        }}
      />
    </main>
  );
}
