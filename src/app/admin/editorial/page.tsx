'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  Award,
  Building,
} from 'lucide-react';

export default function AdminEditorialPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    department: '',
    institution: '',
    country: 'India',
    role: 'Editorial Board Member',
    email: '',
    photoUrl: '',
    order: 0,
    isEditorInChief: false,
  });

  const fetchMembers = () => {
    setLoading(true);
    fetch('/api/admin/editorial')
      .then((res) => res.json())
      .then((data) => {
        if (data.members) setMembers(data.members);
      })
      .catch((err) => setError('Failed to load editorial members'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleOpenCreate = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      designation: '',
      department: '',
      institution: '',
      country: 'India',
      role: 'Editorial Board Member',
      email: '',
      photoUrl: '',
      order: members.length + 1,
      isEditorInChief: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (m: any) => {
    setEditingMember(m);
    setFormData({
      name: m.name,
      designation: m.designation,
      department: m.department || '',
      institution: m.institution,
      country: m.country || 'India',
      role: m.role || 'Editorial Board Member',
      email: m.email || '',
      photoUrl: m.photoUrl || '',
      order: m.order || 0,
      isEditorInChief: Boolean(m.isEditorInChief),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingMember) {
        const res = await fetch('/api/admin/editorial', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingMember.id, ...formData }),
        });
        if (!res.ok) throw new Error('Failed to update member');
        setSuccess('Member updated successfully!');
      } else {
        const res = await fetch('/api/admin/editorial', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to create member');
        setSuccess('Member created successfully!');
      }

      setModalOpen(false);
      setTimeout(() => setSuccess(''), 2500);
      fetchMembers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this editorial member?')) return;
    try {
      const res = await fetch(`/api/admin/editorial?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete member');
      fetchMembers();
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
            <Users className="w-6 h-6 text-primary-700" />
            <span>Editorial Board Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Add, update, and organize editors, associate editors, and advisory board members.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Board Member</span>
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

      {/* Members Grid / Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {members.map((m) => (
            <div key={m.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-800 font-bold flex items-center justify-center text-xs">
                  {m.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-navy-900">{m.name}</h3>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {m.role}
                    </span>
                    {m.isEditorInChief && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                        Editor-in-Chief
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-primary-800 font-medium">
                    {m.designation} {m.department ? `• ${m.department}` : ''}
                  </p>
                  <p className="text-xs text-slate-500">
                    {m.institution} ({m.country})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(m)}
                  className="p-1.5 text-primary-700 hover:bg-primary-50 rounded"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-sm text-navy-900">
                {editingMember ? 'Edit Editorial Member' : 'Add Editorial Member'}
              </h3>
              <button onClick={() => setModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name &amp; Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Harvinder S. Sandhu"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Designation *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Professor & Dean"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  placeholder="e.g. University Business School (UBS)"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Institution *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Guru Nanak Dev University"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    placeholder="India"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role / Committee</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="Editor-in-Chief">Editor-in-Chief</option>
                  <option value="Associate Editor">Associate Editor</option>
                  <option value="International Advisory Board">International Advisory Board</option>
                  <option value="Editorial Board Member">Editorial Board Member</option>
                  <option value="Reviewer">Reviewer</option>
                </select>
              </div>

              <div className="space-y-2 pt-2 border-t">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isEditorInChief}
                    onChange={(e) => setFormData({ ...formData, isEditorInChief: e.target.checked })}
                    className="rounded text-primary-600"
                  />
                  <span className="text-slate-700 font-bold">Mark as Editor-in-Chief</span>
                </label>
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
                  className="px-5 py-2 bg-primary-700 text-white font-semibold rounded-lg shadow-sm"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
