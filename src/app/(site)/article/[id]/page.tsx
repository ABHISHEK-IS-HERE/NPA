/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React from 'react';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ScholarReaderView } from '@/components/articles/ScholarReaderView';
import { ArticleJsonLd } from '@/components/common/ArticleJsonLd';

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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://npa-puce.vercel.app';
  const firstPage = article.pageRange?.split('-')[0]?.trim() || '';
  const lastPage = article.pageRange?.split('-')[1]?.trim() || '';
  const pubDate = article.publishedAt.toISOString().split('T')[0];

  // Separate authors into individual entries for Google Scholar
  const authorArray = article.authors
    ? article.authors
        .split(/[,;]/)
        .map((a) => a.trim())
        .filter(Boolean)
    : [article.authors];

  const keywordList = article.keywords
    ? article.keywords
        .split(/[,;]/)
        .map((k) => k.trim())
        .filter(Boolean)
    : [];

  const pdfFullUrl = article.pdfUrl?.startsWith('http')
    ? article.pdfUrl
    : `${baseUrl}${article.pdfUrl || `/uploads/papers/${article.paperId}.pdf`}`;

  return {
    title: `${article.title} | NRJBE`,
    description: article.abstract.slice(0, 160),
    alternates: {
      canonical: `${baseUrl}/article/${article.id}`,
    },
    openGraph: {
      title: article.title,
      description: article.abstract.slice(0, 200),
      url: `${baseUrl}/article/${article.id}`,
      siteName: 'National Research Journal of Business Economics (NRJBE)',
      type: 'article',
      publishedTime: article.publishedAt.toISOString(),
      authors: authorArray,
      tags: keywordList,
      images: [
        {
          url: `${baseUrl}/templates/cover-default.jpg`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.abstract.slice(0, 200),
      images: [`${baseUrl}/templates/cover-default.jpg`],
    },
    other: {
      'citation_title': article.title,
      'citation_author': authorArray,
      'citation_publication_date': pubDate,
      'citation_journal_title': 'National Research Journal of Business Economics',
      'citation_issn': '2349-2015',
      'citation_volume': String(article.issue?.volume?.volumeNumber || '12'),
      'citation_issue': String(article.issue?.issueNumber || '1'),
      'citation_firstpage': firstPage,
      'citation_lastpage': lastPage,
      'citation_doi': article.doi || '',
      'citation_pdf_url': pdfFullUrl,
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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://npa-puce.vercel.app';
  const pdfFullUrl = article.pdfUrl?.startsWith('http')
    ? article.pdfUrl
    : `${baseUrl}${article.pdfUrl || `/uploads/papers/${article.paperId}.pdf`}`;

  return (
    <>
      <ArticleJsonLd
        title={article.title}
        abstract={article.abstract}
        authors={article.authors}
        publishedAt={article.publishedAt}
        doi={article.doi}
        url={`${baseUrl}/article/${article.id}`}
        pdfUrl={pdfFullUrl}
        keywords={article.keywords}
        volumeNumber={article.issue?.volume?.volumeNumber}
        issueNumber={article.issue?.issueNumber}
        pageRange={article.pageRange}
      />
      <ScholarReaderView article={article} relatedArticles={relatedArticles} />
    </>
  );
}
