'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Award,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export default function TrackStatusPage() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [trackingId, setTrackingId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const fetchStatus = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/submissions/track?id=${encodeURIComponent(id.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Manuscript not found. Please verify your tracking ID.');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchStatus(initialId);
    }
  }, [initialId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStatus(trackingId);
  };

  // Status step progression helper
  const getStepStatus = (stepName: string, currentStatus: string) => {
    const order = ['Submitted', 'Under Review', 'Accepted', 'Published'];
    const currentIdx = order.indexOf(currentStatus);
    const stepIdx = order.indexOf(stepName);

    if (currentStatus === 'Rejected') {
      return stepName === 'Submitted' ? 'complete' : 'rejected';
    }
    if (currentStatus === 'Revision Required') {
      return stepName === 'Under Review' ? 'revision' : currentIdx >= stepIdx ? 'complete' : 'pending';
    }

    if (currentIdx >= stepIdx) return 'complete';
    return 'pending';
  };

  return (
    <div className="py-10 bg-slate-50 min-h-[70vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 text-center max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900">
            Track Manuscript Status
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Enter your <strong>Manuscript Tracking ID</strong> (e.g. <code>NRJBE-2026-XXXX</code>) or <strong>Published Paper ID</strong> to view the real-time review progress and editorial remarks.
          </p>

          {/* Search Input Box */}
          <form onSubmit={handleSearch} className="mt-6 flex gap-2">
            <input
              type="text"
              required
              placeholder="e.g. NRJBE-2026-8742 or HEA-6a647828e3453"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none font-mono"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-700 hover:bg-primary-800 text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 flex-shrink-0 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Checking...' : 'Check Status'}</span>
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2 max-w-2xl mx-auto">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tracking Details View */}
        {result && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6 animate-in fade-in">
            {/* Status Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <span className="text-xs text-slate-400 font-mono">Tracking Code:</span>
                <h2 className="text-xl font-mono font-bold text-primary-800">
                  {result.trackingId}
                </h2>
                <h3 className="text-base sm:text-lg font-serif font-bold text-navy-900 mt-1">
                  {result.paperTitle}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Author: <span className="font-semibold">{result.authorName}</span>
                  {result.affiliation && ` (${result.affiliation})`}
                </p>
              </div>

              <div className="flex sm:flex-col items-start sm:items-end gap-1">
                <span className="text-xs text-slate-400">Current Status:</span>
                <span
                  className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${
                    result.status === 'Published'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : result.status === 'Accepted'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : result.status === 'Under Review'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : result.status === 'Revision Required'
                      ? 'bg-purple-50 text-purple-800 border-purple-200'
                      : result.status === 'Rejected'
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : 'bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  {result.status}
                </span>
              </div>
            </div>

            {/* Visual Review Pipeline Steps */}
            <div className="py-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Peer Review Progress Workflow:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                {/* Step 1 */}
                <div
                  className={`p-3.5 rounded-lg border flex items-center gap-3 ${
                    getStepStatus('Submitted', result.status) === 'complete'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                  <div>
                    <p className="font-bold">1. Submitted</p>
                    <p className="text-[11px]">Editorial Intake</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div
                  className={`p-3.5 rounded-lg border flex items-center gap-3 ${
                    getStepStatus('Under Review', result.status) === 'complete'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <CheckCircle2
                    className={`w-5 h-5 flex-shrink-0 ${
                      getStepStatus('Under Review', result.status) === 'complete'
                        ? 'text-emerald-600'
                        : 'text-slate-300'
                    }`}
                  />
                  <div>
                    <p className="font-bold">2. Peer Review</p>
                    <p className="text-[11px]">Double-Blind Review</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div
                  className={`p-3.5 rounded-lg border flex items-center gap-3 ${
                    getStepStatus('Accepted', result.status) === 'complete'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <CheckCircle2
                    className={`w-5 h-5 flex-shrink-0 ${
                      getStepStatus('Accepted', result.status) === 'complete'
                        ? 'text-emerald-600'
                        : 'text-slate-300'
                    }`}
                  />
                  <div>
                    <p className="font-bold">3. Editorial Decision</p>
                    <p className="text-[11px]">Decision Letter</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div
                  className={`p-3.5 rounded-lg border flex items-center gap-3 ${
                    getStepStatus('Published', result.status) === 'complete'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <CheckCircle2
                    className={`w-5 h-5 flex-shrink-0 ${
                      getStepStatus('Published', result.status) === 'complete'
                        ? 'text-emerald-600'
                        : 'text-slate-300'
                    }`}
                  />
                  <div>
                    <p className="font-bold">4. Published</p>
                    <p className="text-[11px]">DOI &amp; Certificate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial Remarks / Reviewer Comments */}
            {result.editorRemarks && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Editor-in-Chief Remarks:
                </span>
                <p className="text-xs sm:text-sm text-slate-700">
                  {result.editorRemarks}
                </p>
              </div>
            )}

            {/* Published Article Downloads */}
            {result.status === 'Published' && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-emerald-900 text-sm">
                    Article Published &amp; Digitally Archived
                  </h4>
                  {result.doi && (
                    <p className="text-xs text-emerald-700 font-mono mt-0.5">
                      DOI: {result.doi}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {result.pdfUrl && (
                    <a
                      href={result.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View PDF</span>
                    </a>
                  )}
                  {result.certificateUrl && (
                    <a
                      href={result.certificateUrl}
                      download
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-md border border-slate-300 transition-colors"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      <span>Download Certificate</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
