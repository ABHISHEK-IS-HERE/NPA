/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const article = await db.article.findUnique({
      where: { id },
      include: {
        issue: { include: { volume: true } },
      },
    });

    if (!article) return NextResponse.json({ error: 'Article not found' }, { status: 404 });

    return NextResponse.json({ article });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const id = Number(params.id);
    const body = await request.json();

    const {
      issueId,
      paperId,
      title,
      authors,
      affiliations,
      abstract,
      keywords,
      doi,
      pageRange,
      pdfUrl,
      certificateUrl,
      status,
    } = body;

    const updated = await db.article.update({
      where: { id },
      data: {
        ...(issueId !== undefined && { issueId: Number(issueId) }),
        ...(paperId !== undefined && { paperId: paperId.trim() }),
        ...(title !== undefined && { title: title.trim() }),
        ...(authors !== undefined && { authors: authors.trim() }),
        ...(affiliations !== undefined && { affiliations: affiliations.trim() }),
        ...(abstract !== undefined && { abstract: abstract.trim() }),
        ...(keywords !== undefined && { keywords: keywords.trim() }),
        ...(doi !== undefined && { doi: doi?.trim() || null }),
        ...(pageRange !== undefined && { pageRange: pageRange.trim() }),
        ...(pdfUrl !== undefined && { pdfUrl }),
        ...(certificateUrl !== undefined && { certificateUrl }),
        ...(status !== undefined && { status }),
      },
      include: {
        issue: { include: { volume: true } },
      },
    });

    return NextResponse.json({ success: true, article: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const id = Number(params.id);
    await db.article.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
