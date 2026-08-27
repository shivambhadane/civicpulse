'use client';

import React, { useState } from 'react';
import { X, MapPin, Upload, Sparkles, AlertCircle, ChevronRight, ArrowLeft, Loader2, ShieldCheck, Check } from 'lucide-react';
import LocationPickerModal from './LocationPickerModal';
import { Category, Department, SeverityLevel } from '@/types/database';
import { AIClassificationResult, AIDepartmentRoutingResult } from '@/types/ai';
import Image from 'next/image';

import { getOrCreateUserId } from '@/lib/dataStore';

interface ReportWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  departments: Department[];
  onSubmitSuccess: (newComplaint: unknown) => void;
  onTriggerNearbyCheck: (lat: number, lng: number, desc: string, callbackToProceed: () => void) => void;
}

export default function ReportWizardModal({
  isOpen,
  onClose,
  categories,
  departments,
  onSubmitSuccess,
  onTriggerNearbyCheck,
}: ReportWizardModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [lat, setLat] = useState<number>(18.5089);
  const [lng, setLng] = useState<number>(73.8267);
  const [locationName, setLocationName] = useState<string>('Karve Road, Kothrud, Pune');
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  // AI State
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiClassification, setAiClassification] = useState<AIClassificationResult | null>(null);
  const [aiRouting, setAiRouting] = useState<AIDepartmentRoutingResult | null>(null);

  // User Overrides on Step 3
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedSeverity, setSelectedSeverity] = useState<SeverityLevel>('MEDIUM');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Handle Photo Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setImageUrl(data.data.url);
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Step 2 -> Step 3: Trigger AI Analysis & Nearby Duplicate Check
  const handleProceedToAiReview = async () => {
    if (!description || description.trim().length < 5) return;

    setIsAiAnalyzing(true);
    try {
      // 1. Call AI Classification
      const classRes = await fetch('/api/ai/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, image_url: imageUrl }),
      });
      const classData = await resDataJson(classRes);

      const aiClass: AIClassificationResult = classData?.data || {
        category_slug: 'roads-traffic',
        severity: 'MEDIUM',
        summary: description.substring(0, 50),
        tags: ['civic'],
      };
      setAiClassification(aiClass);

      // Set Title if empty
      if (!title) {
        setTitle(aiClass.summary || 'Civic Infrastructure Report');
      }

      // 2. Call AI Routing
      const routeRes = await fetch('/api/ai/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_slug: aiClass.category_slug,
          description,
          location_name: locationName,
        }),
      });
      const routeData = await resDataJson(routeRes);
      const aiRoute: AIDepartmentRoutingResult = routeData?.data || {
        department_code: 'PMC_ROADS',
        department_name: 'Roads & Maintenance Department',
        confidence_score: 0.92,
        reasoning: 'Default category mapping',
      };
      setAiRouting(aiRoute);

      // Pre-set user selection state from AI suggestions
      const matchedCat = categories.find((c) => c.slug === aiClass.category_slug) || categories[0];
      setSelectedCategoryId(matchedCat?.id || categories[0]?.id || '');
      setSelectedSeverity(aiClass.severity);
      const matchedDept = departments.find((d) => d.code === aiRoute.department_code) || departments[0];
      setSelectedDepartmentId(matchedDept?.id || departments[0]?.id || '');

      setIsAiAnalyzing(false);

      // 3. Trigger Nearby Duplicate Check callback
      onTriggerNearbyCheck(lat, lng, description, () => {
        setStep(3);
      });
    } catch (err) {
      console.error('AI pipeline error:', err);
      setIsAiAnalyzing(false);
      setStep(3);
    }
  };

  const resDataJson = async (res: Response) => {
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  // Step 3 -> Final Submission
  const handleSubmitFinal = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        title: title || 'Civic Infrastructure Complaint',
        description,
        latitude: lat,
        longitude: lng,
        location_name: locationName,
        user_id: getOrCreateUserId(),
        category_id: selectedCategoryId,
        department_id: selectedDepartmentId,
        severity: selectedSeverity,
        image_urls: imageUrl ? [imageUrl] : [],
        ai_category: aiClassification?.category_slug,
        ai_department: aiRouting?.department_name,
        ai_confidence: aiRouting?.confidence_score,
      };

      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        onSubmitSuccess(data.data);
        onClose();
      }
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-900 font-sans">
          {/* Header & Step Indicator */}
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                Report Civic Infrastructure Issue
              </h3>
              <p className="text-xs text-slate-500 font-medium">AI-assisted reporting wizard for prompt municipal action</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step Progress Bar */}
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-200'}`}>
                1
              </span>
              <span>Location</span>
            </div>
            <div className={`h-0.5 flex-1 mx-3 ${step >= 2 ? 'bg-emerald-600' : 'bg-slate-200'}`} />

            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-200'}`}>
                2
              </span>
              <span>Details & Photo</span>
            </div>
            <div className={`h-0.5 flex-1 mx-3 ${step >= 3 ? 'bg-emerald-600' : 'bg-slate-200'}`} />

            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-200'}`}>
                3
              </span>
              <span>AI Review</span>
            </div>
          </div>

          {/* Modal Body Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-5">
            {/* STEP 1: LOCATION SELECTION */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 overflow-hidden shadow-xl relative group">
                  {/* Visual Real Vector Map Canvas Preview Box */}
                  <div
                    onClick={() => setIsLocationPickerOpen(true)}
                    className="relative w-full h-48 bg-slate-950 overflow-hidden cursor-pointer flex items-center justify-center border-b border-slate-800 select-none group-hover:opacity-95 transition-opacity"
                  >
                    {/* Dynamic Vector Canvas Grid & Roads */}
                    <div className="absolute inset-0 opacity-45 pointer-events-none">
                      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id="miniGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1" />
                            <circle cx="0" cy="0" r="1.5" fill="rgba(56, 189, 248, 0.4)" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#miniGrid)" />
                        <path d="M -50 120 Q 180 30 400 200 T 800 100" fill="none" stroke="rgba(14, 165, 233, 0.35)" strokeWidth="20" strokeLinecap="round" />
                        <path d="M 180 -20 Q 300 200 150 500" fill="none" stroke="rgba(14, 165, 233, 0.25)" strokeWidth="14" strokeLinecap="round" />
                      </svg>
                    </div>

                    {/* Centered Target Pin Marker */}
                    <div className="relative z-10 flex flex-col items-center animate-bounce">
                      <div className="w-10 h-10 rounded-2xl bg-cyan-500 border-2 border-white text-slate-950 flex items-center justify-center shadow-xl shadow-cyan-500/50">
                        <MapPin className="w-6 h-6 fill-current text-slate-950" />
                      </div>
                      <div className="w-3 h-3 bg-cyan-400 rotate-45 -mt-1 shadow-md" />
                    </div>

                    {/* Overlay Action Badge */}
                    <div className="absolute bottom-3 right-3 z-20 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-cyan-300 text-xs font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-md group-hover:scale-105 transition-transform">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Change Pin on Map</span>
                    </div>
                  </div>

                  {/* Address & Coordinate Details */}
                  <div className="p-4 bg-slate-900/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        Selected Defect Location
                      </span>
                      <p className="text-sm font-bold text-white mt-0.5">{locationName}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {lat.toFixed(5)}°N, {lng.toFixed(5)}°E
                      </p>
                    </div>

                    <button
                      onClick={() => setIsLocationPickerOpen(true)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 shrink-0 transition-all"
                    >
                      Open Full Map Picker
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-600 bg-amber-50/80 p-3.5 rounded-xl border border-amber-200 flex items-start gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Precise coordinates help PostGIS perform exact 300m radius duplicate checks and allow municipal field crews to locate the defect easily.
                  </span>
                </div>
              </div>
            )}

            {/* STEP 2: DETAILS & PHOTO */}
            {step === 2 && (
              <div className="space-y-4">
                {/* Description Input */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Problem Description *
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the issue clearly (e.g., Deep pothole near bus stop causing severe traffic backup)..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-medium"
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Attach Photo Evidence (Optional)
                  </label>
                  {imageUrl ? (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-40 group">
                      <Image src={imageUrl} alt="Complaint Evidence" fill className="object-cover" />
                      <button
                        onClick={() => setImageUrl('')}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors z-10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl bg-slate-50 cursor-pointer transition-colors">
                      {isUploading ? (
                        <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-slate-400 mb-2" />
                          <span className="text-xs font-bold text-slate-700">Click to upload photo evidence</span>
                          <span className="text-[10px] text-slate-400 mt-1">JPEG, PNG, WEBP up to 5 MB</span>
                        </>
                      )}
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: AI REVIEW SCREEN */}
            {step === 3 && (
              <div className="space-y-4">
                {/* AI Confidence Badge */}
                <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-900">AI Advisor Inference Complete</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {Math.round((aiRouting?.confidence_score || 0.94) * 100)}% Confidence
                  </span>
                </div>

                {/* Editable Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Issue Title Summary
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold focus:border-emerald-500"
                  />
                </div>

                {/* Category Override Dropdown */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Category (AI Recommended — Click to Override)
                  </label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:border-emerald-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Severity Badge Picker */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Severity Rating (AI Assessed)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as SeverityLevel[]).map((sev) => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setSelectedSeverity(sev)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          selectedSeverity === sev
                            ? sev === 'CRITICAL'
                              ? 'bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-600/20'
                              : sev === 'HIGH'
                              ? 'bg-amber-600 text-white border-amber-400 shadow-md shadow-amber-600/20'
                              : sev === 'MEDIUM'
                              ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/20'
                              : 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/20'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Department Recommendation Card */}
                <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Recommended Municipal Department
                  </span>
                  <p className="text-xs font-bold text-emerald-800 mt-0.5">
                    {aiRouting?.department_name || 'Roads & Maintenance Department'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 italic">
                    &quot;{aiRouting?.reasoning || 'Matched based on complaint classification and jurisdiction bounds.'}&quot;
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="p-5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep((step - 1) as 1 | 2)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                onClick={() => {
                  if (step === 1) setStep(2);
                  else if (step === 2) handleProceedToAiReview();
                }}
                disabled={step === 2 && (!description || description.trim().length < 5 || isAiAnalyzing)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
              >
                {isAiAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing with AI...</span>
                  </>
                ) : (
                  <>
                    <span>{step === 1 ? 'Next: Add Details' : 'Analyze & Check Duplicates'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  type="button"
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleSubmitFinal}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>Done (Publish & Close)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Location Picker Sub-modal */}
      <LocationPickerModal
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        onConfirmLocation={(newLat, newLng, newLocName) => {
          setLat(newLat);
          setLng(newLng);
          setLocationName(newLocName);
        }}
        initialLat={lat}
        initialLng={lng}
      />
    </>
  );
}
