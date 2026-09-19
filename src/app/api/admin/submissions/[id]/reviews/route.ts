/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { sendReviewerInvitation } from '@/lib/email';
import crypto from 'crypto';

export async function GET(
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

    const reviews = await db.reviewAssignment.findMany({
      where: { submissionId },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
            institution: true,
            department: true,
            expertiseAreas: true,
          },
        },
      },
      orderBy: { invitedAt: 'desc' },
    });

    return NextResponse.json({ reviews });
  } catch (error: any) {
    console.error('Failed to fetch reviews:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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
    const { reviewerId, deadlineDays = 14 } = body;

    if (!reviewerId) {
      return NextResponse.json({ error: 'Reviewer ID is required' }, { status: 400 });
    }

    const [submission, reviewer] = await Promise.all([
      db.submission.findUnique({ where: { id: submissionId } }),
      db.reviewer.findUnique({ where: { id: Number(reviewerId) } }),
    ]);

    if (!submission) {
      return NextResponse.json({ error: 'Manuscript submission not found' }, { status: 404 });
    }

    if (!reviewer) {
      return NextResponse.json({ error: 'Reviewer not found' }, { status: 404 });
    }

    // Check if reviewer is already assigned to this submission
    const existing = await db.reviewAssignment.findFirst({
      where: {
        submissionId,
        reviewerId: Number(reviewerId),
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'This reviewer has already been assigned to this manuscript.' },
        { status: 409 }
      );
    }

    // Generate secure cryptographic token
    const accessToken = crypto.randomUUID();

    const deadline = new Date();
    deadline.setDate(deadline.getDate() + Number(deadlineDays));

    const assignment = await db.reviewAssignment.create({
      data: {
        submissionId,
        reviewerId: Number(reviewerId),
        accessToken,
        status: 'Invited',
        deadline,
      },
      include: {
        reviewer: true,
      },
    });

    // Update submission status to Under Review if it was Submitted
    if (submission.status === 'Submitted') {
      await db.submission.update({
        where: { id: submissionId },
        data: { status: 'Under Review' },
      });
    }

    // Dispatch invitation email to reviewer (double-blind, author details omitted)
    await sendReviewerInvitation(
      reviewer.email,
      reviewer.name,
      submission.paperTitle,
      submission.abstract,
      accessToken,
      Number(deadlineDays)
    );

    return NextResponse.json({ success: true, assignment }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to assign reviewer:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
