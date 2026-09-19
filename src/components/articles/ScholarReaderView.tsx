'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Award,
  ExternalLink,
  Download,
  Eye,
  CheckCircle2,
  ArrowLeft,
  Quote,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Sparkles,
  BookOpen,
  Copy,
  Check,
  Type,
  Clock,
  Share2,
} from 'lucide-react';
import { CitationModal } from '@/components/articles/CitationModal';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { useCurrency } from '@/context/CurrencyContext';

interface ScholarReaderViewProps {
  article: any;
  relatedArticles: any[];
}

export const ScholarReaderView: React.FC<ScholarReaderViewProps> = ({
  article,
  relatedArticles,
}) => {
  const { formatPrice } = useCurrency();
  const [citationModalOpen, setCitationModalOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [copiedDoi, setCopiedDoi] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const keywordsList = article.keywords
    ? article.keywords.split(',').map((k: string) => k.trim()).filter(Boolean)
    : [];

  const wordCount = article.abstract ? article.abstract.split(/\s+/).length : 0;
  const estimatedReadMin = Math.max(3, Math.round(wordCount / 50) + 5);

  const copyDoi = () => {
    if (article.doi) {
      navigator.clipboard.writeText(article.doi);
      setCopiedDoi(true);
      setTimeout(() => setCopiedDoi(false), 2000);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };

  const textSizeClass = {
    normal: 'text-sm sm:text-base leading-relaxed',
    large: 'text-base sm:text-lg leading-relaxed',
    xlarge: 'text-lg sm:text-xl leading-loose',
  }[fontSize];

  return (
    <div className="py-8 bg-slate-50 min-h-[70vh] pb-24 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-primary-700">Home</Link>
            <span>/</span>
            <Link href="/current-issue" className="hover:text-primary-700">
              {article.issue?.title || 'Current Issue'}
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-mono truncate max-w-[200px]">{article.paperId}</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>~{estimatedReadMin} Min Read</span>
            </span>

            {/* Font Size Scaler */}
            <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-0.5">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-0.5 rounded text-xs font-semibold ${fontSize === 'normal' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                title="Normal font size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-0.5 rounded text-xs font-semibold ${fontSize === 'large' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                title="Large font size"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-0.5 rounded text-xs font-semibold ${fontSize === 'xlarge' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                title="Extra large font size"
              >
                A++
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Scholarly Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Article Column (8 Cols) */}
          <main className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10 space-y-8">
            {/* Header Metadata */}
            <div className="space-y-3 pb-4 border-b border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-primary-800 bg-primary-50 px-2.5 py-0.5 rounded border border-primary-200 text-xs">
                    {article.paperId}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {article.issue?.title} &bull; pp. {article.pageRange}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                    Open Access
                  </span>
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                    Double-Blind Refereed
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900 leading-snug tracking-tight">
                {article.title}
              </h1>

              {/* Authors and Affiliations */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <div className="text-sm sm:text-base font-bold text-navy-900">
                  {article.authors}
                </div>
                {article.affiliations && (
                  <p className="text-xs sm:text-sm text-slate-600 italic">
                    {article.affiliations}
                  </p>
                )}
              </div>

              {/* Permanent DOI Card */}
              {article.doi && (
                <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-primary-800 uppercase text-[10px]">DOI:</span>
                    <a
                      href={article.doi}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-primary-700 hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>{article.doi}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={copyDoi}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    {copiedDoi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDoi ? 'Copied!' : 'Copy DOI'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Quick Action Toolbar */}
            <div className="flex flex-wrap items-center gap-2.5 py-1">
              <a
                href={`/uploads/papers/${article.paperId}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-lg shadow-sm transition-all"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>Download Full PDF</span>
              </a>

              <button
                type="button"
                onClick={() => setCitationModalOpen(true)}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold px-3.5 py-2.5 rounded-lg border border-slate-300 transition-colors"
              >
                <Quote className="w-4 h-4 text-primary-700" />
                <span>Cite Article</span>
              </button>

              <Link
                href={`/certificate/${article.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs sm:text-sm font-semibold px-3.5 py-2.5 rounded-lg border border-amber-300 transition-colors"
              >
                <Award className="w-4 h-4 text-amber-600" />
                <span>Publication Certificate</span>
              </Link>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium px-3 py-2.5 rounded-lg border border-slate-300 transition-colors"
                title="Copy shareable link"
              >
                <Share2 className="w-4 h-4" />
                <span>{shareSuccess ? 'Link Copied!' : 'Share'}</span>
              </button>
            </div>

            {/* Abstract Section */}
            <section id="abstract" className="space-y-3 pt-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-navy-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                <span>Abstract</span>
              </h2>
              <div className={`text-slate-800 text-justify whitespace-pre-line ${textSizeClass}`}>
                {article.abstract}
              </div>
            </section>

            {/* Keywords */}
            {keywordsList.length > 0 && (
              <section id="keywords" className="space-y-2 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Keywords &amp; Indexing Terms:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {keywordsList.map((kw: string, i: number) => (
                    <span
                      key={i}
                      className="text-xs bg-slate-100 text-slate-800 px-3 py-1 rounded-md border border-slate-200 font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Article Metrics & Archival Notice */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-primary-600" />
                  <span>Views: <strong className="text-slate-900 font-mono">{article.views}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>Downloads: <strong className="text-slate-900 font-mono">{article.downloads}</strong></span>
                </div>
              </div>

              <div className="text-right text-slate-500">
                Published: <strong>{new Date(article.publishedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
              </div>
            </div>

            {/* License & Copyright Card */}
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80 text-xs text-emerald-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Open Access License (Creative Commons CC BY-NC 4.0)</span>
              </div>
              <p className="text-emerald-800 text-[11px] leading-relaxed">
                This article is distributed under the terms of the Creative Commons Attribution Non-Commercial 4.0 International License, which permits unrestricted non-commercial use, distribution, and reproduction in any medium, provided the original work is properly cited.
              </p>
            </div>
          </main>

          {/* Right Sidebar: E-Commerce & Related Papers (4 Cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* 1. Order Hardcopy of This Issue Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="bg-amber-500 text-navy-950 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  Physical Journal Edition
                </span>
                <span className="font-mono text-xs font-bold text-navy-900">
                  {formatPrice(article.issue?.printPrice || 450, 18)}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-serif font-bold text-navy-900 text-sm">
                  Order Physical Printed Volume
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Receive this complete bound issue containing <em>&quot;{article.title.slice(0, 45)}...&quot;</em> printed on 80 GSM bond paper.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-2 text-emerald-700 font-medium text-[11px]">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Free India Post Speed Post Dispatch</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary-600" />
                  <span>Double-Blind Refereed Periodical</span>
                </div>
              </div>

              <AddToCartButton
                id={`article-issue-${article.issueId}`}
                type="print_issue"
                title={`${article.issue?.title} - Hardcopy Print Edition`}
                subtitle={`Contains paper ${article.paperId} • Dispatched via Speed Post`}
                price={article.issue?.printPrice || 450}
                priceUsd={18}
                badge="Print Edition"
                label={`Order Print Volume (${formatPrice(article.issue?.printPrice || 450, 18)})`}
                className="w-full bg-amber-500 hover:bg-amber-600 text-navy-950 text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              />
            </div>

            {/* 2. Institutional Library Portal Link */}
            <div className="bg-amber-50/80 border border-amber-300 text-stone-900 rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>For University Libraries</span>
              </div>
              <h4 className="font-serif font-bold text-stone-900 text-sm leading-snug">
                Subscribing for a College or Institution?
              </h4>
              <p className="text-xs text-stone-600">
                Generate an immediate Proforma Invoice on NPA letterhead with GSTIN and locked-in multi-year rates.
              </p>
              <Link
                href="/institutions"
                className="inline-flex items-center justify-center gap-1.5 w-full bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold py-2 px-3 rounded-lg shadow-2xs transition-colors"
              >
                <span>Generate Proforma Invoice</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {/* 3. Related Articles in Same Issue / Volume */}
            {relatedArticles.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <h4 className="font-serif font-bold text-navy-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                  <BookOpen className="w-4 h-4 text-primary-700" />
                  <span>Other Papers in This Issue</span>
                </h4>

                <div className="divide-y divide-slate-100 space-y-2.5">
                  {relatedArticles.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/article/${rel.id}`}
                      className="block pt-2.5 first:pt-0 space-y-1 group"
                    >
                      <span className="font-mono text-[9px] font-bold text-primary-800 bg-primary-50 px-1.5 py-0.2 rounded border border-primary-200">
                        {rel.paperId}
                      </span>
                      <h5 className="font-serif font-bold text-xs text-slate-900 group-hover:text-primary-700 transition-colors line-clamp-2 leading-snug">
                        {rel.title}
                      </h5>
                      <p className="text-[10px] text-slate-500 truncate">{rel.authors}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 flex items-center justify-between gap-2 lg:hidden shadow-lg">
        <a
          href={`/uploads/papers/${article.paperId}.pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-primary-700 text-white text-xs font-bold py-2 px-3 rounded-lg"
        >
          <Download className="w-3.5 h-3.5 text-amber-300" />
          <span>Download PDF</span>
        </a>

        <button
          type="button"
          onClick={() => setCitationModalOpen(true)}
          className="inline-flex items-center justify-center gap-1 bg-slate-100 text-slate-800 text-xs font-semibold py-2 px-3 rounded-lg border border-slate-300"
        >
          <Quote className="w-3.5 h-3.5 text-primary-700" />
          <span>Cite</span>
        </button>

        <AddToCartButton
          id={`mobile-issue-${article.issueId}`}
          type="print_issue"
          title={`${article.issue?.title} - Print Edition`}
          price={article.issue?.printPrice || 450}
          priceUsd={18}
          badge="Print"
          label={`Print (${formatPrice(article.issue?.printPrice || 450, 18)})`}
          className="inline-flex items-center justify-center gap-1 bg-amber-500 text-navy-950 text-xs font-bold py-2 px-3 rounded-lg shadow-xs"
        />
      </div>

      {/* Citation Modal */}
      <CitationModal
        article={article}
        isOpen={citationModalOpen}
        onClose={() => setCitationModalOpen(false)}
      />
    </div>
  );
};
