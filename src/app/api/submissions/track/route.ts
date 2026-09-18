/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingId = searchParams.get('id')?.trim();

    if (!trackingId) {
      return NextResponse.json({ error: 'Tracking ID or Manuscript ID is required' }, { status: 400 });
    }

    const submission = await db.submission.findUnique({
      where: { trackingId },
      select: {
        id: true,
        trackingId: true,
        paperTitle: true,
        authorName: true,
        affiliation: true,
        researchArea: true,
        status: true,
        editorRemarks: true,
        submittedAt: true,
        updatedAt: true,
      },
    });

    if (!submission) {
      // Also check if this is an already published paper's paperId
      const article = await db.article.findUnique({
        where: { paperId: trackingId },
        include: {
          issue: { include: { volume: true } },
        },
      });

      if (article) {
        return NextResponse.json({
          found: true,
          type: 'article',
          trackingId: article.paperId,
          paperTitle: article.title,
          authorName: article.authors,
          status: 'Published',
          publishedAt: article.publishedAt,
          doi: article.doi,
          pdfUrl: article.pdfUrl,
          certificateUrl: article.certificateUrl,
          issueTitle: article.issue.title,
        });
      }

      return NextResponse.json({ error: 'No manuscript or published paper found with this ID.' }, { status: 404 });
    }

    return NextResponse.json({
      found: true,
      type: 'submission',
      ...submission,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
