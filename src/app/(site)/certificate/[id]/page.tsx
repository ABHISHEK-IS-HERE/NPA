/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React from 'react';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { CertificateViewer } from '@/components/admin/CertificateViewer';
import type { Metadata } from 'next';

interface CertificatePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: CertificatePageProps): Promise<Metadata> {
  const numId = parseInt(params.id, 10);
  if (isNaN(numId)) return { title: 'Certificate | NRJBE' };

  const article = await db.article.findUnique({
    where: { id: numId },
    select: { title: true, paperId: true },
  });

  return {
    title: `Publication Certificate — ${article?.paperId || params.id} | NRJBE`,
    description: `Official Certificate of Publication for "${article?.title || 'Academic Research Paper'}" published in National Research Journal of Business Economics.`,
  };
}

export default async function PublicCertificatePage({ params }: CertificatePageProps) {
  const numId = parseInt(params.id, 10);

  if (isNaN(numId)) {
    notFound();
  }

  const [article, settings] = await Promise.all([
    db.article.findUnique({
      where: { id: numId },
      include: {
        issue: {
          include: { volume: true },
        },
      },
    }),
    db.siteSetting.findFirst({ where: { id: 1 } }),
  ]);

  if (!article) notFound();

  const volNum = article.issue?.volume?.volumeNumber || '12';
  const issNum = article.issue?.issueNumber || '1';
  const year = article.issue?.volume?.year || '2026';
  const issueTitle = article.issue?.title || `Volume ${volNum}, Issue ${issNum} (${year})`;

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 print:bg-white print:p-0">
      <CertificateViewer
        documentType="certificate"
        paperTitle={article.title}
        authorName={article.authors.split(',')[0]?.trim() || article.authors}
        coAuthors={article.authors.split(',').slice(1).join(', ').trim()}
        affiliation={article.affiliations || ''}
        volumeNumber={volNum}
        issueNumber={issNum}
        year={year}
        issueTitle={issueTitle}
        doi={article.doi || '10.5281/zenodo.10892341'}
        paperId={article.paperId}
        publishedDate={new Intl.DateTimeFormat('en-IN', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }).format(new Date(article.publishedAt))}
        settings={{
          journalName: settings?.journalName,
          issn: settings?.issn,
          impactFactor: settings?.impactFactor,
          publisherName: settings?.publisherName,
          contactEmail: settings?.contactEmail,
          contactPhone: settings?.contactPhone,
        }}
      />
    </div>
  );
}
