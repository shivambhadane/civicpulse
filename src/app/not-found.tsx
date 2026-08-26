import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-bold font-display text-cyan-400 mb-2">404 — Page Not Found</h2>
      <p className="text-xs text-slate-400 mb-6 max-w-sm">
        The requested civic grievance or page could not be located on the map.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-xs font-bold text-white shadow-lg shadow-cyan-500/25"
      >
        Return to Civic Pulse Map
      </Link>
    </div>
  );
}
