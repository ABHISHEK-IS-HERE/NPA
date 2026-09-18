'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  Award,
  ShieldCheck,
  Truck,
  Phone,
  Mail,
  FileUp,
  Sparkles,
  ExternalLink,
  Printer,
  Building,
  ArrowRight,
  Send,
  BookMarked,
  GraduationCap,
} from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';

export default function PublishBooksPage() {
  const { formatPrice } = useCurrency();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    authorName: '',
    designation: '',
    institution: '',
    email: '',
    phone: '',
    bookTitle: '',
    discipline: 'Commerce & Management',
    bookType: 'Edited Volume with ISBN',
    manuscriptStatus: 'Complete Manuscript Ready',
    estimatedPages: '150 - 200',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="space-y-12 pb-20 bg-[#fdfbf2] min-h-screen">
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-[#fefce8] via-[#fefbf0] to-[#fffdf5] text-stone-900 py-14 px-4 sm:px-6 lg:px-8 border-b border-amber-200/80">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-3xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-950 text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border border-amber-300">
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>National Press Associates &bull; Book Publishing Wing</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
              Publish Your Academic Book with National &amp; International ISBN
            </h1>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl">
              Enhance your academic portfolio, secure crucial <strong>UGC / API promotion score points</strong>, and establish your scholarly legacy. We publish authored textbooks, edited volumes with peer-reviewed chapters, Ph.D. theses monographs, and conference proceedings.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-stone-600">
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Govt. Registered ISBN (Ministry of Education)</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Max UGC API Score for CAS Promotion</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <Truck className="w-4 h-4 text-blue-400" />
                <span>Doorstep Author Copies Dispatched</span>
              </span>
            </div>
          </div>

          {/* Quick Contact Card */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 text-white max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="font-serif font-bold text-base text-amber-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Book Editorial Desk</span>
            </h3>
            <p className="text-xs text-slate-200">
              Speak directly with our Chief Editor regarding manuscript preparation, chapter invitations, or conference volume publication.
            </p>
            <div className="space-y-2 text-xs border-t border-white/10 pt-3">
              <a
                href="tel:+919888934889"
                className="flex items-center gap-2 hover:text-amber-300 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>+91-9888934889, 7986925354</span>
              </a>
              <a
                href="mailto:info@npajournals.org"
                className="flex items-center gap-2 hover:text-amber-300 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>info@npajournals.org / editornrjbe@gmail.com</span>
              </a>
            </div>
            <a
              href="https://wa.me/919888934889?text=Hello%20NPA%20Book%20Publishing%20Desk,%20I%20want%20to%20publish%20an%20academic%20book%20with%20ISBN"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-lg text-xs transition-colors"
            >
              <span>WhatsApp Chief Book Editor</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* SECTION 1: PUBLISHING FORMATS & PACKAGES */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
              Publishing Formats
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-2">
              Select Your Academic Publication Category
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              All books are published under National Press Associates with official 13-digit ISBN and barcode.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Format 1 */}
            <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Edited Volumes with ISBN
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Serve as Chief Editor and invite research chapters from scholars. Each chapter receives individual page numbers and certificates.
                </p>
                <ul className="space-y-1.5 text-[11px] text-stone-600 pt-2 border-t border-amber-100">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>UGC API Points: 10 per chapter</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Editorial Board Certificates</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hardcopy author copies delivered</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 mt-4 border-t border-amber-100">
                <a
                  href="#inquiry-form"
                  className="block text-center w-full py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-lg transition-colors shadow-2xs"
                >
                  Submit Proposal
                </a>
              </div>
            </div>

            {/* Format 2 */}
            <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Authored Textbooks &amp; Reference
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Single or co-authored academic textbooks for undergraduate and postgraduate university curricula.
                </p>
                <ul className="space-y-1.5 text-[11px] text-stone-600 pt-2 border-t border-amber-100">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>National or International ISBN</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Max CAS Promotion API Score</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Author royalties on sales</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 mt-4 border-t border-amber-100">
                <a
                  href="#inquiry-form"
                  className="block text-center w-full py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-lg transition-colors shadow-2xs"
                >
                  Submit Proposal
                </a>
              </div>
            </div>

            {/* Format 3 */}
            <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <BookMarked className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Ph.D. Thesis Monograph
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Transform your awarded doctoral dissertation into a recognized reference book with official ISBN and library indexing.
                </p>
                <ul className="space-y-1.5 text-[11px] text-stone-600 pt-2 border-t border-amber-100">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Official ISBN Registration</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>University Library Distribution</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Global DOI Assignment</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 mt-4 border-t border-amber-100">
                <a
                  href="#inquiry-form"
                  className="block text-center w-full py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-lg transition-colors shadow-2xs"
                >
                  Submit Proposal
                </a>
              </div>
            </div>

            {/* Format 4 */}
            <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Conference Proceedings
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Publish proceedings for national and international seminars, symposiums, and university conferences with ISBN and DOI.
                </p>
                <ul className="space-y-1.5 text-[11px] text-stone-600 pt-2 border-t border-amber-100">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Fast Turnaround for Conferences</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Printed Copies for Delegates</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>E-Proceedings &amp; Certificates</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 mt-4 border-t border-amber-100">
                <a
                  href="#inquiry-form"
                  className="block text-center w-full py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-lg transition-colors shadow-2xs"
                >
                  Submit Proposal
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: BOOK PUBLISHING INQUIRY FORM */}
        <section id="inquiry-form" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10 max-w-3xl mx-auto space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded">
              Online Proposal
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-navy-900 mt-1">
              Submit Book Publishing Proposal
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Our book editorial coordinator will review your proposal and respond with publishing guidelines, ISBN details, and estimated turnaround within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-lg font-bold text-emerald-900">Proposal Submitted Successfully!</h4>
              <p className="text-xs text-emerald-700 max-w-md mx-auto">
                Thank you, <strong>{formData.authorName}</strong>. Your book publishing inquiry for <em>&quot;{formData.bookTitle}&quot;</em> has been forwarded to Chief Book Editor, National Press Associates.
              </p>
              <div className="pt-3">
                <a
                  href={`https://wa.me/919888934889?text=${encodeURIComponent(
                    `Hello Chief Editor NPA Books, I have submitted a proposal for my book: "${formData.bookTitle}" (${formData.bookType}). My phone is ${formData.phone}. Please review.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-lg shadow-sm transition-colors"
                >
                  <span>Connect via WhatsApp Fast Desk</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Full Name of Author / Chief Editor *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Gurpreet Kaur"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Designation &amp; Department
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Associate Professor, Commerce"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    University / College / Institute *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Panjab University, Chandigarh"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="official@institution.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91-9888934889"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Subject / Discipline *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Commerce / Economics / Computer Science"
                    value={formData.discipline}
                    onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tentative Book Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Contemporary Issues in Indian Banking and Financial Inclusion"
                    value={formData.bookTitle}
                    onChange={(e) => setFormData({ ...formData, bookTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Publication Category *
                  </label>
                  <select
                    value={formData.bookType}
                    onChange={(e) => setFormData({ ...formData, bookType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Edited Volume with ISBN">Edited Volume with ISBN</option>
                    <option value="Authored Textbook with ISBN">Authored Textbook with ISBN</option>
                    <option value="Ph.D. Thesis / Monograph">Ph.D. Thesis / Monograph</option>
                    <option value="Conference Proceedings with ISBN">Conference Proceedings with ISBN</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Manuscript Status
                  </label>
                  <select
                    value={formData.manuscriptStatus}
                    onChange={(e) => setFormData({ ...formData, manuscriptStatus: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Complete Manuscript Ready">Complete Manuscript Ready</option>
                    <option value="Partial Draft Ready (50%+)">{`Partial Draft Ready (50%+)`}</option>
                    <option value="Concept / Table of Contents Only">Concept / Table of Contents Only</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Brief Book Synopsis / Additional Requirements
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of book scope, target audience, expected number of chapters, or conference dates..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-sm py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting Proposal...' : 'Submit Book Publishing Proposal'}</span>
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
