import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { MagazineCover } from '@/components/covers/MagazineCover';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import {
  ShoppingBag,
  BookOpen,
  Truck,
  ShieldCheck,
  CheckCircle,
  Award,
  Sparkles,
  FileCheck,
  PackageCheck,
  Clock,
  ExternalLink,
} from 'lucide-react';

export const revalidate = 0;

export default async function JournalStorePage() {
  const [issues, plans, settings] = await Promise.all([
    db.issue.findMany({
      orderBy: [{ volume: { volumeNumber: 'desc' } }, { issueNumber: 'desc' }],
      include: {
        volume: true,
        _count: { select: { articles: true } },
      },
    }),
    db.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    }),
    db.siteSetting.findFirst({ where: { id: 1 } }),
  ]);

  return (
    <div className="space-y-12 pb-16">
      {/* Store Hero Banner */}
      <section className="bg-gradient-to-r from-navy-950 via-primary-950 to-navy-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-navy-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="bg-amber-500 text-navy-950 text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full">
                NRJBE Official Store &amp; Print Editions
              </span>
              <span className="text-xs text-slate-300 font-mono">
                ISSN: 2349-2015 • Impact Factor: 6.74
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Order Physical Journal Copies &amp; Subscription Packages
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Purchase physical bound magazine issues, register institutional library subscriptions, or order author publication fee packages with fast dispatch via India Post Speed Post.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Free Postal Delivery Across India</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Double Blind Refereed Edition</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-primary-400" />
                <span>Zenodo DOI Indexed</span>
              </span>
            </div>
          </div>

          {/* Quick Showcase Card */}
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-xs flex items-center gap-4 max-w-sm flex-shrink-0">
            <div className="w-20 h-28 flex-shrink-0">
              <MagazineCover
                volumeNumber="12"
                issueNumber="1"
                year="2026"
                monthYear="Jan - Jun 2026"
                size="sm"
                isCurrent
              />
            </div>
            <div className="space-y-1.5 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Latest Available Issue
              </span>
              <h4 className="text-xs font-bold text-white leading-snug">
                Vol 12, Issue 1 (2026) Hard Copy
              </h4>
              <p className="text-[11px] text-slate-300">Delivered in 2-3 business days</p>
              <div className="pt-1">
                <AddToCartButton
                  id="featured-vol-12-iss-1"
                  type="print_issue"
                  title="Vol 12, Issue 1 (Jan - Jun 2026) - Hard Copy"
                  subtitle="ISSN: 2349-2015 • Printed on 80 GSM Bond Paper"
                  price={450}
                  badge="Print Copy"
                  label="Quick Buy: ₹450"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-navy-950 text-xs font-bold py-1.5 px-3 rounded-lg shadow transition-all flex items-center justify-center gap-1.5"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* SECTION 1: PHYSICAL PRINT COPIES & ISSUES CATALOG */}
        <section id="print-issues" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-primary-100 text-primary-800 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
                  Physical Journal Copies
                </span>
                <span className="text-xs text-slate-500 font-medium">Delivered to your address</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-navy-900 mt-1">
                Hardcopy Magazine Issues &amp; Bound Volumes
              </h2>
            </div>
            <p className="text-xs text-slate-500 sm:text-right max-w-xs">
              Printed on premium 80 GSM bond paper with 300 GSM glossy laminated cover.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((iss) => {
              const issuePrice = iss.printPrice || 450;
              return (
                <div
                  key={iss.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between group"
                >
                  <div className="flex gap-4">
                    {/* 3D Cover */}
                    <div className="flex-shrink-0">
                      <MagazineCover
                        volumeNumber={iss.volume.volumeNumber}
                        issueNumber={iss.issueNumber}
                        year={iss.volume.year}
                        monthYear={iss.monthYear}
                        coverImage={iss.coverImage}
                        size="sm"
                        isCurrent={iss.isCurrent}
                      />
                    </div>

                    {/* Metadata & Details */}
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {iss.isCurrent ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                            Current Issue
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                            Archive Issue
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-medium">
                          {iss._count.articles} Papers Included
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-navy-900 text-sm leading-snug line-clamp-2 group-hover:text-primary-800 transition-colors">
                        {iss.title}
                      </h3>

                      <p className="text-[11px] text-slate-500">
                        Period: <strong>{iss.monthYear}</strong>
                      </p>

                      <div className="pt-1">
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-extrabold text-navy-900">
                            ₹{issuePrice}
                          </span>
                          <span className="text-xs text-slate-500">INR</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                          <Truck className="w-3 h-3" />
                          <span>Includes Free Speed Post</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      href={iss.isCurrent ? '/current-issue' : `/archives#issue-${iss.id}`}
                      className="text-xs font-semibold text-slate-600 hover:text-primary-700 flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Table of Contents</span>
                    </Link>

                    <AddToCartButton
                      id={`issue-${iss.id}`}
                      type="print_issue"
                      title={`${iss.title} - Hardcopy Print Edition`}
                      subtitle={`Volume ${iss.volume.volumeNumber}, Issue ${iss.issueNumber} • Delivered via Speed Post`}
                      price={issuePrice}
                      badge="Print Copy"
                      label="Buy Hardcopy"
                      className="bg-primary-700 hover:bg-primary-800 text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-xs transition-all flex items-center gap-1.5"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 2: ANNUAL SUBSCRIPTION PACKAGES */}
        <section id="subscriptions" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
                  Annual Plans
                </span>
                <span className="text-xs text-slate-500 font-medium">Individual &amp; Institutional Tiers</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-navy-900 mt-1">
                Journal Subscriptions &amp; Library Packages
              </h2>
            </div>
            <p className="text-xs text-slate-500 sm:text-right max-w-xs">
              Guaranteed delivery of biannual issues + perpetual digital repository access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              let features: string[] = [];
              try {
                features = JSON.parse(plan.featuresJson);
              } catch (e) {
                features = ['Printed journal copies delivered', 'Full digital archive access'];
              }

              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-2xl p-6 border transition-all flex flex-col justify-between relative ${
                    plan.isPopular
                      ? 'border-2 border-amber-500 shadow-lg ring-4 ring-amber-500/10'
                      : 'border-slate-200 shadow-xs hover:shadow-md'
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-500 text-navy-950 text-[10px] font-extrabold uppercase tracking-wider py-0.5 px-3 rounded-full shadow-xs">
                      Most Popular Tier
                    </div>
                  )}

                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {plan.planType} Tier
                    </span>
                    <h3 className="text-lg font-serif font-bold text-navy-900 mt-1">
                      {plan.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {plan.format} • {plan.duration}
                    </p>

                    <div className="my-5 pb-5 border-b border-slate-100">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-serif font-bold text-navy-900">
                          ₹{plan.priceInr.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">/ Year</span>
                      </div>
                      {plan.priceUsd && (
                        <p className="text-xs text-slate-400 mt-0.5">(${plan.priceUsd} USD for international)</p>
                      )}
                    </div>

                    <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                      {features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <AddToCartButton
                    id={`plan-${plan.id}`}
                    type="subscription"
                    title={plan.title}
                    subtitle={`${plan.format} • ${plan.duration}`}
                    price={plan.priceInr}
                    badge="Annual Plan"
                    label={`Subscribe (₹${plan.priceInr.toLocaleString('en-IN')})`}
                    className={`w-full text-xs font-bold py-3 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 ${
                      plan.isPopular
                        ? 'bg-amber-500 hover:bg-amber-600 text-navy-950'
                        : 'bg-navy-900 hover:bg-navy-950 text-white'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: AUTHOR PUBLISHING PACKAGES & APC SERVICES */}
        <section id="author-packages" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
                  Author Services
                </span>
                <span className="text-xs text-slate-500 font-medium">After Manuscript Acceptance</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-navy-900 mt-1">
                Article Processing Charges &amp; Certificate Bundles
              </h2>
            </div>
            <p className="text-xs text-slate-500 sm:text-right max-w-xs">
              Instant receipt generation with university refund / reimbursement invoice format.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Package 1: APC Online */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center mb-3">
                  <FileCheck className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-navy-900">
                  Online Open Access Publication
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  For accepted manuscripts requiring permanent online indexing.
                </p>

                <div className="my-4 pb-4 border-b border-slate-100">
                  <span className="text-2xl font-bold text-navy-900">₹1,800</span>
                  <span className="text-xs text-slate-500 ml-1">INR</span>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Zenodo &amp; CrossRef DOI Assignment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Permanent Open Access (CC BY-NC)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Electronic Publication Certificate</span>
                  </li>
                </ul>
              </div>

              <AddToCartButton
                id="apc-online"
                type="apc"
                title="APC - Online Open Access Publication"
                subtitle="DOI Assignment + E-Certificate"
                price={1800}
                badge="APC Fee"
                label="Pay APC (₹1,800)"
                className="w-full bg-primary-700 hover:bg-primary-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              />
            </div>

            {/* Package 2: APC Print Bundle */}
            <div className="bg-white rounded-2xl p-6 border-2 border-primary-600 shadow-md flex flex-col justify-between relative">
              <div className="absolute -top-3 right-4 bg-primary-700 text-white text-[10px] font-extrabold uppercase tracking-wider py-0.5 px-2.5 rounded-full shadow-xs">
                Author Recommended
              </div>

              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                  <PackageCheck className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-navy-900">
                  Publication + Hardcopy Print Bundle
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Complete package including physical printed journal copy and certificate.
                </p>

                <div className="my-4 pb-4 border-b border-slate-100">
                  <span className="text-2xl font-bold text-navy-900">₹2,300</span>
                  <span className="text-xs text-slate-500 ml-1">INR</span>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>All Online Open Access benefits + DOI</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Physical Printed Journal Copy Mailed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Printed Author Certificate with Hologram</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Speed Post Dispatch with Tracking</span>
                  </li>
                </ul>
              </div>

              <AddToCartButton
                id="apc-print-bundle"
                type="apc"
                title="APC Bundle - Publication + Print Issue + Certificate"
                subtitle="Includes Physical Journal & Hologram Certificate"
                price={2300}
                badge="Complete Bundle"
                label="Buy Complete Bundle (₹2,300)"
                className="w-full bg-amber-500 hover:bg-amber-600 text-navy-950 text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              />
            </div>

            {/* Package 3: Extra Certificate */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-navy-900">
                  Extra Printed Certificate (Co-Authors)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Additional original hardcopy certificates for secondary authors.
                </p>

                <div className="my-4 pb-4 border-b border-slate-100">
                  <span className="text-2xl font-bold text-navy-900">₹400</span>
                  <span className="text-xs text-slate-500 ml-1">INR per copy</span>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Original Embossed Security Hologram</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Individual Co-Author Name Verification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dispatched in Rigid Protective Envelope</span>
                  </li>
                </ul>
              </div>

              <AddToCartButton
                id="extra-certificate"
                type="certificate"
                title="Extra Hardcopy Author Certificate"
                subtitle="Printed Certificate with Security Hologram"
                price={400}
                badge="Certificate"
                label="Order Certificate (₹400)"
                className="w-full bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
