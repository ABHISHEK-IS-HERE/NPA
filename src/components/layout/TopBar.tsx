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
    <div className="bg-[#18191d] text-stone-300 text-xs py-2 border-b border-stone-800 relative z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-2">
        {/* Left: Contact Info, WhatsApp & Indian Trust Marker */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-5">
          <a
            href={`tel:${settings.contactPhone || '+919888934889'}`}
            className="flex items-center gap-1.5 hover:text-amber-300 transition-colors text-stone-300 font-medium tracking-tight"
          >
            <Phone className="w-3 h-3 text-amber-400" strokeWidth={1.5} />
            <span>Tel: {settings.contactPhone || '+91-9888934889'}</span>
          </a>

          <a
            href={`mailto:${settings.contactEmail || 'editornrjbe@gmail.com'}`}
            className="hidden sm:flex items-center gap-1.5 hover:text-amber-300 transition-colors text-stone-300 tracking-tight"
          >
            <Mail className="w-3 h-3 text-amber-400" strokeWidth={1.5} />
            <span>{settings.contactEmail || 'editornrjbe@gmail.com'}</span>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] transition-colors shadow-2xs"
          >
            <MessageSquare className="w-3 h-3" strokeWidth={1.5} />
            <span>Editorial Helpline</span>
          </a>

          <span className="hidden xl:inline-flex items-center gap-1 text-[11px] text-stone-400 font-medium">
            <Truck className="w-3 h-3 text-amber-400/80" strokeWidth={1.5} />
            <span>Speed Post Dispatch (India) &bull; Registered Airmail</span>
          </span>
        </div>

        {/* Right: Currency Toggle, ISSN, Impact Factor & NPA Network Ecosystem */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {/* Dual Currency Switcher (INR / USD) */}
          <CurrencySwitcher variant="dark" />

          <span className="inline-flex items-center gap-1 bg-stone-900/90 px-2.5 py-0.5 rounded border border-stone-700/80 text-stone-300 text-[11px] font-medium">
            <ShieldCheck className="w-3 h-3 text-stone-400" strokeWidth={1.5} />
            <span>ISSN: <strong className="text-white font-mono">{settings.issn || '2349-2015'}</strong></span>
          </span>

          <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded border border-amber-500/40 text-[11px] font-medium">
            <Award className="w-3 h-3 text-amber-400" strokeWidth={1.5} />
            <span>Impact Factor: <strong className="text-amber-200 font-bold">{settings.impactFactor || '6.74'}</strong></span>
          </span>

          {/* Interactive NPA Network Hub Dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="hover:text-white flex items-center gap-1 transition-colors text-stone-300 text-[11px] font-medium bg-stone-900/90 px-2.5 py-0.5 rounded border border-stone-700/80 shadow-2xs group-hover:border-amber-400/60"
              title="National Press Associates 10-Journal Network"
            >
              <Globe className="w-3 h-3 text-amber-400" strokeWidth={1.5} />
              <span>NPA Press Network (10 Journals)</span>
              <ChevronDown className="w-3 h-3 text-stone-400 group-hover:rotate-180 transition-transform" strokeWidth={1.5} />
            </button>

            {/* Dropdown Card */}
            <div className="absolute right-0 top-full pt-1.5 w-80 sm:w-96 hidden group-hover:block transition-all z-50 animate-in fade-in-50 duration-150">
              <div className="bg-white rounded-xl shadow-lg border border-stone-200 p-4 text-stone-800 ring-1 ring-black/5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <div>
                    <h4 className="font-serif font-bold text-stone-900 text-xs">
                      National Press Associates (NPA)
                    </h4>
                    <p className="text-[10px] text-stone-500">
                      Scholarly Journals &amp; Academic Book Publishing
                    </p>
                  </div>
                  <a
                    href={settings.publisherUrl || 'https://npajournals.org'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-medium text-stone-700 hover:text-stone-950 hover:underline flex items-center gap-0.5"
                  >
                    <span>Publisher Portal</span>
                    <ExternalLink className="w-2.5 h-2.5 text-stone-400" />
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
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-colors group/item"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-medium text-stone-900 truncate group-hover/item:text-primary-800">
                          {journal.name}
                        </p>
                        {journal.category && (
                          <span className="text-[10px] text-stone-500">
                            {journal.category}
                          </span>
                        )}
                      </div>
                      <ExternalLink className="w-3 h-3 text-stone-400 group-hover/item:text-stone-700 flex-shrink-0" />
                    </a>
                  ))}
                </div>

                {/* Ecosystem Quick Links */}
                <div className="pt-2 border-t border-stone-200 grid grid-cols-2 gap-2 text-[11px]">
                  <Link
                    href="/institutions"
                    className="p-2 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-800 font-medium text-center border border-stone-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Building2 className="w-3 h-3 text-stone-600" strokeWidth={1.5} />
                    <span>Library Invoicing</span>
                  </Link>
                  <Link
                    href="/publish-books"
                    className="p-2 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-800 font-medium text-center border border-stone-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3 h-3 text-stone-600" strokeWidth={1.5} />
                    <span>Publish Books (ISBN)</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1 text-stone-500 hover:text-stone-800 transition-colors pl-2 border-l border-stone-200 text-[11px] font-medium"
          >
            <Lock className="w-3 h-3" strokeWidth={1.5} />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
