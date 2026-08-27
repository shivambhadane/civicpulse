'use client';

import React from 'react';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 flex flex-col items-center justify-center min-h-screen p-4 font-sans">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center max-w-md w-full shadow-2xl space-y-4">
          <h2 className="text-xl font-bold text-white">Application Error</h2>
          <p className="text-xs text-slate-400">A global application error occurred. Refresh to continue.</p>
          <button
            onClick={() => reset()}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
          >
            Reset Application
          </button>
        </div>
      </body>
    </html>
  );
}
