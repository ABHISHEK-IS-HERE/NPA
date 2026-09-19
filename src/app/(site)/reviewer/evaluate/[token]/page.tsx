'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  ShieldCheck,
  Award,
  CheckCircle2,
  AlertCircle,
  Download,
  ExternalLink,
  Send,
  Star,
  BookOpen,
  Eye,
  Check,
} from 'lucide-react';

interface BlindedData {
  assignment: {
    id: number;
    status: string;
    deadline: string | null;
    completedAt: string | null;
    scoreOriginality?: number | null;
    scoreMethodology?: number | null;
    scoreLiterature?: number | null;
    scoreClarity?: number | null;
    scoreSignificance?: number | null;
    recommendation?: string | null;
    commentsForAuthor?: string | null;
    confidentialComments?: string | null;
  };
  manuscript: {
    title: string;
    abstract: string;
    keywords?: string | null;
    researchArea?: string | null;
    manuscriptFileUrl: string;
    submittedAt: string;
  };
  reviewer: {
    name: string;
  };
}

export default function ReviewerEvaluatePage() {
  const params = useParams();
  const token = params.token as string;

  const [data, setData] = useState<BlindedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Rubric State (1 to 5)
  const [scoreOriginality, setScoreOriginality] = useState<number>(4);
  const [scoreMethodology, setScoreMethodology] = useState<number>(4);
  const [scoreLiterature, setScoreLiterature] = useState<number>(4);
  const [scoreClarity, setScoreClarity] = useState<number>(4);
  const [scoreSignificance, setScoreSignificance] = useState<number>(4);

  // Recommendation & Comments
  const [recommendation, setRecommendation] = useState<string>('Minor Revision');
  const [commentsForAuthor, setCommentsForAuthor] = useState<string>('');
  const [confidentialComments, setConfidentialComments] = useState<string>('');

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`/api/reviewer/${encodeURIComponent(token)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Invalid or expired review invitation link.');
        return res.json();
      })
      .then((resData) => {
        setData(resData);
        if (resData.assignment?.status === 'Completed') {
          setSuccess(true);
          setScoreOriginality(resData.assignment.scoreOriginality || 4);
          setScoreMethodology(resData.assignment.scoreMethodology || 4);
          setScoreLiterature(resData.assignment.scoreLiterature || 4);
          setScoreClarity(resData.assignment.scoreClarity || 4);
          setScoreSignificance(resData.assignment.scoreSignificance || 4);
          setRecommendation(resData.assignment.recommendation || 'Accept');
          setCommentsForAuthor(resData.assignment.commentsForAuthor || '');
          setConfidentialComments(resData.assignment.confidentialComments || '');
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentsForAuthor || commentsForAuthor.trim().length < 20) {
      setError('Please provide constructive comments for the author (at least 20 characters).');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/reviewer/${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scoreOriginality,
          scoreMethodology,
          scoreLiterature,
          scoreClarity,
          scoreSignificance,
          recommendation,
          commentsForAuthor,
          confidentialComments,
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to submit evaluation.');

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfbf2] flex items-center justify-center p-4">
        <div className="bg-white border border-stone-200 p-8 rounded-xl shadow-sm text-center max-w-md w-full animate-pulse space-y-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full mx-auto"></div>
          <div className="h-6 bg-stone-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-stone-100 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-[#fdfbf2] flex items-center justify-center p-4">
        <div className="bg-white border border-red-200 p-8 rounded-xl shadow-sm text-center max-w-md w-full space-y-4">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
          <h2 className="font-serif font-bold text-xl text-stone-900">Access Link Invalid</h2>
          <p className="text-sm text-stone-600">{error}</p>
          <Link
            href="/"
            className="inline-block bg-stone-900 text-stone-100 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition-colors"
          >
            Return to Journal Home
          </Link>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const averageScore = (
    (scoreOriginality + scoreMethodology + scoreLiterature + scoreClarity + scoreSignificance) /
    5
  ).toFixed(1);

  return (
    <div className="min-h-screen bg-[#fdfbf2] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Masthead Header */}
        <div className="bg-stone-900 text-stone-100 p-6 sm:p-8 rounded-xl shadow-md border border-stone-800">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-4 mb-4">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-mono text-amber-400 font-bold">
                Double-Blind Peer Review Desk
              </span>
              <h1 className="font-serif font-bold text-xl sm:text-2xl text-white mt-1">
                National Research Journal of Business Economics
              </h1>
            </div>
            <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-3 py-1 rounded-full text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Double-Blind Protocol Active</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-stone-400 gap-2">
            <span>Welcome, <strong>Dr. {data.reviewer.name}</strong></span>
            {data.assignment.deadline && (
              <span>
                Review Deadline:{' '}
                <strong className="text-amber-300">
                  {new Date(data.assignment.deadline).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </strong>
              </span>
            )}
          </div>
        </div>

        {/* Blinded Manuscript Card */}
        <div className="bg-white border border-stone-300 p-6 sm:p-8 rounded-xl shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div className="flex items-center gap-2 text-primary-800">
              <BookOpen className="w-5 h-5 text-amber-600" />
              <h2 className="font-serif font-bold text-lg text-stone-900">Blinded Manuscript Record</h2>
            </div>
            <span className="text-xs bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded font-mono">
              {data.manuscript.researchArea || 'Business Economics'}
            </span>
          </div>

          <div>
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-stone-950 leading-snug">
              {data.manuscript.title}
            </h3>
            {data.manuscript.keywords && (
              <p className="text-xs text-stone-500 mt-2">
                <strong>Keywords:</strong> {data.manuscript.keywords}
              </p>
            )}
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-lg p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">Abstract</h4>
            <p className="text-sm text-stone-800 leading-relaxed font-serif whitespace-pre-wrap">
              {data.manuscript.abstract}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="text-xs text-stone-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Author identity is sealed per COPE and UGC-CARE double-blind review ethics.</span>
            </div>

            {data.manuscript.manuscriptFileUrl && (
              <a
                href={data.manuscript.manuscriptFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Blinded Manuscript (PDF)</span>
              </a>
            )}
          </div>
        </div>

        {/* Evaluation Form / Submitted Summary */}
        {success ? (
          <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-8 text-center space-y-4 shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="font-serif font-bold text-2xl text-emerald-950">Evaluation Successfully Submitted</h3>
            <p className="text-sm text-emerald-800 max-w-lg mx-auto">
              Your expert evaluation has been transmitted to the Editor-in-Chief. Your contribution ensures high academic rigor and integrity in peer-reviewed scholarly literature.
            </p>
            <div className="bg-white border border-emerald-200 rounded-lg p-4 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Overall Recommendation:</span>
                <strong className="text-stone-900">{recommendation}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Average Rubric Score:</span>
                <strong className="text-stone-900">{averageScore} / 5.0</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Completed On:</span>
                <span className="text-stone-700 font-mono">{new Date().toLocaleDateString('en-GB')}</span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-stone-300 rounded-xl p-6 sm:p-8 shadow-xs space-y-8">
            <div>
              <h3 className="font-serif font-bold text-xl text-stone-950 mb-1">Standardized Peer Review Rubric</h3>
              <p className="text-xs text-stone-500">
                Score each scholarly dimension from 1 (Unsatisfactory) to 5 (Outstanding).
              </p>
            </div>

            {/* Rubric Criteria Grid */}
            <div className="space-y-6">
              {[
                {
                  label: '1. Originality & Novelty',
                  desc: 'Does the manuscript provide a distinct theoretical or empirical contribution?',
                  value: scoreOriginality,
                  setter: setScoreOriginality,
                },
                {
                  label: '2. Methodological Rigor & Data Integrity',
                  desc: 'Are the research design, econometric models, and data sources sound and reproducible?',
                  value: scoreMethodology,
                  setter: setScoreMethodology,
                },
                {
                  label: '3. Grounding in Academic Literature',
                  desc: 'Is the conceptual framework well-anchored in contemporary peer-reviewed citations?',
                  value: scoreLiterature,
                  setter: setScoreLiterature,
                },
                {
                  label: '4. Structure & Presentation Clarity',
                  desc: 'Are arguments coherent, terminology precise, and data tables clear?',
                  value: scoreClarity,
                  setter: setScoreClarity,
                },
                {
                  label: '5. Theoretical & Practical Significance',
                  desc: 'Are the findings actionable for corporate leaders, economists, or policymakers?',
                  value: scoreSignificance,
                  setter: setScoreSignificance,
                },
              ].map((crit) => (
                <div key={crit.label} className="border-b border-stone-100 pb-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">{crit.label}</h4>
                      <p className="text-xs text-stone-500">{crit.desc}</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-stone-50 p-1.5 rounded-lg border border-stone-200">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => crit.setter(num)}
                          className={`w-8 h-8 rounded text-xs font-bold transition-all ${
                            crit.value === num
                              ? 'bg-amber-600 text-white shadow-xs scale-105'
                              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendation */}
            <div className="space-y-3 pt-2">
              <label className="block text-sm font-bold text-stone-900">
                Overall Editorial Recommendation <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { value: 'Accept', label: 'Accept as is', color: 'emerald' },
                  { value: 'Minor Revision', label: 'Minor Revisions', color: 'amber' },
                  { value: 'Major Revision', label: 'Major Revisions', color: 'orange' },
                  { value: 'Reject', label: 'Reject Manuscript', color: 'red' },
                ].map((rec) => (
                  <label
                    key={rec.value}
                    className={`cursor-pointer border-2 rounded-lg p-3.5 text-center transition-all ${
                      recommendation === rec.value
                        ? 'border-stone-900 bg-stone-900 text-white shadow-sm font-bold'
                        : 'border-stone-200 bg-white text-stone-800 hover:border-stone-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="recommendation"
                      value={rec.value}
                      checked={recommendation === rec.value}
                      onChange={(e) => setRecommendation(e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-xs">{rec.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Feedback Sections */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-stone-900 mb-1">
                  Constructive Comments for Authors <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-stone-500 mb-2">
                  This report will be forwarded anonymously to the authors to guide their revisions.
                </p>
                <textarea
                  rows={6}
                  value={commentsForAuthor}
                  onChange={(e) => setCommentsForAuthor(e.target.value)}
                  placeholder="Detail specific strengths, methodological limitations, and actionable suggestions for improvement..."
                  className="w-full text-sm p-3.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-serif leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-900 mb-1">
                  Confidential Comments for the Editor-in-Chief <span className="text-xs font-normal text-stone-500">(Optional)</span>
                </label>
                <p className="text-xs text-stone-500 mb-2">
                  Visible ONLY to the Editorial Board. Author will never see these remarks.
                </p>
                <textarea
                  rows={3}
                  value={confidentialComments}
                  onChange={(e) => setConfidentialComments(e.target.value)}
                  placeholder="Private notes regarding originality doubts, overlap with existing work, or editorial considerations..."
                  className="w-full text-sm p-3.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-serif leading-relaxed bg-stone-50"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Action */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-200">
              <div className="text-xs text-stone-500">
                Composite Score: <strong className="text-stone-900 font-mono text-sm">{averageScore} / 5.0</strong>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-[#fdfbf2] text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg shadow-sm transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting Evaluation...' : 'Submit Official Review'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
