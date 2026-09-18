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
    <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-navy-950 text-xs font-semibold py-2 px-4 shadow-inner overflow-hidden border-b border-amber-400">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        {/* Fixed Announcement Badge */}
        <div className="flex items-center gap-1.5 bg-navy-950 text-amber-400 px-2.5 py-1 rounded shadow-sm text-xs font-bold uppercase tracking-wider flex-shrink-0">
          <Bell className="w-3.5 h-3.5 animate-bounce text-amber-400" />
          <span>Announcements</span>
        </div>

        {/* Continuous Ticker Content */}
        <div className="relative overflow-hidden w-full whitespace-nowrap flex-1">
          <div className="inline-flex gap-8 animate-marquee">
            {items.concat(items).map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="inline-flex items-center gap-2">
                {item.badgeText && (
                  <span className="bg-navy-900/90 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                    {item.badgeText}
                  </span>
                )}
                {item.linkUrl ? (
                  <Link
                    href={item.linkUrl}
                    className="hover:underline flex items-center gap-1 text-navy-950 hover:text-black transition-colors"
                  >
                    <span>{item.title}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <span>{item.title}</span>
                )}
                <span className="text-navy-950/40 font-bold mx-2">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
