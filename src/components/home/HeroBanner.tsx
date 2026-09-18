'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileUp,
  BookOpen,
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';

import { MagazineCover } from '@/components/covers/MagazineCover';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { ShoppingBag } from 'lucide-react';

interface HeroBannerProps {
  settings: {
    journalName?: string;
    shortName?: string;
    issn?: string;
    impactFactor?: string;
    heroTitle?: string;
    heroSubtitle?: string;
    heroBadge?: string;
  };
  currentIssue?: {
    id: number;
    title: string;
    volumeNumber?: number | string;
    issueNumber: string;
    monthYear?: string;
    printPrice?: number;
    coverImage?: string | null;
  } | null;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ settings, currentIssue }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/current-issue?q=${encodeURIComponent(searchQuery.trim())}#papers-list`);
    }
  };

  const volumeNum = currentIssue?.volumeNumber || '12';
  const issueNum = currentIssue?.issueNumber || '1';
  const price = currentIssue?.printPrice || 450;

  return (
    <div className="relative bg-gradient-to-br from-navy-950 via-primary-950 to-navy-900 text-white py-10 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-navy-800 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Journal Identity & Search */}
          <div className="lg:col-span-8 space-y-6 text-center lg:text-left">
            {/* Quality Badges */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs font-semibold text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{settings.heroBadge || 'ISSN: 2349-2015 | Impact Factor: 6.74 | Double Blind Peer Review | Open Access'}</span>
            </div>

            {/* Hero Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-extrabold tracking-tight text-white leading-tight">
              {settings.heroTitle || 'Advancing Global Research in Business & Economics'}
            </h1>

            {/* Hero Subtitle */}
            <p className="text-xs sm:text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              {settings.heroSubtitle ||
                'National Research Journal of Business Economics is an internationally indexed, peer-reviewed, refereed journal providing an intellectual platform for scholars worldwide.'}
            </p>

            {/* Search Bar for Articles / DOIs */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto lg:mx-0 pt-1">
              <div className="relative flex items-center bg-white rounded-xl shadow-2xl p-1.5 border border-slate-200">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 ml-2.5 sm:ml-3 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search papers, authors, topics, or DOIs..."
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                />
                <button
                  type="submit"
                  className="bg-primary-700 hover:bg-primary-800 text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-5 py-2 rounded-lg transition-colors flex items-center gap-1 flex-shrink-0"
                >
                  <span>Search</span>
                  <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
                </button>
              </div>
            </form>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href="/submit-paper"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-navy-950 text-xs sm:text-sm font-bold px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                <FileUp className="w-4 h-4" />
                <span>Submit Manuscript Online</span>
              </Link>

              <Link
                href="/store"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg border border-white/20 transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>Journal Store &amp; Print Editions</span>
              </Link>

              <Link
                href="/track-status"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-300 hover:text-white underline decoration-slate-500 py-2"
              >
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Track Manuscript</span>
              </Link>
            </div>
          </div>

          {/* Right Column: 3D Magazine Cover Feature Showcase */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md shadow-2xl flex flex-col items-center text-center max-w-xs w-full relative">
              <div className="mb-4">
                <MagazineCover
                  volumeNumber={volumeNum}
                  issueNumber={issueNum}
                  year="2026"
                  monthYear={currentIssue?.monthYear || 'January - June 2026'}
                  coverImage={currentIssue?.coverImage}
                  size="md"
                  isCurrent
                />
              </div>

              <div className="space-y-1 w-full">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                  Current Issue Available
                </span>
                <h3 className="font-serif font-bold text-white text-sm">
                  {currentIssue?.title || `Volume ${volumeNum}, Issue ${issueNum} (2026)`}
                </h3>
                <p className="text-[11px] text-slate-300">
                  Printed on 80 GSM Bond • Speed Post Dispatch
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 w-full space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs text-slate-300">Print Edition:</span>
                  <span className="text-base font-extrabold text-amber-400">₹{price} INR</span>
                </div>

                <AddToCartButton
                  id={currentIssue ? `issue-${currentIssue.id}` : 'current-issue-print'}
                  type="print_issue"
                  title={`${currentIssue?.title || 'Vol 12, Issue 1'} - Print Copy`}
                  subtitle="Delivered via India Post Speed Post"
                  price={price}
                  badge="Print Copy"
                  label={`Order Print Copy (₹${price})`}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-navy-950 text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                />

                <Link
                  href="/current-issue"
                  className="block text-center text-[11px] text-slate-300 hover:text-white underline"
                >
                  Read Digital Papers Free (Open Access)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
