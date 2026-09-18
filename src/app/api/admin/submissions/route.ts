/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status) where.status = status;

    const submissions = await db.submission.findMany({
      where,
      orderBy: { submittedAt: 'desc' },
    });

    return NextResponse.json({ submissions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { id, status, reviewerNotes, editorRemarks, publishToIssueId, pageRange, doi } = body;

    if (!id) return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 });

    const submission = await db.submission.findUnique({ where: { id: Number(id) } });
    if (!submission) return NextResponse.json({ error: 'Submission not found' }, { status: 404 });

    // Check if one-click publish requested
    if (status === 'Published' && publishToIssueId) {
      // Create article directly
      const authorsFormatted = submission.coAuthors
        ? `${submission.authorName}, ${submission.coAuthors}`
        : submission.authorName;

      const newArticle = await db.article.create({
        data: {
          issueId: Number(publishToIssueId),
          paperId: submission.trackingId,
          title: submission.paperTitle,
          authors: authorsFormatted,
          affiliations: submission.affiliation || '',
          abstract: submission.abstract,
          keywords: submission.keywords || '',
          doi: doi || null,
          pageRange: pageRange || '01-10',
          pdfUrl: submission.manuscriptFileUrl,
          certificateUrl: `/uploads/certificates/cert-${submission.trackingId}.pdf`,
          status: 'Published',
        },
      });

      const updatedSub = await db.submission.update({
        where: { id: Number(id) },
        data: {
          status: 'Published',
          reviewerNotes: reviewerNotes !== undefined ? reviewerNotes : submission.reviewerNotes,
          editorRemarks: editorRemarks !== undefined ? editorRemarks : 'Published in official journal issue.',
        },
      });

      return NextResponse.json({
        success: true,
        submission: updatedSub,
        publishedArticle: newArticle,
        message: 'Manuscript approved and successfully published to issue!',
      });
    }

    const updated = await db.submission.update({
      where: { id: Number(id) },
      data: {
        ...(status !== undefined && { status }),
        ...(reviewerNotes !== undefined && { reviewerNotes }),
        ...(editorRemarks !== undefined && { editorRemarks }),
      },
    });

    return NextResponse.json({ success: true, submission: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 });

    await db.submission.delete({ where: { id: Number(id) } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
