'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Sparkles,
  ArrowRight,
  Flame,
  Globe,
  Building2,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* 1. Header Navigation */}
      <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black font-display tracking-tight text-white">Civic Pulse</span>
            <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              v1.0 MVP
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-900 transition-colors flex items-center gap-1.5"
          >
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Official Portal</span>
          </Link>
          <Link
            href="/dashboard"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 flex items-center gap-2"
          >
            <span>Launch Citizen Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-6xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-emerald-400">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>AI-Powered Map-Centric Civic Grievance Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Empowering Citizens. <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Accelerating Municipal Action.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal">
          Civic Pulse connects citizens directly with municipal departments using Mapbox vector mapping, OpenAI geospatial duplicate detection, and community upvoting for transparent urban resolution.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <Globe className="w-5 h-5" />
            <span>Open Citizen Dashboard</span>
          </Link>

          <Link
            href="/admin"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold text-sm transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <Building2 className="w-5 h-5 text-amber-400" />
            <span>Government Officer Portal</span>
          </Link>
        </div>
      </section>

      {/* 3. Stat Highlights */}
      <section className="border-y border-slate-800/80 bg-slate-900/50 py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-extrabold text-white font-display">100%</div>
            <div className="text-xs text-slate-400 mt-1">Geospatial Precision</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-emerald-400 font-display">&lt; 3s</div>
            <div className="text-xs text-slate-400 mt-1">AI Classification</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-cyan-400 font-display">0</div>
            <div className="text-xs text-slate-400 mt-1">Duplicate Spam</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-amber-400 font-display">Real-Time</div>
            <div className="text-xs text-slate-400 mt-1">Status Transparency</div>
          </div>
        </div>
      </section>

      {/* 4. Core Features Bento Grid */}
      <section className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white">
            Built for Modern Civic Infrastructure
          </h2>
          <p className="text-sm text-slate-400">Integrated features ensuring seamless reporting and resolution accountability.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Dynamic Mapbox Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full-screen vector interactive maps with custom category markers, heatmap density toggles, and locality jump controls.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">AI Duplicate Detection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated OpenAI similarity check prevents duplicate complaint submissions by offering instant upvoting on existing nearby issues.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Community Hotspots</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              High-impact civic problems automatically cluster into priority hotspots, alerting municipal engineers to dispatch teams faster.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="border-t border-slate-800 py-8 px-6 text-center text-xs text-slate-500">
        <p>© 2026 Civic Pulse — Urban Grievance & Community Accountability Platform.</p>
      </footer>
    </div>
  );
}
