'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React, { useState } from 'react';
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
  BookOpen,
} from 'lucide-react';

export default function SubmitPaperPage() {
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    authorPhone: '',
    affiliation: '',
    coAuthors: '',
    paperTitle: '',
    researchArea: 'Business Economics',
    abstract: '',
    keywords: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [agreeOriginal, setAgreeOriginal] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const researchAreas = [
    'Business Economics',
    'Financial Markets & Banking',
    'Sales & Marketing Management',
    'Human Resource Management',
    'Supply Chain & Operations',
    'Corporate Governance & Business Ethics',
    'Information Systems & Analytics',
    'Sustainable Business & ESG',
    'Other Allied Disciplines',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agreeOriginal || !agreeTerms) {
      setError('Please certify originality and accept the author guidelines.');
      return;
    }

    if (!file) {
      setError('Please attach your research manuscript file (.pdf, .doc, or .docx).');
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

      // 2. Submit paper data
      const subRes = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
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

  if (submittedId) {
    return (
      <div className="py-12 bg-slate-50 min-h-[70vh] flex items-center justify-center">
        <div className="max-w-xl mx-auto px-4 w-full">
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Manuscript Received
              </span>
              <h1 className="text-2xl font-serif font-bold text-navy-900 mt-2">
                Submission Successful!
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Your research manuscript has been queued for editorial screening and double-blind peer review.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left">
              <span className="text-xs text-slate-500 font-medium">Your Manuscript Tracking ID:</span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-mono font-bold text-xl text-primary-800 tracking-wide">
                  {submittedId}
                </span>
                <span className="text-xs bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded">
                  Save this ID
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                A confirmation has been recorded. You can track your peer review status, reviewer remarks, and acceptance letters using this tracking code.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href={`/track-status?id=${submittedId}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                <span>Track Manuscript Status &rarr;</span>
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto text-xs text-slate-600 hover:text-slate-900 font-medium px-4 py-2"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 bg-slate-50 min-h-[70vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded w-fit border border-primary-200 mb-2">
            <FileUp className="w-3.5 h-3.5" />
            <span>Online Submission Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900">
            Submit Paper Online
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            Submit your research paper for publication in the National Research Journal of Business Economics. Manuscripts are reviewed under our double-blind peer review process with fast-track processing.
          </p>

          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Plagiarism: &le; 25% Allowed</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>AI Content: &le; 10% Allowed</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Fast Track: 7-14 Days Review</span>
            </div>
          </div>
        </div>

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Author Details */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-primary-700" />
              <span>1. Corresponding Author Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name (with title, e.g. Dr. / Prof. / Mr.) *
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
                  Official / Primary Email Address *
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
                  Mobile / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 9888934889"
                  value={formData.authorPhone}
                  onChange={(e) => setFormData({ ...formData, authorPhone: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department &amp; University / Affiliation *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Department of Economics, Panjab University"
                  value={formData.affiliation}
                  onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Co-Author(s) (if any, separated by commas)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Navneet Seth, Rameshwar Mandavi"
                  value={formData.coAuthors}
                  onChange={(e) => setFormData({ ...formData, coAuthors: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Manuscript Metadata */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary-700" />
              <span>2. Manuscript Information</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Manuscript Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter full title of the research paper"
                  value={formData.paperTitle}
                  onChange={(e) => setFormData({ ...formData, paperTitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Research Domain / Discipline *
                </label>
                <select
                  value={formData.researchArea}
                  onChange={(e) => setFormData({ ...formData, researchArea: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white"
                >
                  {researchAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Structured Abstract (150–250 words) *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Provide background, objectives, methodology, key findings, and conclusions..."
                  value={formData.abstract}
                  onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Keywords (4 to 8 keywords, separated by semicolons) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Health insurance; financial protection; public health; Punjab; empirical study"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: File Upload */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
              <Upload className="w-4 h-4 text-primary-700" />
              <span>3. Upload Manuscript Document</span>
            </h2>

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-primary-500 transition-colors bg-slate-50">
              <input
                type="file"
                id="manuscript-file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <label htmlFor="manuscript-file" className="cursor-pointer flex flex-col items-center">
                <FileText className="w-10 h-10 text-primary-600 mb-2" />
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  {file ? file.name : 'Click to Browse Manuscript (.PDF, .DOC, .DOCX)'}
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB selected` : 'Maximum file size: 25 MB'}
                </span>
              </label>
            </div>
          </div>

          {/* Section 4: Declaration & Terms */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeOriginal}
                onChange={(e) => setAgreeOriginal(e.target.checked)}
                className="mt-0.5 rounded text-primary-600 focus:ring-primary-500"
              />
              <span className="text-slate-700">
                I certify that this paper is original, free from plagiarism (&le; 25% similarity) and unauthorized AI generation (&le; 10%), and has not been published or submitted elsewhere.
              </span>
            </label>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded text-primary-600 focus:ring-primary-500"
              />
              <span className="text-slate-700">
                I agree to the <Link href="/page/editorial-policy" className="text-primary-700 underline" target="_blank">Editorial Policy</Link>, <Link href="/page/peer-review-process" className="text-primary-700 underline" target="_blank">Peer Review Process</Link>, and <Link href="/page/open-access-licensing" className="text-primary-700 underline" target="_blank">Open Access CC-BY-NC Terms</Link> of the journal.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-700 to-navy-900 hover:from-primary-800 hover:to-navy-950 text-white font-bold text-sm py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FileUp className="w-4 h-4 text-amber-400" />
              <span>{loading ? 'Submitting Manuscript & Uploading Document...' : 'Submit Manuscript for Review'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
