'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  FileUp,
  CheckCircle2,
  AlertCircle,
  Upload,
  FileText,
  ShieldCheck,
  User,
  Mail,
  Phone,
  Building,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Plus,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  HelpCircle,
  Sparkles,
  Award,
  Globe,
  Loader2,
} from 'lucide-react';

interface CoAuthor {
  id: string;
  name: string;
  email: string;
  affiliation: string;
}

const NPA_JOURNALS = [
  {
    id: 'nrjbe',
    name: 'National Research Journal of Business Economics',
    short: 'NRJBE',
    issn: '2349-2015',
    impact: '6.74',
    badge: 'Flagship Journal',
  },
  {
    id: 'nrjbfm',
    name: 'National Research Journal of Banking & Finance Management',
    short: 'NRJBFM',
    issn: '2349-6762',
    impact: '6.52',
    badge: 'Sister Journal',
  },
  {
    id: 'nrjhrm',
    name: 'National Research Journal of Human Resource Management',
    short: 'NRJHRM',
    issn: '2349-7432',
    impact: '6.31',
    badge: 'Sister Journal',
  },
  {
    id: 'nrjit',
    name: 'National Research Journal of Information Technology',
    short: 'NRJIT',
    issn: '2349-8129',
    impact: '6.85',
    badge: 'Sister Journal',
  },
  {
    id: 'nrjbt',
    name: 'National Research Journal of Biotechnology & Biosciences',
    short: 'NRJBT',
    issn: '2349-9041',
    impact: '6.40',
    badge: 'Sister Journal',
  },
  {
    id: 'nrjer',
    name: 'National Research Journal of Educational Research',
    short: 'NRJER',
    issn: '2349-5510',
    impact: '6.15',
    badge: 'Sister Journal',
  },
];

const RESEARCH_AREAS = [
  'Business Economics & Macroeconomics',
  'Banking, Financial Markets & FinTech',
  'Marketing Strategy & Consumer Behaviour',
  'Human Resource Management & Organizational Studies',
  'Supply Chain, Logistics & Operations',
  'Corporate Governance & Business Ethics',
  'Information Systems, AI & Data Analytics',
  'Sustainable Business, ESG & Green Economy',
  'Public Policy, Trade & Developmental Economics',
  'Other Interdisciplinary Business Disciplines',
];

