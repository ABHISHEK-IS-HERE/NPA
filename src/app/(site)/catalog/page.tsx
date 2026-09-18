'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Download,
  Printer,
  ShoppingBag,
  Building,
  CheckCircle2,
  ExternalLink,
  Award,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowRight,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';

const JOURNALS_CATALOG = [
  {
    id: 'nrjbe',
    name: 'National Research Journal of Business Economics',
    short: 'NRJBE',
    issn: '2349-2015',
    impact: '6.74',
    frequency: 'Biannual (2 Issues / Year)',
    discipline: 'Commerce, Economics, Corporate Governance & Business Management',
    indexing: 'Zenodo DOI, Google Scholar, CiteFactor, Index Copernicus, SJIF',
    price1YrInr: 3500,
    price2YrInr: 6500,
    price3YrInr: 9200,
    price1YrUsd: 130,
    price2YrUsd: 240,
    price3YrUsd: 340,
    color: 'border-l-primary-600',
  },
  {
    id: 'nrjbfm',
    name: 'National Research Journal of Banking & Finance Management',
    short: 'NRJBFM',
    issn: '2349-6762',
    impact: '6.52',
    frequency: 'Biannual (2 Issues / Year)',
    discipline: 'Banking Operations, FinTech, Risk Analytics, Investment & Monetary Policy',
    indexing: 'Zenodo DOI, Google Scholar, ResearchGate, SJIF',
    price1YrInr: 3500,
    price2YrInr: 6500,
    price3YrInr: 9200,
    price1YrUsd: 130,
    price2YrUsd: 240,
    price3YrUsd: 340,
    color: 'border-l-emerald-600',
  },
  {
    id: 'nrjhrm',
    name: 'National Research Journal of Human Resource Management',
    short: 'NRJHRM',
    issn: '2349-7432',
    impact: '6.31',
    frequency: 'Biannual (2 Issues / Year)',
    discipline: 'Strategic HRM, Organizational Psychology, Talent Analytics & Labor Laws',
    indexing: 'Google Scholar, CiteFactor, CrossRef / Zenodo DOI',
    price1YrInr: 3500,
    price2YrInr: 6500,
    price3YrInr: 9200,
    price1YrUsd: 130,
    price2YrUsd: 240,
    price3YrUsd: 340,
    color: 'border-l-purple-600',
  },
  {
    id: 'nrjit',
    name: 'National Research Journal of Information Technology',
    short: 'NRJIT',
    issn: '2349-8129',
    impact: '6.85',
    frequency: 'Biannual (2 Issues / Year)',
    discipline: 'Artificial Intelligence, Cloud Computing, Cybersecurity, Data Science & Software Systems',
    indexing: 'Zenodo DOI, Google Scholar, Index Copernicus (ICV), SJIF',
    price1YrInr: 3800,
    price2YrInr: 7100,
    price3YrInr: 9900,
    price1YrUsd: 140,
    price2YrUsd: 260,
    price3YrUsd: 370,
    color: 'border-l-blue-600',
  },
  {
    id: 'nrjbt',
    name: 'National Research Journal of Biotechnology & Biosciences',
    short: 'NRJBT',
    issn: '2349-9041',
    impact: '6.40',
    frequency: 'Biannual (2 Issues / Year)',
    discipline: 'Molecular Biology, Bioinformatics, Agriculture & Microbial Sciences',
    indexing: 'Zenodo DOI, Google Scholar, CiteFactor, SJIF',
    price1YrInr: 3800,
    price2YrInr: 7100,
    price3YrInr: 9900,
    price1YrUsd: 140,
    price2YrUsd: 260,
    price3YrUsd: 370,
    color: 'border-l-teal-600',
  },
  {
    id: 'nrjer',
    name: 'National Research Journal of Educational Research',
    short: 'NRJER',
    issn: '2349-5510',
    impact: '6.15',
    frequency: 'Biannual (2 Issues / Year)',
    discipline: 'Higher Education Policy, Educational Technology, Pedagogy & Assessment',
    indexing: 'Zenodo DOI, Google Scholar, ResearchGate',
    price1YrInr: 3200,
    price2YrInr: 6000,
    price3YrInr: 8500,
    price1YrUsd: 120,
    price2YrUsd: 220,
    price3YrUsd: 310,
    color: 'border-l-amber-600',
  },
];

