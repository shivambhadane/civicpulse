'use client';

import { useEffect } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Router Runtime Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 font-sans">
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 max-w-md w-full text-center space-y-4 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-xl font-bold font-display text-white">Something went wrong</h2>
          <p className="text-xs text-slate-400 mt-1">
            An unexpected application error occurred. Click below to recover the dashboard session.
          </p>
        </div>

        <button
          onClick={() => reset()}
          className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reload Interface</span>
        </button>
      </div>
    </div>
  );
}
