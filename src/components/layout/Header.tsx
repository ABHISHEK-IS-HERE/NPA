'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, FileUp, Building2, ShoppingBag, Search } from 'lucide-react';
import { CartButton } from '@/components/cart/CartButton';
import { GlobalSearchModal } from '@/components/search/GlobalSearchModal';

interface HeaderProps {
  settings: {
    journalName?: string;
    shortName?: string;
    tagline?: string;
    logoUrl?: string | null;
  };
}

export const Header: React.FC<HeaderProps> = ({ settings }) => {
  const [searchOpen, setSearchOpen] = useState(false);

  // Global keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="bg-[#fffdf8] border-b border-amber-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5 lg:gap-8 text-center lg:text-left">
          {/* Logo & Journal Title (Bespoke Academic Masthead) */}
          <Link href="/" className="group flex items-center gap-4 transition-all">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-amber-400 flex items-center justify-center text-stone-950 shadow-xs group-hover:scale-[1.02] transition-transform flex-shrink-0 border border-amber-500/40">
              <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-stone-950" strokeWidth={1.75} />
            </div>
            <div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-amber-100 text-amber-950 border border-amber-300 font-mono">
                  {settings.shortName || 'NRJBE'}
                </span>
                <span className="text-xs text-stone-500 font-medium">International Refereed Journal</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-stone-900 tracking-tight leading-snug mt-1 group-hover:text-amber-800 transition-colors">
                {settings.journalName || 'National Research Journal of Business Economics'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-2xl mt-0.5">
                {settings.tagline || 'An International Reputed Peer Reviewed Refereed Research Journal | Open Access'}
              </p>
            </div>
          </Link>

          {/* Quick Action CTAs, Search & Cart */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex items-center gap-2 bg-[#fffdf9] hover:bg-amber-50 text-stone-700 text-xs sm:text-sm font-medium px-3.5 py-2 rounded-lg border border-amber-200/80 transition-colors group"
              title="Search Articles, DOIs, Authors (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-700 transition-colors" strokeWidth={1.5} />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.2 text-[10px] font-mono font-semibold text-stone-400 bg-white rounded border border-amber-200">
                ⌘K
              </kbd>
            </button>

            <Link
              href="/institutions"
              className="inline-flex items-center gap-1.5 bg-amber-50/80 hover:bg-amber-100 text-amber-950 text-xs sm:text-sm font-medium px-3.5 py-2 rounded-lg border border-amber-200/80 transition-colors"
              title="For University & College Libraries"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-800" strokeWidth={1.5} />
              <span>Library Acquisition</span>
            </Link>

            <Link
              href="/store"
              className="inline-flex items-center gap-1.5 bg-[#fffdf9] hover:bg-amber-50 text-stone-800 text-xs sm:text-sm font-medium px-3.5 py-2 rounded-lg border border-amber-200/80 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-800" strokeWidth={1.5} />
              <span>Print Editions</span>
            </Link>

            <Link
              href="/submit-paper"
              className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs sm:text-sm font-bold px-4 py-2 rounded-lg shadow-xs hover:shadow transition-all tracking-tight"
            >
              <FileUp className="w-3.5 h-3.5 text-stone-950" strokeWidth={2} />
              <span>Submit Manuscript</span>
            </Link>

            {/* Interactive Shopping Bag */}
            <CartButton />
          </div>
        </div>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
};
