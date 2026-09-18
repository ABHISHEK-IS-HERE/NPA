'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MessageSquare, Award, ExternalLink, ShieldCheck, Lock, Globe, Truck, ChevronDown, BookOpen, Building2 } from 'lucide-react';
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
  sisterJournals?: Array<{ id: number; name: string; url: string; category?: string | null }>;
}

export const TopBar: React.FC<TopBarProps> = ({ settings, sisterJournals = [] }) => {
  const whatsappUrl = `https://wa.me/${settings.whatsappNumber || '919888934889'}?text=Hello%20NRJBE%20Editorial%20Office,%20I%20have%20an%20inquiry%20regarding%20manuscript%20submission`;

  return (
    <div className="bg-slate-100/90 text-slate-700 text-xs py-2 border-b border-slate-200 relative z-50">
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

        {/* Right: Currency Toggle, ISSN, Impact Factor & NPA Network Ecosystem */}
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

          {/* Interactive NPA Network Hub Dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="hover:text-primary-900 flex items-center gap-1 transition-colors text-slate-700 text-[11px] font-bold bg-white px-2 py-0.5 rounded border border-slate-300 shadow-2xs group-hover:border-primary-400"
              title="National Press Associates 10-Journal Network"
            >
              <Globe className="w-3 h-3 text-primary-700" />
              <span>NPA Network (10 Journals)</span>
              <ChevronDown className="w-3 h-3 text-slate-400 group-hover:rotate-180 transition-transform" />
            </button>

            {/* Dropdown Card */}
            <div className="absolute right-0 top-full pt-1.5 w-80 sm:w-96 hidden group-hover:block transition-all z-50 animate-in fade-in-50 duration-150">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 text-slate-800 ring-1 ring-black/5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div>
                    <h4 className="font-serif font-bold text-navy-950 text-xs">
                      National Press Associates (NPA)
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Peer-Reviewed Academic Publishing Network
                    </p>
                  </div>
                  <a
                    href={settings.publisherUrl || 'https://npajournals.org'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-primary-800 hover:underline flex items-center gap-0.5"
                  >
                    <span>Publisher Portal</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                {/* Sister Journals Grid */}
                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {sisterJournals.map((journal) => (
                    <a
                      key={journal.id}
                      href={journal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors group/item"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-semibold text-slate-900 truncate group-hover/item:text-primary-800">
                          {journal.name}
                        </p>
                        {journal.category && (
                          <span className="text-[10px] text-slate-500 font-medium">
                            {journal.category}
                          </span>
                        )}
                      </div>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover/item:text-primary-700 flex-shrink-0" />
                    </a>
                  ))}
                </div>

                {/* Ecosystem Quick Links */}
                <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-[11px]">
                  <Link
                    href="/institutions"
                    className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-950 font-semibold text-center border border-amber-200/80 transition-colors"
                  >
                    🏛️ Library Proforma PO
                  </Link>
                  <Link
                    href="/publish-books"
                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-semibold text-center border border-emerald-200/80 transition-colors"
                  >
                    📚 Book Publishing (ISBN)
                  </Link>
                </div>
              </div>
            </div>
          </div>

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
