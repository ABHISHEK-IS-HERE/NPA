'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  QrCode,
  Building,
  FileCheck,
  Printer,
  ExternalLink,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    isOpen,
    closeCart,
    totalItems,
    subtotal,
  } = useCart();

  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmation'>('cart');
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  // Checkout form fields
  const [formData, setFormData] = useState({
    subscriberName: '',
    organization: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMode: 'UPI / Net Banking',
    utrNumber: '',
    notes: '',
  });

  if (!isOpen) return null;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setOrderError('');

    try {
      const payload = {
        subscriberName: formData.subscriberName,
        organization: formData.organization || null,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        paymentMode: `${formData.paymentMode}${formData.utrNumber ? ` (UTR: ${formData.utrNumber})` : ''}`,
        notes: formData.notes || null,
        items,
        amount: subtotal,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to place order');

      setConfirmedOrder({
        orderNumber: data.orderNumber,
        orderId: data.orderId,
        ...formData,
        amount: subtotal,
        items: [...items],
      });
      clearCart();
      setStep('confirmation');
    } catch (err: any) {
      setOrderError(err.message || 'Error processing order');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseAndReset = () => {
    closeCart();
    // Delay resetting step so animation finishes smoothly
    setTimeout(() => {
      setStep('cart');
      setConfirmedOrder(null);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark backdrop overlay */}
      <div
        className="fixed inset-0 bg-navy-950/70 backdrop-blur-xs transition-opacity"
        onClick={handleCloseAndReset}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              {step === 'checkout' && (
                <button
                  onClick={() => setStep('cart')}
                  className="p-1 -ml-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-full transition-colors mr-1"
                  aria-label="Back to Cart"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <ShoppingBag className="w-5 h-5 text-primary-700" />
              <h3 className="font-serif font-bold text-navy-900 text-base">
                {step === 'cart' && `Shopping Bag (${totalItems})`}
                {step === 'checkout' && 'Checkout & Dispatch Info'}
                {step === 'confirmation' && 'Order Confirmed'}
              </h3>
            </div>

            <button
              onClick={handleCloseAndReset}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {/* 1. CART VIEW */}
            {step === 'cart' && (
              <>
                {items.length === 0 ? (
                  <div className="py-16 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Your shopping bag is empty</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                        Add physical print issues, annual subscriptions, or publication packages from the journal store.
                      </p>
                    </div>
                    <button
                      onClick={handleCloseAndReset}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
                    >
                      <span>Explore Journal Editions</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Free shipping banner */}
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-800 text-xs font-medium">
                      <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Free Speed Post dispatch across India on all orders!</span>
                    </div>

                    {/* Item list */}
                    <div className="divide-y divide-slate-100 space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {item.badge && (
                                <span className="bg-primary-50 text-primary-800 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border border-primary-200">
                                  {item.badge}
                                </span>
                              )}
                              <span className="font-bold text-xs text-slate-900 leading-snug">
                                {item.title}
                              </span>
                            </div>

                            {item.subtitle && (
                              <p className="text-[11px] text-slate-500">{item.subtitle}</p>
                            )}

                            <div className="text-xs font-bold text-navy-900 pt-1">
                              ₹{item.price.toLocaleString('en-IN')}{' '}
                              <span className="text-[10px] text-slate-400 font-normal">INR each</span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            {/* Quantity stepper */}
                            <div className="flex items-center border border-slate-200 rounded-md overflow-hidden bg-slate-50">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:bg-slate-200 text-slate-600 transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2.5 text-xs font-semibold text-slate-800 min-w-[24px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:bg-slate-200 text-slate-600 transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-[11px] text-rose-600 hover:text-rose-800 flex items-center gap-1 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* 2. CHECKOUT VIEW */}
            {step === 'checkout' && (
              <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
                {orderError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs">
                    {orderError}
                  </div>
                )}

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-primary-700" />
                    <span>Recipient &amp; Delivery Address</span>
                  </h4>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Full Name of Recipient / Author *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Harpreet Singh"
                      value={formData.subscriberName}
                      onChange={(e) => setFormData({ ...formData, subscriberName: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      University / Institution / College
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Punjabi University, Patiala"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="you@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Mobile / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91-9888934889"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Postal Delivery Street Address *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="House/Dept, Street, Landmark"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">City *</label>
                      <input
                        type="text"
                        required
                        placeholder="Chandigarh"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">State *</label>
                      <input
                        type="text"
                        required
                        placeholder="Punjab"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Pincode *</label>
                      <input
                        type="text"
                        required
                        placeholder="160014"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment mode selection */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Payment Method</span>
                  </h4>

                  <div className="space-y-2">
                    <label className="flex items-start gap-2 p-2 rounded-md border border-primary-300 bg-primary-50/50 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMode"
                        value="UPI / QR Code"
                        checked={formData.paymentMode.includes('UPI')}
                        onChange={() => setFormData({ ...formData, paymentMode: 'UPI / QR Code' })}
                        className="mt-0.5 text-primary-700"
                      />
                      <div>
                        <span className="font-bold text-slate-900">Direct UPI / QR Code Transfer</span>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          Instant transfer via Google Pay, PhonePe, Paytm, or BHIM.
                        </p>
                      </div>
                    </label>

                    {formData.paymentMode.includes('UPI') && (
                      <div className="p-3 bg-white rounded-md border border-slate-200 space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-slate-900 text-white rounded flex items-center justify-center flex-shrink-0">
                            <QrCode className="w-10 h-10 text-amber-400" />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 font-semibold uppercase">UPI ID:</span>
                            <p className="font-mono font-bold text-navy-900 text-xs select-all">
                              editornrjbe@okhdfcbank
                            </p>
                            <span className="text-[10px] text-slate-400">Account: National Press Associates</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                            Transaction UTR / Reference ID (Optional):
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 425619284910"
                            value={formData.utrNumber}
                            onChange={(e) => setFormData({ ...formData, utrNumber: e.target.value })}
                            className="w-full px-2 py-1 border border-slate-300 rounded font-mono text-xs bg-slate-50"
                          />
                        </div>
                      </div>
                    )}

                    <label className="flex items-start gap-2 p-2 rounded-md border border-slate-200 bg-white cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMode"
                        value="NEFT / RTGS Bank Transfer"
                        checked={formData.paymentMode.includes('NEFT')}
                        onChange={() => setFormData({ ...formData, paymentMode: 'NEFT / RTGS Bank Transfer' })}
                        className="mt-0.5 text-primary-700"
                      />
                      <div>
                        <span className="font-bold text-slate-900">Direct Bank Transfer (NEFT / IMPS)</span>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          HDFC Bank • A/C: National Press Associates • IFSC: HDFC0001234
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-2 p-2 rounded-md border border-slate-200 bg-white cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMode"
                        value="Institutional Cheque / Purchase Order"
                        checked={formData.paymentMode.includes('Institutional')}
                        onChange={() => setFormData({ ...formData, paymentMode: 'Institutional Cheque / Purchase Order' })}
                        className="mt-0.5 text-primary-700"
                      />
                      <div>
                        <span className="font-bold text-slate-900">Institutional Purchase Order / Cheque</span>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          For university libraries, colleges, and authorized procurement departments.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </form>
            )}

            {/* 3. CONFIRMATION VIEW */}
            {step === 'confirmation' && confirmedOrder && (
              <div className="space-y-4 text-center py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                    Order Logged Successfully
                  </span>
                  <h4 className="font-serif font-bold text-navy-900 text-lg mt-1">
                    Order #{confirmedOrder.orderNumber}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Thank you, <strong>{confirmedOrder.subscriberName}</strong>. Your order has been registered in the editorial system.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Order Amount:</span>
                    <span className="font-extrabold text-navy-900">₹{confirmedOrder.amount.toLocaleString('en-IN')} INR</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Payment Mode:</span>
                    <span className="font-semibold text-slate-800">{confirmedOrder.paymentMode}</span>
                  </div>

                  <div className="pt-1">
                    <span className="text-slate-500 block mb-0.5">Dispatching To:</span>
                    <p className="text-slate-800 font-medium">
                      {confirmedOrder.address}, {confirmedOrder.city}, {confirmedOrder.state} - {confirmedOrder.pincode}
                    </p>
                  </div>
                </div>

                {/* WhatsApp notification action */}
                <div className="space-y-2 pt-2">
                  <a
                    href={`https://wa.me/919888934889?text=${encodeURIComponent(
                      `Hello Editor NRJBE, I have placed Order ${confirmedOrder.orderNumber} for ₹${confirmedOrder.amount} for: ${confirmedOrder.items.map((i: any) => i.title).join(', ')}. My phone is ${confirmedOrder.phone}. Please confirm receipt and dispatch details.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow-sm transition-colors"
                  >
                    <span>Send Order Slip to WhatsApp Fast Desk</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <Link
                    href={`/order/${confirmedOrder.orderNumber}/invoice`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold py-2.5 px-4 rounded-lg border border-slate-300 shadow-xs transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-primary-700" />
                    <span>View & Print Official Tax Invoice</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          {items.length > 0 && step !== 'confirmation' && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/80 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Speed Post Postal Dispatch:</span>
                  <span className="text-emerald-700 font-bold uppercase text-[10px]">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-navy-900 pt-1 border-t border-slate-200">
                  <span>Total Amount:</span>
                  <span className="text-base text-primary-800">₹{subtotal.toLocaleString('en-IN')} INR</span>
                </div>
              </div>

              {step === 'cart' ? (
                <button
                  onClick={() => setStep('checkout')}
                  className="w-full bg-primary-700 hover:bg-primary-800 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={submitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{submitting ? 'Placing Order...' : `Place Order (₹${subtotal.toLocaleString('en-IN')})`}</span>
                </button>
              )}
            </div>
          )}

          {step === 'confirmation' && (
            <div className="p-4 border-t border-slate-200 bg-slate-50 text-center">
              <button
                onClick={handleCloseAndReset}
                className="w-full bg-navy-900 hover:bg-navy-950 text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-colors"
              >
                Done / Continue Browsing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
