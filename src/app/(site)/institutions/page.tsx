'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  FileText,
  Printer,
  Download,
  CheckCircle2,
  ShieldCheck,
  Award,
  Truck,
  Phone,
  Mail,
  HelpCircle,
  Clock,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';

interface JournalOption {
  id: string;
  name: string;
  code: string;
  issn: string;
  discipline: string;
  frequency: string;
  price1YrInr: number;
  price2YrInr: number;
  price3YrInr: number;
  price1YrUsd: number;
  price2YrUsd: number;
  price3YrUsd: number;
}

const NPA_JOURNALS: JournalOption[] = [
  {
    id: 'nrjbe',
    name: 'National Research Journal of Business Economics (NRJBE)',
    code: 'NRJBE',
    issn: '2349-2015',
    discipline: 'Business, Economics & Commerce',
    frequency: 'Biannual (2 Issues/Yr)',
    price1YrInr: 3500,
    price2YrInr: 6500,
    price3YrInr: 9200,
    price1YrUsd: 65,
    price2YrUsd: 120,
    price3YrUsd: 165,
  },
  {
    id: 'nrjbfm',
    name: 'National Research Journal of Banking and Finance Management (NRJBFM)',
    code: 'NRJBFM',
    issn: '2349-6762',
    discipline: 'Banking, Fintech & Financial Management',
    frequency: 'Biannual (2 Issues/Yr)',
    price1YrInr: 3500,
    price2YrInr: 6500,
    price3YrInr: 9200,
    price1YrUsd: 65,
    price2YrUsd: 120,
    price3YrUsd: 165,
  },
  {
    id: 'nrjhrm',
    name: 'National Research Journal of Human Resource Management (NRJHRM)',
    code: 'NRJHRM',
    issn: '2394-059X',
    discipline: 'HR Analytics & Organizational Behavior',
    frequency: 'Biannual (2 Issues/Yr)',
    price1YrInr: 3500,
    price2YrInr: 6500,
    price3YrInr: 9200,
    price1YrUsd: 65,
    price2YrUsd: 120,
    price3YrUsd: 165,
  },
  {
    id: 'nrjitis',
    name: 'National Research Journal of Info Tech & Info Science (NRJITIS)',
    code: 'NRJITIS',
    issn: '2350-1278',
    discipline: 'Computer Science, AI, Cloud & IoT',
    frequency: 'Biannual (2 Issues/Yr)',
    price1YrInr: 3500,
    price2YrInr: 6500,
    price3YrInr: 9200,
    price1YrUsd: 65,
    price2YrUsd: 120,
    price3YrUsd: 165,
  },
  {
    id: 'rrbb',
    name: 'Research & Reviews in Biotechnology & Biosciences (RRBB)',
    code: 'RRBB',
    issn: '2321-8681',
    discipline: 'Biotechnology, Life Sciences & Medicine',
    frequency: 'Biannual (2 Issues/Yr)',
    price1YrInr: 3500,
    price2YrInr: 6500,
    price3YrInr: 9200,
    price1YrUsd: 65,
    price2YrUsd: 120,
    price3YrUsd: 165,
  },
  {
    id: 'ajep',
    name: 'Academe Journal of Education & Psychology (AJEP)',
    code: 'AJEP',
    issn: '2249-040X',
    discipline: 'Education, Pedagogy & Psychology',
    frequency: 'Biannual (2 Issues/Yr)',
    price1YrInr: 3500,
    price2YrInr: 6500,
    price3YrInr: 9200,
    price1YrUsd: 65,
    price2YrUsd: 120,
    price3YrUsd: 165,
  },
];

