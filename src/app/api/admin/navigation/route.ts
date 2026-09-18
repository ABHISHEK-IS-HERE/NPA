/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const items = await db.navItem.findMany({
      where: { parentId: null },
      orderBy: { order: 'asc' },
      include: {
        children: {
          orderBy: { order: 'asc' },
        },
      },
    });
    return NextResponse.json({ items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { label, path, parentId, isExternal, openInNewTab, order, isActive } = body;

    if (!label || !path) {
      return NextResponse.json({ error: 'Label and path are required' }, { status: 400 });
    }

    const newItem = await db.navItem.create({
      data: {
        label,
        path,
        parentId: parentId ? Number(parentId) : null,
        isExternal: Boolean(isExternal),
        openInNewTab: Boolean(openInNewTab),
        order: order ? Number(order) : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json({ success: true, item: newItem });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { id, label, path, parentId, isExternal, openInNewTab, order, isActive } = body;

    if (!id) return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });

    const updated = await db.navItem.update({
      where: { id: Number(id) },
      data: {
        ...(label !== undefined && { label }),
        ...(path !== undefined && { path }),
        ...(parentId !== undefined && { parentId: parentId ? Number(parentId) : null }),
        ...(isExternal !== undefined && { isExternal: Boolean(isExternal) }),
        ...(openInNewTab !== undefined && { openInNewTab: Boolean(openInNewTab) }),
        ...(order !== undefined && { order: Number(order) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });

    await db.navItem.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
