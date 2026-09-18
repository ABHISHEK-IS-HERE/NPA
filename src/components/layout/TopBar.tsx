'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MessageSquare, Award, ExternalLink, ShieldCheck, Lock, Globe, Truck } from 'lucide-react';
import { CurrencySwitcher } from '@/components/common/CurrencySwitcher';

interface TopBarProps {
  settings: {
    issn?: string;
    impactFactor?: string;
    contactPhone?: string;
    contactPhoneAlt?: string;
    contactEmail?: string;
    whatsappNumber?: string;
    publisherName?: string;
    publisherUrl?: string;
  };
}

export const TopBar: React.FC<TopBarProps> = ({ settings }) => {
  const whatsappUrl = `https://wa.me/${settings.whatsappNumber || '919888934889'}?text=Hello%20NRJBE%20Editorial%20Office,%20I%20have%20an%20inquiry%20regarding%20manuscript%20submission`;

  return (
    <div className="bg-slate-100/80 text-slate-700 text-xs py-2 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-2">
        {/* Left: Contact Info, WhatsApp & Indian Trust Marker */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-5">
          <a
            href={`tel:${settings.contactPhone || '+919888934889'}`}
            className="flex items-center gap-1.5 hover:text-primary-800 transition-colors text-slate-700 font-medium"
          >
            <Phone className="w-3.5 h-3.5 text-primary-700" />
            <span>PH: {settings.contactPhone || '+91-9888934889'}</span>
          </a>

          <a
            href={`mailto:${settings.contactEmail || 'editornrjbe@gmail.com'}`}
            className="hidden sm:flex items-center gap-1.5 hover:text-primary-800 transition-colors text-slate-600"
          >
            <Mail className="w-3.5 h-3.5 text-primary-700" />
            <span>{settings.contactEmail || 'editornrjbe@gmail.com'}</span>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition-colors shadow-2xs"
          >
            <MessageSquare className="w-3 h-3" />
            <span>WhatsApp Fast Desk</span>
          </a>

          <span className="hidden xl:inline-flex items-center gap-1 text-[11px] text-emerald-800 font-medium">
            <Truck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Speed Post Dispatch (India) • Global Airmail</span>
          </span>
        </div>

        {/* Right: Currency Toggle, ISSN, Impact Factor & Links */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {/* Dual Currency Switcher (INR / USD) */}
          <CurrencySwitcher variant="compact" />

          <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-300 text-slate-800 text-[11px] font-medium shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-primary-700" />
            <span>ISSN: <strong className="text-slate-900">{settings.issn || '2349-2015'}</strong></span>
          </span>

          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-950 px-2 py-0.5 rounded border border-amber-300 text-[11px] font-medium shadow-2xs">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>IF: <strong className="text-amber-900 font-bold">{settings.impactFactor || '6.74'}</strong></span>
          </span>

          <a
            href={settings.publisherUrl || 'https://npajournals.org'}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-800 flex items-center gap-1 transition-colors text-slate-600 text-[11px] font-medium"
            title="National Press Associates Publisher Portal"
          >
            <span>NPA Network</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors pl-2 border-l border-slate-300 text-[11px] font-medium"
          >
            <Lock className="w-3 h-3" />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
