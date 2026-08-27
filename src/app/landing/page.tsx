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
  Sparkles,
  ShieldCheck,
  Zap,
  Flame,
  CheckCircle2,
  BarChart3,
  Users,
  Clock,
  Check,
} from 'lucide-react';

export default function LandingPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      {/* 1. Top Navbar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <MapPin className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-base font-extrabold font-display tracking-tight text-slate-900">
              Civic Pulse
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">Workflow</a>
            <a href="#coverage" className="hover:text-slate-900 transition-colors">Map Engine</a>
            <a href="#metrics" className="hover:text-slate-900 transition-colors">Impact</a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-full hover:bg-slate-100 transition-colors flex items-center gap-1.5"
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official Portal</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full font-semibold">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="truncate max-w-[120px]">{user.displayName || user.email}</span>
              </div>
              <Link
                href="/dashboard"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-full shadow-sm transition-all hover:scale-[1.02] flex items-center gap-1.5"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={logout}
                className="text-xs text-slate-500 hover:text-rose-600 font-semibold px-1.5"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4.5 py-2 rounded-full shadow-sm transition-all hover:scale-[1.02] flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </Link>
          )}
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="pt-32 pb-16 px-6 max-w-6xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>AI-POWERED CIVIC RESOLUTION PLATFORM</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-slate-950 max-w-4xl mx-auto leading-[1.08]">
          Report civic issues. <br />
          <span className="text-slate-500 font-normal">Track resolutions in real time.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
          Civic Pulse combines Mapbox vector maps, OpenAI geospatial duplicate detection, and community upvoting for transparent urban grievance resolution.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <Link
            href={user ? "/dashboard" : "/login"}
            className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all hover:scale-105 flex items-center gap-2"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>{user ? "Open Citizen Dashboard" : "Start Reporting (Free)"}</span>
          </Link>

          <Link
            href="/admin"
            className="px-6 py-3 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-900 font-bold text-xs transition-all hover:scale-105 flex items-center gap-2"
          >
            <Building2 className="w-4 h-4 text-slate-600" />
            <span>Municipal Dispatch Portal</span>
          </Link>
        </div>

        {/* Hero Dashboard Interface Preview Card (Matching SaaS Image 1 Top Preview) */}
        <div className="pt-8">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-slate-200/60 max-w-5xl mx-auto space-y-4">
            {/* Window Top Controls */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs font-bold text-slate-400 font-mono">civicpulse.gov/dashboard</span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                LIVE DISPATCH NODE
              </span>
            </div>

            {/* Dashboard Mock Grid Inside Hero Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-left">
              {/* Left Sidebar Mock */}
              <div className="md:col-span-4 bg-slate-50 rounded-2xl p-4 border border-slate-200/60 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>Pune Ward Complaints</span>
                  <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full">14 Active</span>
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-900">
                      <span>Pothole on Swargate Flyover</span>
                      <span className="text-[9px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold">Critical</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Swargate, Ward 14 • 18 Upvotes</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-900">
                      <span>Garbage Overflow at Kothrud</span>
                      <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">Pending</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Paud Road • 12 Upvotes</p>
                  </div>
                </div>
              </div>

              {/* Right Map Canvas Mock */}
              <div className="md:col-span-8 bg-[#f4f4f2] rounded-2xl p-6 border border-slate-200/60 relative min-h-[220px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:14px_14px]" />
                <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200 shadow-lg max-w-sm text-center space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>AI Duplicate Match Found (0.92 Similarity)</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">
                    Auto-grouped with existing Swargate pothole report.
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Submitted complaint combined with 18 supporters to escalate municipal SLA priority.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Horizontal Metrics Bar (Matching Image Section 2) */}
      <section id="metrics" className="border-y border-slate-200/80 bg-white py-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6 text-center divide-x divide-slate-100">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">100%</div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Map Precision</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-display">&lt; 3s</div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">AI Route Time</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">0</div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Duplicate Spam</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-display">300+</div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Hotspots Fixed</div>
          </div>
          <div className="space-y-1 col-span-2 md:col-span-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">45%</div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">SLA Reduction</div>
          </div>
        </div>
      </section>

      {/* 4. Split Feature Section 1 (Matching SaaS Image Feature Card) */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI GEOSPATIAL ENGINE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-display leading-tight">
              Instant duplicate detection before submission.
            </h2>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              When citizens snap a photo, OpenAI embedding vectors check existing issues within a 300-meter radius to prevent spam and prompt users to upvote instead.
            </p>
            <ul className="space-y-2.5 pt-2 text-xs font-bold text-slate-700">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Prevents duplicate entries across municipal wards</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Auto-categorizes into Roads, Sanitation, Drainage & Lighting</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Calculates similarity scores instantly in browser</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs font-bold text-slate-900">
              <span>Vector Similarity Check</span>
              <span className="text-emerald-600 font-mono">Similarity: 0.94</span>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  AI
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-900">Matching Grievance Found</p>
                  <p className="text-xs text-slate-600">
                    &quot;Water main leakage near Swargate bus stand.&quot; Reported 2 hours ago by Citizen #102.
                  </p>
                </div>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <span className="text-xs font-bold text-emerald-800">
                  Click &quot;Upvote Existing Report&quot; to increase priority by +1 supporter
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid 3 Cards (Matching Image 3 Card Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4 hover:border-slate-300 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 text-slate-900 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-slate-950 font-display">Mapbox Vector Maps</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Full vector interactive maps with custom category markers, locality autocomplete, and heatmap density overlays.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4 hover:border-slate-300 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 text-slate-900 flex items-center justify-center">
              <Flame className="w-5 h-5 text-rose-500" />
            </div>
            <h3 className="text-base font-bold text-slate-950 font-display">Priority Hotspots</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              High-upvote civic issues automatically cluster into priority hotspots, alerting ward engineers to dispatch crews.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4 hover:border-slate-300 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 text-slate-900 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-slate-950 font-display">Official Verification</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Municipal officers update grievance workflow status and upload resolution photo proof for public accountability.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Dark Contrast Section ("Built for municipal scale & governance") */}
      <section className="bg-slate-950 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full inline-block">
              ENTERPRISE GOVERNANCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
              Built for city scale & ward level action.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Empowering municipal engineers with real-time triage, SLA tracking, and resolution proof management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">DISPATCH QUEUE</span>
                <Clock className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-white font-display">Live Triage</div>
              <p className="text-xs text-slate-400">Categorized by urgency level and department assignment.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">WARD COVERAGE</span>
                <BarChart3 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-white font-display">100% Wards</div>
              <p className="text-xs text-slate-400">Full municipal coverage across Pune locality boundaries.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">CITIZEN FEEDBACK</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-white font-display">4.9 ★ Rating</div>
              <p className="text-xs text-slate-400">Community trust backed by resolution proof photos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Customer Stories / Community Testimonials (Matching SaaS Grid) */}
      <section className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="flex justify-between items-end border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              COMMUNITY IMPACT
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
              What citizens & officers say
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500 hidden sm:block">PUNE MUNICIPALITY</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              &quot;Reporting the Swargate pothole took 30 seconds. The AI recognized existing reports and let me upvote. The road team fixed it in 24 hours!&quot;
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                R
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Rahul Deshmukh</p>
                <p className="text-[10px] text-slate-500">Citizen • Swargate Pune</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              &quot;Civic Pulse eliminates duplicate reports automatically. Our municipal crew targets high-upvote hotspots first, reducing SLA response times drastically.&quot;
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                A
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Anil Kulkarni</p>
                <p className="text-[10px] text-slate-500">Ward Engineer • Roads Dept</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Bottom Action Banner (Matching SaaS Bottom CTA Card) */}
      <section className="pb-20 px-6 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-10 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>JOIN THE MOVEMENT</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-display text-white max-w-2xl mx-auto leading-tight">
            Ready to make your city cleaner & safer?
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-medium">
            Open the citizen dashboard, report an issue in 3 clicks, or upvote existing grievances in your ward.
          </p>

          <div className="pt-2">
            <Link
              href={user ? "/dashboard" : "/login"}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all hover:scale-105"
            >
              <span>{user ? "Go to Citizen Dashboard" : "Get Started Now (Free)"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 px-6 text-xs text-slate-600 font-medium">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                C
              </div>
              <span className="font-extrabold text-slate-900 text-sm font-display">Civic Pulse</span>
            </div>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              AI-assisted, map-centric civic grievance reporting & community accountability platform.
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-slate-900">Platform</p>
            <ul className="space-y-1.5 text-slate-500 text-[11px]">
              <li><Link href="/dashboard" className="hover:text-slate-900">Citizen Dashboard</Link></li>
              <li><Link href="/admin" className="hover:text-slate-900">Municipal Console</Link></li>
              <li><Link href="/login" className="hover:text-slate-900">Firebase Auth</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-slate-900">Features</p>
            <ul className="space-y-1.5 text-slate-500 text-[11px]">
              <li>Mapbox GL Engine</li>
              <li>OpenAI AI Duplicate Check</li>
              <li>Community Hotspots</li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-slate-900">Contact</p>
            <ul className="space-y-1.5 text-slate-500 text-[11px]">
              <li>Pune Municipal Hub</li>
              <li>support@civicpulse.gov</li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <p>© 2026 Civic Pulse Platform. All rights reserved.</p>
          <p>Built for Indian Municipal Infrastructure</p>
        </div>
      </footer>
    </div>
  );
}
