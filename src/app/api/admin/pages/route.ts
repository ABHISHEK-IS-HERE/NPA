/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const pages = await db.page.findMany({
      orderBy: { id: 'asc' },
    });
    return NextResponse.json({ pages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { slug, title, subtitle, contentHtml, metaDescription, isPublished, showInNav, showInFooter } = body;

    if (!slug || !title || !contentHtml) {
      return NextResponse.json({ error: 'Slug, title, and content are required' }, { status: 400 });
    }

    const sanitizedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

    const page = await db.page.create({
      data: {
        slug: sanitizedSlug,
        title: title.trim(),
        subtitle: subtitle?.trim() || null,
        contentHtml,
        metaDescription: metaDescription?.trim() || null,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        showInNav: Boolean(showInNav),
        showInFooter: Boolean(showInFooter),
      },
    });

    return NextResponse.json({ success: true, page });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
