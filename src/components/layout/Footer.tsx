'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Phone,
  Mail,
  MapPin,
  FileDown,
  ExternalLink,
  ShieldCheck,
  Award,
  Lock,
  MessageCircle,
} from 'lucide-react';

interface FooterProps {
  settings: {
    journalName?: string;
    shortName?: string;
    issn?: string;
    impactFactor?: string;
    contactPhone?: string;
    contactPhoneAlt?: string;
    contactEmail?: string;
    address?: string;
    publisherName?: string;
    publisherUrl?: string;
    whatsappNumber?: string;
  };
  sisterJournals: Array<{ id: number; name: string; url: string; category?: string | null }>;
}

export const Footer: React.FC<FooterProps> = ({ settings, sisterJournals }) => {
  return (
    <footer className="bg-slate-100 text-slate-700 pt-12 pb-8 border-t border-slate-300 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-300">
          {/* Column 1: Journal Info & Publisher */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-800 flex items-center justify-center text-amber-400 font-bold border border-primary-700 shadow-2xs">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-navy-950 text-base leading-tight">
                  {settings.shortName || 'NRJBE'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">Refereed Research Journal</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>{settings.journalName || 'National Research Journal of Business Economics'}</strong> is an international peer-reviewed and refereed research journal published by {settings.publisherName || 'National Press Associates'}. Dedicated to promoting excellence in business, management, and economic sciences.
            </p>

            <div className="pt-2 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-primary-700" />
                <span>ISSN: <strong className="text-slate-900">{settings.issn || '2349-2015'}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Impact Factor: <strong className="text-amber-800">{settings.impactFactor || '6.74'}</strong></span>
              </div>
            </div>
          </div>

          {/* Column 2: Useful Links */}
          <div>
            <h4 className="font-semibold text-navy-950 text-sm uppercase tracking-wider mb-4 border-b border-slate-300 pb-2">
              Useful Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-primary-800 transition-colors">Home Page</Link>
              </li>
              <li>
                <Link href="/current-issue" className="hover:text-primary-800 transition-colors">Current Issue (Vol 12, Issue 1)</Link>
              </li>
              <li>
                <Link href="/archives" className="hover:text-primary-800 transition-colors">Journal Archives</Link>
              </li>
              <li>
                <Link href="/editorial-board" className="hover:text-primary-800 transition-colors">Editorial &amp; Advisory Board</Link>
              </li>
              <li>
                <Link href="/submit-paper" className="hover:text-primary-800 transition-colors font-semibold text-primary-700">Submit Paper Online</Link>
              </li>
              <li>
                <Link href="/track-status" className="hover:text-primary-800 transition-colors">Track Manuscript Status</Link>
              </li>
              <li>
                <Link href="/ugc-api-calculator" className="hover:text-primary-800 transition-colors font-medium text-emerald-700">
                  🧮 UGC CAS &amp; API Score Calculator
                </Link>
              </li>
              <li>
                <Link href="/institutions" className="hover:text-primary-800 transition-colors font-medium text-amber-800">
                  🏛️ Library Proforma Invoice Generator
                </Link>
              </li>
              <li>
                <Link href="/naac-compliance" className="hover:text-primary-800 transition-colors">
                  📜 NAAC &amp; NIRF Library Compliance Kit
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="hover:text-primary-800 transition-colors">
                  📑 Annual Subscription Rate Catalog
                </Link>
              </li>
              <li>
                <Link href="/dispatch-tracking" className="hover:text-primary-800 transition-colors">
                  🚚 Speed Post Dispatch &amp; Transit Tracker
                </Link>
              </li>
              <li>
                <Link href="/publish-books" className="hover:text-primary-800 transition-colors">
                  📚 Publish Books / Monographs (ISBN)
                </Link>
              </li>
              <li>
                <Link href="/store" className="hover:text-primary-800 transition-colors">Journal Issue &amp; Print Store</Link>
              </li>
              <li>
                <Link href="/page/peer-review-process" className="hover:text-primary-800 transition-colors">Peer Review Mechanism</Link>
              </li>
              <li>
                <Link href="/page/publication-ethics" className="hover:text-primary-800 transition-colors">Publication Ethics (COPE)</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Author Downloads & Indexing */}
          <div>
            <h4 className="font-semibold text-navy-950 text-sm uppercase tracking-wider mb-4 border-b border-slate-300 pb-2">
              Author Downloads
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href="/templates/Copyright-Form.pdf"
                  download
                  className="inline-flex items-center gap-2 p-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 hover:text-primary-800 border border-slate-300 transition-colors w-full shadow-2xs"
                >
                  <FileDown className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Download Copyright Agreement Form (PDF)</span>
                </a>
              </li>
              <li>
                <a
                  href="/templates/Paper-Template.pdf"
                  download
                  className="inline-flex items-center gap-2 p-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 hover:text-primary-800 border border-slate-300 transition-colors w-full shadow-2xs"
                >
                  <FileDown className="w-4 h-4 text-primary-700 flex-shrink-0" />
                  <span>Download Paper Formatting Template</span>
                </a>
              </li>
              <li>
                <Link
                  href="/page/manuscript-guidelines"
                  className="hover:text-primary-800 transition-colors block text-slate-600"
                >
                  &rarr; Author Preparation Instructions
                </Link>
              </li>
              <li>
                <Link
                  href="/page/publication-charges"
                  className="hover:text-primary-800 transition-colors block text-slate-600"
                >
                  &rarr; Article Processing Charges (APC)
                </Link>
              </li>
            </ul>

            <h5 className="font-semibold text-navy-950 text-xs uppercase tracking-wider mt-6 mb-2">
              Indexed Across
            </h5>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-700 shadow-2xs">Google Scholar</span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-700 shadow-2xs">Zenodo</span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-700 shadow-2xs">CrossRef DOI</span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-700 shadow-2xs">ResearchGate</span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-700 shadow-2xs">DRJI</span>
            </div>
          </div>

          {/* Column 4: Contact & Office */}
          <div>
            <h4 className="font-semibold text-navy-950 text-sm uppercase tracking-wider mb-4 border-b border-slate-300 pb-2">
              Editorial Office
            </h4>
            <div className="space-y-3 text-xs text-slate-700">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary-700 flex-shrink-0 mt-0.5" />
                <span>{settings.address || 'Publishing Office: National Press Associates, Regional HQ, India'}</span>
              </p>

              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-700 flex-shrink-0" />
                <a href={`tel:${settings.contactPhone || '+919888934889'}`} className="hover:text-primary-800">
                  {settings.contactPhone || '+91-9888934889'}
                </a>
              </p>

              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-700 flex-shrink-0" />
                <a href={`mailto:${settings.contactEmail || 'editornrjbe@gmail.com'}`} className="hover:text-primary-800">
                  {settings.contactEmail || 'editornrjbe@gmail.com'}
                </a>
              </p>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${settings.whatsappNumber || '919888934889'}?text=Hello%20NRJBE%20Editorial%20Office`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors w-full justify-center shadow-2xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Fast-Track Desk</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Explore Sister Journals Accordion / Network */}
        {sisterJournals.length > 0 && (
          <div className="py-6 border-b border-slate-300">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">
              National Press Associates (NPA) Journals Network:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
              {sisterJournals.map((j) => (
                <a
                  key={j.id}
                  href={j.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-navy-950 flex items-center justify-between group transition-all shadow-2xs"
                >
                  <span className="truncate">{j.name}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-primary-700 flex-shrink-0 ml-1" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Bar: Copyright, Links & Admin Access */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>
            &copy; {new Date().getFullYear()} {settings.journalName || 'National Research Journal of Business Economics'}. Published by{' '}
            <a
              href={settings.publisherUrl || 'https://npajournals.org'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-800 hover:text-primary-800 underline"
            >
              {settings.publisherName || 'National Press Associates'}
            </a>
            . All Rights Reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link href="/page/privacy-policy" className="hover:text-primary-800 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/page/open-access-licensing" className="hover:text-primary-800 transition-colors">
              CC BY-NC 4.0
            </Link>
            <Link href="/contact" className="hover:text-primary-800 transition-colors">
              Contact
            </Link>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1 text-slate-700 hover:text-primary-800 transition-colors font-medium border border-slate-300 px-2.5 py-1 rounded bg-white shadow-2xs"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
