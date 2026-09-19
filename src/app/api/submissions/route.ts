/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { validateSubmissionInput } from '@/lib/validators';
import { sendSubmissionConfirmation } from '@/lib/email';

function generateTrackingId(): string {
  const year = new Date().getFullYear();
  // Generate 6 uppercase alphanumeric characters
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `NRJBE-${year}-${rand}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateSubmissionInput(body);

    if (!validation.success || !validation.data) {
      return NextResponse.json(
        { error: validation.error || 'Invalid manuscript submission data.', errors: validation.errors },
        { status: 400 }
      );
    }

    const {
      paperTitle,
      authorName,
      authorEmail,
      authorPhone,
      affiliation,
      coAuthors,
      abstract,
      keywords,
      researchArea,
      manuscriptFileUrl,
    } = validation.data;

    // Retry loop for unique tracking ID
    let submission = null;
    let attempts = 0;
    while (!submission && attempts < 5) {
      attempts++;
      const trackingId = generateTrackingId();
      try {
        submission = await db.submission.create({
          data: {
            trackingId,
            paperTitle,
            authorName,
            authorEmail,
            authorPhone,
            affiliation,
            coAuthors,
            abstract,
            keywords,
            researchArea,
            manuscriptFileUrl,
            status: 'Submitted',
          },
        });
      } catch (err: any) {
        if (err.code === 'P2002' && attempts < 5) {
          // Unique constraint collision, retry
          continue;
        }
        throw err;
      }
    }

    if (!submission) {
      throw new Error('Failed to generate a unique tracking identifier. Please try again.');
    }

    // Dispatch confirmation email asynchronously (does not block response)
    sendSubmissionConfirmation(
      submission.authorEmail,
      submission.authorName,
      submission.trackingId,
      submission.paperTitle
    ).catch((err) => console.error('Error sending submission confirmation email:', err));

    return NextResponse.json({
      success: true,
      trackingId: submission.trackingId,
      message: 'Manuscript submitted successfully! Please save your tracking ID.',
    });
  } catch (error: any) {
    console.error('Submission error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
