/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sanitizeInput } from '@/lib/validators';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    if (!token) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 });
    }

    const assignment = await db.reviewAssignment.findUnique({
      where: { accessToken: token },
      include: {
        submission: true,
        reviewer: {
          select: { name: true, email: true },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json({ error: 'Invalid or expired review invitation link.' }, { status: 404 });
    }

    // STRICT DOUBLE-BLIND ENFORCEMENT: Author PII is completely stripped
    const blindedData = {
      assignment: {
        id: assignment.id,
        status: assignment.status,
        deadline: assignment.deadline,
        completedAt: assignment.completedAt,
        scoreOriginality: assignment.scoreOriginality,
        scoreMethodology: assignment.scoreMethodology,
        scoreLiterature: assignment.scoreLiterature,
        scoreClarity: assignment.scoreClarity,
        scoreSignificance: assignment.scoreSignificance,
        recommendation: assignment.recommendation,
        commentsForAuthor: assignment.commentsForAuthor,
        confidentialComments: assignment.confidentialComments,
      },
      manuscript: {
        title: assignment.submission.paperTitle,
        abstract: assignment.submission.abstract,
        keywords: assignment.submission.keywords,
        researchArea: assignment.submission.researchArea,
        manuscriptFileUrl: assignment.submission.manuscriptFileUrl,
        submittedAt: assignment.submission.submittedAt,
      },
      reviewer: {
        name: assignment.reviewer.name,
      },
    };

    return NextResponse.json(blindedData);
  } catch (error: any) {
    console.error('Failed to fetch blinded review data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    if (!token) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 });
    }

    const assignment = await db.reviewAssignment.findUnique({
      where: { accessToken: token },
      include: { submission: true },
    });

    if (!assignment) {
      return NextResponse.json({ error: 'Invalid or expired review invitation link.' }, { status: 404 });
    }

    const body = await request.json();
    const {
      scoreOriginality,
      scoreMethodology,
      scoreLiterature,
      scoreClarity,
      scoreSignificance,
      recommendation,
      commentsForAuthor,
      confidentialComments,
    } = body;

    // Validate scores are 1-5 integers
    const scores = [
      scoreOriginality,
      scoreMethodology,
      scoreLiterature,
      scoreClarity,
      scoreSignificance,
    ];

    for (const s of scores) {
      const num = Number(s);
      if (isNaN(num) || num < 1 || num > 5) {
        return NextResponse.json(
          { error: 'All rubric scores must be integers between 1 and 5.' },
          { status: 400 }
        );
      }
    }

    const validRecommendations = ['Accept', 'Minor Revision', 'Major Revision', 'Reject'];
    if (!validRecommendations.includes(recommendation)) {
      return NextResponse.json(
        { error: 'Recommendation must be Accept, Minor Revision, Major Revision, or Reject.' },
        { status: 400 }
      );
    }

    if (!commentsForAuthor || commentsForAuthor.trim().length < 20) {
      return NextResponse.json(
        { error: 'Please provide constructive comments for the authors (at least 20 characters).' },
        { status: 400 }
      );
    }

    const updated = await db.reviewAssignment.update({
      where: { id: assignment.id },
      data: {
        scoreOriginality: Number(scoreOriginality),
        scoreMethodology: Number(scoreMethodology),
        scoreLiterature: Number(scoreLiterature),
        scoreClarity: Number(scoreClarity),
        scoreSignificance: Number(scoreSignificance),
        recommendation,
        commentsForAuthor: sanitizeInput(commentsForAuthor),
        confidentialComments: confidentialComments ? sanitizeInput(confidentialComments) : null,
        status: 'Completed',
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Evaluation submitted successfully. Thank you for your contribution to academic rigor.',
      assignment: updated,
    });
  } catch (error: any) {
    console.error('Failed to submit evaluation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
