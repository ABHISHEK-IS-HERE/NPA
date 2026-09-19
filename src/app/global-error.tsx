'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center p-4 bg-[#fdfbf2] text-stone-900 font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-amber-200 shadow-xl text-center space-y-4">
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            National Research Journal of Business Economics
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            A critical application error occurred. We apologize for the inconvenience.
          </p>
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
