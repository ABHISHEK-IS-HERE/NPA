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
import { ResearchDiscoverySection } from '@/components/home/ResearchDiscoverySection';
import { MagazineCover } from '@/components/covers/MagazineCover';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { OrganizationJsonLd, JournalJsonLd } from '@/components/common/JsonLd';
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
  Building2,
  ExternalLink,
  Landmark,
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
          take: 24, // Show up to 24 papers for rich tabbed streams & taxonomy filtering
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
    contactEmail: 'editornrjbe@gmail.com',
    contactPhone: '+91-9888934889',
  };

  return (
    <div className="space-y-8 pb-16">
      <OrganizationJsonLd
        name={settings?.publisherName || defaultSettings.publisherName}
        url="https://npa-puce.vercel.app"
        email={settings?.contactEmail || defaultSettings.contactEmail}
        phone={settings?.contactPhone || defaultSettings.contactPhone}
      />
      <JournalJsonLd
        name={settings?.journalName || defaultSettings.journalName}
        issn={settings?.issn || defaultSettings.issn}
        url="https://npa-puce.vercel.app"
        publisherName={settings?.publisherName || defaultSettings.publisherName}
        description={settings?.tagline || defaultSettings.tagline}
      />
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
        {/* National & International Trust & Compliance Standards Bar */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="group bg-gradient-to-b from-white via-[#fffdfa] to-amber-50/40 p-4 rounded-xl border border-amber-200/90 shadow-2xs hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-amber-100/70 border border-amber-300/60 flex items-center justify-center mb-2 shadow-2xs group-hover:scale-110 group-hover:bg-amber-100 transition-all">
              <Landmark className="w-5 h-5 text-amber-800" />
            </div>
            <span className="text-xs font-bold text-stone-900 leading-tight">UGC-CARE Compliant</span>
            <span className="text-[10px] text-stone-500 mt-0.5 font-medium">API Score for CAS &amp; NAAC</span>
          </div>

          <div className="group bg-gradient-to-b from-white via-[#fffdfa] to-amber-50/40 p-4 rounded-xl border border-amber-200/90 shadow-2xs hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-amber-100/70 border border-amber-300/60 flex items-center justify-center mb-2 shadow-2xs group-hover:scale-110 group-hover:bg-amber-100 transition-all">
              <Truck className="w-5 h-5 text-amber-700" />
            </div>
            <span className="text-xs font-bold text-stone-900 leading-tight">India Speed Post</span>
            <span className="text-[10px] text-stone-500 mt-0.5 font-medium">Free Doorstep Dispatch</span>
          </div>

          <div className="group bg-gradient-to-b from-white via-[#fffdfa] to-amber-50/40 p-4 rounded-xl border border-amber-200/90 shadow-2xs hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-amber-100/70 border border-amber-300/60 flex items-center justify-center mb-2 shadow-2xs group-hover:scale-110 group-hover:bg-amber-100 transition-all">
              <ShieldCheck className="w-5 h-5 text-amber-800" />
            </div>
            <span className="text-xs font-bold text-stone-900 leading-tight">Double-Blind Refereed</span>
            <span className="text-[10px] text-stone-500 mt-0.5 font-medium">7-14 Days Peer Review</span>
          </div>

          <div className="group bg-gradient-to-b from-white via-[#fffdfa] to-amber-50/40 p-4 rounded-xl border border-amber-200/90 shadow-2xs hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-amber-100/70 border border-amber-300/60 flex items-center justify-center mb-2 shadow-2xs group-hover:scale-110 group-hover:bg-amber-100 transition-all">
              <Globe2 className="w-5 h-5 text-amber-700" />
            </div>
            <span className="text-xs font-bold text-stone-900 leading-tight">Zenodo &amp; CrossRef</span>
            <span className="text-[10px] text-stone-500 mt-0.5 font-medium">Permanent DOI Minting</span>
          </div>

          <div className="group bg-gradient-to-b from-white via-[#fffdfa] to-amber-50/40 p-4 rounded-xl border border-amber-200/90 shadow-2xs hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-amber-100/70 border border-amber-300/60 flex items-center justify-center mb-2 shadow-2xs group-hover:scale-110 group-hover:bg-amber-100 transition-all">
              <Award className="w-5 h-5 text-amber-700" />
            </div>
            <span className="text-xs font-bold text-stone-900 leading-tight">Impact Factor 6.74</span>
            <span className="text-[10px] text-stone-500 mt-0.5 font-medium">Google Scholar &amp; ICI</span>
          </div>

          <div className="group bg-gradient-to-b from-white via-[#fffdfa] to-amber-50/40 p-4 rounded-xl border border-amber-200/90 shadow-2xs hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-amber-100/70 border border-amber-300/60 flex items-center justify-center mb-2 shadow-2xs group-hover:scale-110 group-hover:bg-amber-100 transition-all">
              <Building2 className="w-5 h-5 text-amber-800" />
            </div>
            <span className="text-xs font-bold text-stone-900 leading-tight">Institutional Invoicing</span>
            <span className="text-[10px] text-stone-500 mt-0.5 font-medium">30-Day Proforma Lock</span>
          </div>
        </section>

        {/* 2. Journal Parameter & Key Metrics Profile */}
        <JournalProfileCard settings={defaultSettings} />

        {/* NPA Journal Network Showcase Section */}
        <section className="bg-[#fffdfa] rounded-xl border border-amber-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-200/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-100/90 text-amber-950 text-xs font-mono uppercase tracking-wider px-2.5 py-0.5 rounded border border-amber-300/80 font-medium">
                  Publisher Network
                </span>
                <span className="text-xs text-stone-500 font-medium">National Press Associates (npajournals.org)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-1.5">
                Explore NPA Peer-Reviewed Research Journals
              </h2>
            </div>

            <Link
              href="/store"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-950 hover:text-amber-800 transition-colors group"
            >
              <span>View All 6 NPA Journals in Store</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Journal 1: NRJBE */}
            <div className="bg-white rounded-xl p-4 border border-amber-200/80 hover:border-amber-400 transition-all flex gap-3.5 shadow-2xs">
              <div className="flex-shrink-0">
                <MagazineCover
                  volumeNumber="12"
                  issueNumber="1"
                  year="2026"
                  monthYear="Jan - Jun 2026"
                  journalTitle="Business Economics"
                  journalSubtitle="National Research Journal"
                  issn="2349-2015"
                  impactFactor="6.74"
                  accentColor="navy"
                  size="sm"
                  isCurrent
                />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <span className="font-mono text-[9px] font-bold bg-amber-100/90 text-amber-950 px-1.5 py-0.5 rounded border border-amber-200/80">
                  ISSN: 2349-2015
                </span>
                <h3 className="font-serif font-bold text-stone-900 text-xs leading-snug pt-0.5">
                  Business Economics (NRJBE)
                </h3>
                <p className="text-[10px] text-stone-500 line-clamp-2">
                  Applied Economics, Corporate Finance, Trade Policy &amp; Management.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <Link
                    href="/current-issue"
                    className="text-[10px] font-bold text-amber-900 hover:underline"
                  >
                    Current Issue &rarr;
                  </Link>
                  <Link
                    href="/submit-paper"
                    className="text-[10px] font-bold text-amber-700 hover:underline ml-auto"
                  >
                    Submit Paper &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Journal 2: NRJBFM */}
            <div className="bg-white rounded-xl p-4 border border-amber-200/80 hover:border-amber-400 transition-all flex gap-3.5 shadow-2xs">
              <div className="flex-shrink-0">
                <MagazineCover
                  volumeNumber="11"
                  issueNumber="2"
                  year="2026"
                  monthYear="Jan - Jun 2026"
                  journalTitle="Banking & Finance"
                  journalSubtitle="National Research Journal"
                  issn="2349-6762"
                  impactFactor="6.45"
                  accentColor="emerald"
                  size="sm"
                />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <span className="font-mono text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200/70">
                  ISSN: 2349-6762
                </span>
                <h3 className="font-serif font-bold text-stone-900 text-xs leading-snug pt-0.5">
                  Banking &amp; Finance Management
                </h3>
                <p className="text-[10px] text-stone-500 line-clamp-2">
                  Banking Reforms, Fintech, Financial Markets &amp; Risk Analytics.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <Link
                    href="/store"
                    className="text-[10px] font-bold text-amber-900 hover:underline"
                  >
                    Subscribe &rarr;
                  </Link>
                  <a
                    href="https://nrjbfm.in/submit-paper.php"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-stone-600 hover:text-amber-950 hover:underline ml-auto flex items-center gap-0.5"
                  >
                    <span>Gateway</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Journal 3: NRJHRM */}
            <div className="bg-white rounded-xl p-4 border border-amber-200/80 hover:border-amber-400 transition-all flex gap-3.5 shadow-2xs">
              <div className="flex-shrink-0">
                <MagazineCover
                  volumeNumber="10"
                  issueNumber="1"
                  year="2026"
                  monthYear="Jan - Jun 2026"
                  journalTitle="Human Resources"
                  journalSubtitle="National Research Journal"
                  issn="2394-059X"
                  impactFactor="6.12"
                  accentColor="burgundy"
                  size="sm"
                />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <span className="font-mono text-[9px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded border border-rose-200/70">
                  ISSN: 2394-059X
                </span>
                <h3 className="font-serif font-bold text-stone-900 text-xs leading-snug pt-0.5">
                  Human Resource Management
                </h3>
                <p className="text-[10px] text-stone-500 line-clamp-2">
                  HR Analytics, Organizational Behavior, Talent Strategy &amp; Labor Welfare.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <Link
                    href="/store"
                    className="text-[10px] font-bold text-amber-900 hover:underline"
                  >
                    Subscribe &rarr;
                  </Link>
                  <a
                    href="https://www.nrjhrm.in/submit-paper-online"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-stone-600 hover:text-amber-950 hover:underline ml-auto flex items-center gap-0.5"
                  >
                    <span>Gateway</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Journal 4: NRJITIS */}
            <div className="bg-white rounded-xl p-4 border border-amber-200/80 hover:border-amber-400 transition-all flex gap-3.5 shadow-2xs">
              <div className="flex-shrink-0">
                <MagazineCover
                  volumeNumber="11"
                  issueNumber="1"
                  year="2026"
                  monthYear="Jan - Jun 2026"
                  journalTitle="IT & Info Science"
                  journalSubtitle="National Research Journal"
                  issn="2350-1278"
                  impactFactor="6.85"
                  accentColor="indigo"
                  size="sm"
                />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <span className="font-mono text-[9px] font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded border border-indigo-200/70">
                  ISSN: 2350-1278
                </span>
                <h3 className="font-serif font-bold text-stone-900 text-xs leading-snug pt-0.5">
                  Info Tech &amp; Info Science
                </h3>
                <p className="text-[10px] text-stone-500 line-clamp-2">
                  Artificial Intelligence, Machine Learning, Cloud Systems &amp; Cybersecurity.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <Link
                    href="/store"
                    className="text-[10px] font-bold text-amber-900 hover:underline"
                  >
                    Subscribe &rarr;
                  </Link>
                  <a
                    href="https://nrjitis.in/submit-paper-online"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-stone-600 hover:text-amber-950 hover:underline ml-auto flex items-center gap-0.5"
                  >
                    <span>Gateway</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Journal 5: RRBB */}
            <div className="bg-white rounded-xl p-4 border border-amber-200/80 hover:border-amber-400 transition-all flex gap-3.5 shadow-2xs">
              <div className="flex-shrink-0">
                <MagazineCover
                  volumeNumber="14"
                  issueNumber="1"
                  year="2026"
                  monthYear="Jan - Jun 2026"
                  journalTitle="Biotech & Biosciences"
                  journalSubtitle="Research & Reviews"
                  issn="2321-8681"
                  impactFactor="6.52"
                  accentColor="sage"
                  size="sm"
                />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <span className="font-mono text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200/70">
                  ISSN: 2321-8681
                </span>
                <h3 className="font-serif font-bold text-stone-900 text-xs leading-snug pt-0.5">
                  Biotechnology &amp; Biosciences
                </h3>
                <p className="text-[10px] text-stone-500 line-clamp-2">
                  Molecular Biology, Genetics, Bioinformatics &amp; Clinical Sciences.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <Link
                    href="/store"
                    className="text-[10px] font-bold text-amber-900 hover:underline"
                  >
                    Subscribe &rarr;
                  </Link>
                  <a
                    href="https://www.biotechjournal.in/submit-paper-online"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-stone-600 hover:text-amber-950 hover:underline ml-auto flex items-center gap-0.5"
                  >
                    <span>Gateway</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Journal 6: AJEP */}
            <div className="bg-white rounded-xl p-4 border border-amber-200/80 hover:border-amber-400 transition-all flex gap-3.5 shadow-2xs">
              <div className="flex-shrink-0">
                <MagazineCover
                  volumeNumber="15"
                  issueNumber="1"
                  year="2026"
                  monthYear="Jan - Jun 2026"
                  journalTitle="Education & Psych"
                  journalSubtitle="Academe Journal"
                  issn="2249-040X"
                  impactFactor="5.98"
                  accentColor="amber"
                  size="sm"
                />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <span className="font-mono text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200/70">
                  ISSN: 2249-040X
                </span>
                <h3 className="font-serif font-bold text-stone-900 text-xs leading-snug pt-0.5">
                  Education &amp; Psychology (AJEP)
                </h3>
                <p className="text-[10px] text-stone-500 line-clamp-2">
                  Higher Education Policy, Pedagogical Innovation &amp; Behavioral Science.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <Link
                    href="/store"
                    className="text-[10px] font-bold text-amber-900 hover:underline"
                  >
                    Subscribe &rarr;
                  </Link>
                  <a
                    href="https://academejournal.in/submit-paper"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-stone-600 hover:text-amber-950 hover:underline ml-auto flex items-center gap-0.5"
                  >
                    <span>Gateway</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. E-Commerce Showcase: Physical Print Editions & Subscriptions */}
        <section className="bg-[#fffdfa] rounded-xl border border-amber-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-100/90 text-amber-950 text-xs font-mono uppercase tracking-wider px-2.5 py-0.5 rounded border border-amber-300/80 font-medium">
                  Journal Bookstore
                </span>
                <span className="text-xs text-stone-500 font-medium">Delivered to your home / library</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-1.5">
                Order Physical Magazine Copies &amp; Subscriptions
              </h2>
            </div>

            <Link
              href="/store"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-950 hover:text-amber-800 transition-colors group"
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
                  className="bg-white rounded-xl p-4 border border-amber-200/80 shadow-2xs hover:shadow-sm hover:border-amber-400 transition-all flex flex-col justify-between"
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
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-950 bg-amber-100/90 px-2 py-0.5 rounded border border-amber-300/70 font-medium">
                        {iss.isCurrent ? 'Current Issue' : 'Back Issue'}
                      </span>
                      <h3 className="font-serif font-bold text-stone-900 text-xs sm:text-sm line-clamp-2 mt-1">
                        {iss.title}
                      </h3>
                      <p className="text-[11px] text-stone-500">{iss.monthYear}</p>
                      <div className="pt-1">
                        <span className="text-base font-bold text-stone-900">₹{price}</span>
                        <span className="text-[10px] text-stone-500 ml-1">INR</span>
                        <span className="text-[10px] text-amber-800 font-medium block flex items-center gap-1 mt-0.5">
                          <Truck className="w-3 h-3 text-amber-600" /> Free Speed Post
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-amber-200/70 flex items-center justify-between gap-2">
                    <Link
                      href={iss.isCurrent ? '/current-issue' : `/archives#issue-${iss.id}`}
                      className="text-[11px] font-semibold text-stone-600 hover:text-amber-950"
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
                      className="bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold py-1.5 px-3 rounded-md shadow-2xs transition-all flex items-center gap-1 border border-amber-500/20"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-amber-50 via-amber-100/50 to-amber-50 p-4 rounded-xl border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-lg bg-amber-200/80 text-amber-950 flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                  Annual Subscription (Print + Digital) Available at ₹3,500/Year
                </h4>
                <p className="text-[11px] text-stone-600">
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
              className="bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold py-2 px-4 rounded-md shadow-2xs transition-all flex-shrink-0 border border-amber-500/30"
            />
          </div>
        </section>

        {/* 3. Dynamic Research Discovery: Tabbed Streams & Subject Taxonomy */}
        <ResearchDiscoverySection
          currentIssueTitle={currentIssue?.title || 'Volume 12, Issue 1 (January - June 2026)'}
          articles={
            currentIssue?.articles
              ? currentIssue.articles.map((article) => ({
                  ...article,
                  issue: {
                    id: currentIssue.id,
                    title: currentIssue.title,
                    issueNumber: currentIssue.issueNumber,
                    volume: currentIssue.volume,
                  },
                }))
              : []
          }
        />

        {/* Indexing Partners & Digital Archiving Strip (Benchmark: ScienceDirect) */}
        <section className="bg-[#fffdfa] rounded-xl border border-amber-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-200/80">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-stone-500">
                Digital Archiving &amp; Abstracting
              </span>
              <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg mt-0.5">
                Globally Indexed &amp; Citations Tracked
              </h3>
            </div>
            <span className="text-xs text-stone-600 font-medium">
              Permanent DOI Repository: <strong className="font-mono text-amber-950 font-bold">10.5281/zenodo</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
            <div className="p-3.5 rounded-lg bg-amber-50/40 border border-amber-200/70 hover:bg-white hover:border-amber-400 hover:shadow-2xs transition-all flex flex-col items-center text-center space-y-1">
              <span className="font-bold text-xs sm:text-sm text-stone-900">Google Scholar</span>
              <span className="text-[10px] text-stone-500">Citation Metrics</span>
            </div>
            <div className="p-3.5 rounded-lg bg-amber-50/40 border border-amber-200/70 hover:bg-white hover:border-amber-400 hover:shadow-2xs transition-all flex flex-col items-center text-center space-y-1">
              <span className="font-bold text-xs sm:text-sm text-stone-900">Zenodo (CERN)</span>
              <span className="text-[10px] text-stone-500">Permanent Repository</span>
            </div>
            <div className="p-3.5 rounded-lg bg-amber-50/40 border border-amber-200/70 hover:bg-white hover:border-amber-400 hover:shadow-2xs transition-all flex flex-col items-center text-center space-y-1">
              <span className="font-bold text-xs sm:text-sm text-stone-900">CrossRef</span>
              <span className="text-[10px] text-stone-500">Official DOI Registry</span>
            </div>
            <div className="p-3.5 rounded-lg bg-amber-50/40 border border-amber-200/70 hover:bg-white hover:border-amber-400 hover:shadow-2xs transition-all flex flex-col items-center text-center space-y-1">
              <span className="font-bold text-xs sm:text-sm text-stone-900">ResearchGate</span>
              <span className="text-[10px] text-stone-500">Academic Network</span>
            </div>
            <div className="p-3.5 rounded-lg bg-amber-50/40 border border-amber-200/70 hover:bg-white hover:border-amber-400 hover:shadow-2xs transition-all flex flex-col items-center text-center space-y-1">
              <span className="font-bold text-xs sm:text-sm text-stone-900">DRJI</span>
              <span className="text-[10px] text-stone-500">Journal Indexing</span>
            </div>
            <div className="p-3.5 rounded-lg bg-amber-50/40 border border-amber-200/70 hover:bg-white hover:border-amber-400 hover:shadow-2xs transition-all flex flex-col items-center text-center space-y-1">
              <span className="font-bold text-xs sm:text-sm text-stone-900">ICI Journals</span>
              <span className="text-[10px] text-stone-500">Master List Evaluation</span>
            </div>
          </div>
        </section>

        {/* 4. Why Publish With Us / Author Advantages Grid */}
        <section className="mb-12 bg-[#fffdfa] rounded-xl border border-amber-200/80 p-6 sm:p-8 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-950 bg-amber-100/90 px-3 py-1 rounded border border-amber-300/80 font-medium">
              Author Advantages
            </span>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mt-2">
              Why Publish in NRJBE?
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 font-sans">
              Committed to ethical peer review, international indexing, and transparent publication processes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-lg bg-white border border-amber-200/70 hover:border-amber-400 hover:shadow-2xs transition-all">
              <div className="w-10 h-10 rounded-lg bg-amber-100/90 text-amber-900 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm mb-1 font-serif">Fast-Track Peer Review</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Initial editorial decision within 3 days; thorough double-blind review completed within 7-14 days.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-white border border-amber-200/70 hover:border-amber-400 hover:shadow-2xs transition-all">
              <div className="w-10 h-10 rounded-lg bg-amber-100/90 text-amber-900 flex items-center justify-center mb-3">
                <Globe2 className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm mb-1 font-serif">Zenodo &amp; CrossRef DOI</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Every published article is assigned a permanent Digital Object Identifier for global citation and metadata indexing.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-white border border-amber-200/70 hover:border-amber-400 hover:shadow-2xs transition-all">
              <div className="w-10 h-10 rounded-lg bg-amber-100/90 text-amber-900 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm mb-1 font-serif">Open Access (CC BY-NC)</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Retain author copyright while reaching thousands of researchers and libraries worldwide without paywalls.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-white border border-amber-200/70 hover:border-amber-400 hover:shadow-2xs transition-all">
              <div className="w-10 h-10 rounded-lg bg-amber-100/90 text-amber-900 flex items-center justify-center mb-3">
                <Award className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm mb-1 font-serif">Official E-Certificate</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Instant electronic publication certificate generated with individual paper verification IDs.
              </p>
            </div>
          </div>
        </section>

        {/* Dedicated Institutional & University Library Acquisition Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0c1829] via-[#12233c] to-[#0c1829] text-white p-7 sm:p-10 border border-amber-500/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-amber-400/5 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-2 text-center md:text-left max-w-2xl">
            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400/20 to-amber-500/10 text-amber-300 border border-amber-400/50 text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              University &amp; College Librarians
            </span>
            <h3 className="font-serif font-bold text-xl sm:text-2xl lg:text-3xl text-stone-100 leading-snug">
              Equipping Your Library? Generate an Official Proforma Invoice in 30 Seconds
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
              Select multiple NPA journals, choose 1 to 3-year subscription terms with locked-in institutional rates, and download an official stamp-ready Proforma Invoice for your acquisition committee.
            </p>
          </div>

          <Link
            href="/institutions"
            className="relative z-10 inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-stone-950 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-lg shadow-lg hover:shadow-amber-500/20 transition-all flex-shrink-0 border border-amber-300/80 group"
          >
            <Building2 className="w-4 h-4 text-stone-950" />
            <span>Open Institutional Portal</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>

        {/* 5. Call for Papers 2026 Submission Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#18181b] via-[#242220] to-[#18181b] text-white p-7 sm:p-10 border border-amber-500/30 shadow-xl">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Call For Papers 2026
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white mt-3 leading-snug">
              Submit Your Research Paper for Upcoming Issues
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm mt-2.5 leading-relaxed font-sans max-w-2xl">
              We invite researchers, academicians, and industry practitioners to submit original research manuscripts, empirical studies, and review articles in Business Management, Economics, Commerce, and Allied Disciplines.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-7">
              <Link
                href="/submit-paper"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-stone-950 text-xs sm:text-sm font-bold px-6 py-3 rounded-lg transition-all shadow-md border border-amber-300/80 group"
              >
                <FileUp className="w-4 h-4 text-stone-950" />
                <span>Submit Manuscript Online</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/page/manuscript-guidelines"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-300 hover:text-white underline decoration-stone-500"
              >
                <span>Read Manuscript Guidelines</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href="/templates/Paper-Template.pdf"
                download
                className="text-xs text-amber-300 hover:text-amber-200 underline font-semibold"
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
