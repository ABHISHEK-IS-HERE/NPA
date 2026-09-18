'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  CheckCircle2,
  Phone,
  Mail,
  Building,
  ShieldCheck,
  Award,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function SubscribePage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    subscriberName: '',
    organization: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMode: 'Bank Transfer / Cheque / UPI',
    notes: '',
  });

  useEffect(() => {
    fetch('/api/admin/subscriptions/plans')
      .then((res) => res.json())
      .then((data) => {
        if (data.plans && data.plans.length > 0) {
          setPlans(data.plans);
          const popular = data.plans.find((p: any) => p.isPopular) || data.plans[0];
          setSelectedPlan(popular);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) {
      setError('Please select a subscription package.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          planTitle: selectedPlan.title,
          amount: selectedPlan.priceInr,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit subscription order');

      setOrderSuccess(`Subscription Order #${data.orderId} Created Successfully!`);
    } catch (err: any) {
      setError(err.message || 'Error creating order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 bg-slate-50 min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 max-w-4xl mx-auto text-center">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Journal Circulation
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-navy-900 mt-2">
            Subscribe to NRJBE
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-3 max-w-2xl mx-auto leading-relaxed">
            We request institutions, universities, and scholars to subscribe to our journals for the noble cause of spreading knowledge, wisdom, and protecting intellectual property rights of researchers worldwide.
          </p>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-primary-600" />
              <span>Helpline: +91-9888934889, 7986925354</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-primary-600" />
              <span>editornrjbe@gmail.com</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isSelected = selectedPlan?.id === plan.id;
            let features: string[] = [];
            try {
              features = JSON.parse(plan.featuresJson);
            } catch {
              features = [];
            }

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`relative bg-white rounded-2xl p-6 sm:p-8 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-primary-600 shadow-xl ring-2 ring-primary-500/20'
                    : 'border-slate-200 shadow-sm hover:border-slate-300'
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-navy-950 font-extrabold text-[11px] uppercase tracking-wider px-3 py-0.5 rounded-full shadow">
                    Most Popular
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded">
                      {plan.planType}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{plan.format}</span>
                  </div>

                  <h2 className="text-lg font-serif font-bold text-navy-900 mt-1">
                    {plan.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Duration: {plan.duration}</p>

                  <div className="mt-4 mb-6">
                    <span className="text-3xl font-extrabold text-navy-900">
                      ₹{plan.priceInr}
                    </span>
                    <span className="text-xs text-slate-500 font-medium ml-1">INR</span>
                    {plan.priceUsd && (
                      <span className="text-xs text-slate-400 block mt-0.5">
                        International: ${plan.priceUsd} USD
                      </span>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-600">
                    {features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <button
                    type="button"
                    className={`w-full py-2.5 rounded-lg text-xs font-bold transition-colors ${
                      isSelected
                        ? 'bg-primary-700 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? 'Selected Package ✓' : 'Select Package'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Subscription Request Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10 max-w-3xl mx-auto">
          <div className="border-b border-slate-200 pb-4 mb-6">
            <h2 className="text-xl font-serif font-bold text-navy-900">
              Subscription &amp; Delivery Order Request
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Selected Tier:{' '}
              <strong className="text-primary-700">
                {selectedPlan ? `${selectedPlan.title} (₹${selectedPlan.priceInr})` : 'None'}
              </strong>
            </p>
          </div>

          {orderSuccess ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-emerald-900">{orderSuccess}</h3>
              <p className="text-xs text-emerald-700 max-w-md mx-auto">
                Thank you for subscribing to NRJBE. Our circulation coordinator will email you the official tax invoice and electronic bank transfer / UPI instructions.
              </p>
              <button
                onClick={() => setOrderSuccess(null)}
                className="mt-4 px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg"
              >
                Place Another Subscription
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subscriber / Librarian Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={formData.subscriberName}
                    onChange={(e) => setFormData({ ...formData, subscriberName: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Institution / University / Company
                  </label>
                  <input
                    type="text"
                    placeholder="Name of college or department"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="official@institution.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9888934889"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Complete Postal Dispatch Address (for Print Copies &amp; Invoice) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Full street address, campus / department name..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State &amp; Pincode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="PIN"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {loading
                      ? 'Processing Subscription...'
                      : `Confirm & Submit Subscription Request (₹${selectedPlan?.priceInr || 3500})`}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
