/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
    } = body;

    if (!paperTitle || !authorName || !authorEmail || !abstract || !manuscriptFileUrl) {
      return NextResponse.json(
        { error: 'Paper title, author name, author email, abstract, and manuscript file are required' },
        { status: 400 }
      );
    }

    // Generate random 4-digit unique tracking code
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const trackingId = `NRJBE-${new Date().getFullYear()}-${randomCode}`;

    const submission = await db.submission.create({
      data: {
        trackingId,
        paperTitle: paperTitle.trim(),
        authorName: authorName.trim(),
        authorEmail: authorEmail.trim().toLowerCase(),
        authorPhone: authorPhone?.trim() || null,
        affiliation: affiliation?.trim() || null,
        coAuthors: coAuthors?.trim() || null,
        abstract: abstract.trim(),
        keywords: keywords?.trim() || null,
        researchArea: researchArea?.trim() || 'General Business Economics',
        manuscriptFileUrl,
        status: 'Submitted',
      },
    });

    return NextResponse.json({
      success: true,
      trackingId: submission.trackingId,
      message: 'Manuscript submitted successfully! Please save your tracking ID.',
    });
  } catch (error: any) {
    console.error('Submission error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
