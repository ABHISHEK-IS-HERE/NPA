/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { sendEditorialDecisionLetter } from '@/lib/email';
import { sanitizeInput } from '@/lib/validators';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const submissionId = Number(params.id);
    if (isNaN(submissionId)) {
      return NextResponse.json({ error: 'Invalid submission ID' }, { status: 400 });
    }

    const body = await request.json();
    const { decision, editorRemarks, notifyAuthor = true } = body;

    const validDecisions = ['Accept', 'Minor Revision', 'Major Revision', 'Reject'];
    if (!validDecisions.includes(decision)) {
      return NextResponse.json(
        { error: 'Decision must be Accept, Minor Revision, Major Revision, or Reject.' },
        { status: 400 }
      );
    }

    if (!editorRemarks || editorRemarks.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please provide detailed editorial remarks for the decision letter.' },
        { status: 400 }
      );
    }

    const submission = await db.submission.findUnique({
      where: { id: submissionId },
      include: {
        reviews: {
          where: { status: 'Completed' },
          orderBy: { completedAt: 'asc' },
        },
      },
    });

    if (!submission) {
      return NextResponse.json({ error: 'Manuscript submission not found' }, { status: 404 });
    }

    const statusMap: Record<string, string> = {
      Accept: 'Accepted',
      'Minor Revision': 'Revisions Required',
      'Major Revision': 'Revisions Required',
      Reject: 'Rejected',
    };

    const newStatus = statusMap[decision] || 'Under Review';

    const updatedSubmission = await db.submission.update({
      where: { id: submissionId },
      data: {
        status: newStatus,
        editorRemarks: sanitizeInput(editorRemarks),
      },
    });

    // Optionally notify author via email
    if (notifyAuthor && submission.authorEmail) {
      const anonymizedComments = submission.reviews
        .map((r) => r.commentsForAuthor)
        .filter(Boolean) as string[];

      await sendEditorialDecisionLetter(
        submission.authorEmail,
        submission.authorName,
        submission.trackingId,
        submission.paperTitle,
        decision as 'Accept' | 'Minor Revision' | 'Major Revision' | 'Reject',
        editorRemarks,
        anonymizedComments
      );
    }

    return NextResponse.json({
      success: true,
      message: `Editorial decision (${decision}) finalized successfully.`,
      submission: updatedSubmission,
    });
  } catch (error: any) {
    console.error('Failed to finalize editorial decision:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
