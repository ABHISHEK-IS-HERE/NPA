/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React from 'react';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ScholarReaderView } from '@/components/articles/ScholarReaderView';

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

  // Fetch related articles from same issue
  const relatedArticles = await db.article.findMany({
    where: {
      issueId: article.issueId,
      id: { not: article.id },
      status: 'Published',
    },
    select: {
      id: true,
      paperId: true,
      title: true,
      authors: true,
    },
    take: 4,
  });

  return <ScholarReaderView article={article} relatedArticles={relatedArticles} />;
}
