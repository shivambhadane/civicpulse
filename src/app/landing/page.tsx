'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  MapPin,
  ArrowRight,
  Globe,
  Building2,
  LogIn,
  UserCheck,
  Star,
  ChevronRight,
} from 'lucide-react';

export default function LandingPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#f8f8f6] text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* 1. Header Navigation */}
      <header className="fixed top-0 w-full z-50 bg-[#f8f8f6]/90 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
            <MapPin className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="text-xl font-extrabold font-display tracking-tight text-slate-900">Civic Pulse</span>
            <span className="ml-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
              2026
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-full hover:bg-slate-200/60 transition-colors flex items-center gap-1.5"
          >
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Official Portal</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-700 bg-white border border-slate-200/80 px-3.5 py-1.5 rounded-full font-medium shadow-sm">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span className="truncate max-w-[130px] font-semibold">{user.displayName || user.email}</span>
              </div>
              <Link
                href="/dashboard"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-md transition-all hover:scale-105 flex items-center gap-2"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={logout}
                className="text-xs text-slate-500 hover:text-rose-600 font-bold px-2 py-1"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-md transition-all hover:scale-105 flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Register</span>
            </Link>
          )}
        </div>
      </header>

      {/* 2. Hero Section (Swiss Brutalist Minimalist Style) */}
      <section className="pt-32 pb-16 px-6 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>CIVIC RESOLUTION PLATFORM</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-4">
            <h1 className="text-5xl sm:text-7xl font-black font-display tracking-tight text-slate-950 leading-[0.95] uppercase">
              YOUR CITY. <br />
              YOUR WARD. <br />
              <span className="bg-emerald-500 text-slate-950 px-3 py-1 inline-block mt-2 font-mono">
                YOUR CIVIC PULSE.
              </span>
            </h1>
          </div>

          <div className="lg:col-span-4 space-y-6 pb-2">
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              AI-assisted civic grievance platform with map precision, OpenAI geospatial duplicate elimination, and community upvoting.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href={user ? "/dashboard" : "/login"}
                className="px-6 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>{user ? "Open Citizen Dashboard" : "Get Started via Firebase"}</span>
              </Link>
              <Link
                href="/admin"
                className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-100 border border-slate-300 text-slate-900 font-bold text-xs transition-all flex items-center gap-2"
              >
                <span>Municipal Console</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Bento Metric Stats Grid (Inspired by Reference Image 4) */}
      <section className="py-12 px-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
          <span>● ABOUT CIVIC PULSE</span>
          <span>IMPACT METRICS 2026</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Dark Mission Card */}
          <div className="lg:col-span-4 bg-slate-950 text-white rounded-3xl p-8 flex flex-col justify-between space-y-8 shadow-xl relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full inline-block">
                Our Mission
              </span>
              <h3 className="text-2xl font-bold font-display leading-snug">
                Transparent civic accountability for every citizen & ward officer.
              </h3>
            </div>

            <div className="space-y-4 relative z-10 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Trusted by 10,000+ Citizens</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">THEY REPORT PROBLEMS — WE ACCELERATE FIXES.</p>
              </div>
            </div>
          </div>

          {/* Right 4 Bento Metric Cards Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-4xl sm:text-5xl font-black font-display text-slate-900">100%</span>
                <span className="text-xs text-slate-400 font-mono">01</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Geospatial Precision</p>
                <p className="text-xs text-slate-500 mt-1">Mapbox GL vector coordinate tagging down to ward meter precision.</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-4xl sm:text-5xl font-black font-display text-emerald-600">&lt; 3s</span>
                <span className="text-xs text-slate-400 font-mono">02</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">AI Routing Speed</p>
                <p className="text-xs text-slate-500 mt-1">OpenAI automated issue classification and department routing.</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-4xl sm:text-5xl font-black font-display text-slate-900">300+</span>
                <span className="text-xs text-slate-400 font-mono">03</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Hotspots Resolved</p>
                <p className="text-xs text-slate-500 mt-1">Clustered pothole & drainage zones addressed by municipal teams.</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-4xl sm:text-5xl font-black font-display text-emerald-600">45%</span>
                <span className="text-xs text-slate-400 font-mono">04</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">SLA Time Reduction</p>
                <p className="text-xs text-slate-500 mt-1">Faster municipal response via community upvote prioritization.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Giant Numbered Workflow Steps (Inspired by Reference Image 2 - Enerblock Style) */}
      <section className="py-16 px-6 max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">● HOW IT WORKS</h2>
          <span className="text-xs text-slate-400 font-mono">4-STEP WORKFLOW</span>
        </div>

        <div className="divide-y divide-slate-200">
          {/* Step 01 */}
          <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center group">
            <div className="md:col-span-4">
              <span className="text-6xl sm:text-7xl font-black font-display text-rose-500 group-hover:scale-105 transition-transform inline-block">
                01
              </span>
            </div>
            <div className="md:col-span-8 space-y-1">
              <h3 className="text-2xl font-extrabold text-slate-900 font-display">Snap & Report Grievance</h3>
              <p className="text-sm text-slate-600 max-w-xl font-medium">
                Citizens upload issue photo, select category, and let GPS pinpoint the exact ward locality automatically.
              </p>
            </div>
          </div>

          {/* Step 02 */}
          <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center group">
            <div className="md:col-span-4">
              <span className="text-6xl sm:text-7xl font-black font-display text-rose-500 group-hover:scale-105 transition-transform inline-block">
                02
              </span>
            </div>
            <div className="md:col-span-8 space-y-1">
              <h3 className="text-2xl font-extrabold text-slate-900 font-display">AI Geospatial Duplicate Elimination</h3>
              <p className="text-sm text-slate-600 max-w-xl font-medium">
                OpenAI vector embeddings check a 300-meter radius to find existing complaints, prompting users to upvote instead of spamming duplicates.
              </p>
            </div>
          </div>

          {/* Step 03 */}
          <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center group">
            <div className="md:col-span-4">
              <span className="text-6xl sm:text-7xl font-black font-display text-rose-500 group-hover:scale-105 transition-transform inline-block">
                03
              </span>
            </div>
            <div className="md:col-span-8 space-y-1">
              <h3 className="text-2xl font-extrabold text-slate-900 font-display">Community Upvoting & Priority Clustering</h3>
              <p className="text-sm text-slate-600 max-w-xl font-medium">
                High-upvote issues trigger hotspot alerts, elevating severe potholes, water leaks, or garbage dumps to high-priority status.
              </p>
            </div>
          </div>

          {/* Step 04 */}
          <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center group">
            <div className="md:col-span-4">
              <span className="text-6xl sm:text-7xl font-black font-display text-rose-500 group-hover:scale-105 transition-transform inline-block">
                04
              </span>
            </div>
            <div className="md:col-span-8 space-y-1">
              <h3 className="text-2xl font-extrabold text-slate-900 font-display">Official Municipal Resolution</h3>
              <p className="text-sm text-slate-600 max-w-xl font-medium">
                Ward officers update status (`IN_PROGRESS` → `RESOLVED`), attaching photo evidence to notify citizens in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Geospatial Map & Locality Showcase (Inspired by Reference Image 1 - Volt Drive Style) */}
      <section className="py-16 px-6 max-w-7xl mx-auto space-y-8">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                ● COVERAGE & WARD DISPATCH
              </div>
              <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-900 uppercase">
                YOUR CITY. YOUR ROUTES. <br />
                YOUR CIVIC ENGINE.
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
              PUNE MUNICIPAL NODE
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Map Preview Illustration */}
            <div className="lg:col-span-8 bg-[#f5f5f3] rounded-2xl p-6 border border-slate-200 relative min-h-[300px] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Floating Locality Card Mockup */}
              <div className="relative z-10 bg-white rounded-2xl p-4 shadow-xl border border-slate-200 max-w-xs space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-slate-900">Swargate Junction, Ward 14</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Deep asphalt pothole causing traffic congestion. 14 supporters upvoted.
                </p>
                <div className="flex items-center justify-between text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <span>● Status: IN_PROGRESS</span>
                  <span>SLA &lt; 24h</span>
                </div>
              </div>
            </div>

            {/* Locality Ward List */}
            <div className="lg:col-span-4 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Active Wards & Localities
              </span>
              {[
                'Swargate, Pune',
                'Kothrud, Pune',
                'Paud Road, Pune',
                'Viman Nagar, Pune',
                'Shivajinagar, Pune',
              ].map((locality, idx) => (
                <div
                  key={idx}
                  className="w-full bg-[#f8f8f6] hover:bg-slate-100 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-900" />
                    {locality}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="border-t border-slate-200 bg-white py-10 px-6 text-slate-600 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span className="font-extrabold text-slate-900 font-display">Civic Pulse Platform © 2026</span>
          </div>
          <div className="flex gap-6 text-slate-500">
            <Link href="/dashboard" className="hover:text-slate-900 transition-colors">Citizen Dashboard</Link>
            <Link href="/admin" className="hover:text-slate-900 transition-colors">Official Portal</Link>
            <Link href="/login" className="hover:text-slate-900 transition-colors">Firebase Auth</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
