'use client';

import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

export default function DisclosureBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-950/90 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-200 flex items-center justify-between z-50 glass-panel">
      <div className="flex items-center gap-2 max-w-5xl mx-auto">
        <Info className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Hackathon Disclosure:</strong> Civic Pulse is an open-source civic tech demonstration. All municipal departments, status transitions, and official updates are simulated for evaluation purposes. Not an official government service.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 hover:bg-amber-900/50 rounded-lg text-amber-400 transition-colors"
        title="Dismiss disclosure banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
