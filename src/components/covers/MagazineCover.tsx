'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React from 'react';
import { BookOpen, Award, ShieldCheck } from 'lucide-react';

interface MagazineCoverProps {
  volumeNumber: number | string;
  issueNumber: string;
  year?: number | string;
  monthYear?: string;
  title?: string;
  coverImage?: string | null;
  size?: 'sm' | 'md' | 'lg';
  isCurrent?: boolean;
}

export const MagazineCover: React.FC<MagazineCoverProps> = ({
  volumeNumber,
  issueNumber,
  year = '2026',
  monthYear = 'January - June 2026',
  title,
  coverImage,
  size = 'md',
  isCurrent = false,
}) => {
  // Dimension styles based on size
  const sizeClasses = {
    sm: 'w-36 h-52 text-[10px]',
    md: 'w-52 h-72 text-xs',
    lg: 'w-64 h-88 text-sm',
  }[size];

  return (
    <div className={`relative group select-none ${sizeClasses} flex-shrink-0 transition-transform duration-300 hover:scale-[1.02]`}>
      {/* 3D Book Container */}
      <div className="relative w-full h-full rounded-r-lg rounded-l-xs overflow-hidden shadow-xl hover:shadow-2xl border-r-2 border-b-2 border-slate-700/40 transition-shadow">
        {/* If custom cover image is uploaded */}
        {coverImage ? (
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${coverImage})` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-black/20" />
          </div>
        ) : (
          /* Prestigious Academic Print Magazine Styling */
          <div className="w-full h-full bg-gradient-to-br from-navy-950 via-primary-950 to-slate-900 text-white flex flex-col justify-between p-4 relative">
            {/* Top Academic Banner */}
            <div className="relative z-10 border-b border-amber-500/30 pb-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] font-extrabold tracking-widest text-amber-400 uppercase">
                  ISSN 2349-2015
                </span>
                <span className="bg-amber-500/20 text-amber-300 text-[8px] font-bold px-1.5 py-0.5 rounded border border-amber-400/30">
                  IF: 6.74
                </span>
              </div>
              <p className="text-[9px] font-serif text-slate-300 mt-1 uppercase tracking-wider font-semibold">
                National Research Journal
              </p>
              <h4 className="font-serif font-bold text-amber-400 text-xs tracking-tight leading-tight">
                Business Economics
              </h4>
            </div>

            {/* Middle Feature Graphic / Badge */}
            <div className="relative z-10 my-auto text-center py-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-2 shadow-inner">
                <BookOpen className="w-6 h-6 text-amber-400" />
              </div>
              <div className="bg-white/10 backdrop-blur-xs py-1.5 px-3 rounded-lg border border-white/10">
                <span className="block font-serif font-extrabold text-white text-sm">
                  VOLUME {volumeNumber}
                </span>
                <span className="block text-amber-300 text-[10px] font-bold uppercase tracking-widest">
                  ISSUE {issueNumber}
                </span>
              </div>
              <p className="text-[9px] text-slate-300 mt-1.5 font-medium">
                {monthYear}
              </p>
            </div>

            {/* Bottom Publisher Band */}
            <div className="relative z-10 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[8px] text-slate-400">
              <span className="font-semibold text-slate-300 truncate">National Press Associates</span>
              <span className="font-mono text-amber-400/90 font-bold">{year}</span>
            </div>

            {/* Elegant Background Watermark Texture */}
            <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
              <BookOpen className="w-48 h-48" />
            </div>
          </div>
        )}

        {/* 3D Physical Spine Simulation (Left bound edge) */}
        <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none" />
        <div className="absolute top-0 bottom-0 left-0.5 w-[1px] bg-white/20 pointer-events-none" />

        {/* Glossy Sheen Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none" />

        {/* Current Issue Ribbon Badge */}
        {isCurrent && (
          <div className="absolute -top-1 -right-1 z-20 overflow-hidden w-16 h-16 pointer-events-none">
            <div className="bg-amber-500 text-navy-950 font-extrabold text-[8px] uppercase tracking-wider py-0.5 text-center shadow-md rotate-45 transform translate-x-4 translate-y-2 w-20">
              Current
            </div>
          </div>
        )}
      </div>

      {/* Realistic Book Pages Bottom Shadow */}
      <div className="absolute -bottom-1.5 left-2 right-1 h-1.5 bg-slate-300 rounded-b-sm shadow-inner border border-slate-400/40 pointer-events-none flex items-center justify-end pr-1">
        <div className="w-full h-[1px] bg-slate-400/50" />
      </div>
    </div>
  );
};
