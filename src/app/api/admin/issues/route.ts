import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const issues = await db.issue.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        volume: true,
        _count: { select: { articles: true } },
      },
    });
    return NextResponse.json({ issues });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { volumeId, issueNumber, title, monthYear, isCurrent, isSpecial, coverImage, printPrice, status } = body;

    if (!volumeId || !issueNumber || !title) {
      return NextResponse.json({ error: 'Volume ID, issue number, and title are required' }, { status: 400 });
    }

    // If marked isCurrent, unset isCurrent on all other issues
    if (isCurrent) {
      await db.issue.updateMany({
        where: { isCurrent: true },
        data: { isCurrent: false },
      });
    }

    const issue = await db.issue.create({
      data: {
        volumeId: Number(volumeId),
        issueNumber: String(issueNumber),
        title,
        monthYear: monthYear || '',
        isCurrent: Boolean(isCurrent),
        isSpecial: Boolean(isSpecial),
        coverImage,
        printPrice: printPrice ? Number(printPrice) : 450,
        status: status || 'Published',
      },
      include: { volume: true },
    });

    return NextResponse.json({ success: true, issue });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { id, volumeId, issueNumber, title, monthYear, isCurrent, isSpecial, coverImage, printPrice, status } = body;

    if (!id) return NextResponse.json({ error: 'Issue ID is required' }, { status: 400 });

    if (isCurrent) {
      await db.issue.updateMany({
        where: { isCurrent: true },
        data: { isCurrent: false },
      });
    }

    const updated = await db.issue.update({
      where: { id: Number(id) },
      data: {
        ...(volumeId !== undefined && { volumeId: Number(volumeId) }),
        ...(issueNumber !== undefined && { issueNumber: String(issueNumber) }),
        ...(title !== undefined && { title }),
        ...(monthYear !== undefined && { monthYear }),
        ...(isCurrent !== undefined && { isCurrent: Boolean(isCurrent) }),
        ...(isSpecial !== undefined && { isSpecial: Boolean(isSpecial) }),
        ...(coverImage !== undefined && { coverImage }),
        ...(printPrice !== undefined && { printPrice: Number(printPrice) }),
        ...(status !== undefined && { status }),
      },
      include: { volume: true },
    });

    return NextResponse.json({ success: true, issue: updated });
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

    if (!id) return NextResponse.json({ error: 'Issue ID is required' }, { status: 400 });

    await db.issue.delete({ where: { id: Number(id) } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
