/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React from 'react';
import type { Metadata } from 'next';
import { db } from '@/lib/db';
import Link from 'next/link';
import { Archive, BookOpen, Calendar, ChevronRight, FileText, ShoppingBag, Truck } from 'lucide-react';
import { MagazineCover } from '@/components/covers/MagazineCover';
import { AddToCartButton } from '@/components/cart/AddToCartButton';

export const metadata: Metadata = {
  title: 'Journal Archives',
  description: 'Access the complete volume and issue archives of the National Research Journal of Business Economics.',
};

export const revalidate = 0;

export default async function ArchivesPage() {
  const volumes = await db.volume.findMany({
    orderBy: { volumeNumber: 'desc' },
    include: {
      issues: {
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { articles: true } },
        },
      },
    },
  });

  return (
    <div className="py-10 bg-slate-50 min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Archives Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="flex items-center gap-3 text-primary-800 mb-2">
            <Archive className="w-6 h-6 text-accent" />
            <span className="text-xs font-bold uppercase tracking-wider bg-primary-50 px-2.5 py-0.5 rounded border border-primary-200">
              Publication Archives
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900">
            Journal Archives &amp; Past Volumes
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Browse through all previously published volumes and issues of National Research Journal of Business Economics. All historical articles remain permanently accessible in open-access format with DOIs and author certificates.
          </p>
        </div>

        {/* Volumes and Issues Accordion/Grid */}
        <div className="space-y-6">
          {volumes.map((vol) => (
            <div key={vol.id} className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-100 via-blue-50/50 to-amber-50/30 text-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary-800" />
                  <div>
                    <h2 className="font-serif font-bold text-base sm:text-lg text-navy-950">
                      {vol.title}
                    </h2>
                    <span className="text-xs text-slate-500">Publication Year: {vol.year}</span>
                  </div>
                </div>
                <span className="text-xs bg-white text-slate-700 px-3 py-1 rounded-full font-semibold border border-slate-200 shadow-2xs">
                  {vol.issues.length} {vol.issues.length === 1 ? 'Issue' : 'Issues'}
                </span>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vol.issues.map((iss) => (
                    <div
                      key={iss.id}
                      className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-primary-300 hover:bg-white transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <MagazineCover
                              volumeNumber={vol.volumeNumber}
                              issueNumber={iss.issueNumber}
                              year={vol.year}
                              monthYear={iss.monthYear}
                              coverImage={iss.coverImage}
                              size="sm"
                              isCurrent={iss.isCurrent}
                            />
                          </div>

                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-xs font-bold font-mono text-primary-800 bg-primary-50 px-2 py-0.5 rounded border border-primary-100">
                                Issue {iss.issueNumber}
                              </span>
                              {iss.isCurrent && (
                                <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                                  Current Issue
                                </span>
                              )}
                            </div>
                            <h3 className="font-serif font-bold text-sm sm:text-base text-navy-900 leading-snug">
                              {iss.title}
                            </h3>
                            <p className="text-xs text-slate-500">
                              Period: {iss.monthYear || 'Published'}
                            </p>
                            <div className="pt-1">
                              <span className="text-sm font-extrabold text-navy-900">
                                ₹{iss.printPrice || 450}
                              </span>
                              <span className="text-[10px] text-slate-500 ml-1">INR (Print Copy)</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                        <Link
                          href={`/current-issue?issueId=${iss.id}`}
                          className="inline-flex items-center gap-1 font-semibold text-primary-700 hover:text-primary-900 group"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span>{iss._count.articles} Papers (Free PDF)</span>
                        </Link>

                        <AddToCartButton
                          id={`issue-${iss.id}`}
                          type="print_issue"
                          title={`${iss.title} - Hardcopy Edition`}
                          subtitle={`Volume ${vol.volumeNumber}, Issue ${iss.issueNumber}`}
                          price={iss.printPrice || 450}
                          badge="Print Copy"
                          label="Order Print Copy"
                          className="bg-amber-500 hover:bg-amber-600 text-navy-950 text-xs font-bold py-1.5 px-3 rounded-lg shadow-xs transition-all flex items-center gap-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
