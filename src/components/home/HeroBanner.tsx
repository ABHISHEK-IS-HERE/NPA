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
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  Award,
  Truck,
  Building2,
  ExternalLink,
  Layers,
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
  const [searchField, setSearchField] = useState<'all' | 'title' | 'author' | 'keywords' | 'doi'>('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/current-issue?q=${encodeURIComponent(searchQuery.trim())}&field=${searchField}#papers-list`);
    }
  };

  const handleQuickTagClick = (tag: string) => {
    setSearchQuery(tag);
    router.push(`/current-issue?q=${encodeURIComponent(tag)}#papers-list`);
  };

  const volumeNum = currentIssue?.volumeNumber || '12';
  const issueNum = currentIssue?.issueNumber || '1';
  const price = currentIssue?.printPrice || 450;

  const popularTags = [
    'FinTech & Banking',
    'Corporate Governance',
    'Microeconomics',
    'Supply Chain',
    'GST & Tax Policy',
  ];

  return (
    <div className="relative bg-gradient-to-b from-[#fefce8] via-[#fefbf0] to-[#fffdf5] text-stone-900 pt-6 pb-12 sm:pt-8 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-amber-200/80 overflow-hidden">
      {/* Subtle Archival Editorial Watermark / Rules */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#1c1917_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto space-y-6">
        {/* Top Journal Vitals Strip (Benchmark: Nature & Oxford Academic) */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-amber-200/80 shadow-2xs py-2 px-3 sm:px-5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-stone-700">
            <span className="inline-flex items-center gap-1.5 font-mono font-bold text-stone-900">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              ISSN: {settings.issn || '2349-2015'} (Print)
            </span>
            <span className="hidden sm:inline text-amber-200">•</span>
            <span className="inline-flex items-center gap-1 font-semibold text-amber-950 bg-amber-100/90 px-2.5 py-0.5 rounded border border-amber-300/80">
              <Award className="w-3.5 h-3.5 text-amber-700" />
              Impact Factor: {settings.impactFactor || '6.74'}
            </span>
            <span className="hidden md:inline text-amber-200">•</span>
            <span className="hidden md:inline-flex items-center gap-1 text-stone-700">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
              Double-Blind Refereed
            </span>
            <span className="hidden lg:inline text-amber-200">•</span>
            <span className="hidden lg:inline-flex items-center gap-1 text-emerald-900 bg-emerald-50/80 px-2 py-0.5 rounded border border-emerald-200/70 font-medium">
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              7–14 Days Review Decision
            </span>
            <span className="hidden xl:inline text-amber-200">•</span>
            <span className="hidden xl:inline-flex items-center gap-1 text-stone-600 font-medium">
              Open Access CC BY-NC 4.0
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-semibold text-stone-500">
            <span className="text-stone-400 uppercase font-mono tracking-wider text-[10px]">Indexed In:</span>
            <span className="text-stone-800 font-bold">Zenodo</span>
            <span className="text-stone-300">/</span>
            <span className="text-stone-800 font-bold">CrossRef</span>
            <span className="text-stone-300">/</span>
            <span className="text-stone-800 font-bold">Google Scholar</span>
          </div>
        </div>

        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Journal Identity, Multi-Field Search, Action Matrix */}
          <div className="lg:col-span-8 space-y-6 text-center lg:text-left">
            {/* Accreditation Line */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 bg-amber-50/90 px-3 py-1 rounded-md border border-amber-200/80 text-xs font-mono uppercase tracking-wider text-amber-950 font-medium">
              <Award className="w-3.5 h-3.5 text-amber-700" />
              <span>{settings.heroBadge || 'UGC Regulations 2018 CAS & NAAC Criterion 4.2 Compliant'}</span>
            </div>

            {/* Hero Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-serif font-bold tracking-tight text-stone-900 leading-[1.12]">
              {settings.heroTitle || 'Advancing Global Research in Business & Economics'}
            </h1>

            {/* Hero Subtitle */}
            <p className="text-sm sm:text-base text-stone-600 max-w-2xl leading-relaxed mx-auto lg:mx-0 font-sans">
              {settings.heroSubtitle ||
                'National Research Journal of Business Economics (NRJBE) is an internationally indexed, double-blind peer-reviewed journal providing an intellectual platform for scholars, faculty, and institutions worldwide.'}
            </p>

            {/* Advanced Multi-Field Search Bar (Benchmark: ScienceDirect & OUP) */}
            <div className="max-w-2xl mx-auto lg:mx-0 space-y-2.5 pt-1">
              {/* Field Selector */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 text-xs text-stone-600">
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 mr-1">Search:</span>
                {[
                  { id: 'all', label: 'All Fields' },
                  { id: 'title', label: 'Title' },
                  { id: 'author', label: 'Author' },
                  { id: 'keywords', label: 'Keywords' },
                  { id: 'doi', label: 'DOI' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSearchField(f.id as any)}
                    className={`px-3 py-0.5 rounded text-xs font-medium transition-all ${
                      searchField === f.id
                        ? 'bg-amber-400 text-stone-950 font-bold shadow-2xs border border-amber-400'
                        : 'bg-white hover:bg-amber-50/80 text-stone-700 border border-amber-200/70'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Input Box */}
              <form onSubmit={handleSearch}>
                <div className="relative flex items-center bg-white rounded-lg shadow-xs p-1.5 border border-amber-200/90 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-400/20 transition-all">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-stone-400 ml-2.5 sm:ml-3 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      searchField === 'title'
                        ? 'Search paper titles...'
                        : searchField === 'author'
                        ? 'Search authors by name...'
                        : searchField === 'doi'
                        ? 'Enter DOI (e.g., 10.5281/zenodo...)'
                        : 'Search papers, authors, topics, or DOIs...'
                    }
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none bg-transparent"
                  />
                  <button
                    type="submit"
                    className="bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs sm:text-sm font-bold px-4 sm:px-6 py-2 rounded-md transition-colors flex items-center gap-1.5 flex-shrink-0 shadow-2xs"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
                  </button>
                </div>
              </form>

              {/* Quick Suggestion Tags */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 pt-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">Popular:</span>
                {popularTags.map((tag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickTagClick(tag)}
                    className="text-[11px] bg-white hover:bg-amber-50 text-stone-700 hover:text-stone-950 px-2 py-0.5 rounded border border-amber-200/80 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Trio Action Matrix: Author, Subscriber & Institution */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href="/submit-paper"
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs sm:text-sm font-bold px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg shadow-sm hover:shadow transition-all border border-amber-500/20"
              >
                <FileUp className="w-4 h-4 text-stone-950" />
                <span>Submit Manuscript Online</span>
              </Link>

              <Link
                href="/store"
                className="inline-flex items-center gap-2 bg-white hover:bg-amber-50/60 text-stone-800 text-xs sm:text-sm font-semibold px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg border border-amber-200/90 shadow-2xs transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-stone-600" />
                <span>Order Print Issue (₹{price})</span>
              </Link>

              <Link
                href="/institutions"
                className="inline-flex items-center gap-1.5 bg-amber-50/80 hover:bg-amber-100 text-amber-950 text-xs sm:text-sm font-semibold px-3.5 py-2.5 sm:py-3 rounded-lg border border-amber-200/90 transition-colors"
              >
                <Building2 className="w-4 h-4 text-stone-700" />
                <span>Library Proforma Invoice</span>
              </Link>

              <Link
                href="/track-status"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-stone-600 hover:text-stone-900 underline decoration-stone-300 py-2 ml-1"
              >
                <Clock className="w-3.5 h-3.5 text-stone-500" />
                <span>Track Manuscript</span>
              </Link>
            </div>
          </div>

          {/* Right Column: 3D Magazine Cover Feature Showcase */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="bg-white border border-amber-200/90 p-6 rounded-2xl shadow-sm flex flex-col items-center text-center max-w-xs w-full relative transition-transform hover:-translate-y-0.5">
              <div className="mb-4 relative group">
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

              <div className="space-y-1.5 w-full">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-950 bg-amber-100/90 border border-amber-300/80 px-2.5 py-0.5 rounded-full inline-block">
                  Current Issue Available
                </span>
                <h3 className="font-serif font-bold text-stone-900 text-sm">
                  {currentIssue?.title || `Volume ${volumeNum}, Issue ${issueNum} (2026)`}
                </h3>
                <p className="text-[11px] text-stone-500">
                  Printed on 80 GSM Bond • Speed Post Dispatch
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200/80 w-full space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs text-stone-600 font-medium">Print Edition:</span>
                  <span className="text-base font-bold text-stone-900">₹{price} INR</span>
                </div>

                <AddToCartButton
                  id={currentIssue ? `issue-${currentIssue.id}` : 'current-issue-print'}
                  type="print_issue"
                  title={`${currentIssue?.title || 'Vol 12, Issue 1'} - Print Copy`}
                  subtitle="Delivered via India Post Speed Post"
                  price={price}
                  badge="Print Copy"
                  label={`Order Print Copy (₹${price})`}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold py-2.5 px-4 rounded-lg shadow-2xs transition-all flex items-center justify-center gap-2 border border-amber-500/30"
                />

                <div className="flex items-center justify-center gap-3 pt-1">
                  <Link
                    href="/current-issue#papers-list"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-800 hover:text-amber-950 hover:underline"
                  >
                    <BookOpen className="w-3 h-3 text-amber-700" />
                    <span>Table of Contents</span>
                  </Link>
                  <span className="text-amber-200">•</span>
                  <Link
                    href="/current-issue"
                    className="text-[11px] text-amber-800 hover:text-amber-950 hover:underline font-semibold"
                  >
                    Read Open Access
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

