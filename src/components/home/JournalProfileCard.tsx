'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  BookOpen,
  Calendar,
  Globe,
  Lock,
  FileCheck,
  DollarSign,
  Building,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface JournalProfileCardProps {
  settings: {
    journalName?: string;
    issn?: string;
    impactFactor?: string;
    frequency?: string;
    peerReviewType?: string;
    languages?: string;
    accessibility?: string;
    plagiarismLimit?: string;
    aiContentLimit?: string;
    apcOnline?: string;
    apcPrint?: string;
    publisherName?: string;
    publisherUrl?: string;
    contactEmail?: string;
    contactPhone?: string;
  };
}

export const JournalProfileCard: React.FC<JournalProfileCardProps> = ({ settings }) => {
  const profileItems = [
    {
      icon: <Building className="w-4 h-4 text-amber-700" />,
      label: 'Publisher',
      value: settings.publisherName || 'National Press Associates',
      link: settings.publisherUrl || 'https://npajournals.org',
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-amber-800" />,
      label: 'ISSN Number',
      value: settings.issn || '2349-2015',
      highlight: true,
    },
    {
      icon: <Award className="w-4 h-4 text-amber-600" />,
      label: 'Impact Factor',
      value: settings.impactFactor || '6.74',
      badge: 'High Impact',
    },
    {
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-700" />,
      label: 'Peer Review Process',
      value: settings.peerReviewType || 'Double Blind Peer Review Process',
    },
    {
      icon: <Calendar className="w-4 h-4 text-amber-700" />,
      label: 'Frequency of Publication',
      value: settings.frequency || 'Biannual (2 Issues Per Year)',
    },
    {
      icon: <Globe className="w-4 h-4 text-stone-700" />,
      label: 'Language & Medium',
      value: settings.languages || 'English (Online & Print)',
    },
    {
      icon: <BookOpen className="w-4 h-4 text-emerald-700" />,
      label: 'Accessibility',
      value: settings.accessibility || 'Open Access (CC-BY-NC 4.0)',
    },
    {
      icon: <FileCheck className="w-4 h-4 text-rose-700" />,
      label: 'Plagiarism & AI Limits',
      value: `${settings.plagiarismLimit || '25% Allowed'} | AI: ${settings.aiContentLimit || '10% Allowed'}`,
    },
    {
      icon: <DollarSign className="w-4 h-4 text-amber-800" />,
      label: 'Article Processing Charges (APC)',
      value: `Online: ${settings.apcOnline || '1800 INR'} | Print+Online: ${settings.apcPrint || '2300 INR'}`,
    },
  ];

  return (
    <div className="bg-[#fffdfa] rounded-2xl shadow-xs border border-amber-200/80 overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-amber-100/70 via-amber-50 to-[#fffdf5] text-stone-900 px-6 py-4 flex items-center justify-between border-b border-amber-200/80">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-amber-700" />
          <h2 className="font-serif font-bold text-base sm:text-lg text-stone-900">
            Journal Identification &amp; Key Parameters
          </h2>
        </div>
        <span className="text-xs bg-amber-200/90 text-amber-950 font-bold px-3 py-1 rounded-full border border-amber-300 shadow-2xs">
          Refereed &amp; Indexed
        </span>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profileItems.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg bg-amber-50/30 border border-amber-200/70 hover:bg-white hover:border-amber-400 hover:shadow-2xs transition-all"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 mb-1">
                {item.icon}
                <span>{item.label}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-sm text-amber-900 hover:text-amber-950 flex items-center gap-1 hover:underline"
                  >
                    <span>{item.value}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span
                    className={`text-sm font-bold ${
                      item.highlight ? 'text-amber-950 font-mono text-base' : 'text-stone-900'
                    }`}
                  >
                    {item.value}
                  </span>
                )}
                {item.badge && (
                  <span className="text-[10px] uppercase font-extrabold bg-amber-100 text-amber-950 px-1.5 py-0.5 rounded border border-amber-200">
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action callouts */}
        <div className="mt-6 pt-5 border-t border-amber-200/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-stone-600">
            Powered by <strong className="text-stone-900">Zenodo (CERN / OpenAIRE)</strong> &amp; <strong className="text-stone-900">CrossRef DOIs</strong> for permanent academic archiving.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/page/manuscript-guidelines"
              className="font-semibold text-amber-900 hover:text-amber-950 hover:underline"
            >
              View Author Guidelines &rarr;
            </Link>
            <Link
              href="/page/publication-charges"
              className="font-semibold text-stone-700 hover:text-stone-950 hover:underline"
            >
              APC Fee Details &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
