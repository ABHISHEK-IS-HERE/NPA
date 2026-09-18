'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  BookOpen,
  Truck,
  ShieldCheck,
  CheckCircle,
  Award,
  Sparkles,
  FileCheck,
  PackageCheck,
  Filter,
  ExternalLink,
  Building2,
  FileText,
} from 'lucide-react';
import { MagazineCover } from '@/components/covers/MagazineCover';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { useCurrency } from '@/context/CurrencyContext';
import { CurrencySwitcher } from '@/components/common/CurrencySwitcher';

interface StoreCatalogProps {
  issues: any[];
  plans: any[];
  settings: any;
}

const DISCIPLINES = [
  { id: 'all', label: 'All Disciplines' },
  { id: 'economics', label: 'Business & Economics' },
  { id: 'banking', label: 'Banking & Finance' },
  { id: 'hr', label: 'Human Resources' },
  { id: 'it', label: 'Computing & IT' },
  { id: 'biotech', label: 'Biotechnology & Biosciences' },
  { id: 'education', label: 'Education & Psychology' },
];

const ALL_NPA_JOURNALS = [
  {
    id: 'nrjbe',
    discipline: 'economics',
    title: 'National Research Journal of Business Economics',
    shortName: 'NRJBE',
    issn: '2349-2015',
    impactFactor: '6.74',
    scope: 'Micro/Macro Economics, Corporate Finance, Trade Policy, International Business',
    accentColor: 'navy' as const,
    gateway: 'editornrjbe@gmail.com',
    isPrimary: true,
  },
  {
    id: 'nrjbfm',
    discipline: 'banking',
    title: 'National Research Journal of Banking & Finance Management',
    shortName: 'NRJBFM',
    issn: '2349-6762',
    impactFactor: '6.45',
    scope: 'Banking Reforms, Commercial Banking, Financial Markets, Risk Analytics',
    accentColor: 'emerald' as const,
    gateway: 'https://nrjbfm.in/submit-paper.php',
    isPrimary: false,
  },
  {
    id: 'nrjhrm',
    discipline: 'hr',
    title: 'National Research Journal of Human Resource Management',
    shortName: 'NRJHRM',
    issn: '2394-059X',
    impactFactor: '6.12',
    scope: 'HR Analytics, Organizational Psychology, Talent Acquisition, Labor Welfare',
    accentColor: 'burgundy' as const,
    gateway: 'https://www.nrjhrm.in/submit-paper-online',
    isPrimary: false,
  },
  {
    id: 'nrjitis',
    discipline: 'it',
    title: 'National Research Journal of Info Tech & Info Science',
    shortName: 'NRJITIS',
    issn: '2350-1278',
    impactFactor: '6.85',
    scope: 'Artificial Intelligence, Cloud Computing, Cybersecurity, Data Science, IoT',
    accentColor: 'indigo' as const,
    gateway: 'https://nrjitis.in/submit-paper-online',
    isPrimary: false,
  },
  {
    id: 'rrbb',
    discipline: 'biotech',
    title: 'Research & Reviews in Biotechnology & Biosciences',
    shortName: 'RRBB',
    issn: '2321-8681',
    impactFactor: '6.52',
    scope: 'Molecular Biology, Bioinformatics, Pharmacology, Genomics, Biochemistry',
    accentColor: 'sage' as const,
    gateway: 'https://www.biotechjournal.in/submit-paper-online',
    isPrimary: false,
  },
  {
    id: 'ajep',
    discipline: 'education',
    title: 'Academe Journal of Education & Psychology',
    shortName: 'AJEP',
    issn: '2249-040X',
    impactFactor: '5.98',
    scope: 'Pedagogical Innovation, Higher Education Policy, Behavioral Studies',
    accentColor: 'amber' as const,
    gateway: 'https://academejournal.in/submit-paper',
    isPrimary: false,
  },
];

