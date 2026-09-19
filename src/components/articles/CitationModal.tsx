'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React, { useState } from 'react';
import { X, Copy, Check, Quote, Download } from 'lucide-react';
import { generateBibtex, generateApaCitation } from '@/lib/utils';

interface CitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: {
    id?: number;
    title: string;
    authors: string;
    doi?: string | null;
    pageRange?: string | null;
    publishedAt?: Date | string | null;
    paperId?: string;
    issue?: {
      title?: string;
      volume?: { volumeNumber?: number };
      issueNumber?: string;
    };
  };
}

export const CitationModal: React.FC<CitationModalProps> = ({ isOpen, onClose, article }) => {
  const [activeTab, setActiveTab] = useState<'apa' | 'bibtex' | 'chicago'>('apa');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const apaText = generateApaCitation({
    title: article.title,
    authors: article.authors,
    doi: article.doi,
    pageRange: article.pageRange,
    publishedAt: article.publishedAt,
    volumeNumber: article.issue?.volume?.volumeNumber,
    issueNumber: article.issue?.issueNumber,
  });

  const bibtexText = generateBibtex({
    title: article.title,
    authors: article.authors,
    doi: article.doi,
    pageRange: article.pageRange,
    publishedAt: article.publishedAt,
    paperId: article.paperId,
    volumeNumber: article.issue?.volume?.volumeNumber,
    issueNumber: article.issue?.issueNumber,
  });

  const year = article.publishedAt ? new Date(article.publishedAt).getFullYear() : '2026';
  const chicagoText = `${article.authors}. "${article.title}." National Research Journal of Business Economics ${article.issue?.volume?.volumeNumber || 12}, no. ${article.issue?.issueNumber || 1} (${year}): ${article.pageRange || '1-10'}.${article.doi ? ` ${article.doi}` : ''}`;

  const currentText = activeTab === 'apa' ? apaText : activeTab === 'bibtex' ? bibtexText : chicagoText;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2 text-primary-800">
            <Quote className="w-5 h-5 text-accent" />
            <h3 className="font-serif font-bold text-lg text-navy-900">Cite this Research Paper</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-500 font-medium">
            Select citation style and copy to include in your academic paper, thesis, or bibliography manager.
          </p>

          {/* Style Selector Tabs */}
          <div className="flex border-b border-slate-200 gap-2">
            <button
              onClick={() => setActiveTab('apa')}
              className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'apa'
                  ? 'border-primary-600 text-primary-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              APA 7th Edition
            </button>
            <button
              onClick={() => setActiveTab('bibtex')}
              className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'bibtex'
                  ? 'border-primary-600 text-primary-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              BibTeX (LaTeX)
            </button>
            <button
              onClick={() => setActiveTab('chicago')}
              className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'chicago'
                  ? 'border-primary-600 text-primary-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Chicago Style
            </button>
          </div>

          {/* Citation Output Box */}
          <div className="relative">
            <pre className="citation-box whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
              {currentText}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {article.id && (
              <>
                <a
                  href={`/api/articles/${article.id}/cite?format=bibtex`}
                  download
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                  title="Download BibTeX (.bib) for LaTeX"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>BibTeX (.bib)</span>
                </a>
                <a
                  href={`/api/articles/${article.id}/cite?format=ris`}
                  download
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                  title="Download RIS (.ris) for Zotero, Mendeley, EndNote"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>RIS (.ris)</span>
                </a>
              </>
            )}
          </div>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Citation'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
