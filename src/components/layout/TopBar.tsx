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
    <div className="bg-navy-950 text-slate-200 text-xs py-2 border-b border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-2">
        {/* Left: Contact Info, WhatsApp & Indian Trust Marker */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-5">
          <a
            href={`tel:${settings.contactPhone || '+919888934889'}`}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>PH: {settings.contactPhone || '+91-9888934889'}</span>
          </a>

          <a
            href={`mailto:${settings.contactEmail || 'editornrjbe@gmail.com'}`}
            className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <span>{settings.contactEmail || 'editornrjbe@gmail.com'}</span>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700/80 hover:bg-emerald-600 text-white font-medium transition-colors"
          >
            <MessageSquare className="w-3 h-3" />
            <span>WhatsApp Fast Desk</span>
          </a>

          <span className="hidden xl:inline-flex items-center gap-1 text-[11px] text-emerald-300">
            <Truck className="w-3 h-3 text-emerald-400" />
            <span>Speed Post Dispatch (India) • Global Airmail</span>
          </span>
        </div>

        {/* Right: Currency Toggle, ISSN, Impact Factor & Links */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {/* Dual Currency Switcher (INR / USD) */}
          <CurrencySwitcher variant="compact" />

          <span className="inline-flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>ISSN: <strong className="text-white">{settings.issn || '2349-2015'}</strong></span>
          </span>

          <span className="inline-flex items-center gap-1 bg-amber-950/70 text-amber-200 px-2 py-0.5 rounded border border-amber-800/60">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>IF: <strong className="text-amber-300">{settings.impactFactor || '6.74'}</strong></span>
          </span>

          <a
            href={settings.publisherUrl || 'https://npajournals.org'}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white flex items-center gap-1 transition-colors text-slate-300 text-[11px]"
            title="National Press Associates Publisher Portal"
          >
            <span>NPA Network</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-100 transition-colors pl-2 border-l border-slate-700 text-[11px]"
          >
            <Lock className="w-3 h-3" />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
