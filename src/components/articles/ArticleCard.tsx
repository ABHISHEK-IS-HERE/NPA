'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Award,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Quote,
  Eye,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { CitationModal } from './CitationModal';

export interface ArticleData {
  id: number;
  paperId: string;
  title: string;
  authors: string;
  affiliations?: string | null;
  abstract: string;
  keywords: string;
  doi?: string | null;
  pageRange?: string | null;
  pdfUrl?: string | null;
  certificateUrl?: string | null;
  publishedAt?: Date | string | null;
  issue?: {
    id?: number;
    title?: string;
    issueNumber?: string;
    volume?: {
      volumeNumber?: number;
      year?: number;
    };
  };
}

interface ArticleCardProps {
  article: ArticleData;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const [expanded, setExpanded] = useState(false);
  const [citationModalOpen, setCitationModalOpen] = useState(false);

  const keywordsList = article.keywords
    ? article.keywords.split(',').map((k) => k.trim()).filter(Boolean)
    : [];

  return (
    <article className="academic-card p-5 sm:p-6 mb-4 border border-slate-200">
      {/* Top Meta: Paper ID, DOI Badge, Page Numbers */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded border border-primary-200">
            {article.paperId}
          </span>
          {article.pageRange && (
            <span className="text-slate-500 font-medium">
              pp. {article.pageRange}
            </span>
          )}
          {article.issue?.title && (
            <span className="hidden sm:inline text-slate-400">
              • {article.issue.title}
            </span>
          )}
        </div>

        {article.doi && (
          <a
            href={article.doi}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 transition-colors"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span className="truncate max-w-[200px] sm:max-w-xs">{article.doi.replace('https://doi.org/', 'doi:')}</span>
            <ExternalLink className="w-3 h-3 text-emerald-600" />
          </a>
        )}
      </div>

      {/* Paper Title */}
      <h3 className="text-base sm:text-lg font-serif font-bold text-navy-900 leading-snug hover:text-primary-700 transition-colors mb-2">
        <Link href={`/article/${article.id}`}>
          {article.title}
        </Link>
      </h3>

      {/* Authors & Affiliations */}
      <div className="text-xs sm:text-sm text-slate-700 mb-3">
        <span className="font-semibold text-slate-900">Author(s): </span>
        <span className="text-primary-900 font-medium">{article.authors}</span>
        {article.affiliations && (
          <p className="text-xs text-slate-500 italic mt-0.5">
            {article.affiliations}
          </p>
        )}
      </div>

      {/* Abstract preview with Expand toggle */}
      <div className="mb-4">
        <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          <span className="font-bold text-slate-800 uppercase text-xs tracking-wider mr-1">
            Abstract:
          </span>
          {expanded ? (
            <span>{article.abstract}</span>
          ) : (
            <span>{article.abstract.slice(0, 240)}...</span>
          )}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 hover:text-primary-900 mt-1 transition-colors"
        >
          <span>{expanded ? 'Collapse Abstract' : 'Read Full Abstract'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Keywords Tags */}
      {keywordsList.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          <span className="text-[11px] font-semibold text-slate-400">Keywords:</span>
          {keywordsList.map((kw, i) => (
            <span
              key={i}
              className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded transition-colors"
            >
              {kw}
            </span>
          ))}
        </div>
      )}

      {/* Action Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          {/* View / Download PDF */}
          <a
            href={article.pdfUrl || `/uploads/papers/${article.paperId}.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-primary-700 hover:bg-primary-800 text-white shadow-sm transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-amber-300" />
            <span>View Full PDF</span>
          </a>

          {/* Download Certificate */}
          <a
            href={article.certificateUrl || `/uploads/certificates/cert-${article.paperId}.pdf`}
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors"
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Download Certificate</span>
          </a>

          {/* Cite Paper */}
          <button
            onClick={() => setCitationModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
          >
            <Quote className="w-3.5 h-3.5 text-slate-500" />
            <span>Cite</span>
          </button>
        </div>

        {/* View Details Page Link */}
        <Link
          href={`/article/${article.id}`}
          className="text-xs font-semibold text-primary-700 hover:text-primary-900 inline-flex items-center gap-1 hover:underline ml-auto"
        >
          <span>Article Details &amp; Metrics</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Citation Modal */}
      <CitationModal
        isOpen={citationModalOpen}
        onClose={() => setCitationModalOpen(false)}
        article={article}
      />
    </article>
  );
};
