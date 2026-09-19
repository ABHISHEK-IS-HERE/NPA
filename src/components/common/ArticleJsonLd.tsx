/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React from 'react';

interface ArticleJsonLdProps {
  title: string;
  abstract: string;
  authors: string;
  publishedAt: Date | string;
  doi?: string | null;
  url: string;
  pdfUrl?: string | null;
  keywords?: string | null;
  volumeNumber?: string | number;
  issueNumber?: string | number;
  pageRange?: string | null;
  journalName?: string;
  issn?: string;
  publisherName?: string;
}

export const ArticleJsonLd: React.FC<ArticleJsonLdProps> = ({
  title,
  abstract,
  authors,
  publishedAt,
  doi,
  url,
  pdfUrl,
  keywords,
  volumeNumber = '12',
  issueNumber = '1',
  pageRange,
  journalName = 'National Research Journal of Business Economics',
  issn = '2349-2015',
  publisherName = 'National Press Associates',
}) => {
  // Parse comma or semicolon separated authors into Person objects
  const authorList = authors
    ? authors
        .split(/[,;]/)
        .map((a) => a.trim())
        .filter(Boolean)
        .map((name) => ({
          '@type': 'Person',
          name,
        }))
    : [{ '@type': 'Person', name: 'Author' }];

  const keywordList = keywords
    ? keywords
        .split(/[,;]/)
        .map((k) => k.trim())
        .filter(Boolean)
    : [];

  const firstPage = pageRange?.split('-')[0]?.trim();
  const lastPage = pageRange?.split('-')[1]?.trim();
  const pubDateString = typeof publishedAt === 'string' 
    ? publishedAt 
    : publishedAt.toISOString().split('T')[0];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: title,
    name: title,
    description: abstract,
    abstract: abstract,
    author: authorList,
    datePublished: pubDateString,
    inLanguage: 'en',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    url: url,
    ...(doi ? { sameAs: `https://doi.org/${doi}`, identifier: doi } : {}),
    ...(pdfUrl ? { encoding: { '@type': 'MediaObject', contentUrl: pdfUrl, encodingFormat: 'application/pdf' } } : {}),
    ...(keywordList.length > 0 ? { keywords: keywordList } : {}),
    ...(firstPage ? { pageStart: firstPage } : {}),
    ...(lastPage ? { pageEnd: lastPage } : {}),
    isPartOf: {
      '@type': 'PublicationIssue',
      issueNumber: String(issueNumber),
      isPartOf: {
        '@type': 'PublicationVolume',
        volumeNumber: String(volumeNumber),
        isPartOf: {
          '@type': 'Periodical',
          name: journalName,
          issn: issn,
          publisher: {
            '@type': 'Organization',
            name: publisherName,
            url: 'https://npajournals.org',
          },
        },
      },
    },
    publisher: {
      '@type': 'Organization',
      name: publisherName,
      url: 'https://npajournals.org',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