export const StoreCatalog: React.FC<StoreCatalogProps> = ({ issues, plans, settings }) => {
  const { currency, formatPrice } = useCurrency();
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  const [subscriptionDuration, setSubscriptionDuration] = useState<'1yr' | '2yr' | '3yr'>('1yr');

  const filteredJournals = selectedDiscipline === 'all'
    ? ALL_NPA_JOURNALS
    : ALL_NPA_JOURNALS.filter((j) => j.discipline === selectedDiscipline);

  return (
    <div className="space-y-12 pb-16">
      {/* Store Hero Banner */}
      <section className="bg-gradient-to-b from-[#fefce8] via-[#fefbf0] to-[#fffdf5] text-stone-900 py-12 px-4 sm:px-6 lg:px-8 border-b border-amber-200/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="bg-amber-400 text-stone-950 text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border border-amber-500/40">
                NPA Official Publishing &amp; Subscription Store
              </span>
              <span className="text-xs text-stone-500 font-mono">
                ISSN Registered • Refereed Editions
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              Order Physical Journal Copies &amp; Subscription Packages
            </h1>

            <p className="text-sm text-stone-600 leading-relaxed">
              Purchase physical bound periodical volumes, register institutional library subscriptions with multi-year savings, or order author APC and certificate bundles. Fast dispatch via India Post Speed Post across India and airmail internationally.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-stone-600">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Speed Post Across India (Free)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>UGC-CARE Compliant API Score</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-800" />
                <span>Zenodo &amp; CrossRef DOI Indexed</span>
              </span>
            </div>
          </div>

          {/* Quick Institutional Callout Card */}
          <div className="bg-white/90 border border-amber-300 p-5 rounded-2xl shadow-2xs flex flex-col gap-3 max-w-sm flex-shrink-0 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-200 text-amber-950 px-2 py-0.5 rounded border border-amber-300">
                For University Libraries
              </span>
              <CurrencySwitcher variant="compact" />
            </div>
            <h4 className="text-sm font-serif font-bold text-stone-900 leading-snug">
              Need an Official Proforma Invoice for College PO?
            </h4>
            <p className="text-xs text-stone-600">
              Generate an immediate quotation with 30-day price lock, GSTIN, and bank mandate for your acquisition committee.
            </p>
            <Link
              href="/institutions"
              className="inline-flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs py-2 px-3 rounded-lg shadow-2xs transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generate Proforma Invoice</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* DISCIPLINE FILTER BAR (Benchmarked against mysubs.in categories) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-xl border border-amber-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
            <Filter className="w-4 h-4 text-amber-700" />
            <span>Filter by Academic Discipline:</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {DISCIPLINES.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDiscipline(d.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedDiscipline === d.id
                    ? 'bg-amber-400 text-stone-950 shadow-2xs font-bold'
                    : 'bg-stone-100 text-stone-700 hover:bg-amber-100'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 1: PHYSICAL PRINT COPIES & ISSUES CATALOG */}
        <section id="print-issues" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-primary-100 text-primary-800 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
                  Physical Journal Editions
                </span>
                <span className="text-xs text-slate-500 font-medium">Delivered to your address</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-navy-900 mt-1">
                Hardcopy Magazine Issues &amp; Bound Volumes
              </h2>
            </div>
            <p className="text-xs text-slate-500 sm:text-right max-w-xs">
              Printed on premium 80 GSM bond paper with 300 GSM glossy laminated cover.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((iss) => {
              const issuePriceInr = iss.printPrice || 450;
              const issuePriceUsd = 18; // International Airmail rate

              return (
                <div
                  key={iss.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between group"
                >
                  <div className="flex gap-4">
                    {/* 3D Cover */}
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

                    {/* Metadata & Details */}
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {iss.isCurrent ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                            Current Issue
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                            Archive Issue
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-medium">
                          {iss._count.articles} Papers Included
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-navy-900 text-sm leading-snug line-clamp-2 group-hover:text-primary-800 transition-colors">
                        {iss.title}
                      </h3>

                      <p className="text-[11px] text-slate-500">
                        Period: <strong>{iss.monthYear}</strong>
                      </p>

                      <div className="pt-1">
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-extrabold text-navy-900">
                            {formatPrice(issuePriceInr, issuePriceUsd)}
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                          <Truck className="w-3 h-3" />
                          <span>{currency === 'USD' ? 'Includes Global Airmail Dispatch' : 'Includes Free India Speed Post'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      href={iss.isCurrent ? '/current-issue' : `/archives#issue-${iss.id}`}
                      className="text-xs font-semibold text-slate-600 hover:text-primary-700 flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Table of Contents</span>
                    </Link>

                    <AddToCartButton
                      id={`issue-${iss.id}`}
                      type="print_issue"
                      title={`${iss.title} - Hardcopy Print Edition`}
                      subtitle={`Volume ${iss.volume.volumeNumber}, Issue ${iss.issueNumber} • Delivered via Speed Post`}
                      price={issuePriceInr}
                      priceUsd={issuePriceUsd}
                      badge="Print Copy"
                      label="Buy Hardcopy"
                      className="bg-primary-700 hover:bg-primary-800 text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-xs transition-all flex items-center gap-1.5"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 2: NPA JOURNAL NETWORK PORTFOLIO (From npajournals.org crawl) */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
                  Publisher Portfolio
                </span>
                <span className="text-xs text-slate-500 font-medium">National Press Associates</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-navy-900 mt-1">
                National Press Associates Peer-Reviewed Journals
              </h2>
            </div>
            <p className="text-xs text-slate-500 sm:text-right max-w-xs">
              Subscribe or submit manuscripts across NPA&apos;s disciplinary network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJournals.map((journal) => (
              <div
                key={journal.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <MagazineCover
                      volumeNumber="12"
                      issueNumber="1"
                      year="2026"
                      monthYear="Jan - Jun 2026"
                      journalTitle={journal.title.replace('National Research Journal of ', '')}
                      journalSubtitle="National Research Journal"
                      issn={journal.issn}
                      impactFactor={journal.impactFactor}
                      accentColor={journal.accentColor}
                      size="sm"
                      isCurrent
                    />
                  </div>

                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="bg-navy-100 text-navy-900 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">
                        ISSN: {journal.issn}
                      </span>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        IF: {journal.impactFactor}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-navy-900 text-xs sm:text-sm leading-snug">
                      {journal.title}
                    </h3>

                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {journal.scope}
                    </p>

                    <div className="pt-1">
                      <span className="text-xs font-extrabold text-navy-900">
                        {formatPrice(3500, 65)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium ml-1">/ Year (Print)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <AddToCartButton
                    id={`sub-${journal.id}-1yr`}
                    type="subscription"
                    title={`${journal.shortName} - 1 Year Institutional Subscription`}
                    subtitle={`ISSN: ${journal.issn} • 2 Bound Print Issues`}
                    price={3500}
                    priceUsd={65}
                    badge="Annual Plan"
                    label="Subscribe"
                    className="bg-navy-900 hover:bg-navy-950 text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-xs transition-all"
                  />

                  {journal.isPrimary ? (
                    <Link
                      href="/submit-paper"
                      className="text-xs font-semibold text-primary-700 hover:text-primary-900 flex items-center gap-1"
                    >
                      <span>Submit Paper</span>
                    </Link>
                  ) : (
                    <a
                      href={journal.gateway}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-primary-700 hover:text-primary-900 flex items-center gap-1"
                    >
                      <span>Paper Gateway</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: SUBSCRIPTION PACKAGES WITH MULTI-YEAR SAVINGS SELECTOR */}
        <section id="subscriptions" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
                  Subscription Plans
                </span>
                <span className="text-xs text-slate-500 font-medium">Multi-Year Savings Available</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-navy-900 mt-1">
                Annual &amp; Multi-Year Journal Subscriptions
              </h2>
            </div>

            {/* Duration Selector Tabs */}
            <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setSubscriptionDuration('1yr')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  subscriptionDuration === '1yr'
                    ? 'bg-white text-navy-900 shadow-xs'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                1 Year
              </button>

              <button
                type="button"
                onClick={() => setSubscriptionDuration('2yr')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  subscriptionDuration === '2yr'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                <span>2 Years</span>
                <span className="bg-emerald-100 text-emerald-700 text-[9px] px-1.5 py-0.2 rounded font-extrabold">
                  Save ₹500
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSubscriptionDuration('3yr')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  subscriptionDuration === '3yr'
                    ? 'bg-amber-500 text-navy-950 shadow-xs'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                <span>3 Years</span>
                <span className="bg-navy-950 text-amber-300 text-[9px] px-1.5 py-0.2 rounded font-extrabold">
                  Save ₹1,300
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              let features: string[] = [];
              try {
                features = JSON.parse(plan.featuresJson);
              } catch {
                features = ['Printed journal copies delivered', 'Full digital archive access'];
              }

              // Adjust price based on duration
              let inrPrice = plan.priceInr;
              let usdPrice = plan.priceUsd || 65;

              if (subscriptionDuration === '2yr') {
                inrPrice = plan.priceInr * 2 - 500;
                usdPrice = (plan.priceUsd || 65) * 2 - 10;
              } else if (subscriptionDuration === '3yr') {
                inrPrice = plan.priceInr * 3 - 1300;
                usdPrice = (plan.priceUsd || 65) * 3 - 30;
              }

              const durationLabel = subscriptionDuration === '1yr' ? '1 Year' : subscriptionDuration === '2yr' ? '2 Years' : '3 Years';

              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-2xl p-6 border transition-all flex flex-col justify-between relative ${
                    plan.isPopular || subscriptionDuration === '3yr'
                      ? 'border-2 border-amber-500 shadow-lg ring-4 ring-amber-500/10'
                      : 'border-slate-200 shadow-xs hover:shadow-md'
                  }`}
                >
                  {(plan.isPopular || subscriptionDuration === '3yr') && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-500 text-navy-950 text-[10px] font-extrabold uppercase tracking-wider py-0.5 px-3 rounded-full shadow-xs">
                      {subscriptionDuration === '3yr' ? 'Recommended for Libraries' : 'Most Popular Tier'}
                    </div>
                  )}

                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {plan.planType} Tier
                    </span>
                    <h3 className="text-lg font-serif font-bold text-navy-900 mt-1">
                      {plan.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {plan.format} • {durationLabel} Duration
                    </p>

                    <div className="my-5 pb-5 border-b border-slate-100">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-serif font-bold text-navy-900">
                          {formatPrice(inrPrice, usdPrice)}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          / {durationLabel}
                        </span>
                      </div>
                      {subscriptionDuration !== '1yr' && (
                        <p className="text-xs text-emerald-700 font-bold mt-1">
                          Multi-Year Institutional Discount Applied
                        </p>
                      )}
                    </div>

                    <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                      {features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <AddToCartButton
                    id={`plan-${plan.id}-${subscriptionDuration}`}
                    type="subscription"
                    title={`${plan.title} (${durationLabel})`}
                    subtitle={`${plan.format} • ${durationLabel} Subscription`}
                    price={inrPrice}
                    priceUsd={usdPrice}
                    badge="Subscription"
                    label={`Subscribe (${formatPrice(inrPrice, usdPrice)})`}
                    className={`w-full text-xs font-bold py-3 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 ${
                      plan.isPopular || subscriptionDuration === '3yr'
                        ? 'bg-amber-500 hover:bg-amber-600 text-navy-950'
                        : 'bg-navy-900 hover:bg-navy-950 text-white'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 4: AUTHOR APC & CERTIFICATE PACKAGES */}
        <section id="author-packages" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
                  Author Services
                </span>
                <span className="text-xs text-slate-500 font-medium">After Acceptance</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-navy-900 mt-1">
                Article Processing Charges &amp; Author Certificates
              </h2>
            </div>
            <p className="text-xs text-slate-500 sm:text-right max-w-xs">
              Instant receipt generation formatted for university reimbursement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Package 1: APC Online */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center mb-3">
                  <FileCheck className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-navy-900">
                  Online Open Access Publication
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  For accepted manuscripts requiring permanent online indexing and DOI assignment.
                </p>

                <div className="my-4 pb-4 border-b border-slate-100">
                  <span className="text-2xl font-bold text-navy-900">
                    {formatPrice(1800, 45)}
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Zenodo &amp; CrossRef DOI Assignment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Permanent Open Access (CC BY-NC)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Electronic Publication Certificate</span>
                  </li>
                </ul>
              </div>

              <AddToCartButton
                id="apc-online"
                type="apc"
                title="APC - Online Open Access Publication"
                subtitle="DOI Assignment + E-Certificate"
                price={1800}
                priceUsd={45}
                badge="APC Fee"
                label={`Pay APC (${formatPrice(1800, 45)})`}
                className="w-full bg-primary-700 hover:bg-primary-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              />
            </div>

            {/* Package 2: APC Print Bundle */}
            <div className="bg-white rounded-2xl p-6 border-2 border-primary-600 shadow-md flex flex-col justify-between relative">
              <div className="absolute -top-3 right-4 bg-primary-700 text-white text-[10px] font-extrabold uppercase tracking-wider py-0.5 px-2.5 rounded-full shadow-xs">
                Author Recommended
              </div>

              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                  <PackageCheck className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-navy-900">
                  Publication + Hardcopy Print Bundle
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Complete package including physical printed journal copy and certificate.
                </p>

                <div className="my-4 pb-4 border-b border-slate-100">
                  <span className="text-2xl font-bold text-navy-900">
                    {formatPrice(2300, 65)}
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>All Online Open Access benefits + DOI</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Physical Printed Journal Copy Mailed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Printed Author Certificate with Hologram</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Speed Post Dispatch with Tracking</span>
                  </li>
                </ul>
              </div>

              <AddToCartButton
                id="apc-print-bundle"
                type="apc"
                title="APC Bundle - Publication + Print Issue + Certificate"
                subtitle="Includes Physical Journal & Hologram Certificate"
                price={2300}
                priceUsd={65}
                badge="Complete Bundle"
                label={`Buy Complete Bundle (${formatPrice(2300, 65)})`}
                className="w-full bg-amber-500 hover:bg-amber-600 text-navy-950 text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              />
            </div>

            {/* Package 3: Extra Certificate */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-navy-900">
                  Extra Printed Certificate (Co-Authors)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Additional original hardcopy certificates with security hologram for secondary authors.
                </p>

                <div className="my-4 pb-4 border-b border-slate-100">
                  <span className="text-2xl font-bold text-navy-900">
                    {formatPrice(400, 15)}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">per certificate</span>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Original Embossed Security Hologram</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Individual Co-Author Name Verification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dispatched in Rigid Protective Envelope</span>
                  </li>
                </ul>
              </div>

              <AddToCartButton
                id="extra-certificate"
                type="certificate"
                title="Extra Hardcopy Author Certificate"
                subtitle="Printed Certificate with Security Hologram"
                price={400}
                priceUsd={15}
                badge="Certificate"
                label={`Order Certificate (${formatPrice(400, 15)})`}
                className="w-full bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
