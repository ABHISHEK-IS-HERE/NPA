'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, FileUp, Sparkles, ShoppingBag, Search } from 'lucide-react';
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
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6 text-center lg:text-left">
          {/* Logo & Journal Title */}
          <Link href="/" className="group flex items-center gap-4 transition-all">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-primary-800 to-navy-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform flex-shrink-0 border-2 border-amber-500/30">
              <BookOpen className="w-8 h-8 sm:w-9 sm:h-9 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-primary-50 text-primary-800 border border-primary-200">
                  {settings.shortName || 'NRJBE'}
                </span>
                <span className="text-xs text-slate-500 font-medium">International Research Publication</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-navy-900 tracking-tight leading-snug mt-1 group-hover:text-primary-700 transition-colors">
                {settings.journalName || 'National Research Journal of Business Economics'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl mt-0.5">
                {settings.tagline || 'An International Reputed Peer Reviewed Refereed Research Journal | Open Access'}
              </p>
            </div>
          </Link>

          {/* Quick Action CTAs, Search & Cart */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold px-3 py-2.5 rounded-lg border border-slate-300 transition-colors group"
              title="Search Articles, DOIs, Authors (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-slate-500 group-hover:text-primary-700 transition-colors" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.2 text-[10px] font-mono font-semibold text-slate-500 bg-white rounded border border-slate-300">
                ⌘K
              </kbd>
            </button>

            <Link
              href="/institutions"
              className="inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs sm:text-sm font-semibold px-3 py-2.5 rounded-lg border border-amber-300 transition-colors"
              title="For University & College Libraries"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Library / Institutional PO</span>
            </Link>

            <Link
              href="/store"
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold px-3.5 py-2.5 rounded-lg border border-slate-300 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-primary-700" />
              <span>Journal Store</span>
            </Link>

            <Link
              href="/submit-paper"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-primary-700 to-primary-800 hover:from-primary-800 hover:to-primary-900 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition-all"
            >
              <FileUp className="w-4 h-4 text-amber-300" />
              <span>Submit Paper</span>
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
