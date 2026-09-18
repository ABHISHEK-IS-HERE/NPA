'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Building,
  Plus,
  Edit2,
  Trash2,
  X,
  Mail,
  Phone,
  Truck,
  ExternalLink,
  MessageCircle,
  Save,
  ShoppingBag,
} from 'lucide-react';

export default function AdminSubscriptionsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [trackingInputs, setTrackingInputs] = useState<Record<number, string>>({});

  // Plan modal state
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [planForm, setPlanForm] = useState({
    title: '',
    planType: 'Individual',
    format: 'Print + Online',
    duration: '1 Year (2 Issues)',
    priceInr: 3500,
    priceUsd: 130,
    featuresJson: '["Full digital archive access", "Printed journal copies"]',
    isPopular: false,
  });

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/admin/subscriptions').then((r) => r.json()),
      fetch('/api/admin/subscriptions/plans').then((r) => r.json()),
    ])
      .then(([ordData, plData]) => {
        if (ordData.orders) {
          setOrders(ordData.orders);
          // Initialize tracking inputs
          const tMap: Record<number, string> = {};
          ordData.orders.forEach((o: any) => {
            if (o.trackingNumber) tMap[o.id] = o.trackingNumber;
          });
          setTrackingInputs(tMap);
        }
        if (plData.plans) setPlans(plData.plans);
      })
      .catch((err) => setError('Failed to load orders and subscriptions'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      const res = await fetch('/api/admin/subscriptions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status }),
      });
      if (!res.ok) throw new Error('Failed to update order status');
      setSuccess('Order status updated successfully');
      setTimeout(() => setSuccess(''), 2500);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSaveTracking = async (orderId: number) => {
    try {
      const trackingNumber = trackingInputs[orderId] || '';
      const res = await fetch('/api/admin/subscriptions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, trackingNumber, status: 'Dispatched' }),
      });
      if (!res.ok) throw new Error('Failed to save tracking number');
      setSuccess('Tracking number saved and order marked as Dispatched!');
      setTimeout(() => setSuccess(''), 2500);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteOrder = async (id: number) => {
    if (!confirm('Are you sure you want to delete this order record?')) return;
    try {
      const res = await fetch(`/api/admin/subscriptions?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete order');
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleOpenPlanModal = (pl?: any) => {
    if (pl) {
      setEditingPlan(pl);
      setPlanForm({
        title: pl.title,
        planType: pl.planType,
        format: pl.format,
        duration: pl.duration,
        priceInr: pl.priceInr,
        priceUsd: pl.priceUsd || 0,
        featuresJson: pl.featuresJson,
        isPopular: Boolean(pl.isPopular),
      });
    } else {
      setEditingPlan(null);
      setPlanForm({
        title: 'New Subscription Plan',
        planType: 'Individual',
        format: 'Print + Online',
        duration: '1 Year',
        priceInr: 3500,
        priceUsd: 120,
        featuresJson: '["2 Printed Issues Mailed via Speed Post", "Full Digital Archive Access"]',
        isPopular: false,
      });
    }
    setPlanModalOpen(true);
  };

  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        const res = await fetch('/api/admin/subscriptions/plans', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingPlan.id, ...planForm }),
        });
        if (!res.ok) throw new Error('Failed to update plan');
        setSuccess('Plan updated successfully');
      } else {
        const res = await fetch('/api/admin/subscriptions/plans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(planForm),
        });
        if (!res.ok) throw new Error('Failed to create plan');
        setSuccess('Plan created successfully');
      }

      setPlanModalOpen(false);
      setTimeout(() => setSuccess(''), 2500);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const totalAmountSum = orders.reduce((sum, ord) => sum + (ord.amount || 0), 0);
  const pendingCount = orders.filter((o) => o.status === 'Pending').length;

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-navy-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary-700" />
            <span>Customer Orders &amp; Store Pricing</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage customer orders (physical print copies, subscriptions, APC fees), save postal tracking numbers, and manage price packages.
          </p>
        </div>

        <button
          onClick={() => handleOpenPlanModal()}
          className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Price Package</span>
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

      {/* Overview Metric Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">Total Orders</span>
            <p className="text-2xl font-bold text-navy-900 mt-1">{orders.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">Pending Actions</span>
            <p className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">Total Value</span>
            <p className="text-2xl font-bold text-emerald-700 mt-1">₹{totalAmountSum.toLocaleString('en-IN')}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* SECTION 1: CUSTOMER ORDERS TABLE */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900 border-b border-slate-200 pb-2 flex items-center gap-2">
          <Truck className="w-4 h-4 text-primary-700" />
          <span>Received Customer Orders &amp; Dispatch Queue ({orders.length})</span>
        </h2>

        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="divide-y divide-slate-100">
            {orders.length > 0 ? (
              orders.map((ord) => {
                let itemsList: any[] = [];
                if (ord.itemsJson) {
                  try {
                    itemsList = JSON.parse(ord.itemsJson);
                  } catch (e) {
                    itemsList = [];
                  }
                }

                const trackingVal = trackingInputs[ord.id] !== undefined ? trackingInputs[ord.id] : (ord.trackingNumber || '');

                return (
                  <div key={ord.id} className="p-5 hover:bg-slate-50/80 transition-colors space-y-4">
                    {/* Top row: Order ID, Date, Status dropdown & Delete */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-xs font-bold text-primary-800 bg-primary-50 px-2.5 py-0.5 rounded border border-primary-200">
                          Order #{ord.id}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(ord.createdAt).toLocaleDateString()} at {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                            ord.status === 'Paid' || ord.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : ord.status === 'Dispatched'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <label className="text-xs font-semibold text-slate-500">Status:</label>
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="text-xs py-1 px-2.5 border border-slate-300 rounded-md bg-white font-semibold text-slate-800"
                        >
                          <option value="Pending">Pending Review</option>
                          <option value="Paid">Paid / Confirmed</option>
                          <option value="Dispatched">Dispatched (Mailed)</option>
                          <option value="Delivered">Delivered</option>
                        </select>

                        {/* WhatsApp Customer Action */}
                        <a
                          href={`https://wa.me/${ord.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hello ${ord.subscriberName}, Greetings from National Research Journal of Business Economics (NRJBE). Regarding your Order #${ord.id} (₹${ord.amount}): ${
                              ord.status === 'Dispatched' && ord.trackingNumber
                                ? `Your printed copy has been dispatched via India Post Speed Post. Tracking Number is: ${ord.trackingNumber}.`
                                : `We have received your order details and are processing your publication/dispatch. Thank you!`
                            }`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded border border-emerald-200 flex items-center gap-1 text-xs font-semibold"
                          title="Message Customer on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </a>

                        <button
                          onClick={() => handleDeleteOrder(ord.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Middle grid: Customer info & Items Ordered */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Left: Customer & Delivery Address */}
                      <div className="space-y-1 bg-slate-50/60 p-3.5 rounded-lg border border-slate-200">
                        <h4 className="font-bold text-sm text-navy-900">{ord.subscriberName}</h4>
                        {ord.organization && (
                          <p className="text-slate-700 font-semibold">{ord.organization}</p>
                        )}
                        <div className="text-slate-600 pt-1 space-y-0.5">
                          <p>
                            Phone:{' '}
                            <a href={`tel:${ord.phone}`} className="font-bold text-slate-800 hover:underline">
                              {ord.phone}
                            </a>
                          </p>
                          <p>
                            Email:{' '}
                            <a href={`mailto:${ord.email}`} className="text-primary-700 underline">
                              {ord.email}
                            </a>
                          </p>
                        </div>
                        <div className="pt-2 border-t border-slate-200/80">
                          <span className="text-[11px] font-bold text-slate-700 block">
                            Postal Delivery Address:
                          </span>
                          <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                            {ord.address}
                            {ord.city ? `, ${ord.city}` : ''}
                            {ord.state ? `, ${ord.state}` : ''}
                            {ord.pincode ? ` - ${ord.pincode}` : ''}
                          </p>
                        </div>
                      </div>

                      {/* Right: Items Purchased & Payment Info */}
                      <div className="space-y-3 bg-slate-50/60 p-3.5 rounded-lg border border-slate-200">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-slate-800">Items in Order:</span>
                            <span className="font-bold text-navy-900 text-sm">
                              Total: ₹{ord.amount.toLocaleString('en-IN')} INR
                            </span>
                          </div>

                          {itemsList.length > 0 ? (
                            <ul className="divide-y divide-slate-200/80 text-slate-700">
                              {itemsList.map((it: any, idx: number) => (
                                <li key={idx} className="py-1.5 flex justify-between items-center">
                                  <div>
                                    <span className="font-medium">{it.title}</span>
                                    {it.badge && (
                                      <span className="ml-1.5 text-[9px] font-bold uppercase bg-slate-200 px-1.5 py-0.2 rounded">
                                        {it.badge}
                                      </span>
                                    )}
                                  </div>
                                  <span className="font-mono text-slate-600">
                                    Qty: {it.quantity} × ₹{it.price}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-slate-700 font-medium">{ord.planTitle}</p>
                          )}
                        </div>

                        <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                          <p>
                            Payment Mode:{' '}
                            <strong className="text-slate-800">{ord.paymentMode}</strong>
                          </p>
                          {ord.notes && <p>Notes from Buyer: {ord.notes}</p>}
                        </div>

                        {/* Speed Post Tracking Input */}
                        <div className="pt-2 border-t border-slate-200/80">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                            <Truck className="w-3.5 h-3.5 text-primary-700" />
                            <span>Speed Post Postal Tracking Number:</span>
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="e.g. ED849201920IN"
                              value={trackingVal}
                              onChange={(e) =>
                                setTrackingInputs({ ...trackingInputs, [ord.id]: e.target.value })
                              }
                              className="w-full px-2.5 py-1 border border-slate-300 rounded font-mono text-xs bg-white uppercase"
                            />
                            <button
                              onClick={() => handleSaveTracking(ord.id)}
                              className="px-3 py-1 bg-primary-700 hover:bg-primary-800 text-white rounded font-semibold text-xs flex items-center gap-1 flex-shrink-0"
                            >
                              <Save className="w-3 h-3" />
                              <span>Save</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                No customer orders received yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: CONFIGURED SUBSCRIPTION PLANS */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary-700" />
              <span>Subscription Packages &amp; Pricing Tiers ({plans.length})</span>
            </h2>
            <p className="text-xs text-slate-500">Displayed in the Journal Store and Subscription page</p>
          </div>

          <button
            onClick={() => handleOpenPlanModal()}
            className="text-xs font-semibold text-primary-700 hover:text-primary-900 inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Another Tier</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((pl) => (
            <div
              key={pl.id}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {pl.planType} Tier
                  </span>
                  <button
                    onClick={() => handleOpenPlanModal(pl)}
                    className="p-1 text-slate-500 hover:bg-slate-100 rounded"
                    title="Edit Plan"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mt-2">{pl.title}</h3>
                <p className="text-xs text-slate-500">{pl.format} • {pl.duration}</p>

                <div className="mt-3">
                  <span className="text-xl font-extrabold text-navy-900">
                    ₹{pl.priceInr.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">INR</span>
                  {pl.priceUsd && (
                    <span className="text-xs text-slate-400 block">(${pl.priceUsd} USD)</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Edit Modal */}
      {planModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-sm text-navy-900">
                {editingPlan ? 'Edit Pricing Package' : 'Create Pricing Package'}
              </h3>
              <button onClick={() => setPlanModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handlePlanSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Package Title *</label>
                <input
                  type="text"
                  required
                  value={planForm.title}
                  onChange={(e) => setPlanForm({ ...planForm, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price in INR (₹) *</label>
                  <input
                    type="number"
                    required
                    value={planForm.priceInr}
                    onChange={(e) => setPlanForm({ ...planForm, priceInr: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price in USD ($)</label>
                  <input
                    type="number"
                    value={planForm.priceUsd}
                    onChange={(e) => setPlanForm({ ...planForm, priceUsd: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={planForm.duration}
                    onChange={(e) => setPlanForm({ ...planForm, duration: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Format</label>
                  <input
                    type="text"
                    value={planForm.format}
                    onChange={(e) => setPlanForm({ ...planForm, format: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setPlanModalOpen(false)}
                  className="px-4 py-2 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-700 text-white font-semibold rounded-lg shadow-sm"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
