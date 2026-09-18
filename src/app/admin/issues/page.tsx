'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  Star,
  BookOpen,
  Calendar,
} from 'lucide-react';

export default function AdminIssuesPage() {
  const [volumes, setVolumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Volume modal state
  const [volModalOpen, setVolModalOpen] = useState(false);
  const [editingVol, setEditingVol] = useState<any>(null);
  const [volForm, setVolForm] = useState({
    volumeNumber: 12,
    year: 2026,
    title: '',
    description: '',
  });

  // Issue modal state
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<any>(null);
  const [issueForm, setIssueForm] = useState({
    volumeId: '',
    issueNumber: '1',
    title: '',
    monthYear: '',
    coverImage: '',
    printPrice: 450,
    isCurrent: false,
    isSpecial: false,
    status: 'Published',
  });

  const fetchData = () => {
    setLoading(true);
    fetch('/api/admin/volumes')
      .then((res) => res.json())
      .then((data) => {
        if (data.volumes) setVolumes(data.volumes);
      })
      .catch((err) => setError('Failed to load volumes and issues'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCoverUpload = async (file: File) => {
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('type', 'covers');
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload cover');
      setIssueForm((prev) => ({ ...prev, coverImage: data.url }));
      setSuccess('Cover image uploaded successfully!');
      setTimeout(() => setSuccess(''), 2500);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleOpenVolModal = (vol?: any) => {
    if (vol) {
      setEditingVol(vol);
      setVolForm({
        volumeNumber: vol.volumeNumber,
        year: vol.year,
        title: vol.title,
        description: vol.description || '',
      });
    } else {
      setEditingVol(null);
      const nextNum = volumes.length > 0 ? Math.max(...volumes.map((v) => v.volumeNumber)) + 1 : 12;
      const nextYear = new Date().getFullYear();
      setVolForm({
        volumeNumber: nextNum,
        year: nextYear,
        title: `Volume ${nextNum} (${nextYear})`,
        description: '',
      });
    }
    setVolModalOpen(true);
  };

  const handleOpenIssueModal = (defaultVolId?: number, issue?: any) => {
    if (issue) {
      setEditingIssue(issue);
      setIssueForm({
        volumeId: String(issue.volumeId),
        issueNumber: issue.issueNumber,
        title: issue.title,
        monthYear: issue.monthYear || '',
        coverImage: issue.coverImage || '',
        printPrice: issue.printPrice || 450,
        isCurrent: Boolean(issue.isCurrent),
        isSpecial: Boolean(issue.isSpecial),
        status: issue.status || 'Published',
      });
    } else {
      setEditingIssue(null);
      const targetVol = volumes.find((v) => v.id === defaultVolId) || volumes[0];
      setIssueForm({
        volumeId: targetVol ? String(targetVol.id) : '',
        issueNumber: '2',
        title: targetVol ? `${targetVol.title}, Issue 2` : 'New Issue',
        monthYear: 'July - December 2026',
        coverImage: '',
        printPrice: 450,
        isCurrent: false,
        isSpecial: false,
        status: 'Published',
      });
    }
    setIssueModalOpen(true);
  };

  const handleVolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVol) {
        const res = await fetch('/api/admin/volumes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingVol.id, ...volForm }),
        });
        if (!res.ok) throw new Error('Failed to update volume');
        setSuccess('Volume updated successfully');
      } else {
        const res = await fetch('/api/admin/volumes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(volForm),
        });
        if (!res.ok) throw new Error('Failed to create volume');
        setSuccess('Volume created successfully');
      }

      setVolModalOpen(false);
      setTimeout(() => setSuccess(''), 2500);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingIssue) {
        const res = await fetch('/api/admin/issues', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingIssue.id, ...issueForm }),
        });
        if (!res.ok) throw new Error('Failed to update issue');
        setSuccess('Issue updated successfully');
      } else {
        const res = await fetch('/api/admin/issues', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(issueForm),
        });
        if (!res.ok) throw new Error('Failed to create issue');
        setSuccess('Issue created successfully');
      }

      setIssueModalOpen(false);
      setTimeout(() => setSuccess(''), 2500);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSetCurrentIssue = async (issueId: number) => {
    try {
      const res = await fetch('/api/admin/issues', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: issueId, isCurrent: true }),
      });
      if (!res.ok) throw new Error('Failed to set current issue');
      setSuccess('Current active issue updated successfully');
      setTimeout(() => setSuccess(''), 2500);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteVolume = async (id: number) => {
    if (!confirm('Are you sure you want to delete this volume and all associated issues and papers?')) return;
    try {
      const res = await fetch(`/api/admin/volumes?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete volume');
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteIssue = async (id: number) => {
    if (!confirm('Are you sure you want to delete this issue and all its published papers?')) return;
    try {
      const res = await fetch(`/api/admin/issues?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete issue');
      fetchData();
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
            <Layers className="w-6 h-6 text-primary-700" />
            <span>Volumes &amp; Issues Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize annual journal volumes, create quarterly/biannual issues, and designate the current active issue.
          </p>
        </div>

        <button
          onClick={() => handleOpenVolModal()}
          className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Volume</span>
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

      {/* Volumes List */}
      <div className="space-y-6">
        {volumes.map((vol) => (
          <div key={vol.id} className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Volume Title Bar */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-amber-400" />
                <div>
                  <h2 className="font-serif font-bold text-base">{vol.title}</h2>
                  <span className="text-xs text-slate-400">
                    Volume {vol.volumeNumber} • Year: {vol.year}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenIssueModal(vol.id)}
                  className="px-3 py-1.5 bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Issue</span>
                </button>
                <button
                  onClick={() => handleOpenVolModal(vol)}
                  className="p-1.5 text-slate-400 hover:text-white rounded"
                  title="Edit Volume"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteVolume(vol.id)}
                  className="p-1.5 text-rose-400 hover:text-rose-300 rounded"
                  title="Delete Volume"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Issues inside Volume */}
            <div className="p-4 divide-y divide-slate-100">
              {vol.issues && vol.issues.length > 0 ? (
                vol.issues.map((iss: any) => (
                  <div
                    key={iss.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-primary-800 bg-primary-50 px-2 py-0.5 rounded">
                          Issue {iss.issueNumber}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{iss.title}</h4>
                        {iss.isCurrent && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded flex items-center gap-1">
                            <Star className="w-3 h-3 fill-emerald-600" />
                            <span>Active / Current Issue</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Period: {iss.monthYear || 'Published'} • {iss._count?.articles || 0} Research Papers
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {!iss.isCurrent && (
                        <button
                          onClick={() => handleSetCurrentIssue(iss.id)}
                          className="px-2.5 py-1 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded font-semibold transition-colors"
                        >
                          Make Current
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenIssueModal(vol.id, iss)}
                        className="p-1.5 text-slate-600 hover:bg-slate-100 rounded text-xs"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteIssue(iss.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded text-xs"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-xs text-slate-400">
                  No issues created in this volume yet. Click &quot;Add Issue&quot; above.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Volume Modal */}
      {volModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-sm text-navy-900">
                {editingVol ? 'Edit Volume' : 'Create Volume'}
              </h3>
              <button onClick={() => setVolModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleVolSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Volume Number *</label>
                <input
                  type="number"
                  required
                  value={volForm.volumeNumber}
                  onChange={(e) => setVolForm({ ...volForm, volumeNumber: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Year *</label>
                <input
                  type="number"
                  required
                  value={volForm.year}
                  onChange={(e) => setVolForm({ ...volForm, year: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={volForm.title}
                  onChange={(e) => setVolForm({ ...volForm, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setVolModalOpen(false)}
                  className="px-4 py-2 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-700 text-white font-semibold rounded-lg"
                >
                  {editingVol ? 'Save Volume' : 'Create Volume'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Issue Modal */}
      {issueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-sm text-navy-900">
                {editingIssue ? 'Edit Issue' : 'Create Issue'}
              </h3>
              <button onClick={() => setIssueModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleIssueSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Volume *</label>
                <select
                  value={issueForm.volumeId}
                  onChange={(e) => setIssueForm({ ...issueForm, volumeId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  {volumes.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Issue Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 or 2 or Special"
                    value={issueForm.issueNumber}
                    onChange={(e) => setIssueForm({ ...issueForm, issueNumber: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Period (Month-Year)</label>
                  <input
                    type="text"
                    placeholder="Jan - Jun 2026"
                    value={issueForm.monthYear}
                    onChange={(e) => setIssueForm({ ...issueForm, monthYear: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Issue Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Volume 12, Issue 1 (January - June 2026)"
                  value={issueForm.title}
                  onChange={(e) => setIssueForm({ ...issueForm, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Physical Hardcopy Print Price (INR) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="450"
                  value={issueForm.printPrice}
                  onChange={(e) => setIssueForm({ ...issueForm, printPrice: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Price charged when visitors buy a single physical magazine copy from the store (default: ₹450).
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <label className="block font-semibold text-slate-700 text-xs">
                  Magazine Cover Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleCoverUpload(f);
                  }}
                  className="text-xs file:py-1 file:px-2.5 file:rounded file:border-0 file:bg-primary-700 file:text-white file:text-xs"
                />
                {issueForm.coverImage && (
                  <div className="flex items-center gap-3 pt-1">
                    <img
                      src={issueForm.coverImage}
                      alt="Cover Preview"
                      className="w-12 h-16 object-cover rounded border border-slate-300 shadow-xs"
                    />
                    <span className="text-[10px] text-emerald-700 font-mono truncate">
                      {issueForm.coverImage}
                    </span>
                  </div>
                )}
                <span className="text-[10px] text-slate-400 block">
                  Upload a custom front cover image (JPG or PNG). If omitted, an elegant 3D journal cover is generated automatically.
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={issueForm.isCurrent}
                    onChange={(e) => setIssueForm({ ...issueForm, isCurrent: e.target.checked })}
                    className="rounded text-primary-600"
                  />
                  <span className="text-slate-700 font-bold">Set as Current Active Issue</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={issueForm.isSpecial}
                    onChange={(e) => setIssueForm({ ...issueForm, isSpecial: e.target.checked })}
                    className="rounded text-primary-600"
                  />
                  <span className="text-slate-700">Special Issue / Conference Proceeding</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIssueModalOpen(false)}
                  className="px-4 py-2 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-700 text-white font-semibold rounded-lg"
                >
                  {editingIssue ? 'Save Changes' : 'Create Issue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
