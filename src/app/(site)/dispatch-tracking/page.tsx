'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Truck,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Package,
  MapPin,
  Calendar,
  Building,
  ArrowRight,
  Phone,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export default function DispatchTrackingPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || searchParams.get('order') || '';

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState('');
  const [claimModalOpen, setClaimModalOpen] = useState(false);

  const fetchOrder = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`/api/orders?query=${encodeURIComponent(searchTerm.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'No active order or dispatch record found.');
      }

      setOrder(data.order);
    } catch (err: any) {
      setError(err.message || 'Failed to locate order.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      fetchOrder(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(query);
  };

  // Parse items list
  let itemsList: any[] = [];
  if (order?.itemsJson) {
    try {
      itemsList = JSON.parse(order.itemsJson);
    } catch (e) {
      itemsList = [];
    }
  }

  const orderNum = order ? `NRJBE-ORD-${order.id.toString().padStart(4, '0')}` : '';

  const waClaimText = order
    ? encodeURIComponent(
        `Hello NPA Dispatch & Logistics Desk, I am claiming assistance/replacement for my Order #${order.id} (${orderNum}). Subscriber: ${order.subscriberName}. Phone: ${order.phone}. Delivery Address: ${order.address}, ${order.city || ''}, ${order.pincode || ''}. Tracking Number: ${order.trackingNumber || 'Not Yet Dispatched'}. Please update on delivery status.`
      )
    : '';

  return (
    <div className="py-10 bg-slate-50 min-h-[75vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Search Box */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 text-center max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center mx-auto mb-3">
            <Truck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
            Speed Post Dispatch &amp; Transit Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Track the postal delivery status of your print journal issues, subscriptions, and author certificates dispatched via <strong>India Post Speed Post</strong>.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-6 flex gap-2">
            <input
              type="text"
              required
              placeholder="Enter Order # (e.g. 1 or NRJBE-ORD-0001) or Registered Phone"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none font-mono"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-700 hover:bg-primary-800 text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 flex-shrink-0 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Tracking...' : 'Track'}</span>
            </button>
          </form>

          {/* Sample Query Link */}
          <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <span>Try sample order:</span>
            <button
              type="button"
              onClick={() => {
                setQuery('1');
                fetchOrder('1');
              }}
              className="font-mono text-primary-700 hover:underline bg-slate-100 px-2 py-0.5 rounded border border-slate-200"
            >
              Order #1 (NRJBE-ORD-0001)
            </button>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2 max-w-2xl mx-auto animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Order Dispatch Details */}
        {order && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6 animate-in fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-xs text-primary-800 bg-primary-50 px-2.5 py-0.5 rounded border border-primary-200">
                    {orderNum}
                  </span>
                  <span className="text-xs text-slate-400">
                    Booked on {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-navy-950">
                  {order.subscriberName}
                </h2>
                {order.organization && (
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">
                    {order.organization}
                  </p>
                )}
              </div>

              <div className="flex sm:flex-col items-start sm:items-end gap-1 flex-shrink-0">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  Dispatch Status:
                </span>
                <span
                  className={`text-xs font-bold uppercase px-3.5 py-1 rounded-full border ${
                    order.status === 'Dispatched'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : order.status === 'Delivered'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            {/* India Post Speed Post Consignment Box */}
            {order.trackingNumber ? (
              <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-xl border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded">
                    India Post Speed Post Consignment
                  </span>
                  <h3 className="font-mono text-lg font-bold text-navy-950 pt-1">
                    {order.trackingNumber}
                  </h3>
                  <p className="text-xs text-slate-600">
                    Dispatched from NPA Central Publishing Warehouse directly to your postal address.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx?consignmentNo=${order.trackingNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
                  >
                    <span>Track on India Post</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <span>
                  Your order is currently being printed and bound for packaging. India Post Speed Post tracking number will be logged here within 24–48 hours of dispatch.
                </span>
              </div>
            )}

            {/* Items Dispatched & Delivery Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-navy-950 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-primary-700" />
                  <span>Items in This Consignment</span>
                </h4>
                {itemsList.length > 0 ? (
                  <ul className="divide-y divide-slate-200 text-slate-700">
                    {itemsList.map((it: any, idx: number) => (
                      <li key={idx} className="py-1.5 flex justify-between">
                        <span>{it.title}</span>
                        <span className="font-mono text-slate-500 font-semibold">Qty: {it.quantity}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-700">{order.planTitle}</p>
                )}
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-navy-950 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary-700" />
                  <span>Destination Address</span>
                </h4>
                <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                  {order.address}
                  {order.city ? `, ${order.city}` : ''}
                  {order.state ? `, ${order.state}` : ''}
                  {order.pincode ? ` - ${order.pincode}` : ''}
                </p>
                <p className="text-slate-500 pt-1 font-semibold">Contact Phone: {order.phone}</p>
              </div>
            </div>

            {/* Zero-Loss Transit Guarantee & Missing Issue Claim CTA */}
            <div className="bg-emerald-50/70 p-5 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>National Press Associates Zero-Loss Delivery Guarantee</span>
                </span>
                <p className="text-slate-600 leading-relaxed max-w-xl">
                  If your print copy is delayed past 10 working days, damaged in transit, or untraceable by India Post, we dispatch a fresh complimentary replacement issue immediately.
                </p>
              </div>

              <a
                href={`https://wa.me/919888934889?text=${waClaimText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors flex-shrink-0 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Claim Free Replacement</span>
              </a>
            </div>
          </div>
        )}

        {/* General Logistics Help FAQ */}
        <div className="bg-slate-100 p-6 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-3">
          <h4 className="font-bold text-navy-900 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-primary-700" />
            <span>Frequently Asked Questions Regarding Postal Dispatches</span>
          </h4>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>How long does Speed Post take?</strong> Domestic postal transit across Indian university campuses and towns typically takes 3 to 7 working days from dispatch.
            </li>
            <li>
              <strong>Where do I find my Tracking Number?</strong> Once dispatched, the India Post consignment number is emailed and messaged via WhatsApp to your registered mobile number.
            </li>
            <li>
              <strong>Direct Support Desk:</strong> Contact our Logistics Manager at{' '}
              <a href="tel:+919888934889" className="text-primary-700 font-bold hover:underline">
                +91-9888934889
              </a>{' '}
              or email{' '}
              <a href="mailto:editornrjbe@gmail.com" className="text-primary-700 font-bold hover:underline">
                editornrjbe@gmail.com
              </a>.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
