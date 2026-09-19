/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React from 'react';
import Link from 'next/link';
import { BookOpen, Home, Search, ArrowLeft, FileText } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#fdfbf2]">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center mx-auto shadow-sm">
          <BookOpen className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Error 404
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Page Not Found
          </h1>
          <p className="text-sm text-stone-600">
            The requested research article, periodical archive, or page could not be located in our scholarly index.
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-amber-200/80 shadow-sm text-left text-xs space-y-2 text-stone-600">
          <p className="font-semibold text-stone-800">Helpful Shortcuts:</p>
          <ul className="space-y-1.5 pl-1">
            <li>
              <Link href="/current-issue" className="text-amber-800 hover:underline flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-700" />
                Browse Current Volume &amp; Issue Papers
              </Link>
            </li>
            <li>
              <Link href="/archives" className="text-amber-800 hover:underline flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-amber-700" />
                Search Complete Journal Archive
              </Link>
            </li>
            <li>
              <Link href="/submit-paper" className="text-amber-800 hover:underline flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                Manuscript Submission Guidelines
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
          >
            <Home className="w-4 h-4" />
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
