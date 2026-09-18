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

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/admin/submissions').then((r) => r.json()),
      fetch('/api/admin/issues').then((r) => r.json()),
    ])
      .then(([subData, issData]) => {
        if (subData.submissions) setSubmissions(subData.submissions);
        if (issData.issues) {
          setIssues(issData.issues);
          const current = issData.issues.find((i: any) => i.isCurrent) || issData.issues[0];
          if (current) setPublishToIssueId(String(current.id));
        }
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
            <option value="Revision Required">Revision Required</option>
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
            filteredSubmissions.map((sub) => (
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
                          : sub.status === 'Revision Required'
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

                  <div className="flex items-center gap-2">
                    <a
                      href={sub.manuscriptFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-md border border-slate-200 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-primary-700" />
                      <span>Download Manuscript</span>
                    </a>

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
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
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
                    <span>Email: <a href={`mailto:${sub.authorEmail}`} className="text-primary-700 underline">{sub.authorEmail}</a></span>
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
            ))
          ) : (
            <div className="p-12 text-center text-xs text-slate-500">
              No manuscript submissions found in this status category.
            </div>
          )}
        </div>
      </div>

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
                  <option value="Revision Required">Revision Required (Minor / Major)</option>
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
                  placeholder="e.g. Your paper has successfully passed double-blind peer review with minor revisions accepted..."
                  value={editorRemarks}
                  onChange={(e) => setEditorRemarks(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Internal Peer Reviewer Notes (Private to Editorial Board)
                </label>
                <textarea
                  rows={3}
                  placeholder="Methodology notes, referee remarks..."
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              {/* One-Click Publish Section if Status === 'Published' */}
              {reviewStatus === 'Published' && (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Instant Publish to Journal Issue</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    Marking this paper as Published will automatically insert it into the public research articles database for the selected issue!
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-emerald-900 mb-1">Target Issue</label>
                      <select
                        value={publishToIssueId}
                        onChange={(e) => setPublishToIssueId(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg bg-white"
                      >
                        {issues.map((iss) => (
                          <option key={iss.id} value={iss.id}>
                            {iss.title} {iss.isCurrent ? '(Current)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-emerald-900 mb-1">Page Range</label>
                      <input
                        type="text"
                        value={pageRange}
                        onChange={(e) => setPageRange(e.target.value)}
                        placeholder="e.g. 01-14"
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-emerald-900 mb-1">Assign Zenodo / CrossRef DOI</label>
                      <input
                        type="text"
                        value={doi}
                        onChange={(e) => setDoi(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-700 hover:bg-primary-800 text-white font-semibold rounded-lg shadow-sm"
                >
                  Save Editorial Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
