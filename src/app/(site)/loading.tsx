/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React from 'react';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
      {/* Banner Skeleton */}
      <div className="h-12 bg-amber-100/60 rounded-xl w-full" />

      {/* Hero / Header Skeleton */}
      <div className="space-y-4 py-8">
        <div className="h-4 bg-amber-200/50 rounded-full w-48" />
        <div className="h-10 bg-stone-200/70 rounded-xl w-3/4 max-w-2xl" />
        <div className="h-4 bg-stone-200/50 rounded-md w-1/2 max-w-xl" />
      </div>

      {/* Grid Content Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-6 bg-white rounded-2xl border border-amber-200/60 space-y-4 shadow-sm">
            <div className="h-4 bg-amber-100 rounded w-24" />
            <div className="h-6 bg-stone-200/70 rounded w-5/6" />
            <div className="space-y-2 pt-2">
              <div className="h-3 bg-stone-100 rounded w-full" />
              <div className="h-3 bg-stone-100 rounded w-4/5" />
            </div>
            <div className="pt-4 flex justify-between items-center">
              <div className="h-4 bg-amber-50 rounded w-20" />
              <div className="h-8 bg-amber-200/40 rounded-lg w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
