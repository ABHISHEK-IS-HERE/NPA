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
    <div className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-amber-50/20 text-slate-900 pt-6 pb-12 sm:pt-8 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200 overflow-hidden">
      {/* Subtle Background Academic Grid Pattern */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto space-y-6">
        {/* Top Journal Vitals Strip (Benchmark: Nature & Oxford Academic) */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xs py-2 px-3 sm:px-5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-slate-700">
            <span className="inline-flex items-center gap-1 font-mono font-bold text-navy-950">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ISSN: {settings.issn || '2349-2015'} (Print)
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/70">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              Impact Factor: {settings.impactFactor || '6.74'}
            </span>
            <span className="hidden md:inline text-slate-300">•</span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-primary-700" />
              Double-Blind Refereed
            </span>
            <span className="hidden lg:inline text-slate-300">•</span>
            <span className="hidden lg:inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 font-medium">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              7–14 Days Review Decision
            </span>
            <span className="hidden xl:inline text-slate-300">•</span>
            <span className="hidden xl:inline-flex items-center gap-1 text-slate-600 font-medium">
              Open Access CC BY-NC 4.0
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
            <span className="text-slate-400">Indexed In:</span>
            <span className="text-slate-700 font-bold">Zenodo</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-bold">CrossRef</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-bold">Google Scholar</span>
          </div>
        </div>

        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Journal Identity, Multi-Field Search, Action Matrix */}
          <div className="lg:col-span-8 space-y-6 text-center lg:text-left">
            {/* Accreditation Badge */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 bg-gradient-to-r from-amber-50 to-orange-50/70 px-3.5 py-1.5 rounded-full border border-amber-200 text-xs font-semibold text-amber-900 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{settings.heroBadge || 'UGC Regulations 2018 CAS & NAAC Criterion 4.2 Compliant'}</span>
            </div>

            {/* Hero Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-extrabold tracking-tight text-navy-950 leading-tight">
              {settings.heroTitle || 'Advancing Global Research in Business & Economics'}
            </h1>

            {/* Hero Subtitle */}
            <p className="text-xs sm:text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              {settings.heroSubtitle ||
                'National Research Journal of Business Economics (NRJBE) is an internationally indexed, double-blind peer-reviewed journal providing an intellectual platform for scholars, faculty, and institutions worldwide.'}
            </p>

            {/* Advanced Multi-Field Search Bar (Benchmark: ScienceDirect & OUP) */}
            <div className="max-w-2xl mx-auto lg:mx-0 space-y-2 pt-1">
              {/* Field Selector Pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 text-xs text-slate-600">
                <span className="text-[11px] font-semibold text-slate-400 mr-1">Search by:</span>
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
                    className={`px-2.5 py-0.5 rounded-full font-medium transition-all ${
                      searchField === f.id
                        ? 'bg-primary-800 text-white shadow-2xs'
                        : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Input Box */}
              <form onSubmit={handleSearch}>
                <div className="relative flex items-center bg-white rounded-xl shadow-md p-1.5 border border-slate-300 ring-4 ring-primary-50/60 focus-within:ring-primary-100 transition-all">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 ml-2.5 sm:ml-3 flex-shrink-0" />
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
                        : 'Search 100+ papers, authors, topics, or DOIs...'
                    }
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                  />
                  <button
                    type="submit"
                    className="bg-primary-800 hover:bg-primary-900 text-white text-xs sm:text-sm font-semibold px-4 sm:px-6 py-2 rounded-lg transition-colors flex items-center gap-1.5 flex-shrink-0 shadow-2xs"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
                  </button>
                </div>
              </form>

              {/* Quick Suggestion Tags */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 pt-0.5">
                <span className="text-[11px] font-medium text-slate-400">Popular:</span>
                {popularTags.map((tag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickTagClick(tag)}
                    className="text-[11px] bg-white/70 hover:bg-white text-slate-600 hover:text-primary-800 px-2 py-0.5 rounded border border-slate-200/80 transition-colors"
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
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs sm:text-sm font-bold px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <FileUp className="w-4 h-4" />
                <span>Submit Manuscript Online</span>
              </Link>

              <Link
                href="/store"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl border border-slate-300 shadow-2xs transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-primary-700" />
                <span>Order Print Issue (₹{price})</span>
              </Link>

              <Link
                href="/institutions"
                className="inline-flex items-center gap-1.5 bg-blue-50/70 hover:bg-blue-50 text-primary-900 text-xs sm:text-sm font-semibold px-3.5 py-2.5 sm:py-3 rounded-xl border border-blue-200/80 transition-colors"
              >
                <Building2 className="w-4 h-4 text-primary-700" />
                <span>Library Proforma Invoice</span>
              </Link>

              <Link
                href="/track-status"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 hover:text-slate-900 underline decoration-slate-300 py-2 ml-1"
              >
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Track Manuscript</span>
              </Link>
            </div>
          </div>

          {/* Right Column: 3D Magazine Cover Feature Showcase */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="bg-white border border-slate-200 p-6 rounded-3xl backdrop-blur-md shadow-xl flex flex-col items-center text-center max-w-xs w-full relative ring-1 ring-slate-900/5 transition-transform hover:-translate-y-1">
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
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full inline-block">
                  Current Issue Available
                </span>
                <h3 className="font-serif font-bold text-slate-900 text-sm">
                  {currentIssue?.title || `Volume ${volumeNum}, Issue ${issueNum} (2026)`}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Printed on 80 GSM Bond • Speed Post Dispatch
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 w-full space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs text-slate-600 font-medium">Print Edition:</span>
                  <span className="text-base font-extrabold text-primary-900">₹{price} INR</span>
                </div>

                <AddToCartButton
                  id={currentIssue ? `issue-${currentIssue.id}` : 'current-issue-print'}
                  type="print_issue"
                  title={`${currentIssue?.title || 'Vol 12, Issue 1'} - Print Copy`}
                  subtitle="Delivered via India Post Speed Post"
                  price={price}
                  badge="Print Copy"
                  label={`Order Print Copy (₹${price})`}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                />

                <div className="flex items-center justify-center gap-3 pt-1">
                  <Link
                    href="/current-issue#papers-list"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-800 hover:underline"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>Table of Contents</span>
                  </Link>
                  <span className="text-slate-300">•</span>
                  <Link
                    href="/current-issue"
                    className="text-[11px] text-emerald-700 hover:underline font-medium"
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

