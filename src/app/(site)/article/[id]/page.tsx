import React from 'react';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  FileText,
  Award,
  ExternalLink,
  Calendar,
  Eye,
  Download,
  Share2,
  CheckCircle2,
  ArrowLeft,
  Quote,
  ShieldCheck,
} from 'lucide-react';
import { CitationModal } from '@/components/articles/CitationModal';
import { ArticleActionButtons } from '@/components/articles/ArticleActionButtons';

interface ArticlePageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await db.article.findUnique({
    where: { id: Number(params.id) },
    include: {
      issue: { include: { volume: true } },
    },
  });

  if (!article) return { title: 'Article Not Found' };

  const firstPage = article.pageRange?.split('-')[0]?.trim() || '';
  const lastPage = article.pageRange?.split('-')[1]?.trim() || '';
  const pubDate = article.publishedAt.toISOString().split('T')[0];

  return {
    title: `${article.title} | NRJBE`,
    description: article.abstract.slice(0, 160),
    other: {
      'citation_title': article.title,
      'citation_author': article.authors,
      'citation_publication_date': pubDate,
      'citation_journal_title': 'National Research Journal of Business Economics',
      'citation_issn': '2349-2015',
      'citation_volume': String(article.issue?.volume?.volumeNumber || '12'),
      'citation_issue': String(article.issue?.issueNumber || '1'),
      'citation_firstpage': firstPage,
      'citation_lastpage': lastPage,
      'citation_doi': article.doi || '',
      'citation_pdf_url': `https://nrjbe.in${article.pdfUrl || `/uploads/papers/${article.paperId}.pdf`}`,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await db.article.findUnique({
    where: { id: Number(params.id) },
    include: {
      issue: { include: { volume: true } },
    },
  });

  if (!article) notFound();

  // Increment view count asynchronously
  await db.article.update({
    where: { id: article.id },
    data: { views: { increment: 1 } },
  });

  const keywordsList = article.keywords
    ? article.keywords.split(',').map((k) => k.trim()).filter(Boolean)
    : [];

  return (
    <div className="py-8 bg-slate-50 min-h-[70vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Link href="/" className="hover:text-primary-700">Home</Link>
          <span>/</span>
          <Link href="/current-issue" className="hover:text-primary-700">
            {article.issue?.title || 'Current Issue'}
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-mono truncate max-w-xs">{article.paperId}</span>
        </div>

        {/* Main Article Container */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-10 space-y-6">
          {/* Header Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-primary-800 bg-primary-50 px-2.5 py-0.5 rounded border border-primary-200">
                {article.paperId}
              </span>
              <span className="text-slate-500">
                {article.issue?.title} • pp. {article.pageRange}
              </span>
            </div>

            {article.doi && (
              <a
                href={article.doi}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded border border-emerald-200 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{article.doi}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-3xl font-serif font-bold text-navy-900 leading-snug">
            {article.title}
          </h1>

          {/* Authors and Affiliations */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <div className="text-sm sm:text-base font-semibold text-slate-900">
              {article.authors}
            </div>
            {article.affiliations && (
              <p className="text-xs sm:text-sm text-slate-600 italic">
                {article.affiliations}
              </p>
            )}
          </div>

          {/* Action Buttons Bar: View PDF, Certificate, Cite */}
          <ArticleActionButtons article={article} />

          {/* Abstract */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900 flex items-center gap-2">
              <span>Abstract</span>
            </h2>
            <div className="text-sm sm:text-base text-slate-700 leading-relaxed space-y-2 whitespace-pre-line text-justify">
              {article.abstract}
            </div>
          </div>

          {/* Keywords */}
          {keywordsList.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Keywords &amp; Indexing Terms:
              </h3>
              <div className="flex flex-wrap gap-2">
                {keywordsList.map((kw, i) => (
                  <span
                    key={i}
                    className="text-xs bg-slate-100 text-slate-800 px-3 py-1 rounded-md border border-slate-200 font-medium"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metrics & Archival Notice */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-primary-600" />
                <span>Views: <strong className="text-slate-900">{article.views}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Downloads: <strong className="text-slate-900">{article.downloads}</strong></span>
              </div>
            </div>

            <div className="text-right text-slate-500">
              Published: {new Date(article.publishedAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href="/current-issue"
            className="inline-flex items-center gap-2 text-xs font-semibold text-primary-700 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Current Issue</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
