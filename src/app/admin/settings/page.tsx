'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  Building,
  Phone,
  DollarSign,
  Sparkles,
  Award,
  HelpCircle,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'contacts' | 'pricing' | 'journal' | 'banner'>('contacts');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch((err) => setError('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setSettings((prev: any) => ({ ...prev, [name]: checked }));
    } else {
      setSettings((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save settings');

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err: any) {
      setError(err.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-navy-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary-700" />
            <span>Website Settings &amp; Information</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Select a tab below to update phone numbers, journal prices, editorial details, or top banner text.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <div>
            <strong className="block font-bold">Successfully Saved!</strong>
            <span>Your changes have been updated and are immediately live across the entire website.</span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs Selection Bar */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('contacts')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'contacts'
              ? 'border-primary-700 text-primary-800 bg-primary-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Phone className="w-4 h-4 text-blue-600" />
          <span>1. Phone Numbers &amp; Email</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pricing')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'pricing'
              ? 'border-primary-700 text-primary-800 bg-primary-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <span>2. Prices &amp; Subscriptions</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('journal')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'journal'
              ? 'border-primary-700 text-primary-800 bg-primary-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4 h-4 text-amber-600" />
          <span>3. Journal Details &amp; ISSN</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('banner')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'banner'
              ? 'border-primary-700 text-primary-800 bg-primary-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>4. Top Banner &amp; Announcements</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TAB 1: CONTACTS */}
        {activeTab === 'contacts' && (
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div>
              <h2 className="text-sm font-bold text-navy-900">
                Contact Numbers, Email &amp; Office Address
              </h2>
              <p className="text-xs text-slate-500">
                These contact details appear on the website top bar, header, contact page, and footer.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Mobile / Office Phone *
                </label>
                <input
                  type="text"
                  name="contactPhone"
                  value={settings.contactPhone || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none font-medium"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Example: +91-9888934889 (displayed on top bar &amp; footer)
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alternate Phone Number
                </label>
                <input
                  type="text"
                  name="contactPhoneAlt"
                  value={settings.contactPhoneAlt || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Example: +91-7986925354
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp Helpline (Digits only with 91 country code) *
                </label>
                <input
                  type="text"
                  name="whatsappNumber"
                  value={settings.whatsappNumber || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none font-mono"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Example: 919888934889 (clicking WhatsApp button on site opens this chat)
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Editorial Email Address *
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={settings.contactEmail || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Example: editornrjbe@gmail.com
                </span>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Publishing &amp; Dispatch Office Address
                </label>
                <textarea
                  rows={2}
                  name="address"
                  value={settings.address || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  The postal dispatch and publisher address displayed on official invoices and footer.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Publisher Organization Name
                </label>
                <input
                  type="text"
                  name="publisherName"
                  value={settings.publisherName || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Publisher Main Website URL
                </label>
                <input
                  type="url"
                  name="publisherUrl"
                  value={settings.publisherUrl || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRICING */}
        {activeTab === 'pricing' && (
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div>
              <h2 className="text-sm font-bold text-navy-900">
                Journal Issue Prices &amp; Subscription Fees
              </h2>
              <p className="text-xs text-slate-500">
                Configure standard pricing for physical magazine copies, annual subscriptions, and author publication fees.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Annual Subscription Fee (Displayed on website)
                </label>
                <input
                  type="text"
                  name="subscriptionPrice"
                  value={settings.subscriptionPrice || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg font-semibold"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Example: 3500/- (Bi-Annual) or ₹3,500/Year
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  APC Fee - Online Publication Only
                </label>
                <input
                  type="text"
                  name="apcOnline"
                  value={settings.apcOnline || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Example: 1800 INR (charged to authors for DOI &amp; open-access hosting)
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  APC Bundle - Online + Hard Copy Print Edition + Certificate
                </label>
                <input
                  type="text"
                  name="apcPrint"
                  value={settings.apcPrint || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Example: 2300 INR (includes mailing printed magazine &amp; certificate)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: JOURNAL IDENTITY */}
        {activeTab === 'journal' && (
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div>
              <h2 className="text-sm font-bold text-navy-900">
                Journal Name, ISSN &amp; Peer Review Parameters
              </h2>
              <p className="text-xs text-slate-500">
                Official academic registration information displayed on paper PDFs and header.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Journal Title *
                </label>
                <input
                  type="text"
                  name="journalName"
                  value={settings.journalName || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg font-serif font-bold text-navy-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Short Name / Acronym *
                </label>
                <input
                  type="text"
                  name="shortName"
                  value={settings.shortName || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ISSN Number *
                </label>
                <input
                  type="text"
                  name="issn"
                  value={settings.issn || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Impact Factor *
                </label>
                <input
                  type="text"
                  name="impactFactor"
                  value={settings.impactFactor || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg text-amber-700 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Publication Frequency
                </label>
                <input
                  type="text"
                  name="frequency"
                  value={settings.frequency || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Peer Review Type
                </label>
                <input
                  type="text"
                  name="peerReviewType"
                  value={settings.peerReviewType || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Permitted Plagiarism Limit
                </label>
                <input
                  type="text"
                  name="plagiarismLimit"
                  value={settings.plagiarismLimit || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Permitted AI Content Limit
                </label>
                <input
                  type="text"
                  name="aiContentLimit"
                  value={settings.aiContentLimit || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BANNER & ANNOUNCEMENTS */}
        {activeTab === 'banner' && (
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div>
              <h2 className="text-sm font-bold text-navy-900">
                Top Announcement Ticker &amp; Hero Texts
              </h2>
              <p className="text-xs text-slate-500">
                Control the announcement ticker that scrolls across the very top of the website.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Top Scrolling Announcement Text
                </label>
                <textarea
                  rows={2}
                  name="bannerText"
                  value={settings.bannerText || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Example: CALL FOR PAPERS 2026 (July-December) - Fast-Track Review &amp; DOI Assignment Available! Submit Your Manuscript Today.
                </span>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  name="bannerActive"
                  checked={Boolean(settings.bannerActive)}
                  onChange={handleChange}
                  className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-slate-800">
                  Enable and show the top scrolling announcement ticker on the website
                </span>
              </label>

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Homepage Hero Heading
                </label>
                <input
                  type="text"
                  name="heroTitle"
                  value={settings.heroTitle || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Homepage Hero Paragraph
                </label>
                <textarea
                  rows={2}
                  name="heroSubtitle"
                  value={settings.heroSubtitle || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Big Save Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary-700 hover:bg-primary-800 text-white font-bold text-sm py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Your Changes...' : 'Save and Publish All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
