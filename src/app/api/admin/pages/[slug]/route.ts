/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const page = await db.page.findUnique({
      where: { slug: params.slug },
    });

    if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

    return NextResponse.json({ page });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { title, subtitle, contentHtml, metaDescription, isPublished, showInNav, showInFooter } = body;

    const updated = await db.page.update({
      where: { slug: params.slug },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(subtitle !== undefined && { subtitle: subtitle?.trim() || null }),
        ...(contentHtml !== undefined && { contentHtml }),
        ...(metaDescription !== undefined && { metaDescription: metaDescription?.trim() || null }),
        ...(isPublished !== undefined && { isPublished: Boolean(isPublished) }),
        ...(showInNav !== undefined && { showInNav: Boolean(showInNav) }),
        ...(showInFooter !== undefined && { showInFooter: Boolean(showInFooter) }),
      },
    });

    return NextResponse.json({ success: true, page: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await db.page.delete({ where: { slug: params.slug } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
