'use client';

import React, { useState, useEffect } from 'react';
import {
  Menu,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ExternalLink,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  ArrowUpDown,
} from 'lucide-react';

interface NavChild {
  id: number;
  label: string;
  path: string;
  isExternal: boolean;
  openInNewTab: boolean;
  order: number;
  isActive: boolean;
}

interface NavItem {
  id: number;
  label: string;
  path: string;
  isExternal: boolean;
  openInNewTab: boolean;
  order: number;
  isActive: boolean;
  children?: NavChild[];
}

export default function AdminNavigationPage() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    label: '',
    path: '',
    parentId: '',
    isExternal: false,
    openInNewTab: false,
    order: 0,
    isActive: true,
  });

  const fetchNav = () => {
    setLoading(true);
    fetch('/api/admin/navigation')
      .then((res) => res.json())
      .then((data) => {
        if (data.items) setItems(data.items);
      })
      .catch((err) => setError('Failed to load navigation items'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNav();
  }, []);

  const handleOpenAdd = (parentId?: number) => {
    setEditingItem(null);
    setFormData({
      label: '',
      path: '',
      parentId: parentId ? String(parentId) : '',
      isExternal: false,
      openInNewTab: false,
      order: items.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      label: item.label,
      path: item.path,
      parentId: item.parentId ? String(item.parentId) : '',
      isExternal: Boolean(item.isExternal),
      openInNewTab: Boolean(item.openInNewTab),
      order: item.order || 0,
      isActive: item.isActive !== undefined ? Boolean(item.isActive) : true,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this navigation item and any nested dropdown links?')) return;
    try {
      const res = await fetch(`/api/admin/navigation?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete item');
      setSuccess('Navigation item deleted');
      setTimeout(() => setSuccess(''), 2500);
      fetchNav();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const payload = {
      ...formData,
      parentId: formData.parentId ? Number(formData.parentId) : null,
      order: Number(formData.order),
    };

    try {
      if (editingItem) {
        const res = await fetch('/api/admin/navigation', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingItem.id, ...payload }),
        });
        if (!res.ok) throw new Error('Failed to update navigation item');
        setSuccess('Navigation item updated');
      } else {
        const res = await fetch('/api/admin/navigation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to create navigation item');
        setSuccess('Navigation item created');
      }

      setModalOpen(false);
      setTimeout(() => setSuccess(''), 2500);
      fetchNav();
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
            <Menu className="w-6 h-6 text-primary-700" />
            <span>Navigation Menu Builder</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Add, reorder, edit, and organize top-level navbar links and nested dropdown options.
          </p>
        </div>

        <button
          onClick={() => handleOpenAdd()}
          className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Top-Level Menu</span>
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

      {/* Navigation Tree Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-600 uppercase tracking-wider">
          <span>Menu Item &amp; Structure</span>
          <div className="flex items-center gap-12 pr-4">
            <span>Destination Route / URL</span>
            <span>Order</span>
            <span>Actions</span>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {items.map((item) => (
            <div key={item.id} className="p-3 hover:bg-slate-50 transition-colors space-y-2">
              {/* Parent Row */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded bg-primary-50 text-primary-800 flex items-center justify-center font-bold text-xs">
                    {item.order}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{item.label}</span>
                    {item.children && item.children.length > 0 && (
                      <span className="ml-2 text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">
                        {item.children.length} Dropdown Options
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <code className="text-xs text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded border border-slate-200 max-w-xs truncate">
                    {item.path}
                  </code>

                  <span className="text-xs text-slate-400 font-mono w-6 text-center">
                    {item.order}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenAdd(item.id)}
                      title="Add Dropdown Child"
                      className="p-1.5 text-xs text-primary-700 hover:bg-primary-50 rounded"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(item)}
                      title="Edit Item"
                      className="p-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      title="Delete Item"
                      className="p-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Child Submenu Items */}
              {item.children && item.children.length > 0 && (
                <div className="pl-8 pt-1 space-y-1">
                  {item.children.map((child) => (
                    <div
                      key={child.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50/70 border border-slate-200/60 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">&bull;</span>
                        <span className="font-semibold text-slate-800">{child.label}</span>
                      </div>

                      <div className="flex items-center gap-6">
                        <code className="text-[11px] text-slate-500 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                          {child.path}
                        </code>

                        <span className="text-[11px] text-slate-400 font-mono w-6 text-center">
                          {child.order}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(child)}
                            className="p-1 text-slate-600 hover:bg-white rounded"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(child.id)}
                            className="p-1 text-rose-600 hover:bg-white rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-sm text-navy-900">
                {editingItem ? 'Edit Navigation Item' : 'Add Navigation Item'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Menu Display Label *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Special Issues / Guidelines"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Destination URL / Path *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /current-issue or /page/peer-review-process or https://..."
                  value={formData.path}
                  onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Use # for parent dropdown headers with no direct link.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Parent Menu (Optional for Dropdown Children)
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white"
                >
                  <option value="">None (Top-Level Menu Bar)</option>
                  {items.map((it) => (
                    <option key={it.id} value={it.id}>
                      {it.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Display Order Position
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.openInNewTab}
                    onChange={(e) => setFormData({ ...formData, openInNewTab: e.target.checked })}
                    className="rounded text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-slate-700 font-medium">Open in new browser tab</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-slate-700 font-medium">Item Active &amp; Visible in Navbar</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-700 hover:bg-primary-800 text-white font-semibold rounded-lg shadow-sm"
                >
                  {editingItem ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
