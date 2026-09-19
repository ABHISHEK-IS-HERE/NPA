'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled runtime error in site layout:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 bg-[#fdfbf2]">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center mx-auto shadow-sm">
          <AlertTriangle className="w-8 h-8 text-amber-700" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            System Notification
          </h1>
          <p className="text-sm text-stone-600">
            An unexpected error occurred while loading this academic resource. Our technical team has logged this occurrence.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-semibold border border-stone-300 transition-all"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