export default function InstitutionsPage() {
  const { currency, formatPrice } = useCurrency();

  // Quotation state
  const [selectedJournals, setSelectedJournals] = useState<string[]>(['nrjbe']);
  const [term, setTerm] = useState<'1yr' | '2yr' | '3yr'>('1yr');
  const [institutionName, setInstitutionName] = useState('');
  const [department, setDepartment] = useState('Central Library');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [gstin, setGstin] = useState('');

  const [generatedInvoice, setGeneratedInvoice] = useState<any | null>(null);

  const toggleJournal = (id: string) => {
    if (selectedJournals.includes(id)) {
      if (selectedJournals.length > 1) {
        setSelectedJournals(selectedJournals.filter((j) => j !== id));
      }
    } else {
      setSelectedJournals([...selectedJournals, id]);
    }
  };

  const selectAllJournals = () => {
    setSelectedJournals(NPA_JOURNALS.map((j) => j.id));
  };

  // Compute quotation price
  const calculateTotal = () => {
    return selectedJournals.reduce((acc, jId) => {
      const journal = NPA_JOURNALS.find((j) => j.id === jId);
      if (!journal) return acc;
      if (currency === 'USD') {
        if (term === '1yr') return acc + journal.price1YrUsd;
        if (term === '2yr') return acc + journal.price2YrUsd;
        return acc + journal.price3YrUsd;
      } else {
        if (term === '1yr') return acc + journal.price1YrInr;
        if (term === '2yr') return acc + journal.price2YrInr;
        return acc + journal.price3YrInr;
      }
    }, 0);
  };

  const calculateInrTotal = () => {
    return selectedJournals.reduce((acc, jId) => {
      const journal = NPA_JOURNALS.find((j) => j.id === jId);
      if (!journal) return acc;
      if (term === '1yr') return acc + journal.price1YrInr;
      if (term === '2yr') return acc + journal.price2YrInr;
      return acc + journal.price3YrInr;
    }, 0);
  };

  const calculateUsdTotal = () => {
    return selectedJournals.reduce((acc, jId) => {
      const journal = NPA_JOURNALS.find((j) => j.id === jId);
      if (!journal) return acc;
      if (term === '1yr') return acc + journal.price1YrUsd;
      if (term === '2yr') return acc + journal.price2YrUsd;
      return acc + journal.price3YrUsd;
    }, 0);
  };

  const handleGenerateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const quoteNum = `PI-NPA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const selectedList = NPA_JOURNALS.filter((j) => selectedJournals.includes(j.id)).map((j) => {
      const inrRate = term === '1yr' ? j.price1YrInr : term === '2yr' ? j.price2YrInr : j.price3YrInr;
      const usdRate = term === '1yr' ? j.price1YrUsd : term === '2yr' ? j.price2YrUsd : j.price3YrUsd;
      return {
        ...j,
        unitPriceInr: inrRate,
        unitPriceUsd: usdRate,
      };
    });

    setGeneratedInvoice({
      quoteNumber: quoteNum,
      date: dateStr,
      validUntil: '30 Days from issue',
      institutionName: institutionName || 'University / Institutional Library',
      department,
      contactPerson: contactPerson || 'The Librarian',
      email,
      phone,
      address: address || 'Campus Address',
      city: city || 'City',
      state: state || 'State',
      pincode: pincode || 'Pincode',
      gstin: gstin || 'Not Provided / Exempt',
      termLabel: term === '1yr' ? '1 Year (2 Issues)' : term === '2yr' ? '2 Years (4 Issues)' : '3 Years (6 Issues - Long Term)',
      termYears: term === '1yr' ? 1 : term === '2yr' ? 2 : 3,
      items: selectedList,
      totalInr: calculateInrTotal(),
      totalUsd: calculateUsdTotal(),
      currency,
    });

    // Scroll smoothly to quote preview
    setTimeout(() => {
      document.getElementById('quote-preview')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="space-y-12 pb-20 bg-[#fdfbf2] min-h-screen">
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-[#fefce8] via-[#fefbf0] to-[#fffdf5] text-stone-900 py-14 px-4 sm:px-6 lg:px-8 border-b border-amber-200/80">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-3xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-950 text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border border-amber-300">
              <Building2 className="w-4 h-4 text-amber-700" />
              <span>Institutional &amp; University Library Subscriptions Desk</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
              Institutional Subscriptions, Proforma Invoicing &amp; Library PO
            </h1>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl">
              Equip your university, college, or research institute with peer-reviewed research journals published by <strong>National Press Associates</strong>. Free Speed Post delivery across India, guaranteed replacement copies, and instant official Proforma Invoices for your acquisition committee.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-stone-600">
              <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-lg border border-amber-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>UGC-CARE &amp; API Score Compliant</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-lg border border-amber-200">
                <Truck className="w-4 h-4 text-amber-700" />
                <span>Free Doorstep India Post Speed Post</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-lg border border-amber-200">
                <FileText className="w-4 h-4 text-amber-800" />
                <span>GST Compliant Tax Invoice &amp; 30-Day Price Lock</span>
              </span>
            </div>
          </div>

          {/* Contact Card */}
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-amber-300 text-stone-900 max-w-sm w-full space-y-4 shadow-2xs">
            <h3 className="font-serif font-bold text-base text-amber-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Library Subscription Desk</span>
            </h3>
            <p className="text-xs text-stone-600">
              Have a custom acquisition requirement, multi-campus license, or need vendor registration forms?
            </p>
            <div className="space-y-2 pt-2 border-t border-amber-100 text-xs">
              <a
                href="mailto:contact@npajournals.org"
                className="flex items-center gap-2 text-stone-800 hover:text-amber-800 font-medium transition-colors"
              >
                <Mail className="w-4 h-4 text-amber-600" />
                <span>contact@npajournals.org</span>
              </a>
              <a
                href="tel:+919888934889"
                className="flex items-center gap-2 text-stone-800 hover:text-amber-800 font-medium transition-colors"
              >
                <Phone className="w-4 h-4 text-amber-600" />
                <span>+91-9888934889 / +91-7986925354</span>
              </a>
            </div>
            <a
              href="https://wa.me/919888934889?text=Hello%20NPA%20Institutional%20Desk,%20we%20want%20to%20subscribe%20to%20journals%20for%20our%20library"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-lg text-xs transition-colors"
            >
              <span>Chat with Circulation Officer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* SECTION 1: INTERACTIVE PROFORMA INVOICE GENERATOR */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded">
                Acquisition Tool
              </span>
              <h2 className="text-2xl font-serif font-bold text-navy-900 mt-1">
                Generate Institutional Proforma Invoice &amp; Quotation
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Select your required journals, choose a subscription duration, and enter your college details to download an immediate formal Proforma Invoice.
              </p>
            </div>

            <button
              type="button"
              onClick={selectAllJournals}
              className="text-xs font-bold text-primary-700 hover:text-primary-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-lg border border-slate-300 transition-colors self-start md:self-auto"
            >
              Select All 6 NPA Journals (Bundle)
            </button>
          </div>

          <form onSubmit={handleGenerateQuote} className="space-y-8">
            {/* Step A: Select Term */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Select Subscription Duration:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setTerm('1yr')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    term === '1yr'
                      ? 'border-primary-600 bg-primary-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="font-bold text-sm text-navy-900 block">1 Year Subscription</span>
                  <span className="text-xs text-slate-500">2 Bound Print Issues + Online Access</span>
                  <div className="mt-2 text-xs font-bold text-primary-800">Standard Annual Rate</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTerm('2yr')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    term === '2yr'
                      ? 'border-primary-600 bg-primary-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-navy-900">2 Years Subscription</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      Save ₹500
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">4 Bound Print Issues + Online Access</span>
                  <div className="mt-2 text-xs font-bold text-emerald-700">Multi-Year Institutional Discount</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTerm('3yr')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    term === '3yr'
                      ? 'border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-400/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-navy-900">3 Years (University Term)</span>
                    <span className="bg-amber-500 text-navy-950 text-[10px] font-extrabold px-2 py-0.5 rounded">
                      Save ₹1,300
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">6 Bound Print Issues + Full Archives</span>
                  <div className="mt-2 text-xs font-bold text-amber-800">Most Popular for University Budgets</div>
                </button>
              </div>
            </div>

            {/* Step B: Select Journals */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                2. Select Journal Titles ({selectedJournals.length} Selected):
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {NPA_JOURNALS.map((j) => {
                  const isChecked = selectedJournals.includes(j.id);
                  const inrRate = term === '1yr' ? j.price1YrInr : term === '2yr' ? j.price2YrInr : j.price3YrInr;
                  const usdRate = term === '1yr' ? j.price1YrUsd : term === '2yr' ? j.price2YrUsd : j.price3YrUsd;

                  return (
                    <div
                      key={j.id}
                      onClick={() => toggleJournal(j.id)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        isChecked
                          ? 'border-primary-600 bg-primary-50/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white opacity-70'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-1 w-4 h-4 text-primary-700 rounded border-slate-300"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                              ISSN: {j.issn}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">{j.frequency}</span>
                          </div>
                          <h4 className="font-serif font-bold text-navy-900 text-sm leading-snug">
                            {j.name}
                          </h4>
                          <p className="text-xs text-slate-500">{j.discipline}</p>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-extrabold text-navy-900">
                          {currency === 'USD' ? `$${usdRate} USD` : `₹${inrRate.toLocaleString('en-IN')}`}
                        </div>
                        <span className="text-[10px] text-slate-400">Total for term</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step C: Institution & Delivery Details */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                3. Institutional Billing &amp; Dispatch Details:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Institution / University / College Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Guru Nanak Dev University / DAV College"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Department / Library Section
                  </label>
                  <input
                    type="text"
                    placeholder="Central Library / Department of Economics"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Librarian / Procurement Officer Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Dr. / Prof. / Mr. Name"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Official Institutional Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="library@university.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Direct Contact Phone / Mobile *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91-9888934889"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Institutional GSTIN (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="03AAACN1234F1Z5"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Complete Postal Dispatch Address (for Speed Post Deliveries) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Campus Building, Road / Sector, Landmark"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ludhiana / Delhi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State &amp; Pincode *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="State (e.g. Punjab)"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Total Summary & Submit */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-5 rounded-xl">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Estimated Total for {selectedJournals.length} Journals ({term}):
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-navy-900">
                    {currency === 'USD' ? `$${calculateUsdTotal()} USD` : `₹${calculateInrTotal().toLocaleString('en-IN')} INR`}
                  </span>
                  <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                    Free Speed Post Included
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-700 to-navy-900 hover:from-primary-800 hover:to-navy-950 text-white font-bold text-sm py-3.5 px-6 rounded-xl shadow-md transition-all"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Generate Official Proforma Invoice</span>
              </button>
            </div>
          </form>
        </section>

        {/* SECTION 2: OFFICIAL PROFORMA INVOICE PREVIEW & PRINT READY */}
        {generatedInvoice && (
          <section id="quote-preview" className="space-y-4 animate-in fade-in-50 duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-serif font-bold text-navy-900 text-lg">
                  Official Proforma Invoice Generated ({generatedInvoice.quoteNumber})
                </h3>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 bg-primary-700 hover:bg-primary-800 text-white font-bold text-xs py-2 px-4 rounded-lg shadow-sm transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save as PDF</span>
              </button>
            </div>

            {/* Print-ready document box */}
            <div className="bg-white p-8 sm:p-12 rounded-2xl border-2 border-slate-300 shadow-lg text-slate-800 space-y-8 font-sans max-w-4xl mx-auto print:m-0 print:p-0 print:border-none print:shadow-none">
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-slate-800 pb-6">
                <div>
                  <h2 className="font-serif font-bold text-2xl text-navy-900 tracking-tight">
                    NATIONAL PRESS ASSOCIATES
                  </h2>
                  <p className="text-xs text-slate-600 font-medium uppercase tracking-wider mt-0.5">
                    Publishers of Peer-Reviewed Academic &amp; Research Journals
                  </p>
                  <p className="text-xs text-slate-500 mt-2 max-w-sm">
                    Head Office: #79, GAD Nagar, Flower Enclave, Dugri, Ludhiana, Punjab – 141013, India<br />
                    Phones: +91-9888934889, +91-7986925354 &bull; Email: info@npajournals.org<br />
                    Website: www.npajournals.org | ISSN Network Registered
                  </p>
                </div>

                <div className="text-left sm:text-right space-y-1">
                  <span className="inline-block bg-navy-950 text-white font-mono text-xs font-bold px-3 py-1 uppercase tracking-wider rounded">
                    PROFORMA INVOICE
                  </span>
                  <div className="font-mono text-xs font-bold text-slate-900 pt-1">
                    Invoice No: {generatedInvoice.quoteNumber}
                  </div>
                  <div className="text-xs text-slate-600">Date: {generatedInvoice.date}</div>
                  <div className="text-xs text-emerald-700 font-semibold">
                    Validity: {generatedInvoice.validUntil}
                  </div>
                </div>
              </div>

              {/* Bill To & Dispatch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block mb-1">
                    BILLED &amp; DISPATCHED TO:
                  </span>
                  <div className="font-bold text-navy-900 text-sm">{generatedInvoice.institutionName}</div>
                  <div className="text-slate-700 font-medium">{generatedInvoice.department}</div>
                  <div className="text-slate-600 mt-1">
                    Attn: <strong>{generatedInvoice.contactPerson}</strong> ({generatedInvoice.phone})
                  </div>
                  <div className="text-slate-600">
                    {generatedInvoice.address}, {generatedInvoice.city}, {generatedInvoice.state} – {generatedInvoice.pincode}
                  </div>
                </div>

                <div className="sm:text-right space-y-1">
                  <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block mb-1">
                    SUBSCRIPTION PARTICULARS:
                  </span>
                  <div className="text-slate-700">
                    Duration: <strong>{generatedInvoice.termLabel}</strong>
                  </div>
                  <div className="text-slate-700">
                    Mode of Dispatch: <strong>India Post Speed Post (Regd)</strong>
                  </div>
                  <div className="text-slate-700">
                    Access Rights: <strong>Print Periodical + Digital Repository</strong>
                  </div>
                  <div className="text-slate-500 text-[11px] pt-1 font-mono">
                    Institution GSTIN: {generatedInvoice.gstin}
                  </div>
                </div>
              </div>

              {/* Table of Journals */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-300 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-2.5 px-2">S.No</th>
                      <th className="py-2.5 px-2">Journal Title &amp; ISSN</th>
                      <th className="py-2.5 px-2">Discipline</th>
                      <th className="py-2.5 px-2 text-center">Frequency</th>
                      <th className="py-2.5 px-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {generatedInvoice.items.map((item: any, idx: number) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-2 font-mono font-bold text-slate-500">{idx + 1}</td>
                        <td className="py-3 px-2">
                          <div className="font-bold text-navy-900">{item.name}</div>
                          <span className="font-mono text-[11px] text-slate-500">ISSN: {item.issn}</span>
                        </td>
                        <td className="py-3 px-2 text-slate-600">{item.discipline}</td>
                        <td className="py-3 px-2 text-center text-slate-600">{item.frequency}</td>
                        <td className="py-3 px-2 text-right font-bold text-navy-900 font-mono">
                          {currency === 'USD' ? `$${item.unitPriceUsd} USD` : `₹${item.unitPriceInr.toLocaleString('en-IN')}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-300">
                      <td colSpan={4} className="py-2.5 px-2 text-right font-bold text-slate-600">
                        Subtotal ({generatedInvoice.items.length} Titles):
                      </td>
                      <td className="py-2.5 px-2 text-right font-bold text-navy-900 font-mono">
                        {currency === 'USD' ? `$${generatedInvoice.totalUsd} USD` : `₹${generatedInvoice.totalInr.toLocaleString('en-IN')}`}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="py-1 px-2 text-right text-slate-500">
                        Postal Delivery Charges (Speed Post Trackable):
                      </td>
                      <td className="py-1 px-2 text-right text-emerald-700 font-bold uppercase text-[10px]">
                        FREE / INCLUDED
                      </td>
                    </tr>
                    <tr className="border-t border-slate-300 text-sm">
                      <td colSpan={4} className="py-3 px-2 text-right font-extrabold text-navy-900">
                        Net Payable Total:
                      </td>
                      <td className="py-3 px-2 text-right font-extrabold text-primary-900 font-mono text-base">
                        {currency === 'USD' ? `$${generatedInvoice.totalUsd} USD` : `₹${generatedInvoice.totalInr.toLocaleString('en-IN')} INR`}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Bank Remittance Details */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block mb-1">
                    Bank NEFT / RTGS / Direct Remittance:
                  </span>
                  <div className="space-y-0.5 text-slate-700 font-mono">
                    <p>Beneficiary: <strong>NATIONAL PRESS ASSOCIATES</strong></p>
                    <p>Bank: <strong>HDFC Bank Ltd</strong></p>
                    <p>Account No: <strong>50200028491829</strong> (Current Account)</p>
                    <p>IFSC Code: <strong>HDFC0000249</strong></p>
                    <p>Branch: Model Town / Dugri, Ludhiana, Punjab</p>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block mb-1">
                    Cheque / DD &amp; UPI Instructions:
                  </span>
                  <p className="text-slate-600">
                    Cheques/Demand Drafts should be drawn in favor of <strong>&quot;National Press Associates&quot;</strong> payable at Ludhiana.
                  </p>
                  <p className="text-slate-600 mt-1">
                    UPI ID: <strong className="font-mono text-navy-900">editornrjbe@okhdfcbank</strong>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Please email transaction counterfoil / bank UTR to <em>info@npajournals.org</em> for immediate dispatch logging.
                  </p>
                </div>
              </div>

              {/* Authorization Seal & Terms */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs text-slate-500">
                <div className="space-y-1 max-w-md">
                  <p className="font-bold text-slate-700">Terms &amp; Conditions:</p>
                  <ol className="list-decimal pl-4 space-y-0.5 text-[11px]">
                    <li>Subscription copies are dispatched immediately upon volume release via India Post Speed Post.</li>
                    <li>Any damaged or missing issue must be claimed within 30 days of release for free replacement.</li>
                    <li>Prices are inclusive of packing, forwarding, and postal charges across India.</li>
                  </ol>
                </div>

                <div className="text-center sm:text-right flex flex-col items-center sm:items-end">
                  <div className="w-28 h-12 border-b border-dashed border-slate-400 mb-1 flex items-end justify-center">
                    <span className="text-[10px] font-serif text-slate-400 italic">Official Seal / Signature</span>
                  </div>
                  <span className="font-bold text-navy-900 text-xs">National Press Associates</span>
                  <span className="text-[10px] text-slate-500">Authorized Circulation Officer</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 3: INSTITUTIONAL FAQS & GUARANTEES */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Acquisition FAQ
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-navy-900 mt-2">
              Librarian &amp; Procurement Officer Guide
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Does the subscription include NAAC &amp; UGC documentation?</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Yes. Every institutional subscription package comes with an official Subscription Certificate detailing the ISSN, UGC-CARE compliant API criteria, and publication frequency required for NAAC Criterion 3 &amp; 4 accreditation audits.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>How are physical journal copies dispatched?</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                All physical copies are dispatched via <strong>India Post Speed Post</strong> or Registered Parcel in moisture-proof, heavy-duty padded mailers. Tracking numbers are transmitted to the librarian&apos;s registered email and WhatsApp.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Can we pay after receiving the physical issues?</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Government colleges, universities, and UGC-recognized institutions may provide an official Purchase Order (PO). We issue a 30-day credit term against confirmed institutional POs with advance dispatch.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>What happens if an issue is lost in postal transit?</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                We offer a 100% replacement guarantee. If any volume does not reach your library within 14 working days of dispatch notification, we ship a fresh copy immediately at zero extra cost.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