export default function CatalogPage() {
  const { currency, formatPrice } = useCurrency();
  const [termView, setTermView] = useState<'1yr' | '2yr' | '3yr'>('1yr');

  return (
    <div className="py-10 bg-slate-50 min-h-[75vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Box */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-800 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
              <BookOpen className="w-4 h-4 text-primary-700" />
              <span>Official Publisher Catalog &bull; Academic Session 2026–2027</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-md border border-slate-300 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Rate Sheet</span>
              </button>
              <Link
                href="/institutions"
                className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
              >
                <Building className="w-3.5 h-3.5 text-stone-300" />
                <span>Generate Proforma Invoice</span>
              </Link>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
            Annual Institutional Subscription Catalog &amp; Rate List
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed max-w-4xl">
            Official annual price list and periodical directory for university central libraries, affiliated colleges, research institutions, and corporate R&amp;D resource centers. Subscriptions include free doorstep delivery across India via India Post Speed Post.
          </p>

          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>UGC-CARE &amp; NAAC Compliant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Doorstep Speed Post Delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Impact Factor 6.15 to 6.85</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>30-Day Quotation Price Lock</span>
            </div>
          </div>
        </div>

        {/* Duration Selector Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-navy-950">
              Journal Catalog &amp; Subscription Pricing
            </h2>
            <p className="text-xs text-slate-500">
              All prices in {currency === 'USD' ? 'US Dollars ($ USD)' : 'Indian Rupees (₹ INR)'} &bull; Applicable for Academic Year 2026
            </p>
          </div>

          <div className="inline-flex rounded-lg border border-slate-300 bg-white p-1 text-xs font-semibold">
            <button
              onClick={() => setTermView('1yr')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                termView === '1yr' ? 'bg-primary-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1-Year Rate
            </button>
            <button
              onClick={() => setTermView('2yr')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                termView === '2yr' ? 'bg-primary-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2-Years (Save ₹500)
            </button>
            <button
              onClick={() => setTermView('3yr')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                termView === '3yr' ? 'bg-primary-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3-Years (Save ₹1,300) ★
            </button>
          </div>
        </div>

        {/* Master Catalog Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="bg-navy-950 text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Journal Title &amp; ISSN</th>
                  <th className="px-3 py-3 text-center">Impact Factor</th>
                  <th className="px-3 py-3">Frequency</th>
                  <th className="px-4 py-3">Discipline Scope</th>
                  <th className="px-4 py-3 text-right">
                    {termView === '1yr'
                      ? '1-Year Rate'
                      : termView === '2yr'
                      ? '2-Year Rate'
                      : '3-Year Rate'}
                  </th>
                  <th className="px-3 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {JOURNALS_CATALOG.map((j) => {
                  const displayPrice =
                    currency === 'USD'
                      ? termView === '1yr'
                        ? `$${j.price1YrUsd}`
                        : termView === '2yr'
                        ? `$${j.price2YrUsd}`
                        : `$${j.price3YrUsd}`
                      : termView === '1yr'
                      ? `₹${j.price1YrInr.toLocaleString('en-IN')}`
                      : termView === '2yr'
                      ? `₹${j.price2YrInr.toLocaleString('en-IN')}`
                      : `₹${j.price3YrInr.toLocaleString('en-IN')}`;

                  return (
                    <tr key={j.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-navy-950 block text-sm">{j.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[11px] font-semibold text-primary-800 bg-primary-50 px-2 py-0.2 rounded border border-primary-200">
                            ISSN: {j.issn}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500 uppercase">
                            ({j.short})
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-center font-mono font-bold text-emerald-800 text-sm">
                        {j.impact}
                      </td>
                      <td className="px-3 py-3.5 text-slate-600 font-medium">
                        {j.frequency}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 max-w-xs text-[11px] leading-relaxed">
                        {j.discipline}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-sm text-navy-950">
                        {displayPrice}
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <Link
                          href={`/store`}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold bg-primary-50 hover:bg-primary-100 text-primary-800 px-2.5 py-1 rounded border border-primary-200 transition-colors"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Order</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Consortia & Departmental Packages Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-primary-900 to-navy-950 text-white rounded-xl p-6 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-900/40 px-2.5 py-0.5 rounded border border-amber-500/30">
              <Sparkles className="w-3 h-3" />
              <span>Full Consortia Discount (All 6 Journals)</span>
            </div>
            <h3 className="text-lg font-bold font-serif">
              Complete University Master Library Collection
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Subscribe to all 6 NPA periodicals (Business, Banking, HR, IT, Biotech, Education) and receive an automatic <strong>20% Institutional Discount</strong> plus complimentary hardbound annual archival volumes.
            </p>
            <div className="pt-2">
              <Link
                href="/institutions"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-navy-950 text-xs font-bold px-4 py-2 rounded-lg transition-colors"
              >
                <span>Generate Master Proforma Invoice &rarr;</span>
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-xl p-6 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-900/40 px-2.5 py-0.5 rounded border border-emerald-500/30">
              <Award className="w-3 h-3" />
              <span>Accreditation Compliance Package</span>
            </div>
            <h3 className="text-lg font-bold font-serif">
              NAAC Criterion 4.2 &amp; NIRF Library Kit
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Generate an official, stamp-ready NAAC Subscription Proof Certificate on National Press Associates letterhead with GSTIN, PAN, and volume coverage records for your college SSR audit.
            </p>
            <div className="pt-2">
              <Link
                href="/naac-compliance"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-navy-950 text-xs font-bold px-4 py-2 rounded-lg transition-colors"
              >
                <span>Generate NAAC Certificate &rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Institutional Procurement Mandate Details */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4 text-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Building className="w-4 h-4 text-primary-700" />
            <span>Official Publisher Registration &amp; Bank Mandate</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Publisher Name:</span>
              <strong className="text-navy-950">National Press Associates</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">GSTIN / Tax ID:</span>
              <strong className="font-mono text-navy-950">03AAEFN4829K1Z4</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">PAN Card Number:</span>
              <strong className="font-mono text-navy-950">AAEFN4829K</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">MSME Registration:</span>
              <strong className="font-mono text-navy-950">UDYAM-PB-12-0048291</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Bank &amp; Branch:</span>
              <strong className="text-navy-950">HDFC Bank Ltd, Punjab</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">RTGS / NEFT IFSC:</span>
              <strong className="font-mono text-navy-950">HDFC0000249</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Account Type:</span>
              <strong className="text-navy-950">Current Account</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Delivery Mode:</span>
              <strong className="text-navy-950">India Post Speed Post</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
