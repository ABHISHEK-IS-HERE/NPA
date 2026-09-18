'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React, { useState } from 'react';
import { FileText, Award, Quote, Download } from 'lucide-react';
import { CitationModal } from './CitationModal';

interface ArticleActionButtonsProps {
  article: {
    id: number;
    paperId: string;
    title: string;
    authors: string;
    doi?: string | null;
    pageRange?: string | null;
    pdfUrl?: string | null;
    certificateUrl?: string | null;
    publishedAt?: Date | string | null;
    issue?: {
      title?: string;
      issueNumber?: string;
      volume?: { volumeNumber?: number };
    };
  };
}

export const ArticleActionButtons: React.FC<ArticleActionButtonsProps> = ({ article }) => {
  const [citationModalOpen, setCitationModalOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* View Full PDF */}
      <a
        href={article.pdfUrl || `/uploads/papers/${article.paperId}.pdf`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition-all"
      >
        <FileText className="w-4 h-4 text-amber-300" />
        <span>View Full Text PDF</span>
      </a>

      {/* Download Certificate */}
      <a
        href={article.certificateUrl || `/uploads/certificates/cert-${article.paperId}.pdf`}
        download
        className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-lg border border-slate-300 transition-colors"
      >
        <Award className="w-4 h-4 text-amber-600" />
        <span>Download E-Certificate</span>
      </a>

      {/* Cite Paper */}
      <button
        onClick={() => setCitationModalOpen(true)}
        className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs sm:text-sm px-4 py-2.5 rounded-lg border border-slate-200 transition-colors"
      >
        <Quote className="w-4 h-4 text-slate-500" />
        <span>Cite this Article</span>
      </button>

      <CitationModal
        isOpen={citationModalOpen}
        onClose={() => setCitationModalOpen(false)}
        article={article}
      />
    </div>
  );
};
