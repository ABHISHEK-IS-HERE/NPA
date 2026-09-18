import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const issueId = searchParams.get('issueId');

    const where: any = {};
    if (issueId) {
      where.issueId = Number(issueId);
    }

    const articles = await db.article.findMany({
      where,
      orderBy: { id: 'desc' },
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

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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

    if (!issueId || !title || !authors || !abstract) {
      return NextResponse.json(
        { error: 'Issue ID, Title, Authors, and Abstract are required' },
        { status: 400 }
      );
    }

    // Auto-generate paperId if not provided
    const generatedPaperId =
      paperId?.trim() ||
      `NRJBE-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const article = await db.article.create({
      data: {
        issueId: Number(issueId),
        paperId: generatedPaperId,
        title: title.trim(),
        authors: authors.trim(),
        affiliations: affiliations?.trim() || '',
        abstract: abstract.trim(),
        keywords: keywords?.trim() || '',
        doi: doi?.trim() || null,
        pageRange: pageRange?.trim() || '',
        pdfUrl: pdfUrl || null,
        certificateUrl: certificateUrl || null,
        status: status || 'Published',
      },
      include: {
        issue: { include: { volume: true } },
      },
    });

    return NextResponse.json({ success: true, article });
  } catch (error: any) {
    console.error('Create article error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