export default function SubmitPaperPage() {
  const [currentStep, setCurrentStep] = useState(1);

  // Form Fields
  const [selectedJournal, setSelectedJournal] = useState('nrjbe');
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    authorPhone: '',
    affiliation: '',
    country: 'India',
    paperTitle: '',
    researchArea: 'Business Economics & Macroeconomics',
    abstract: '',
    keywords: '',
  });

  // Dynamic Co-Authors
  const [coAuthors, setCoAuthors] = useState<CoAuthor[]>([]);
  const [newCoAuthor, setNewCoAuthor] = useState({ name: '', email: '', affiliation: '' });
  const [showCoAuthorForm, setShowCoAuthorForm] = useState(false);

  // File Upload State
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Checklists & Agreements
  const [checklists, setChecklists] = useState({
    plagiarismUnder25: false,
    aiUnder10: false,
    apaReferences: false,
    allAuthorsAgreed: false,
  });

  const [agreeOriginal, setAgreeOriginal] = useState(false);
  const [agreeApc, setAgreeApc] = useState(false);

  // Submission Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Word count helper for abstract
  const abstractWordCount = formData.abstract.trim()
    ? formData.abstract.trim().split(/\s+/).length
    : 0;

  // Co-author handlers
  const handleAddCoAuthor = () => {
    if (!newCoAuthor.name.trim()) return;
    setCoAuthors([
      ...coAuthors,
      {
        id: Math.random().toString(36).substring(7),
        name: newCoAuthor.name.trim(),
        email: newCoAuthor.email.trim(),
        affiliation: newCoAuthor.affiliation.trim(),
      },
    ]);
    setNewCoAuthor({ name: '', email: '', affiliation: '' });
    setShowCoAuthorForm(false);
  };

  const handleRemoveCoAuthor = (id: string) => {
    setCoAuthors(coAuthors.filter((a) => a.id !== id));
  };

  // Drag & drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (f: File) => {
    setError('');
    const validExtensions = ['.pdf', '.doc', '.docx'];
    const ext = f.name.substring(f.name.lastIndexOf('.')).toLowerCase();
    if (!validExtensions.includes(ext)) {
      setError('Invalid file format. Please attach a Word document (.doc, .docx) or PDF (.pdf).');
      return;
    }
    if (f.size > 25 * 1024 * 1024) {
      setError('File size exceeds 25 MB limit. Please compress images or tables.');
      return;
    }
    setFile(f);
  };

  // Step Validation
  const canProceedStep1 = () => {
    return (
      formData.authorName.trim() !== '' &&
      formData.authorEmail.trim() !== '' &&
      formData.authorPhone.trim() !== '' &&
      formData.affiliation.trim() !== ''
    );
  };

  const canProceedStep2 = () => {
    return (
      formData.paperTitle.trim() !== '' &&
      formData.abstract.trim().length >= 50 &&
      formData.keywords.trim() !== ''
    );
  };

  const canProceedStep3 = () => {
    return (
      file !== null &&
      checklists.plagiarismUnder25 &&
      checklists.aiUnder10 &&
      checklists.apaReferences
    );
  };

  const canSubmit = () => {
    return agreeOriginal && agreeApc;
  };

  // Submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!canSubmit()) {
      setError('Please certify originality and accept the publication policies.');
      return;
    }

    if (!file) {
      setError('Please attach your research manuscript file.');
      return;
    }

    setLoading(true);

    try {
      // 1. Upload manuscript file
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('type', 'manuscripts');

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadData.error || 'Failed to upload manuscript file');
      }

      // Format co-authors string
      const coAuthorsString = coAuthors
        .map((a) => `${a.name}${a.affiliation ? ` (${a.affiliation})` : ''}`)
        .join('; ');

      // 2. Submit paper data
      const subRes = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          coAuthors: coAuthorsString,
          manuscriptFileUrl: uploadData.url,
        }),
      });

      const subData = await subRes.json();
      if (!subRes.ok) {
        throw new Error(subData.error || 'Failed to submit manuscript');
      }

      setSubmittedId(subData.trackingId);
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your paper.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTrackingId = () => {
    if (submittedId) {
      navigator.clipboard.writeText(submittedId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Success Screen
  if (submittedId) {
    const journalObj = NPA_JOURNALS.find((j) => j.id === selectedJournal) || NPA_JOURNALS[0];
    const waText = encodeURIComponent(
      `Hello Editor-in-Chief, I have submitted my manuscript "${formData.paperTitle}" for ${journalObj.short}. My Tracking ID is: ${submittedId}. Author: ${formData.authorName}. Please confirm receipt.`
    );

    return (
      <div className="py-14 bg-slate-50 min-h-[75vh] flex items-center justify-center">
        <div className="max-w-xl mx-auto px-4 w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Manuscript Officially Logged</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900 mt-3">
                Submission Successful!
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Your paper has been assigned a unique Tracking ID and queued for editorial screening and double-blind peer review.
              </p>
            </div>

            {/* Tracking ID Card */}
            <div className="bg-gradient-to-br from-slate-50 to-primary-50/40 p-5 rounded-xl border border-primary-100 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Manuscript Tracking ID:
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                  Save for Tracking
                </span>
              </div>

              <div className="flex items-center justify-between mt-2 bg-white p-3 rounded-lg border border-slate-200">
                <span className="font-mono font-bold text-lg sm:text-xl text-primary-800 tracking-wide select-all">
                  {submittedId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyTrackingId}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-3 text-xs text-slate-600 space-y-1">
                <p>
                  <strong>Target Journal:</strong> {journalObj.name} ({journalObj.short})
                </p>
                <p>
                  <strong>Lead Author:</strong> {formData.authorName} ({formData.affiliation})
                </p>
              </div>
            </div>

            {/* Next Steps Info */}
            <div className="text-left bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
              <h4 className="font-bold text-navy-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-primary-700" />
                <span>What Happens Next?</span>
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-600">
                <li>Initial Editorial Screening &amp; Turnitin Similarity Check within 24–48 hours.</li>
                <li>Double-blind peer review report dispatched within 7–14 days.</li>
                <li>Track your review status, reviewer remarks, and official Acceptance Letter online anytime.</li>
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href={`/track-status?id=${submittedId}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
              >
                <span>Track Manuscript Status &rarr;</span>
              </Link>

              <a
                href={`https://wa.me/919888934889?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
              >
                <span>Notify Editorial Desk (WhatsApp)</span>
              </a>
            </div>

            <div>
              <Link
                href="/"
                className="text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
              >
                &larr; Return to Journal Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 bg-slate-50 min-h-[75vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Page Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
              <FileUp className="w-3.5 h-3.5" />
              <span>Online Submission Desk</span>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Double-Blind Peer Review &bull; Turnitin &le; 25% &bull; Fast Track (7-14 Days)
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900">
            Submit Your Research Manuscript
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed max-w-3xl">
            Complete the 4-step guided submission below. Your paper will be assigned a permanent Tracking ID for real-time tracking, reviewer evaluation, and automated certificate issuance.
          </p>

          {/* Stepper Progress Bar */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { step: 1, title: 'Author Profile' },
                { step: 2, title: 'Manuscript Details' },
                { step: 3, title: 'File Upload' },
                { step: 4, title: 'Review & Submit' },
              ].map((s) => (
                <div key={s.step} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                      currentStep === s.step
                        ? 'bg-primary-700 text-white ring-4 ring-primary-100'
                        : currentStep > s.step
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-400 border border-slate-300'
                    }`}
                  >
                    {currentStep > s.step ? <Check className="w-4 h-4" /> : s.step}
                  </div>
                  <span
                    className={`text-[11px] sm:text-xs font-semibold mt-1.5 hidden sm:block ${
                      currentStep === s.step
                        ? 'text-primary-800'
                        : currentStep > s.step
                        ? 'text-emerald-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Visual Progress Bar Track */}
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-primary-700 h-full transition-all duration-300 ease-out"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Global Error Notice */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Multi-Step Wizard Form Container */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
          {/* STEP 1: JOURNAL & AUTHOR PROFILE */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h2 className="text-base font-bold text-navy-900 flex items-center gap-2 pb-2 border-b border-slate-200">
                  <BookOpen className="w-5 h-5 text-primary-700" />
                  <span>Select Target Journal &amp; Corresponding Author</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Choose the NPA periodical that matches your paper's discipline and enter lead author details.
                </p>
              </div>

              {/* Journal Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Select Publishing Journal *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {NPA_JOURNALS.map((j) => (
                    <div
                      key={j.id}
                      onClick={() => setSelectedJournal(j.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedJournal === j.id
                          ? 'bg-primary-50/70 border-primary-600 ring-1 ring-primary-600'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-navy-950">{j.short}</span>
                        <span className="text-[10px] font-semibold text-primary-700 bg-white px-2 py-0.5 rounded border border-primary-200">
                          IF: {j.impact}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-700 mt-1 line-clamp-1">{j.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-mono">ISSN: {j.issn}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Corresponding Author Information */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-primary-700" />
                  <span>Corresponding Author Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name (with honorific, e.g. Dr. / Prof. / Mr.) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Amanpreet Singh"
                      value={formData.authorName}
                      onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. author@university.edu"
                      value={formData.authorEmail}
                      onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      WhatsApp / Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98889 34889"
                      value={formData.authorPhone}
                      onChange={(e) => setFormData({ ...formData, authorPhone: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Country of Residence *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. India / United Kingdom"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      University, College or Research Institute Affiliation *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Department of Economics, Punjab University, Chandigarh"
                      value={formData.affiliation}
                      onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Co-Authors Section */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Co-Authors (Optional)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Add any co-authors who contributed to this research work.
                    </p>
                  </div>
                  {!showCoAuthorForm && (
                    <button
                      type="button"
                      onClick={() => setShowCoAuthorForm(true)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 hover:text-primary-800 bg-primary-50 px-2.5 py-1.5 rounded border border-primary-200 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Co-Author</span>
                    </button>
                  )}
                </div>

                {/* List of Added Co-Authors */}
                {coAuthors.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {coAuthors.map((ca, idx) => (
                      <div
                        key={ca.id}
                        className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-800">
                            {idx + 1}. {ca.name}
                          </span>
                          {ca.affiliation && (
                            <span className="text-slate-500 text-[11px] ml-2">
                              &bull; {ca.affiliation}
                            </span>
                          )}
                          {ca.email && (
                            <span className="text-slate-400 text-[11px] ml-2">
                              &lt;{ca.email}&gt;
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCoAuthor(ca.id)}
                          className="text-rose-600 hover:text-rose-800 p-1"
                          title="Remove co-author"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Co-Author Inline Modal/Form */}
                {showCoAuthorForm && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <span className="text-xs font-bold text-slate-700 block">
                      New Co-Author Details:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Co-Author Name"
                        value={newCoAuthor.name}
                        onChange={(e) => setNewCoAuthor({ ...newCoAuthor, name: e.target.value })}
                        className="px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white"
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={newCoAuthor.email}
                        onChange={(e) => setNewCoAuthor({ ...newCoAuthor, email: e.target.value })}
                        className="px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Affiliation / University"
                        value={newCoAuthor.affiliation}
                        onChange={(e) =>
                          setNewCoAuthor({ ...newCoAuthor, affiliation: e.target.value })
                        }
                        className="px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowCoAuthorForm(false)}
                        className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddCoAuthor}
                        className="px-3 py-1 text-xs bg-primary-700 hover:bg-primary-800 text-white font-semibold rounded"
                      >
                        Add to Paper
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation button */}
              <div className="flex justify-end pt-4 border-t border-slate-200">
                <button
                  type="button"
                  disabled={!canProceedStep1()}
                  onClick={() => {
                    setError('');
                    setCurrentStep(2);
                  }}
                  className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-800 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
                >
                  <span>Continue to Manuscript Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: MANUSCRIPT DETAILS */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h2 className="text-base font-bold text-navy-900 flex items-center gap-2 pb-2 border-b border-slate-200">
                  <FileText className="w-5 h-5 text-primary-700" />
                  <span>Manuscript Metadata &amp; Research Scope</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Provide your paper's title, structured abstract, and classification keywords.
                </p>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Research Paper Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monetary Policy Transmission and Financial Stability: An Empirical Analysis of Emerging Markets"
                  value={formData.paperTitle}
                  onChange={(e) => setFormData({ ...formData, paperTitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none font-medium"
                />
              </div>

              {/* Research Area Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Research Discipline *
                </label>
                <select
                  value={formData.researchArea}
                  onChange={(e) => setFormData({ ...formData, researchArea: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white"
                >
                  {RESEARCH_AREAS.map((ra) => (
                    <option key={ra} value={ra}>
                      {ra}
                    </option>
                  ))}
                </select>
              </div>

              {/* Structured Abstract */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Structured Abstract (150–300 words recommended) *
                  </label>
                  <span
                    className={`text-[11px] font-mono ${
                      abstractWordCount < 50
                        ? 'text-amber-600'
                        : abstractWordCount > 350
                        ? 'text-rose-600'
                        : 'text-emerald-600 font-semibold'
                    }`}
                  >
                    {abstractWordCount} words
                  </span>
                </div>
                <textarea
                  rows={6}
                  required
                  placeholder="Enter the structured abstract outlining: Background/Objectives, Methodology, Key Empirical Findings, and Practical/Theoretical Implications..."
                  value={formData.abstract}
                  onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Author Keywords (comma separated, minimum 3–5 keywords) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monetary Policy, Emerging Markets, Bank Capitalization, Econometric Modeling"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 hover:text-slate-900 font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Author Details</span>
                </button>

                <button
                  type="button"
                  disabled={!canProceedStep2()}
                  onClick={() => {
                    setError('');
                    setCurrentStep(3);
                  }}
                  className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-800 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
                >
                  <span>Continue to File Upload</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: FILE UPLOAD & TECHNICAL CHECKLIST */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h2 className="text-base font-bold text-navy-900 flex items-center gap-2 pb-2 border-b border-slate-200">
                  <Upload className="w-5 h-5 text-primary-700" />
                  <span>Manuscript Document &amp; Editorial Checklist</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Upload your research file (.pdf, .doc, or .docx) and verify editorial compliance standards.
                </p>
              </div>

              {/* Drag and drop upload zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-primary-600 bg-primary-50/50 scale-[1.01]'
                    : file
                    ? 'border-emerald-500 bg-emerald-50/20'
                    : 'border-slate-300 hover:border-primary-400 bg-slate-50/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".doc,.docx,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800">{file.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB &bull; Ready for upload
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold mt-1"
                    >
                      Change or Remove File
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-600">
                    <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mb-1">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      Drag &amp; Drop your manuscript here, or{' '}
                      <span className="text-primary-700 underline">browse your files</span>
                    </p>
                    <p className="text-xs text-slate-400">
                      Supported formats: Microsoft Word (.docx, .doc) or PDF (.pdf) &bull; Maximum size: 25 MB
                    </p>
                  </div>
                )}
              </div>

              {/* Technical Author Compliance Checklist */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Technical Quality &amp; Ethics Checklist *</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Please verify compliance with NRJBE double-blind peer-review guidelines before proceeding:
                </p>

                <div className="space-y-2.5 pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={checklists.plagiarismUnder25}
                      onChange={(e) =>
                        setChecklists({ ...checklists, plagiarismUnder25: e.target.checked })
                      }
                      className="w-4 h-4 mt-0.5 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
                    />
                    <span>
                      <strong>Plagiarism Verification:</strong> The manuscript similarity index is
                      under <strong>25%</strong> as checked via Turnitin or Urkund.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={checklists.aiUnder10}
                      onChange={(e) =>
                        setChecklists({ ...checklists, aiUnder10: e.target.checked })
                      }
                      className="w-4 h-4 mt-0.5 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
                    />
                    <span>
                      <strong>AI Content Limit:</strong> Generative AI text accounts for less than{' '}
                      <strong>10%</strong> of the manuscript, per publisher editorial policy.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={checklists.apaReferences}
                      onChange={(e) =>
                        setChecklists({ ...checklists, apaReferences: e.target.checked })
                      }
                      className="w-4 h-4 mt-0.5 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
                    />
                    <span>
                      <strong>Citations &amp; Bibliography:</strong> All in-text citations and
                      references are formatted consistently (APA 7th, Harvard, or IEEE).
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={checklists.allAuthorsAgreed}
                      onChange={(e) =>
                        setChecklists({ ...checklists, allAuthorsAgreed: e.target.checked })
                      }
                      className="w-4 h-4 mt-0.5 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
                    />
                    <span>
                      <strong>Authorial Consent:</strong> All listed co-authors have read, approved,
                      and consented to the submission of this manuscript.
                    </span>
                  </label>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 hover:text-slate-900 font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Metadata</span>
                </button>

                <button
                  type="button"
                  disabled={!canProceedStep3()}
                  onClick={() => {
                    setError('');
                    setCurrentStep(4);
                  }}
                  className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-800 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
                >
                  <span>Continue to Final Review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUMMARY REVIEW & CERTIFICATIONS */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h2 className="text-base font-bold text-navy-900 flex items-center gap-2 pb-2 border-b border-slate-200">
                  <ShieldCheck className="w-5 h-5 text-primary-700" />
                  <span>Review Submission &amp; Author Declarations</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Carefully review your submission summary and sign the required legal certifications.
                </p>
              </div>

              {/* Review Summary Card */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 text-xs space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-bold block">
                      Target Journal
                    </span>
                    <span className="font-bold text-slate-800 text-sm">
                      {NPA_JOURNALS.find((j) => j.id === selectedJournal)?.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-bold block">
                      Research Discipline
                    </span>
                    <span className="font-bold text-slate-800 text-sm">
                      {formData.researchArea}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 uppercase text-[10px] font-bold block">
                    Paper Title
                  </span>
                  <span className="font-serif font-bold text-navy-950 text-sm leading-snug block mt-0.5">
                    {formData.paperTitle}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-bold block">
                      Corresponding Author
                    </span>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {formData.authorName} ({formData.affiliation})
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      {formData.authorEmail} &bull; {formData.authorPhone}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-bold block">
                      Co-Authors
                    </span>
                    <p className="text-slate-700 mt-0.5">
                      {coAuthors.length > 0
                        ? coAuthors.map((c) => c.name).join(', ')
                        : 'Single Author Submission'}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                  <span>
                    Attached File: <strong>{file?.name}</strong> (
                    {file ? (file.size / (1024 * 1024)).toFixed(2) : 0} MB)
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="text-primary-700 hover:underline font-semibold"
                  >
                    Edit File
                  </button>
                </div>
              </div>

              {/* Declarations */}
              <div className="bg-amber-50/60 p-5 rounded-xl border border-amber-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-700" />
                  <span>Author Certifications &amp; Ethics Agreement</span>
                </h3>

                <div className="space-y-3 pt-1 text-xs text-slate-800">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={agreeOriginal}
                      onChange={(e) => setAgreeOriginal(e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
                    />
                    <span>
                      <strong>Originality &amp; Exclusivity Certification:</strong> I hereby certify
                      that this manuscript is an original work, has not been published previously, and
                      is not currently under review with any other journal or conference proceedings.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={agreeApc}
                      onChange={(e) => setAgreeApc(e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
                    />
                    <span>
                      <strong>Article Processing Charges (APC) Agreement:</strong> I acknowledge that
                      if this paper is accepted after double-blind peer review, standard open-access
                      processing charges (₹1,800 INR for Indian authors / $45 USD for International)
                      apply to cover peer-review operations, DOI assignment, and digital archiving.
                    </span>
                  </label>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 hover:text-slate-900 font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Checklist</span>
                </button>

                <button
                  type="submit"
                  disabled={loading || !canSubmit()}
                  className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold px-8 py-3 rounded-lg shadow-md transition-all hover:scale-[1.01]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading &amp; Logging Manuscript...</span>
                    </>
                  ) : (
                    <>
                      <FileUp className="w-4 h-4" />
                      <span>Confirm &amp; Submit Manuscript</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Assistance / Helpline Note */}
        <div className="bg-slate-100 p-4 rounded-xl text-center text-xs text-slate-600">
          <span>Need assistance submitting your manuscript? Contact our Editorial Helpline: </span>
          <a
            href="tel:+919888934889"
            className="font-bold text-slate-800 hover:text-primary-700 underline mx-1"
          >
            +91-9888934889
          </a>
          <span> or email </span>
          <a
            href="mailto:editornrjbe@gmail.com"
            className="font-bold text-primary-700 hover:underline mx-1"
          >
            editornrjbe@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
