/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { HeroBanner } from '@/components/home/HeroBanner';
import { JournalProfileCard } from '@/components/home/JournalProfileCard';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { MagazineCover } from '@/components/covers/MagazineCover';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import {
  BookOpen,
  ArrowRight,
  FileCheck,
  Zap,
  Globe2,
  ShieldCheck,
  CheckCircle,
  FileUp,
  Award,
  ShoppingBag,
  Truck,
  Sparkles,
} from 'lucide-react';

export const revalidate = 0;

export default async function HomePage() {
  // Fetch site settings, current issue, recent issues, and subscription plans
  const [settings, currentIssue, recentIssues, popularPlans] = await Promise.all([
    db.siteSetting.findFirst({ where: { id: 1 } }),
    db.issue.findFirst({
      where: { isCurrent: true },
      include: {
        volume: true,
        articles: {
          where: { status: 'Published' },
          orderBy: { id: 'asc' },
          take: 6, // Show top 6 papers on homepage
        },
      },
    }),
    db.issue.findMany({
      orderBy: { id: 'desc' },
      take: 3,
      include: {
        volume: true,
        _count: { select: { articles: true } },
      },
    }),
    db.subscriptionPlan.findMany({
      where: { isActive: true },
      take: 3,
      orderBy: { order: 'asc' },
    }),
  ]);

  const defaultSettings = settings || {
    journalName: 'National Research Journal of Business Economics',
    shortName: 'NRJBE',
    tagline: 'An International Reputed Peer Reviewed Refereed Research Journal | Open Access',
    issn: '2349-2015',
    impactFactor: '6.74',
    frequency: 'Biannual (2 Issues Per Year)',
    peerReviewType: 'Double Blind Peer Review Process',
    languages: 'English',
    accessibility: 'Open Access',
    plagiarismLimit: '25% Allowed',
    aiContentLimit: '10% Allowed',
    apcOnline: '1800 INR',
    apcPrint: '2300 INR',
    publisherName: 'National Press Associates',
    publisherUrl: 'https://npajournals.org',
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Hero Section with 3D Magazine Cover & Live Search */}
      <HeroBanner
        settings={defaultSettings}
        currentIssue={
          currentIssue
            ? {
                id: currentIssue.id,
                title: currentIssue.title,
                volumeNumber: currentIssue.volume.volumeNumber,
                issueNumber: currentIssue.issueNumber,
                monthYear: currentIssue.monthYear,
                printPrice: currentIssue.printPrice || 450,
                coverImage: currentIssue.coverImage,
              }
            : null
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* 2. Journal Parameter & Key Metrics Profile */}
        <JournalProfileCard settings={defaultSettings} />

        {/* 3. E-Commerce Showcase: Physical Print Editions & Subscriptions */}
        <section className="bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
                  Journal Bookstore
                </span>
                <span className="text-xs text-slate-500 font-medium">Delivered to your home / library</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-navy-900 mt-1">
                Order Physical Magazine Copies &amp; Subscriptions
              </h2>
            </div>

            <Link
              href="/store"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary-700 hover:text-primary-900 transition-colors group"
            >
              <span>Explore All Print Editions &amp; Packages</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentIssues.map((iss) => {
              const price = iss.printPrice || 450;
              return (
                <div
                  key={iss.id}
                  className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <MagazineCover
                        volumeNumber={iss.volume.volumeNumber}
                        issueNumber={iss.issueNumber}
                        year={iss.volume.year}
                        monthYear={iss.monthYear}
                        coverImage={iss.coverImage}
                        size="sm"
                        isCurrent={iss.isCurrent}
                      />
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary-800 bg-primary-50 px-2 py-0.5 rounded">
                        {iss.isCurrent ? 'Current Issue' : 'Back Issue'}
                      </span>
                      <h3 className="font-serif font-bold text-navy-900 text-xs sm:text-sm line-clamp-2 mt-1">
                        {iss.title}
                      </h3>
                      <p className="text-[11px] text-slate-500">{iss.monthYear}</p>
                      <div className="pt-1">
                        <span className="text-base font-extrabold text-navy-900">₹{price}</span>
                        <span className="text-[10px] text-slate-500 ml-1">INR</span>
                        <span className="text-[10px] text-emerald-700 font-semibold block flex items-center gap-1 mt-0.5">
                          <Truck className="w-3 h-3" /> Free Speed Post
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      href={iss.isCurrent ? '/current-issue' : `/archives#issue-${iss.id}`}
                      className="text-[11px] font-semibold text-slate-600 hover:text-primary-800"
                    >
                      View TOC
                    </Link>

                    <AddToCartButton
                      id={`issue-${iss.id}`}
                      type="print_issue"
                      title={`${iss.title} - Hardcopy Edition`}
                      subtitle={`Volume ${iss.volume.volumeNumber}, Issue ${iss.issueNumber}`}
                      price={price}
                      badge="Print Copy"
                      label="Buy Print Copy"
                      className="bg-amber-500 hover:bg-amber-600 text-navy-950 text-xs font-bold py-1.5 px-3 rounded-lg shadow-xs transition-all flex items-center gap-1"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-navy-900">
                  Annual Subscription (Print + Digital) Available at ₹3,500/Year
                </h4>
                <p className="text-[11px] text-slate-500">
                  Get both issues mailed directly to your institution with perpetual archival access.
                </p>
              </div>
            </div>

            <AddToCartButton
              id="annual-sub-quick"
              type="subscription"
              title="Annual Journal Subscription (Print + Online)"
              subtitle="2 Issues Mailed via Speed Post + Perpetual Digital Access"
              price={3500}
              badge="Annual Plan"
              label="Subscribe Now (₹3,500)"
              className="bg-navy-900 hover:bg-navy-950 text-white text-xs font-bold py-2 px-4 rounded-lg shadow-xs transition-all flex-shrink-0"
            />
          </div>
        </section>

        {/* 3. Current Issue Research Articles Section */}
        <section className="mb-12" id="current-issue-section">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-primary-100 text-primary-800 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
                  Latest Research
                </span>
                <span className="text-xs text-slate-500 font-medium">Open Access Articles</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-navy-900 mt-1">
                {currentIssue?.title || 'Volume 12, Issue 1 (January - June 2026)'}
              </h2>
            </div>

            <Link
              href="/current-issue"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary-700 hover:text-primary-900 transition-colors group"
            >
              <span>View All Papers in Current Issue</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {currentIssue?.articles && currentIssue.articles.length > 0 ? (
            <div className="space-y-4">
              {currentIssue.articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={{
                    ...article,
                    issue: {
                      id: currentIssue.id,
                      title: currentIssue.title,
                      issueNumber: currentIssue.issueNumber,
                      volume: currentIssue.volume,
                    },
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500">
              No published papers found in this issue yet.
            </div>
          )}

          {/* View Complete Issue CTA */}
          <div className="text-center pt-6">
            <Link
              href="/current-issue"
              className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-950 text-white text-sm font-semibold px-6 py-3 rounded-lg shadow-sm hover:shadow transition-all"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Browse All Articles &amp; Download Certificates &rarr;</span>
            </Link>
          </div>
        </section>

        {/* 4. Why Publish With Us / Author Advantages Grid */}
        <section className="mb-12 bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
              Author Advantages
            </span>
            <h2 className="text-2xl font-serif font-bold text-navy-900 mt-2">
              Why Publish in NRJBE?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Committed to ethical peer review, international indexing, and transparent publication processes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-lg bg-slate-50 border border-slate-200/80 hover:border-primary-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Fast-Track Peer Review</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Initial editorial decision within 3 days; thorough double-blind review completed within 7-14 days.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-slate-50 border border-slate-200/80 hover:border-primary-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Zenodo &amp; CrossRef DOI</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every published article is assigned a permanent Digital Object Identifier for global citation and metadata indexing.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-slate-50 border border-slate-200/80 hover:border-primary-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Open Access (CC BY-NC)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Retain author copyright while reaching thousands of researchers and libraries worldwide without paywalls.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-slate-50 border border-slate-200/80 hover:border-primary-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Official E-Certificate</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instant electronic publication certificate generated with individual paper verification IDs.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Call for Papers 2026 Submission Banner */}
        <section className="bg-gradient-to-r from-primary-900 via-navy-900 to-navy-950 text-white rounded-2xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="bg-amber-500 text-navy-950 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              Call For Papers 2026
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-3 leading-snug">
              Submit Your Research Paper for Upcoming Issues
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
              We invite researchers, academicians, and industry practitioners to submit original research manuscripts, empirical studies, and review articles in Business Management, Economics, Commerce, and Allied Disciplines.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-6">
              <Link
                href="/submit-paper"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-navy-950 text-xs sm:text-sm font-bold px-5 py-2.5 rounded-lg transition-colors shadow-md"
              >
                <FileUp className="w-4 h-4" />
                <span>Submit Manuscript Online</span>
              </Link>
              <Link
                href="/page/manuscript-guidelines"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white underline decoration-slate-400"
              >
                <span>Read Manuscript Guidelines</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href="/templates/Paper-Template.pdf"
                download
                className="text-xs text-amber-300 hover:text-amber-200 underline font-medium"
              >
                Download Paper Template (PDF)
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
