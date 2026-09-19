'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Inbox,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  ExternalLink,
  Edit2,
  Trash2,
  X,
  Send,
  Sparkles,
  BookOpen,
  Award,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Star,
  Copy,
  Check,
  Clock,
  MessageSquare,
} from 'lucide-react';

export default function AdminSubmissionsPage() {
  const searchParams = useSearchParams();
  const focusId = searchParams.get('id');

  const [submissions, setSubmissions] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Review / Publish Form state
  const [reviewStatus, setReviewStatus] = useState('Under Review');
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [editorRemarks, setEditorRemarks] = useState('');
  const [publishToIssueId, setPublishToIssueId] = useState('');
  const [doi, setDoi] = useState('');
  const [pageRange, setPageRange] = useState('01-14');

  // Peer Review Modal State
  const [peerReviewModalOpen, setPeerReviewModalOpen] = useState(false);
  const [peerReviewSub, setPeerReviewSub] = useState<any>(null);
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [reviewersRegistry, setReviewersRegistry] = useState<any[]>([]);
  const [selectedReviewerId, setSelectedReviewerId] = useState('');
  const [deadlineDays, setDeadlineDays] = useState(14);
  const [assigningReviewer, setAssigningReviewer] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Quick Add Reviewer State
  const [showAddReviewer, setShowAddReviewer] = useState(false);
  const [newReviewerName, setNewReviewerName] = useState('');
  const [newReviewerEmail, setNewReviewerEmail] = useState('');
  const [newReviewerInstitution, setNewReviewerInstitution] = useState('');
  const [newReviewerExpertise, setNewReviewerExpertise] = useState('');
  const [addingReviewer, setAddingReviewer] = useState(false);

  // Editorial Decision Modal State
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState<'Accept' | 'Minor Revision' | 'Major Revision' | 'Reject'>('Accept');
  const [decisionRemarks, setDecisionRemarks] = useState('');
  const [notifyAuthor, setNotifyAuthor] = useState(true);
  const [dispatchingDecision, setDispatchingDecision] = useState(false);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/admin/submissions').then((r) => r.json()),
      fetch('/api/admin/issues').then((r) => r.json()),
      fetch('/api/admin/reviewers').then((r) => r.json()),
    ])
      .then(([subData, issData, revData]) => {
        if (subData.submissions) setSubmissions(subData.submissions);
        if (issData.issues) {
          setIssues(issData.issues);
          const current = issData.issues.find((i: any) => i.isCurrent) || issData.issues[0];
          if (current) setPublishToIssueId(String(current.id));
        }
        if (revData.reviewers) setReviewersRegistry(revData.reviewers);
      })
      .catch((err) => setError('Failed to load submissions'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (focusId && submissions.length > 0) {
      const sub = submissions.find((s) => s.id === Number(focusId));
      if (sub) handleOpenReview(sub);
    }
  }, [focusId, submissions]);

  const handleOpenReview = (sub: any) => {
    setSelectedSub(sub);
    setReviewStatus(sub.status);
    setReviewerNotes(sub.reviewerNotes || '');
    setEditorRemarks(sub.editorRemarks || '');
    setDoi(`https://doi.org/10.5281/zenodo.${Math.floor(10000000 + Math.random() * 90000000)}`);
    setModalOpen(true);
  };

  const handleOpenPeerReview = async (sub: any) => {
    setPeerReviewSub(sub);
    setPeerReviewModalOpen(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/submissions/${sub.id}/reviews`);
      const data = await res.json();
      if (data.reviews) setReviewsList(data.reviews);
    } catch (err: any) {
      setError('Failed to fetch reviews for this submission.');
    }
  };

  const handleAssignReviewer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!peerReviewSub || !selectedReviewerId) return;

    setAssigningReviewer(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/submissions/${peerReviewSub.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewerId: Number(selectedReviewerId),
          deadlineDays,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to assign reviewer.');

      setSuccess('Reviewer assigned and invitation dispatched successfully!');
      setTimeout(() => setSuccess(''), 4000);
      setSelectedReviewerId('');

      // Refresh reviews list
      const revRes = await fetch(`/api/admin/submissions/${peerReviewSub.id}/reviews`);
      const revData = await revRes.json();
      if (revData.reviews) setReviewsList(revData.reviews);

      fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAssigningReviewer(false);
    }
  };

  const handleCreateReviewer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewerName || !newReviewerEmail || !newReviewerInstitution || !newReviewerExpertise) {
      setError('Please fill in all reviewer fields.');
      return;
    }

    setAddingReviewer(true);
    setError('');

    try {
      const res = await fetch('/api/admin/reviewers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newReviewerName,
          email: newReviewerEmail,
          institution: newReviewerInstitution,
          expertiseAreas: newReviewerExpertise,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register reviewer.');

      setSuccess('New expert reviewer added to registry!');
      setTimeout(() => setSuccess(''), 4000);

      // Refresh reviewers registry & select newly created reviewer
      const regRes = await fetch('/api/admin/reviewers');
      const regData = await regRes.json();
      if (regData.reviewers) {
        setReviewersRegistry(regData.reviewers);
        setSelectedReviewerId(String(data.reviewer.id));
      }

      setShowAddReviewer(false);
      setNewReviewerName('');
      setNewReviewerEmail('');
      setNewReviewerInstitution('');
      setNewReviewerExpertise('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAddingReviewer(false);
    }
  };

  const handleOpenDecisionModal = (sub: any) => {
    setPeerReviewSub(sub);
    setDecisionType('Accept');
    setDecisionRemarks(
      'The Editorial Board is pleased to inform you that following rigorous double-blind peer review, your research manuscript has been accepted for publication in the National Research Journal of Business Economics (NRJBE).'
    );
    setDecisionModalOpen(true);
  };

  const handleDecisionTypeChange = (type: 'Accept' | 'Minor Revision' | 'Major Revision' | 'Reject') => {
    setDecisionType(type);
    const templates = {
      Accept:
        'The Editorial Board is pleased to inform you that following rigorous double-blind peer review, your research manuscript has been accepted for publication in the National Research Journal of Business Economics (NRJBE).',
      'Minor Revision':
        'Following peer review, your manuscript has been evaluated favorably. However, minor revisions are required per the referee reports below before final acceptance. Please address each point and upload your revised manuscript within 14 days.',
      'Major Revision':
        'Your manuscript presents a promising premise, but the referee evaluation has identified substantial methodological or conceptual issues requiring major revisions. A second round of double-blind review will follow upon resubmission.',
      Reject:
        'Following thorough double-blind peer review, the Editorial Board regrets to inform you that your manuscript does not meet the necessary criteria for publication in this volume of NRJBE. We encourage you to review the constructive referee remarks below.',
    };
    setDecisionRemarks(templates[type]);
  };

  const handleFinalizeDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!peerReviewSub) return;

    setDispatchingDecision(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/submissions/${peerReviewSub.id}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision: decisionType,
          editorRemarks: decisionRemarks,
          notifyAuthor,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to dispatch editorial decision.');

      setSuccess(`Editorial decision (${decisionType}) finalized and dispatched to author!`);
      setTimeout(() => setSuccess(''), 5000);
      setDecisionModalOpen(false);
      setPeerReviewModalOpen(false);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDispatchingDecision(false);
    }
  };

  const handleCopyTokenLink = (accessToken: string) => {
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const fullUrl = `${siteUrl}/reviewer/evaluate/${accessToken}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedToken(accessToken);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;
    setError('');

    try {
      const res = await fetch('/api/admin/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedSub.id,
          status: reviewStatus,
          reviewerNotes,
          editorRemarks,
          publishToIssueId: reviewStatus === 'Published' ? publishToIssueId : undefined,
          doi: reviewStatus === 'Published' ? doi : undefined,
          pageRange: reviewStatus === 'Published' ? pageRange : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update submission');

      setSuccess(data.message || 'Submission status updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    try {
      const res = await fetch(`/api/admin/submissions?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete submission');
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filteredSubmissions = submissions.filter((s) =>
    statusFilter ? s.status === statusFilter : true
  );

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-navy-900 flex items-center gap-2">
            <Inbox className="w-6 h-6 text-primary-700" />
            <span>Manuscript Submissions &amp; Peer Review Queue</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate incoming author manuscripts, manage double-blind reviews, post feedback, and publish directly to issues.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Filter Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-2 px-3 border border-slate-300 rounded-lg bg-white font-medium text-slate-700"
          >
            <option value="">All Statuses ({submissions.length})</option>
            <option value="Submitted">Submitted ({submissions.filter((s) => s.status === 'Submitted').length})</option>
            <option value="Under Review">Under Review</option>
            <option value="Revisions Required">Revisions Required</option>
            <option value="Accepted">Accepted</option>
            <option value="Published">Published</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Submissions List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredSubmissions.length > 0 ? (
            filteredSubmissions.map((sub) => {
              const reviewsCount = sub.reviews?.length || 0;
              const completedCount = sub.reviews?.filter((r: any) => r.status === 'Completed').length || 0;

              return (
                <div key={sub.id} className="p-5 hover:bg-slate-50 transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-primary-800 bg-primary-50 px-2.5 py-0.5 rounded border border-primary-200">
                        {sub.trackingId}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                          sub.status === 'Submitted'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : sub.status === 'Accepted'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : sub.status === 'Published'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : sub.status === 'Revisions Required' || sub.status === 'Revision Required'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : sub.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {sub.status}
                      </span>
                      <span className="text-xs text-slate-400">
                        Submitted: {new Date(sub.submittedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={sub.manuscriptFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-md border border-slate-200 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-primary-700" />
                        <span>Download</span>
                      </a>

                      {/* Double-Blind Peer Review Desk Button */}
                      <button
                        onClick={() => handleOpenPeerReview(sub)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-[#fdfbf2] text-xs font-semibold rounded-md shadow-xs transition-colors"
                        title="Manage Peer Reviewers & Blinded Evaluations"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>
                          Peer Review ({completedCount}/{reviewsCount})
                        </span>
                      </button>

                      <Link
                        href={`/admin/certificate/submission/${sub.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold rounded-md border border-amber-300 transition-colors"
                        title="Generate Acceptance Letter or Certificate"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-700" />
                        <span>Letter / Cert</span>
                      </Link>

                      <button
                        onClick={() => handleOpenReview(sub)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Review &amp; Status</span>
                      </button>

                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-serif font-bold text-navy-900 leading-snug">
                      {sub.paperTitle}
                    </h3>
                    <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-4">
                      <span>
                        Author: <strong className="text-slate-800">{sub.authorName}</strong>
                      </span>
                      <span>
                        Email:{' '}
                        <a href={`mailto:${sub.authorEmail}`} className="text-primary-700 underline">
                          {sub.authorEmail}
                        </a>
                      </span>
                      {sub.authorPhone && <span>Phone: {sub.authorPhone}</span>}
                      {sub.affiliation && <span>Affiliation: {sub.affiliation}</span>}
                    </div>
                    {sub.coAuthors && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        Co-Authors: {sub.coAuthors}
                      </p>
                    )}
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600">
                    <span className="font-bold text-slate-700 uppercase text-[11px] block mb-1">Abstract:</span>
                    <p className="leading-relaxed line-clamp-3">{sub.abstract}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center text-xs text-slate-500">
              No manuscript submissions found in this status category.
            </div>
          )}
        </div>
      </div>

      {/* Peer Review & Double-Blind Desk Modal */}
      {peerReviewModalOpen && peerReviewSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-stone-900 text-white">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <div>
                  <span className="font-mono text-xs font-bold text-amber-400">{peerReviewSub.trackingId}</span>
                  <h3 className="font-bold text-sm text-white">
                    Double-Blind Peer Review Desk
                  </h3>
                </div>
              </div>
              <button onClick={() => setPeerReviewModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Manuscript Overview */}
              <div className="bg-stone-50 border border-stone-200 p-4 rounded-lg">
                <h4 className="font-serif font-bold text-sm text-stone-900 leading-snug">{peerReviewSub.paperTitle}</h4>
                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 mt-2">
                  <span>Author: <strong>{peerReviewSub.authorName}</strong> ({peerReviewSub.affiliation || 'Unspecified'})</span>
                  <span>•</span>
                  <span>Status: <strong className="text-amber-700">{peerReviewSub.status}</strong></span>
                </div>
              </div>

              {/* Assigned Reviewers List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-primary-700" />
                    <span>Assigned Expert Reviewers ({reviewsList.length})</span>
                  </h4>
                  {reviewsList.length > 0 && (
                    <button
                      onClick={() => handleOpenDecisionModal(peerReviewSub)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded transition-colors shadow-2xs"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Formulate Editorial Decision</span>
                    </button>
                  )}
                </div>

                {reviewsList.length > 0 ? (
                  <div className="space-y-3">
                    {reviewsList.map((rev) => {
                      const isDone = rev.status === 'Completed';
                      const avgScore = isDone
                        ? (
                            (rev.scoreOriginality +
                              rev.scoreMethodology +
                              rev.scoreLiterature +
                              rev.scoreClarity +
                              rev.scoreSignificance) /
                            5
                          ).toFixed(1)
                        : null;

                      return (
                        <div
                          key={rev.id}
                          className={`p-4 rounded-lg border text-xs space-y-2.5 ${
                            isDone ? 'bg-emerald-50/60 border-emerald-200' : 'bg-white border-stone-200'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-stone-900 text-sm">{rev.reviewer?.name}</span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                    isDone
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {rev.status}
                                </span>
                              </div>
                              <p className="text-stone-500 text-[11px] mt-0.5">
                                {rev.reviewer?.institution} • Expertise: {rev.reviewer?.expertiseAreas}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              {isDone ? (
                                <div className="text-right">
                                  <span className="font-bold text-emerald-900 text-sm font-mono">{avgScore} / 5.0</span>
                                  <span className="block text-[10px] text-emerald-700 font-semibold uppercase">
                                    {rev.recommendation}
                                  </span>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleCopyTokenLink(rev.accessToken)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 rounded text-[11px] font-medium transition-colors"
                                  title="Copy secure link to share with reviewer manually"
                                >
                                  {copiedToken === rev.accessToken ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5 text-stone-500" />
                                  )}
                                  <span>{copiedToken === rev.accessToken ? 'Link Copied!' : 'Copy Review Link'}</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {isDone && (
                            <div className="space-y-2 pt-2 border-t border-emerald-100">
                              <div className="bg-white p-3 rounded border border-emerald-100">
                                <span className="font-bold text-stone-700 block mb-1">Feedback for Author:</span>
                                <p className="text-stone-800 whitespace-pre-wrap leading-relaxed">
                                  {rev.commentsForAuthor}
                                </p>
                              </div>
                              {rev.confidentialComments && (
                                <div className="bg-amber-50/60 p-2.5 rounded border border-amber-200/80 text-amber-900">
                                  <span className="font-bold block mb-0.5">Confidential to Editor:</span>
                                  <p className="whitespace-pre-wrap">{rev.confidentialComments}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-stone-500 italic p-3 bg-stone-50 rounded border border-stone-200">
                    No peer reviewers have been assigned to this manuscript yet. Select a referee below to send an invitation.
                  </p>
                )}
              </div>

              {/* Assign Reviewer Form */}
              <div className="border-t border-stone-200 pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <UserPlus className="w-4 h-4 text-primary-700" />
                    <span>Assign Reviewer from Registry</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowAddReviewer(!showAddReviewer)}
                    className="text-xs text-primary-700 hover:underline font-medium"
                  >
                    {showAddReviewer ? 'Cancel New Reviewer' : '+ Quick Register New Reviewer'}
                  </button>
                </div>

                {showAddReviewer ? (
                  <form onSubmit={handleCreateReviewer} className="p-4 bg-stone-50 border border-stone-200 rounded-lg space-y-3 text-xs">
                    <h5 className="font-bold text-stone-900">Register New Expert Reviewer</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-600 mb-1">Full Name &amp; Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Dr. Rajesh Sharma"
                          value={newReviewerName}
                          onChange={(e) => setNewReviewerName(e.target.value)}
                          className="w-full px-2.5 py-1.5 border rounded bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-600 mb-1">Academic Email *</label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. r.sharma@university.edu"
                          value={newReviewerEmail}
                          onChange={(e) => setNewReviewerEmail(e.target.value)}
                          className="w-full px-2.5 py-1.5 border rounded bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-600 mb-1">Institution / University *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Delhi School of Economics"
                          value={newReviewerInstitution}
                          onChange={(e) => setNewReviewerInstitution(e.target.value)}
                          className="w-full px-2.5 py-1.5 border rounded bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-600 mb-1">Research Expertise *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Corporate Finance, Econometrics"
                          value={newReviewerExpertise}
                          onChange={(e) => setNewReviewerExpertise(e.target.value)}
                          className="w-full px-2.5 py-1.5 border rounded bg-white"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={addingReviewer}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded font-bold uppercase tracking-wider text-[11px]"
                    >
                      {addingReviewer ? 'Registering...' : 'Save & Select Reviewer'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleAssignReviewer} className="flex flex-col sm:flex-row items-end gap-3 text-xs">
                    <div className="flex-1 w-full">
                      <label className="block text-stone-600 mb-1 font-semibold">Select Reviewer</label>
                      <select
                        value={selectedReviewerId}
                        onChange={(e) => setSelectedReviewerId(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-lg bg-white"
                      >
                        <option value="">-- Choose Reviewer from Registry ({reviewersRegistry.length}) --</option>
                        {reviewersRegistry.map((rev) => (
                          <option key={rev.id} value={rev.id}>
                            {rev.name} ({rev.institution}) — {rev.expertiseAreas}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-full sm:w-32">
                      <label className="block text-stone-600 mb-1 font-semibold">Deadline</label>
                      <select
                        value={deadlineDays}
                        onChange={(e) => setDeadlineDays(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg bg-white"
                      >
                        <option value={7}>7 Days</option>
                        <option value={14}>14 Days</option>
                        <option value={21}>21 Days</option>
                        <option value={30}>30 Days</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={assigningReviewer || !selectedReviewerId}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary-700 hover:bg-primary-800 text-white font-bold rounded-lg shadow-xs transition-colors disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{assigningReviewer ? 'Dispatching...' : 'Send Blinded Invite'}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editorial Decision Modal */}
      {decisionModalOpen && peerReviewSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif font-bold text-base text-navy-900">Formulate Editorial Decision</h3>
              </div>
              <button onClick={() => setDecisionModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleFinalizeDecision} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block font-bold text-slate-800 mb-2">Editorial Verdict *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Accept', 'Minor Revision', 'Major Revision', 'Reject'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleDecisionTypeChange(type)}
                      className={`p-2.5 rounded-lg border text-center font-bold transition-all ${
                        decisionType === type
                          ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Official Decision Letter &amp; Remarks (Sent to Author) *
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Completed peer reviewer reports will be automatically appended to this decision letter anonymously.
                </p>
                <textarea
                  rows={6}
                  required
                  value={decisionRemarks}
                  onChange={(e) => setDecisionRemarks(e.target.value)}
                  className="w-full p-3 border rounded-lg font-serif text-sm leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="notifyAuthorCheckbox"
                  checked={notifyAuthor}
                  onChange={(e) => setNotifyAuthor(e.target.checked)}
                  className="rounded text-primary-700"
                />
                <label htmlFor="notifyAuthorCheckbox" className="font-semibold text-slate-700 cursor-pointer">
                  Dispatch official email to author ({peerReviewSub.authorEmail})
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDecisionModalOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={dispatchingDecision}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-primary-700 hover:bg-primary-800 text-white font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{dispatchingDecision ? 'Dispatching Decision...' : 'Finalize & Dispatch'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review / Status Update Modal */}
      {modalOpen && selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div>
                <span className="font-mono text-xs font-bold text-primary-800">{selectedSub.trackingId}</span>
                <h3 className="font-bold text-sm text-navy-900 mt-0.5">
                  Editorial Decision &amp; Reviewer Remarks
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Set Review Status *</label>
                <select
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white font-semibold text-sm"
                >
                  <option value="Submitted">Submitted (Intake)</option>
                  <option value="Under Review">Under Review (Assigned to Referees)</option>
                  <option value="Revisions Required">Revisions Required (Minor / Major)</option>
                  <option value="Accepted">Accepted (Awaiting Publication)</option>
                  <option value="Published">Published (Publish to Issue Immediately!)</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Editor-in-Chief Remarks (Visible to Author on Status Tracker)
                </label>
                <textarea
                  rows={3}
                  value={editorRemarks}
                  onChange={(e) => setEditorRemarks(e.target.value)}
                  placeholder="e.g. Under consideration by the editorial review board. Revisions requested in Methodology section."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Internal Editorial Notes (Private)
                </label>
                <textarea
                  rows={2}
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  placeholder="Internal notes regarding reviewer comments, plagiarism score, etc."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              {/* One-Click Publish Section */}
              {reviewStatus === 'Published' && (
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-primary-800 font-bold">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <span>One-Click Publication to Volume &amp; Issue</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    This manuscript will immediately be added to the selected published issue, DOI metadata generated, and made accessible in archives.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Target Issue *</label>
                      <select
                        value={publishToIssueId}
                        onChange={(e) => setPublishToIssueId(e.target.value)}
                        className="w-full px-3 py-1.5 border rounded-lg bg-white"
                        required
                      >
                        {issues.map((i) => (
                          <option key={i.id} value={i.id}>
                            Vol {i.volume?.volumeNumber || '12'} No {i.issueNumber} ({i.monthYear}) {i.isCurrent ? '★ Current' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Page Range *</label>
                      <input
                        type="text"
                        value={pageRange}
                        onChange={(e) => setPageRange(e.target.value)}
                        placeholder="e.g. 01-14"
                        className="w-full px-3 py-1.5 border rounded-lg bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Assigned Zenodo / CrossRef DOI</label>
                    <input
                      type="text"
                      value={doi}
                      onChange={(e) => setDoi(e.target.value)}
                      className="w-full px-3 py-1.5 border rounded-lg bg-white font-mono text-[11px]"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-700 hover:bg-primary-800 text-white font-bold rounded-lg shadow-sm transition-colors"
                >
                  Save &amp; Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
