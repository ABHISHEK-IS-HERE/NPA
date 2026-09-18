/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React from 'react';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Printer, ArrowLeft, CheckCircle2, Truck, ShieldCheck, Mail, Phone, ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';

interface InvoicePageProps {
  params: { orderNumber: string };
}

export async function generateMetadata({ params }: InvoicePageProps): Promise<Metadata> {
  return {
    title: `Tax Invoice ${params.orderNumber} | NRJBE Journal Portal`,
    description: `Official tax invoice and payment receipt for order ${params.orderNumber}.`,
  };
}

export default async function OrderInvoicePage({ params }: InvoicePageProps) {
  const rawId = params.orderNumber.replace(/^NRJBE-ORD-0*/i, '');
  const orderId = parseInt(rawId, 10);

  if (isNaN(orderId)) {
    notFound();
  }

  const [order, settings] = await Promise.all([
    db.subscriptionOrder.findUnique({
      where: { id: orderId },
    }),
    db.siteSetting.findFirst({
      where: { id: 1 },
    }),
  ]);

  if (!order) {
    notFound();
  }

  const formattedOrderNumber = `NRJBE-ORD-${order.id.toString().padStart(4, '0')}`;

  let parsedItems: Array<{
    id: string;
    title: string;
    type?: string;
    price: number;
    quantity: number;
  }> = [];

  if (order.itemsJson) {
    try {
      parsedItems = JSON.parse(order.itemsJson);
    } catch {
      parsedItems = [
        {
          id: 'item-1',
          title: order.planTitle,
          price: order.amount,
          quantity: 1,
        },
      ];
    }
  } else {
    parsedItems = [
      {
        id: 'item-1',
        title: order.planTitle,
        price: order.amount,
        quantity: 1,
      },
    ];
  }

  const dateStr = new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(order.createdAt));

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0 print:m-0">
      {/* Top Action Bar (Hidden on Print) */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link
          href="/store"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journal Store</span>
        </Link>

        <div className="flex items-center gap-3">
          <a
            href={`https://wa.me/919888934889?text=${encodeURIComponent(
              `Hello Editor NRJBE, I am inquiring regarding Invoice ${formattedOrderNumber} (Amount: ₹${order.amount}).`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-2 rounded-lg transition-colors"
          >
            <span>WhatsApp Editorial Desk</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Client-side print button using inline JS onClick */}
          <button
            id="print-btn"
            className="inline-flex items-center gap-2 text-xs font-bold text-white bg-primary-800 hover:bg-primary-900 px-4 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Invoice Card (A4 format layout) */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-slate-200 p-8 sm:p-12 print:shadow-none print:border-none print:p-4 print:max-w-none">
        {/* Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded border border-primary-200">
              {settings?.publisherName || 'National Press Associates'}
            </span>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-slate-900 mt-1">
              {settings?.journalName || 'National Research Journal of Business Economics'}
            </h1>
            <p className="text-xs text-slate-600 font-medium max-w-lg">
              {settings?.tagline || 'An International Reputed Peer Reviewed Refereed Research Journal'}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-1">
              <span>ISSN: <strong>{settings?.issn || '2349-2015'}</strong></span>
              <span>Impact Factor: <strong>{settings?.impactFactor || '6.74'}</strong></span>
              <span>Frequency: <strong>{settings?.frequency || 'Biannual'}</strong></span>
              <span>HSN/SAC: <strong>4902</strong> (Journals/Periodicals)</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-1 space-y-0.5">
              <p>{settings?.address || 'Publishing Office: National Press Associates, Regional HQ, India'}</p>
              <p>Email: {settings?.contactEmail || 'editornrjbe@gmail.com'} | Tel: {settings?.contactPhone || '+91-9888934889'}</p>
            </div>
          </div>

          <div className="text-left md:text-right space-y-1">
            <div className="inline-block bg-slate-900 text-white text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded">
              TAX INVOICE & RECEIPT
            </div>
            <div className="pt-2 font-mono text-xs">
              <p className="text-slate-500">Invoice / Order No:</p>
              <p className="font-bold text-slate-900 text-sm">{formattedOrderNumber}</p>
            </div>
            <div className="font-mono text-xs">
              <p className="text-slate-500">Invoice Date:</p>
              <p className="font-medium text-slate-800">{dateStr}</p>
            </div>
            <div className="pt-1">
              <span
                className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  order.status === 'Dispatched' || order.status === 'Delivered' || order.status === 'Paid'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                Payment: {order.status}
              </span>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-200 text-xs">
          <div>
            <h3 className="font-bold uppercase tracking-wider text-[11px] text-slate-400 mb-2">Billed & Shipped To:</h3>
            <p className="text-base font-bold text-slate-900">{order.subscriberName}</p>
            {order.organization && (
              <p className="font-medium text-slate-700 mt-0.5">{order.organization}</p>
            )}
            <p className="text-slate-600 mt-1 whitespace-pre-line leading-relaxed">{order.address}</p>
            <p className="text-slate-700 font-medium mt-0.5">
              {[order.city, order.state].filter(Boolean).join(', ')}
              {order.pincode ? ` - ${order.pincode}` : ''}
            </p>
            <div className="mt-2 text-slate-500 space-y-0.5">
              <p>Email: <span className="font-medium text-slate-700">{order.email}</span></p>
              <p>Mobile: <span className="font-medium text-slate-700">{order.phone}</span></p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
            <h3 className="font-bold uppercase tracking-wider text-[11px] text-slate-500">Dispatch & Payment Record:</h3>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Mode:</span>
                <span className="font-semibold text-slate-800">{order.paymentMode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fulfillment Method:</span>
                <span className="font-semibold text-slate-800">India Post Speed Post</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Postal Charges:</span>
                <span className="font-bold text-emerald-700 uppercase text-[10px]">Complimentary (Free)</span>
              </div>
              {order.trackingNumber ? (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Speed Post Consignment No:</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Truck className="w-3.5 h-3.5 text-primary-700" />
                    <span className="font-mono font-bold text-xs text-primary-900 bg-white px-2 py-0.5 rounded border border-slate-300">
                      {order.trackingNumber}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Track live at indiapost.gov.in</span>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[11px] text-slate-500 italic">Consignment pending dispatch from publishing office</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="py-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900 text-[11px] uppercase tracking-wider text-slate-600">
                <th className="py-2.5 font-bold">#</th>
                <th className="py-2.5 font-bold">Description of Publication / Service</th>
                <th className="py-2.5 font-bold text-center">HSN/SAC</th>
                <th className="py-2.5 font-bold text-center">Qty</th>
                <th className="py-2.5 font-bold text-right">Unit Price</th>
                <th className="py-2.5 font-bold text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {parsedItems.map((item, idx) => (
                <tr key={idx} className="py-2">
                  <td className="py-3 font-mono text-slate-400">{idx + 1}</td>
                  <td className="py-3">
                    <p className="font-bold text-slate-900">{item.title}</p>
                    <p className="text-[11px] text-slate-500">
                      Published by National Press Associates • Open Access Refereed Journal
                    </p>
                  </td>
                  <td className="py-3 text-center font-mono text-slate-500">4902</td>
                  <td className="py-3 text-center font-semibold text-slate-800">{item.quantity}</td>
                  <td className="py-3 text-right font-mono text-slate-700">₹{item.price.toLocaleString('en-IN')}</td>
                  <td className="py-3 text-right font-mono font-bold text-slate-900">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-200">
                <td colSpan={4} className="py-2.5 text-right font-medium text-slate-500">Subtotal:</td>
                <td colSpan={2} className="py-2.5 text-right font-mono font-semibold text-slate-800">
                  ₹{order.amount.toLocaleString('en-IN')}
                </td>
              </tr>
              <tr>
                <td colSpan={4} className="py-1 text-right font-medium text-slate-500">
                  Speed Post Delivery Across India:
                </td>
                <td colSpan={2} className="py-1 text-right font-mono text-emerald-700 font-bold text-[11px] uppercase">
                  ₹0.00 (FREE)
                </td>
              </tr>
              <tr>
                <td colSpan={4} className="py-1 text-right font-medium text-slate-500">GST (Periodicals & Journals):</td>
                <td colSpan={2} className="py-1 text-right font-mono text-slate-600 text-[11px]">
                  Nil (Exempted)
                </td>
              </tr>
              <tr className="border-t-2 border-slate-900 text-sm">
                <td colSpan={4} className="py-3 text-right font-extrabold text-slate-900">Grand Total Amount:</td>
                <td colSpan={2} className="py-3 text-right font-mono font-extrabold text-base text-primary-900">
                  ₹{order.amount.toLocaleString('en-IN')} INR
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Official Seal and Signature Section */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
          {/* Stamp Graphic */}
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-primary-700 flex flex-col items-center justify-center text-center p-1 text-primary-800 opacity-90 select-none">
              <span className="text-[7px] font-black uppercase tracking-tighter">NATIONAL PRESS ASSOCIATES</span>
              <ShieldCheck className="w-5 h-5 text-primary-800 my-0.5" />
              <span className="text-[7px] font-bold uppercase tracking-tight">OFFICIAL SEAL</span>
              <span className="text-[6px] text-primary-600">ISSN 2349-2015</span>
            </div>
            <div className="text-[11px] text-slate-500 max-w-xs">
              <p className="font-semibold text-slate-700">Official Computer Generated Invoice</p>
              <p>Certified that the journal particulars are true and correct as per publication records.</p>
            </div>
          </div>

          {/* Signatory */}
          <div className="text-center sm:text-right space-y-1">
            <div className="h-10 flex items-end justify-center sm:justify-end">
              <span className="font-serif italic font-bold text-slate-800 text-sm">Editor-in-Chief / Accounts Officer</span>
            </div>
            <div className="w-48 border-t border-slate-400 mx-auto sm:ml-auto sm:mr-0 pt-1">
              <p className="font-bold text-slate-900 text-[11px]">Authorized Signatory</p>
              <p className="text-[10px] text-slate-500">For National Research Journal of Business Economics</p>
            </div>
          </div>
        </div>

        {/* Print Note */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400">
          <p>This invoice is valid for university reimbursement, library procurement, and academic record keeping.</p>
          <p>National Press Associates • https://npajournals.org • editornrjbe@gmail.com</p>
        </div>
      </div>

      {/* Script to trigger print on click */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.getElementById('print-btn')?.addEventListener('click', function() {
              window.print();
            });
          `,
        }}
      />
    </div>
  );
}
