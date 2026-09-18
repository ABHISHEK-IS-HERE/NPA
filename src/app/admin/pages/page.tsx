'use client';

import React, { useState, useEffect } from 'react';
import {
  FileCode,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Eye,
  FileText,
} from 'lucide-react';

export default function AdminPagesPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    subtitle: '',
    contentHtml: '',
    metaDescription: '',
    isPublished: true,
  });

  const fetchPages = () => {
    setLoading(true);
    fetch('/api/admin/pages')
      .then((res) => res.json())
      .then((data) => {
        if (data.pages) setPages(data.pages);
      })
      .catch((err) => setError('Failed to load pages'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleOpenCreate = () => {
    setEditingPage(null);
    setFormData({
      slug: '',
      title: '',
      subtitle: '',
      contentHtml: `<h3>Heading</h3>\n<p>Enter detailed policy or page content here...</p>`,
      metaDescription: '',
      isPublished: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (pg: any) => {
    setEditingPage(pg);
    setFormData({
      slug: pg.slug,
      title: pg.title,
      subtitle: pg.subtitle || '',
      contentHtml: pg.contentHtml,
      metaDescription: pg.metaDescription || '',
      isPublished: Boolean(pg.isPublished),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingPage) {
        const res = await fetch(`/api/admin/pages/${editingPage.slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to update page');
        setSuccess('Page updated successfully!');
      } else {
        const res = await fetch('/api/admin/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to create page');
        setSuccess('Page created successfully!');
      }

      setModalOpen(false);
      setTimeout(() => setSuccess(''), 2500);
      fetchPages();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete the page "${slug}"?`)) return;
    try {
      const res = await fetch(`/api/admin/pages/${slug}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete page');
      fetchPages();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-navy-900 flex items-center gap-2">
            <FileCode className="w-6 h-6 text-primary-700" />
            <span>CMS Pages &amp; Policy Guidelines</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Edit existing editorial policies, author instructions, FAQs, or create brand-new custom pages.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Page</span>
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

      {/* Pages List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {pages.map((pg) => (
            <div key={pg.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-navy-900">{pg.title}</h3>
                  <code className="text-xs text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded">
                    /page/{pg.slug}
                  </code>
                </div>
                {pg.subtitle && (
                  <p className="text-xs text-slate-500">{pg.subtitle}</p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={`/page/${pg.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded text-xs inline-flex items-center gap-1"
                  title="View Live Page"
                >
                  <Eye className="w-4 h-4" />
                </a>

                <button
                  onClick={() => handleOpenEdit(pg)}
                  className="p-1.5 text-primary-700 hover:bg-primary-50 rounded"
                  title="Edit Page"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(pg.slug)}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                  title="Delete Page"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit / Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-sm text-navy-900">
                {editingPage ? `Edit Page: ${editingPage.title}` : 'Create New CMS Page'}
              </h3>
              <button onClick={() => setModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Page Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Special Issue Guidelines 2026"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs sm:text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingPage}
                    placeholder="special-issue-guidelines"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg font-mono text-xs disabled:bg-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subtitle / Summary</label>
                <input
                  type="text"
                  placeholder="Optional header subtitle description"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Page Content (HTML supported) *
                </label>
                <textarea
                  rows={12}
                  required
                  value={formData.contentHtml}
                  onChange={(e) => setFormData({ ...formData, contentHtml: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg font-mono text-xs leading-relaxed"
                />
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
                  {editingPage ? 'Save Changes' : 'Publish Page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
