/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/lib/db';
import { getTopicBySlug, RESEARCH_TOPICS } from '@/lib/topics';
import { BookOpen, ArrowRight, Tag, ShieldCheck, Award, FileText } from 'lucide-react';
import { ArticleCard } from '@/components/articles/ArticleCard';

interface TopicPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return RESEARCH_TOPICS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const topic = getTopicBySlug(params.slug);
  if (!topic) return { title: 'Topic Not Found' };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://npa-puce.vercel.app';

  return {
    title: `${topic.title} — Research Papers & Special Track`,
    description: `${topic.shortDescription} Explore peer-reviewed academic literature published in National Research Journal of Business Economics.`,
    alternates: {
      canonical: `${baseUrl}/topics/${topic.slug}`,
    },
    keywords: [
      ...topic.keywords,
      ...topic.jelCodes.map((j) => `JEL ${j}`),
      'NRJBE',
      'Research Journal',
      'Business Economics',
      'Peer Reviewed Articles',
      'Open Access',
    ],
    openGraph: {
      title: `${topic.title} | NRJBE Journal`,
      description: topic.shortDescription,
      url: `${baseUrl}/topics/${topic.slug}`,
      type: 'website',
      siteName: 'National Research Journal of Business Economics',
    },
  };
}

export default async function TopicHubPage({ params }: TopicPageProps) {
  const topic = getTopicBySlug(params.slug);
  if (!topic) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://npa-puce.vercel.app';

  // Find articles matching topic keywords
  const matchedArticles = await db.article.findMany({
    where: {
      status: 'Published',
      OR: topic.keywords.map((kw) => ({
        OR: [
          { title: { contains: kw, mode: 'insensitive' } },
          { abstract: { contains: kw, mode: 'insensitive' } },
          { keywords: { contains: kw, mode: 'insensitive' } },
        ],
      })),
    },
    include: {
      issue: { include: { volume: true } },
    },
    orderBy: { publishedAt: 'desc' },
  });

  // If no direct matches, fallback to recent published articles so the page is rich with content
  const displayArticles =
    matchedArticles.length > 0
      ? matchedArticles
      : await db.article.findMany({
          where: { status: 'Published' },
          include: { issue: { include: { volume: true } } },
          orderBy: { publishedAt: 'desc' },
          take: 6,
        });

  // Schema.org CollectionPage
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${topic.title} Research Papers`,
    description: topic.longDescription,
    url: `${baseUrl}/topics/${topic.slug}`,
    isPartOf: {
      '@type': 'Periodical',
      name: 'National Research Journal of Business Economics',
      issn: '2349-2015',
    },
    about: topic.keywords.map((k) => ({
      '@type': 'Thing',
      name: k,
    })),
  };

  return (
    <div className="py-10 bg-[#fdfbf2] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-8 font-medium">
          <Link href="/" className="hover:text-primary-800 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/archives" className="hover:text-primary-800 transition-colors">Research Tracks</Link>
          <span>/</span>
          <span className="text-stone-900 font-serif font-bold truncate">{topic.title}</span>
        </nav>

        {/* Topic Masthead Header */}
        <div className="bg-white border-y-2 border-stone-900 p-8 sm:p-12 mb-10 shadow-xs">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-300 text-xs font-serif font-bold uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5" />
              Special Research Track
            </span>
            {topic.jelCodes.map((code) => (
              <span
                key={code}
                className="px-2.5 py-1 bg-stone-100 text-stone-700 border border-stone-200 text-xs font-mono font-medium"
              >
                JEL: {code}
              </span>
            ))}
          </div>

          <h1 className="font-serif font-bold text-2xl sm:text-4xl text-stone-950 mb-4 tracking-tight leading-tight">
            {topic.title}
          </h1>

          <p className="text-base sm:text-lg text-stone-700 font-serif leading-relaxed max-w-4xl mb-6">
            {topic.longDescription}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-stone-200">
            <div className="flex flex-wrap gap-2 items-center text-xs text-stone-600">
              <span className="font-bold text-stone-900">Key Focus Areas:</span>
              {topic.keywords.slice(0, 6).map((kw) => (
                <span key={kw} className="capitalize bg-stone-50 px-2 py-0.5 border border-stone-200 rounded-xs">
                  {kw}
                </span>
              ))}
            </div>

            <Link
              href="/submit-paper"
              className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-[#fdfbf2] text-xs font-bold uppercase tracking-wider px-5 py-2.5 transition-colors shadow-xs"
            >
              <span>Submit Manuscript in this Track</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Articles Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between border-b-2 border-stone-900 pb-3 mb-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-primary-800" />
              <h2 className="font-serif font-bold text-xl text-stone-950">
                Published Research & Empirical Studies
              </h2>
            </div>
            <span className="text-xs font-mono text-stone-600">
              {displayArticles.length} {displayArticles.length === 1 ? 'Article' : 'Articles'} Indexed
            </span>
          </div>

          <div className="space-y-4">
            {displayArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>

        {/* Explore Other Research Tracks */}
        <div className="border-t border-stone-300 pt-10">
          <h3 className="font-serif font-bold text-lg text-stone-900 mb-4">
            Explore Other Research Tracks & JEL Subject Classifications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RESEARCH_TOPICS.filter((t) => t.slug !== topic.slug).map((other) => (
              <Link
                key={other.slug}
                href={`/topics/${other.slug}`}
                className="group bg-white p-5 border border-stone-200 hover:border-stone-900 transition-all shadow-xs"
              >
                <div className="flex items-center gap-2 text-xs font-mono text-stone-500 mb-2">
                  {other.jelCodes.slice(0, 2).map((c) => (
                    <span key={c}>JEL: {c}</span>
                  ))}
                </div>
                <h4 className="font-serif font-bold text-stone-900 group-hover:text-primary-800 transition-colors mb-1 text-sm">
                  {other.title}
                </h4>
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {other.shortDescription}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
