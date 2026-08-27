'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AuthSlideOver from '@/components/AuthSlideOver';
import {
  MapPin,
  ArrowRight,
  UserCheck,
  Sparkles,
  Zap,
  Flame,
  ThumbsUp,
  Map as MapIcon,
  BarChart2,
} from 'lucide-react';

export default function LandingPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'map' | 'ai' | 'hotspots'>('map');

  // Auth Slide-over Drawer State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-900 selection:text-white relative overflow-hidden">
      {/* Background Subtle Grid & Radial Glow (Dub.co Aesthetic) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] [background-size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* 1. Sleek Navbar (Dub.co Pixel-Perfect Match) */}
      <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-3.5 flex items-center justify-between">
        {/* Left Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
            <MapPin className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-base font-extrabold font-display tracking-tight text-slate-950">
            Civic Pulse
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-600">
          <a href="#features" className="hover:text-slate-950 transition-colors">Features</a>
          <a href="#ai-engine" className="hover:text-slate-950 transition-colors">AI Duplicate Engine</a>
          <a href="#hotspots" className="hover:text-slate-950 transition-colors">Priority Hotspots</a>
          <a href="#coverage" className="hover:text-slate-950 transition-colors">Map Explorer</a>
        </nav>

        {/* Right Action CTAs */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full font-medium">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="truncate max-w-[120px] font-semibold">{user.displayName || user.email}</span>
              </div>
              <Link
                href="/dashboard"
                className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-full shadow-sm transition-all hover:scale-[1.02] flex items-center gap-1.5"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={logout}
                className="text-xs text-slate-500 hover:text-rose-600 font-medium px-1"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => openAuth('login')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-950 px-3 py-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => openAuth('signup')}
                className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs px-4.5 py-2 rounded-full shadow-sm transition-all hover:scale-[1.02]"
              >
                Start for free
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 2. Hero Section (Dub.co Exact Layout & Pills) */}
      <section className="relative pt-36 pb-20 px-6 max-w-5xl mx-auto text-center space-y-7 z-10">
        {/* Dub Pill Announcement Badge */}
        <div
          onClick={() => openAuth('signup')}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100/90 border border-slate-200/90 text-xs font-semibold text-slate-700 shadow-sm hover:border-slate-300 transition-all cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Introducing Civic Pulse v1.0</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-950 font-bold flex items-center gap-0.5">
            Read launch ↗
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl sm:text-7xl font-extrabold font-display tracking-tight text-slate-950 max-w-4xl mx-auto leading-[1.05]">
          Turn civic issues <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-slate-950 via-slate-800 to-slate-600 bg-clip-text text-transparent">
            into municipal action
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Civic Pulse is the modern map-centric platform for grievance reporting, geospatial duplicate elimination, and community upvoting.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          {user ? (
            <Link
              href="/dashboard"
              className="px-7 py-3.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shadow-xl transition-all hover:scale-105 flex items-center gap-2"
            >
              <span>Open Citizen Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => openAuth('signup')}
              className="px-7 py-3.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shadow-xl transition-all hover:scale-105 flex items-center gap-2"
            >
              <span>Start reporting for free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <Link
            href="/admin"
            className="px-7 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-950 font-bold text-xs transition-all hover:scale-105"
          >
            <span>Get a municipal demo</span>
          </Link>
        </div>

        {/* 3. Interactive Feature Selector Pill Tabs Above Mockup (Dub.co signature layout) */}
        <div id="features" className="pt-10 space-y-6">
          <div className="inline-flex items-center gap-2 p-1.5 rounded-full bg-slate-100/80 border border-slate-200/80 text-xs font-bold text-slate-700 shadow-sm backdrop-blur-md">
            <button
              onClick={() => setActiveTab('map')}
              className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'map'
                  ? 'bg-white text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5 text-amber-500" />
              <span>Map Explorer</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'ai'
                  ? 'bg-white text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-emerald-500" />
              <span>AI Duplicate Check</span>
            </button>

            <button
              onClick={() => setActiveTab('hotspots')}
              className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'hotspots'
                  ? 'bg-white text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-purple-500" />
              <span>Priority Hotspots</span>
            </button>
          </div>

          {/* 4. High-Fidelity Dub-Style Platform Interface Mockup */}
          <div className="relative bg-gradient-to-b from-slate-100/80 to-slate-200/50 p-3 sm:p-5 rounded-[2.5rem] border border-slate-200/90 shadow-2xl max-w-5xl mx-auto overflow-hidden">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden text-left">
              {/* Window Header */}
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-400" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="ml-3 font-mono text-[11px] text-slate-400">civicpulse.gov/dashboard</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Mapbox GL Vector Engine Active</span>
                </div>
              </div>

              {/* Window Body Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px]">
                {/* App Left Sidebar */}
                <div className="md:col-span-3 border-r border-slate-200/80 p-4 space-y-4 bg-slate-50/50">
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                    <div className="w-6 h-6 rounded-md bg-slate-950 text-white flex items-center justify-center">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <span>Pune Central Ward</span>
                  </div>

                  <div className="space-y-1 text-xs font-medium text-slate-600">
                    <div className="p-2 rounded-xl bg-slate-200/70 font-bold text-slate-900 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <MapIcon className="w-3.5 h-3.5 text-emerald-600" /> Live Map
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">14</span>
                    </div>
                    <div className="p-2 rounded-xl hover:bg-slate-100 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Flame className="w-3.5 h-3.5 text-rose-500" /> Hotspots
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">3</span>
                    </div>
                    <div className="p-2 rounded-xl hover:bg-slate-100 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <BarChart2 className="w-3.5 h-3.5 text-slate-500" /> Analytics
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200/80 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recent Activity</span>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
                      <p className="text-[11px] font-bold text-slate-900 truncate">Swargate Pothole</p>
                      <p className="text-[10px] text-slate-500">18 supporters • Resolved</p>
                    </div>
                  </div>
                </div>

                {/* Main App Content View */}
                <div className="md:col-span-9 p-6 bg-slate-50/20 space-y-6">
                  {activeTab === 'map' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-950 font-display">Interactive Mapbox Explorer</h4>
                          <p className="text-xs text-slate-500">Geospatial coordinate tagging & locality auto-clustering</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Ward Bounds Loaded
                        </span>
                      </div>

                      <div className="bg-[#f2f2ef] rounded-2xl border border-slate-200 p-6 min-h-[220px] relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
                        <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200 shadow-xl max-w-sm space-y-2.5">
                          <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-emerald-600" /> Swargate Flyover, Ward 14
                            </span>
                            <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">Critical</span>
                          </div>
                          <p className="text-xs text-slate-600 font-medium">
                            Deep asphalt pothole reported by 18 citizens. Assigned to Roads & Infrastructure Dept.
                          </p>
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 pt-1 border-t border-slate-100">
                            <span>Upvotes: 18 supporters</span>
                            <span className="text-emerald-600 font-bold">SLA: &lt; 24h</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'ai' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-950 font-display">OpenAI Duplicate Detection</h4>
                          <p className="text-xs text-slate-500">Vector similarity score matching within 300m radius</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Similarity: 94% Match
                        </span>
                      </div>

                      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-950 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            AI
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-900">Existing Grievance Detected</p>
                            <p className="text-xs text-slate-600">
                              &quot;Water main leakage near Swargate bus stand.&quot; Submitted 2 hours ago.
                            </p>
                          </div>
                        </div>

                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center flex items-center justify-center gap-2 text-xs font-bold text-emerald-800">
                          <ThumbsUp className="w-4 h-4 text-emerald-600" />
                          <span>Automatically prompt user to upvote existing issue (+1 Supporter)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'hotspots' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-950 font-display">Priority Community Hotspots</h4>
                          <p className="text-xs text-slate-500">Auto-clustered high urgency civic problems</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                          3 Hotspots Active
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-sm">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                            Pothole Cluster
                          </span>
                          <p className="text-xs font-bold text-slate-900 pt-1">Swargate Junction</p>
                          <p className="text-[10px] text-slate-500">24 Complaints • 62 Supporters</p>
                        </div>

                        <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-sm">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            Waste Overflow
                          </span>
                          <p className="text-xs font-bold text-slate-900 pt-1">Kothrud Market</p>
                          <p className="text-[10px] text-slate-500">14 Complaints • 45 Supporters</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dub-Style Floating CTA Pill at Bottom of Preview */}
            <div className="mt-4 bg-slate-950 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-slate-800">
              <div className="flex items-center gap-3 text-left">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-display">Map-Centric Grievance Engine</h4>
                  <p className="text-[11px] text-slate-400">Report, upvote, and track municipal issues at ward level scale.</p>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition-colors shrink-0"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section 2 Header (Matching exact image headline: "Marketing isn't just about clicks. It's about outcomes.") */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-4xl sm:text-5xl font-black font-display text-slate-950 leading-tight">
          Civic reporting isn&apos;t just about complaints. <br />
          <span className="text-emerald-600">It&apos;s about real outcomes.</span>
        </h2>
        <p className="text-base text-slate-600 font-medium max-w-xl mx-auto">
          Civic Pulse brings transparency to every ward grievance with real-time status updates and municipal photo proof.
        </p>
      </section>

      {/* 6. Bottom Action Banner */}
      <section className="pb-20 px-6 max-w-5xl mx-auto">
        <div className="bg-slate-950 text-white rounded-[2.5rem] p-10 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OPEN FOR ALL CITIZENS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white max-w-2xl mx-auto leading-tight">
            Ready to empower your ward?
          </h2>

          <div className="pt-2">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all hover:scale-105"
              >
                <span>Go to Citizen Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => openAuth('signup')}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all hover:scale-105"
              >
                <span>Start reporting for free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 7. Modern Minimal Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 px-6 text-xs text-slate-600 font-medium">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span className="font-extrabold text-slate-900 font-display">Civic Pulse Platform © 2026</span>
          </div>
          <div className="flex gap-6 text-slate-500 font-semibold">
            <Link href="/dashboard" className="hover:text-slate-950 transition-colors">Dashboard</Link>
            <button onClick={() => openAuth('login')} className="hover:text-slate-950 transition-colors">Log in</button>
            <button onClick={() => openAuth('signup')} className="hover:text-slate-950 transition-colors">Sign up</button>
          </div>
        </div>
      </footer>

      {/* 8. Slide-over Auth Drawer */}
      <AuthSlideOver
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}
