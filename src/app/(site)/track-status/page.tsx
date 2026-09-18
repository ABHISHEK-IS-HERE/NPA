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
  Building,
  QrCode,
  CreditCard,
  MessageCircle,
  Copy,
  Check,
  Sparkles,
  ShoppingBag,
  Download,
} from 'lucide-react';

export default function TrackStatusPage() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [trackingId, setTrackingId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [copiedDoi, setCopiedDoi] = useState(false);

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

  // 5-Stage Pipeline Status Helper
  const getStageStatus = (stageNum: number, currentStatus: string) => {
    if (currentStatus === 'Rejected') {
      return stageNum === 1 ? 'complete' : 'rejected';
    }
    if (currentStatus === 'Revision Required') {
      if (stageNum <= 2) return 'complete';
      if (stageNum === 3) return 'revision';
      return 'pending';
    }

    switch (currentStatus) {
      case 'Submitted':
        return stageNum === 1 ? 'current' : 'pending';
      case 'Under Review':
        if (stageNum < 3) return 'complete';
        if (stageNum === 3) return 'current';
        return 'pending';
      case 'Accepted':
        if (stageNum < 4) return 'complete';
        if (stageNum === 4) return 'current';
        return 'pending';
      case 'Published':
        return 'complete';
      default:
        return 'pending';
    }
  };

  const handleCopyDoi = (doi: string) => {
    navigator.clipboard.writeText(doi);
    setCopiedDoi(true);
    setTimeout(() => setCopiedDoi(false), 2000);
  };

  return (
    <div className="py-10 bg-slate-50 min-h-[75vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Search Header Box */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 text-center max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900">
            Track Manuscript &amp; Paper Status
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Enter your <strong>Manuscript Tracking ID</strong> (e.g. <code>NRJBE-2026-XXXX</code>) or <strong>Published Paper ID</strong> to view the real-time double-blind review progress, similarity score, and editorial decisions.
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
              <span>{loading ? 'Checking...' : 'Track'}</span>
            </button>
          </form>

          {/* Sample IDs Quick Click */}
          <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <span>Try sample tracking IDs:</span>
            <button
              type="button"
              onClick={() => {
                setTrackingId('NRJBE-2026-8742');
                fetchStatus('NRJBE-2026-8742');
              }}
              className="font-mono text-primary-700 hover:underline bg-slate-100 px-2 py-0.5 rounded border border-slate-200"
            >
              NRJBE-2026-8742
            </button>
            <span>or</span>
            <button
              type="button"
              onClick={() => {
                setTrackingId('HEA-6a647828e3453');
                fetchStatus('HEA-6a647828e3453');
              }}
              className="font-mono text-primary-700 hover:underline bg-slate-100 px-2 py-0.5 rounded border border-slate-200"
            >
              HEA-6a647828e3453
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2 max-w-2xl mx-auto animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Tracking Details View */}
        {result && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            {/* Status Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-mono font-bold uppercase text-slate-500">
                    Tracking ID:
                  </span>
                  <span className="text-xs font-mono font-bold text-primary-800 bg-primary-50 px-2.5 py-0.5 rounded border border-primary-200">
                    {result.trackingId}
                  </span>
                  {result.researchArea && (
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {result.researchArea}
                    </span>
                  )}
                </div>

                <h2 className="text-lg sm:text-xl font-serif font-bold text-navy-950 leading-snug">
                  {result.paperTitle}
                </h2>

                <p className="text-xs text-slate-600 mt-1">
                  Author:{' '}
                  <strong className="text-slate-800 font-semibold">{result.authorName}</strong>
                  {result.affiliation && ` (${result.affiliation})`}
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex sm:flex-col items-start sm:items-end gap-1.5 flex-shrink-0">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  Current Stage:
                </span>
                <span
                  className={`text-xs font-bold uppercase px-3.5 py-1 rounded-full border ${
                    result.status === 'Published'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : result.status === 'Accepted'
                      ? 'bg-blue-50 text-blue-800 border-blue-300'
                      : result.status === 'Under Review'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : result.status === 'Revision Required'
                      ? 'bg-purple-50 text-purple-800 border-purple-300'
                      : result.status === 'Rejected'
                      ? 'bg-rose-50 text-rose-800 border-rose-300'
                      : 'bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  {result.status}
                </span>
              </div>
            </div>

            {/* 5-Stage Visual Workflow Stepper */}
            <div className="py-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center justify-between">
                <span>Evaluation &amp; Publishing Workflow:</span>
                <span className="text-[11px] font-normal text-slate-400">
                  Fast-Track Turnaround: 7–14 Days
                </span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-xs">
                {/* Stage 1 */}
                <div
                  className={`p-3 rounded-lg border flex flex-col justify-between ${
                    getStageStatus(1, result.status) === 'complete'
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : getStageStatus(1, result.status) === 'current'
                      ? 'bg-primary-50 border-primary-400 text-primary-950 ring-1 ring-primary-300'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[11px]">1. Intake</span>
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        getStageStatus(1, result.status) === 'complete'
                          ? 'text-emerald-600'
                          : getStageStatus(1, result.status) === 'current'
                          ? 'text-primary-600'
                          : 'text-slate-300'
                      }`}
                    />
                  </div>
                  <p className="text-[11px] font-medium leading-tight">Editorial Screening</p>
                </div>

                {/* Stage 2 */}
                <div
                  className={`p-3 rounded-lg border flex flex-col justify-between ${
                    getStageStatus(2, result.status) === 'complete'
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : getStageStatus(2, result.status) === 'current'
                      ? 'bg-primary-50 border-primary-400 text-primary-950 ring-1 ring-primary-300'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[11px]">2. Similarity</span>
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        getStageStatus(2, result.status) === 'complete'
                          ? 'text-emerald-600'
                          : getStageStatus(2, result.status) === 'current'
                          ? 'text-primary-600'
                          : 'text-slate-300'
                      }`}
                    />
                  </div>
                  <p className="text-[11px] font-medium leading-tight">Turnitin &le; 25% Check</p>
                </div>

                {/* Stage 3 */}
                <div
                  className={`p-3 rounded-lg border flex flex-col justify-between ${
                    getStageStatus(3, result.status) === 'complete'
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : getStageStatus(3, result.status) === 'current'
                      ? 'bg-primary-50 border-primary-400 text-primary-950 ring-1 ring-primary-300'
                      : getStageStatus(3, result.status) === 'revision'
                      ? 'bg-purple-50 border-purple-300 text-purple-950'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[11px]">3. Review</span>
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        getStageStatus(3, result.status) === 'complete'
                          ? 'text-emerald-600'
                          : getStageStatus(3, result.status) === 'current'
                          ? 'text-primary-600'
                          : 'text-slate-300'
                      }`}
                    />
                  </div>
                  <p className="text-[11px] font-medium leading-tight">Double-Blind Review</p>
                </div>

                {/* Stage 4 */}
                <div
                  className={`p-3 rounded-lg border flex flex-col justify-between ${
                    getStageStatus(4, result.status) === 'complete'
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : getStageStatus(4, result.status) === 'current'
                      ? 'bg-primary-50 border-primary-400 text-primary-950 ring-1 ring-primary-300'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[11px]">4. Acceptance</span>
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        getStageStatus(4, result.status) === 'complete'
                          ? 'text-emerald-600'
                          : getStageStatus(4, result.status) === 'current'
                          ? 'text-primary-600'
                          : 'text-slate-300'
                      }`}
                    />
                  </div>
                  <p className="text-[11px] font-medium leading-tight">APC Settlement</p>
                </div>

                {/* Stage 5 */}
                <div
                  className={`p-3 rounded-lg border flex flex-col justify-between ${
                    getStageStatus(5, result.status) === 'complete'
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[11px]">5. Published</span>
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        getStageStatus(5, result.status) === 'complete'
                          ? 'text-emerald-600'
                          : 'text-slate-300'
                      }`}
                    />
                  </div>
                  <p className="text-[11px] font-medium leading-tight">DOI &amp; Certificate</p>
                </div>
              </div>
            </div>

            {/* Editorial Remarks */}
            {result.editorRemarks && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Editor-in-Chief &amp; Reviewer Remarks:
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {result.editorRemarks}
                </p>
              </div>
            )}

            {/* If ACCEPTED: Show Official APC Payment & Next Steps Box */}
            {result.status === 'Accepted' && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50/40 p-6 rounded-xl border border-blue-200 space-y-4">
                <div className="flex items-center gap-2 text-blue-900">
                  <Award className="w-5 h-5 text-blue-700" />
                  <h3 className="font-bold text-sm sm:text-base">
                    Congratulations! Your Manuscript has been Accepted for Publication.
                  </h3>
                </div>
                <p className="text-xs text-blue-950 leading-relaxed">
                  The double-blind peer review board has approved your paper. Please settle the standard Article Processing Charge (APC) to complete galley proofing, Zenodo/CrossRef DOI minting, and inclusion in the upcoming issue.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Domestic India UPI / NetBanking */}
                  <div className="bg-white p-4 rounded-lg border border-blue-100 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">National (Indian Authors)</span>
                      <span className="font-bold text-primary-800">₹1,800 INR (Online)</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Or ₹2,300 INR for Online + Doorstep Speed Post Hardcopy
                    </p>
                    <div className="pt-2 border-t border-slate-100 font-mono text-[11px] text-slate-700 space-y-1">
                      <p>UPI VPA: <strong>editornrjbe@okhdfcbank</strong></p>
                      <p>Bank: <strong>HDFC Bank Ltd</strong></p>
                      <p>A/C Name: <strong>National Press Associates</strong></p>
                      <p>IFSC: <strong>HDFC0000248</strong></p>
                    </div>
                  </div>

                  {/* International USD */}
                  <div className="bg-white p-4 rounded-lg border border-blue-100 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">International Authors</span>
                      <span className="font-bold text-primary-800">$45 USD</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Or $65 USD for International Speed Post Hardcopy
                    </p>
                    <div className="pt-2 border-t border-slate-100 font-mono text-[11px] text-slate-700 space-y-1">
                      <p>SWIFT BIC: <strong>HDFCINBB</strong></p>
                      <p>Currency: <strong>USD / EUR Wire Remittance</strong></p>
                      <p>Card: <a href="https://wa.me/919888934889" className="text-primary-700 underline">Request Card Link</a></p>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Receipt submission CTA */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-600">
                    Once paid, share your Transaction UTR or screenshot with our accounts team for instant confirmation.
                  </span>
                  <a
                    href={`https://wa.me/919888934889?text=${encodeURIComponent(
                      `Hello Editor-in-Chief, I have paid the APC for my Accepted Paper "${result.paperTitle}" (Tracking ID: ${result.trackingId}). Please find my transaction receipt attached.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex-shrink-0"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Payment Receipt (WhatsApp)</span>
                  </a>
                </div>
              </div>
            )}

            {/* If PUBLISHED: Show DOI Link, PDF & Certificate Downloads */}
            {result.status === 'Published' && (
              <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50/40 border border-emerald-200 rounded-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>Digitally Published &amp; Archived</span>
                    </span>
                    <h4 className="font-bold text-emerald-950 text-base mt-1">
                      Your Research is Live in the Academic Record
                    </h4>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {result.pdfUrl && (
                      <a
                        href={result.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        <span>View Galley PDF</span>
                      </a>
                    )}
                    {result.certificateUrl && (
                      <a
                        href={result.certificateUrl}
                        download
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg border border-slate-300 transition-colors shadow-sm"
                      >
                        <Award className="w-4 h-4 text-amber-600" />
                        <span>Download Certificate</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* DOI Card */}
                {result.doi && (
                  <div className="bg-white p-3.5 rounded-lg border border-emerald-100 flex items-center justify-between gap-3">
                    <div className="text-xs">
                      <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                        Permanent Digital Object Identifier (DOI):
                      </span>
                      <a
                        href={result.doi.startsWith('http') ? result.doi : `https://doi.org/${result.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-700 hover:underline font-mono font-bold flex items-center gap-1 mt-0.5"
                      >
                        <span>{result.doi}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyDoi(result.doi)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 px-2.5 py-1.5 rounded transition-colors flex items-center gap-1"
                    >
                      {copiedDoi ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy DOI</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
