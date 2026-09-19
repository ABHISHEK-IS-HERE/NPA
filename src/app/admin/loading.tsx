/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React from 'react';

export default function AdminLoading() {
  return (
    <div className="space-y-6 max-w-6xl animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-28 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center space-y-2">
        <div className="h-6 bg-slate-800 rounded w-1/3" />
        <div className="h-4 bg-slate-800/60 rounded w-1/2" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="h-3 bg-slate-800 rounded w-16" />
            <div className="h-8 bg-slate-800/80 rounded w-12" />
          </div>
        ))}
      </div>

      {/* Content Table Skeleton */}
      <div className="h-64 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="h-5 bg-slate-800 rounded w-48" />
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-slate-800/50 rounded-lg w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
