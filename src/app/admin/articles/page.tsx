'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  FileText,
  Plus,
  Trash2,
  Edit2,
  Upload,
  ExternalLink,
  Award,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  BookOpen,
} from 'lucide-react';

export default function AdminArticlesPage() {
  const searchParams = useSearchParams();
  const initialAction = searchParams.get('action');
  const editId = searchParams.get('edit');

  const [articles, setArticles] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [selectedIssueId, setSelectedIssueId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingCert, setUploadingCert] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    issueId: '',
    paperId: '',
    title: '',
    authors: '',
    affiliations: '',
    abstract: '',
    keywords: '',
    doi: '',
    pageRange: '',
    pdfUrl: '',
    certificateUrl: '',
    status: 'Published',
  });

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/admin/articles').then((r) => r.json()),
      fetch('/api/admin/issues').then((r) => r.json()),
    ])
      .then(([artData, issData]) => {
        if (artData.articles) setArticles(artData.articles);
        if (issData.issues) {
          setIssues(issData.issues);
          if (!formData.issueId && issData.issues.length > 0) {
            const current = issData.issues.find((i: any) => i.isCurrent) || issData.issues[0];
            setFormData((prev) => ({ ...prev, issueId: String(current.id) }));
          }
        }
      })
      .catch((err) => setError('Failed to load articles'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (initialAction === 'new') {
      handleOpenCreate();
    }
  }, [initialAction]);

  useEffect(() => {
    if (editId && articles.length > 0) {
      const art = articles.find((a) => a.id === Number(editId));
      if (art) handleOpenEdit(art);
    }
  }, [editId, articles]);

  const handleOpenCreate = () => {
    setEditingArticle(null);
    const defaultIssue = issues.find((i) => i.isCurrent) || issues[0];
    setFormData({
      issueId: defaultIssue ? String(defaultIssue.id) : '',
      paperId: `NRJBE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      title: '',
      authors: '',
      affiliations: '',
      abstract: '',
      keywords: '',
      doi: 'https://doi.org/10.5281/zenodo.',
      pageRange: '01-12',
      pdfUrl: '',
      certificateUrl: '',
      status: 'Published',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (art: any) => {
    setEditingArticle(art);
    setFormData({
      issueId: String(art.issueId),
      paperId: art.paperId,
      title: art.title,
      authors: art.authors,
      affiliations: art.affiliations || '',
      abstract: art.abstract,
      keywords: art.keywords || '',
      doi: art.doi || '',
      pageRange: art.pageRange || '',
      pdfUrl: art.pdfUrl || '',
      certificateUrl: art.certificateUrl || '',
      status: art.status || 'Published',
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (file: File, field: 'pdfUrl' | 'certificateUrl', type: string) => {
    if (field === 'pdfUrl') setUploadingPdf(true);
    else setUploadingCert(true);

    try {
      const form = new FormData();
      form.append('file', file);
      form.append('type', type);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload file');

      setFormData((prev) => ({ ...prev, [field]: data.url }));
      setSuccess(`${field === 'pdfUrl' ? 'PDF' : 'Certificate'} uploaded successfully!`);
      setTimeout(() => setSuccess(''), 2500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      if (field === 'pdfUrl') setUploadingPdf(false);
      else setUploadingCert(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingArticle) {
        const res = await fetch(`/api/admin/articles/${editingArticle.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to update article');
        setSuccess('Article updated successfully!');
      } else {
        const res = await fetch('/api/admin/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to create article');
        setSuccess('Article published successfully!');
      }

      setModalOpen(false);
      setTimeout(() => setSuccess(''), 2500);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this research article?')) return;
    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete article');
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Filtering
  const filteredArticles = articles.filter((art) => {
    const matchesIssue = selectedIssueId ? art.issueId === Number(selectedIssueId) : true;
    const matchesQuery = searchQuery
      ? art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.paperId.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesIssue && matchesQuery;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-navy-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary-700" />
            <span>Articles &amp; Research Papers Manager</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Publish papers, assign volumes/issues, upload PDFs, attach author certificates, and generate Zenodo DOIs.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Paper</span>
        </button>
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

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">Filter Issue:</label>
          <select
            value={selectedIssueId}
            onChange={(e) => setSelectedIssueId(e.target.value)}
            className="text-xs py-1.5 px-3 border border-slate-300 rounded-lg bg-slate-50 font-medium text-slate-700 w-full sm:w-64"
          >
            <option value="">All Issues ({articles.length} papers)</option>
            {issues.map((iss) => (
              <option key={iss.id} value={iss.id}>
                {iss.title} {iss.isCurrent ? '(Current)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search title, author, Paper ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="p-3.5">Paper ID</th>
                <th className="p-3.5">Title &amp; Authors</th>
                <th className="p-3.5">Issue &amp; Pages</th>
                <th className="p-3.5">Files &amp; DOI</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 align-top">
                      <span className="font-mono font-bold text-primary-800 bg-primary-50 px-2 py-0.5 rounded border border-primary-200">
                        {art.paperId}
                      </span>
                    </td>

                    <td className="p-3.5 align-top max-w-md">
                      <h4 className="font-bold text-slate-900 leading-snug line-clamp-2">
                        {art.title}
                      </h4>
                      <p className="text-slate-600 font-medium mt-1 line-clamp-1">
                        {art.authors}
                      </p>
                      {art.affiliations && (
                        <p className="text-slate-400 text-[11px] italic line-clamp-1 mt-0.5">
                          {art.affiliations}
                        </p>
                      )}
                    </td>

                    <td className="p-3.5 align-top whitespace-nowrap">
                      <span className="font-semibold text-slate-700 block">
                        {art.issue?.title || `Issue #${art.issueId}`}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        Pages: {art.pageRange || 'N/A'}
                      </span>
                    </td>

                    <td className="p-3.5 align-top space-y-1 whitespace-nowrap">
                      {art.doi && (
                        <a
                          href={art.doi}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-mono"
                        >
                          <span>DOI Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <div className="flex items-center gap-2">
                        {art.pdfUrl && (
                          <a
                            href={art.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-primary-700 hover:underline font-semibold"
                          >
                            PDF
                          </a>
                        )}
                        {art.certificateUrl && (
                          <a
                            href={art.certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-amber-700 hover:underline font-semibold"
                          >
                            Cert
                          </a>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5 align-top text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <Link
                          href={`/admin/certificate/article/${art.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-amber-700 hover:bg-amber-50 rounded flex items-center gap-1 text-xs font-semibold"
                          title="Generate & Print Official Author Certificate"
                        >
                          <Award className="w-4 h-4 text-amber-600" />
                          <span className="hidden xl:inline text-[11px]">Cert</span>
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(art)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"
                          title="Edit Paper"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(art.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete Paper"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No articles found matching the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add / Edit Article */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-sm text-navy-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary-700" />
                <span>{editingArticle ? 'Edit Research Article' : 'Publish New Research Article'}</span>
              </h3>
              <button onClick={() => setModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Journal Issue *</label>
                  <select
                    required
                    value={formData.issueId}
                    onChange={(e) => setFormData({ ...formData, issueId: e.target.value })}
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
                  <label className="block font-semibold text-slate-700 mb-1">Paper ID / Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.paperId}
                    onChange={(e) => setFormData({ ...formData, paperId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Full title of the research paper"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Author(s) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Amanpreet Singh, Navneet Seth"
                  value={formData.authors}
                  onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Affiliations / Institutions</label>
                <input
                  type="text"
                  placeholder="e.g. Department of Economics, Panjab University, Chandigarh, India"
                  value={formData.affiliations}
                  onChange={(e) => setFormData({ ...formData, affiliations: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Structured Abstract *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Abstract text..."
                  value={formData.abstract}
                  onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Keywords</label>
                  <input
                    type="text"
                    placeholder="health insurance; financial protection; Punjab"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Page Range (e.g. 01-14)</label>
                  <input
                    type="text"
                    placeholder="01-14"
                    value={formData.pageRange}
                    onChange={(e) => setFormData({ ...formData, pageRange: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Zenodo / CrossRef DOI URL</label>
                <input
                  type="url"
                  placeholder="https://doi.org/10.5281/zenodo.21549492"
                  value={formData.doi}
                  onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg font-mono text-xs"
                />
              </div>

              {/* PDF & Certificate Uploaders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <label className="block font-semibold text-slate-700 mb-1">Research Paper PDF</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFileUpload(f, 'pdfUrl', 'papers');
                    }}
                    className="text-xs file:py-1 file:px-2 file:rounded file:border-0 file:bg-primary-700 file:text-white file:text-xs"
                  />
                  {formData.pdfUrl && (
                    <p className="text-[10px] text-emerald-700 font-mono mt-1 truncate">
                      File: {formData.pdfUrl}
                    </p>
                  )}
                  {uploadingPdf && <p className="text-[10px] text-primary-600 animate-pulse">Uploading PDF...</p>}
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <label className="block font-semibold text-slate-700 mb-1">Author E-Certificate PDF</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFileUpload(f, 'certificateUrl', 'certificates');
                    }}
                    className="text-xs file:py-1 file:px-2 file:rounded file:border-0 file:bg-amber-700 file:text-white file:text-xs"
                  />
                  {formData.certificateUrl && (
                    <p className="text-[10px] text-emerald-700 font-mono mt-1 truncate">
                      File: {formData.certificateUrl}
                    </p>
                  )}
                  {uploadingCert && <p className="text-[10px] text-amber-600 animate-pulse">Uploading Certificate...</p>}
                </div>
              </div>

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
                  {editingArticle ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
