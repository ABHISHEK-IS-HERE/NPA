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
    type: string;
    id: string;
  };
}

export async function generateMetadata({ params }: CertificatePageProps): Promise<Metadata> {
  return {
    title: `Certificate & Acceptance Letter Generator | NRJBE Admin`,
  };
}

export default async function AdminCertificatePage({ params }: CertificatePageProps) {
  const { type, id } = params;
  const numId = parseInt(id, 10);

  if (isNaN(numId) || (type !== 'article' && type !== 'submission')) {
    notFound();
  }

  const settings = await db.siteSetting.findFirst({ where: { id: 1 } });

  if (type === 'article') {
    const article = await db.article.findUnique({
      where: { id: numId },
      include: {
        issue: {
          include: { volume: true },
        },
      },
    });

    if (!article) notFound();

    const volNum = article.issue?.volume?.volumeNumber || '12';
    const issNum = article.issue?.issueNumber || '1';
    const year = article.issue?.volume?.year || '2026';
    const issueTitle = article.issue?.title || `Volume ${volNum}, Issue ${issNum} (${year})`;

    return (
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
    );
  } else {
    // Submission type
    const [submission, currentIssue] = await Promise.all([
      db.submission.findUnique({ where: { id: numId } }),
      db.issue.findFirst({
        where: { isCurrent: true },
        include: { volume: true },
      }),
    ]);

    if (!submission) notFound();

    const volNum = currentIssue?.volume?.volumeNumber || '12';
    const issNum = currentIssue?.issueNumber || '1';
    const year = currentIssue?.volume?.year || '2026';
    const issueTitle = currentIssue?.title || `Volume ${volNum}, Issue ${issNum} (${year})`;

    return (
      <CertificateViewer
        documentType="acceptance"
        paperTitle={submission.paperTitle}
        authorName={submission.authorName}
        coAuthors={submission.coAuthors || ''}
        affiliation={submission.affiliation || ''}
        volumeNumber={volNum}
        issueNumber={issNum}
        year={year}
        issueTitle={issueTitle}
        doi={`10.5281/zenodo.108${submission.id.toString().padStart(5, '0')}`}
        paperId={submission.trackingId}
        publishedDate={new Intl.DateTimeFormat('en-IN', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }).format(new Date(submission.submittedAt))}
        authorEmail={submission.authorEmail}
        authorPhone={submission.authorPhone || ''}
        settings={{
          journalName: settings?.journalName,
          issn: settings?.issn,
          impactFactor: settings?.impactFactor,
          publisherName: settings?.publisherName,
          contactEmail: settings?.contactEmail,
          contactPhone: settings?.contactPhone,
        }}
      />
    );
  }
}
