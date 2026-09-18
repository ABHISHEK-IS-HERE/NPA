/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();
    const issueId = searchParams.get('issueId');
    const volumeId = searchParams.get('volumeId');

    const where: any = {
      status: 'Published',
    };

    if (issueId) {
      where.issueId = Number(issueId);
    } else if (volumeId) {
      where.issue = { volumeId: Number(volumeId) };
    }

    if (query) {
      where.OR = [
        { title: { contains: query } },
        { authors: { contains: query } },
        { abstract: { contains: query } },
        { keywords: { contains: query } },
        { paperId: { contains: query } },
      ];
    }

    const articles = await db.article.findMany({
      where,
      orderBy: { id: 'asc' },
      include: {
        issue: {
          include: { volume: true },
        },
      },
    });

    return NextResponse.json({ articles });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
