'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React from 'react';
import Link from 'next/link';
import { Bell, Sparkles, ChevronRight } from 'lucide-react';

interface Announcement {
  id: number;
  title: string;
  linkUrl?: string | null;
  badgeText?: string | null;
}

interface AnnouncementTickerProps {
  announcements: Announcement[];
  defaultBannerText?: string;
  isActive?: boolean;
}

export const AnnouncementTicker: React.FC<AnnouncementTickerProps> = ({
  announcements,
  defaultBannerText,
  isActive = true,
}) => {
  if (!isActive) return null;

  const items = announcements.length > 0 ? announcements : [
    {
      id: 1,
      title: defaultBannerText || 'CALL FOR PAPERS 2026 (July-December) - Fast-Track Double-Blind Peer Review & Zenodo DOI Assignment',
      linkUrl: '/submit-paper',
      badgeText: 'CALL FOR PAPERS',
    },
  ];

  return (
    <div className="bg-amber-50/95 text-amber-950 text-xs font-semibold py-2 px-4 shadow-2xs overflow-hidden border-b border-amber-200/80">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        {/* Fixed Announcement Badge */}
        <div className="flex items-center gap-1.5 bg-amber-500 text-slate-950 px-2.5 py-1 rounded shadow-2xs text-xs font-bold uppercase tracking-wider flex-shrink-0">
          <Bell className="w-3.5 h-3.5 animate-bounce text-slate-950" />
          <span>Announcements</span>
        </div>

        {/* Continuous Ticker Content */}
        <div className="relative overflow-hidden w-full whitespace-nowrap flex-1">
          <div className="inline-flex gap-8 animate-marquee">
            {items.concat(items).map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="inline-flex items-center gap-2">
                {item.badgeText && (
                  <span className="bg-amber-200/90 text-amber-950 text-[10px] px-2 py-0.5 rounded font-bold uppercase border border-amber-300">
                    {item.badgeText}
                  </span>
                )}
                {item.linkUrl ? (
                  <Link
                    href={item.linkUrl}
                    className="hover:underline flex items-center gap-1 text-amber-950 hover:text-primary-800 transition-colors"
                  >
                    <span>{item.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                  </Link>
                ) : (
                  <span>{item.title}</span>
                )}
                <span className="text-amber-400 font-bold mx-2">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
