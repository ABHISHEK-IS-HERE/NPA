import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const announcements = await db.announcement.findMany({
      orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json({ announcements });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { title, content, linkUrl, badgeText, isTicker, isActive, priority } = body;

    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    const announcement = await db.announcement.create({
      data: {
        title: title.trim(),
        content: content?.trim() || null,
        linkUrl: linkUrl?.trim() || null,
        badgeText: badgeText?.trim() || 'NEW',
        isTicker: Boolean(isTicker),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        priority: priority !== undefined ? Number(priority) : 0,
      },
    });

    return NextResponse.json({ success: true, announcement });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { id, title, content, linkUrl, badgeText, isTicker, isActive, priority } = body;

    if (!id) return NextResponse.json({ error: 'Announcement ID is required' }, { status: 400 });

    const updated = await db.announcement.update({
      where: { id: Number(id) },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(content !== undefined && { content: content?.trim() || null }),
        ...(linkUrl !== undefined && { linkUrl: linkUrl?.trim() || null }),
        ...(badgeText !== undefined && { badgeText: badgeText?.trim() || null }),
        ...(isTicker !== undefined && { isTicker: Boolean(isTicker) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(priority !== undefined && { priority: Number(priority) }),
      },
    });

    return NextResponse.json({ success: true, announcement: updated });
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

    if (!id) return NextResponse.json({ error: 'Announcement ID is required' }, { status: 400 });

    await db.announcement.delete({ where: { id: Number(id) } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
