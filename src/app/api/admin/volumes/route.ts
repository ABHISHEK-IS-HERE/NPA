/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const volumes = await db.volume.findMany({
      orderBy: { volumeNumber: 'desc' },
      include: {
        issues: {
          orderBy: { createdAt: 'desc' },
          include: {
            _count: { select: { articles: true } },
          },
        },
      },
    });
    return NextResponse.json({ volumes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { volumeNumber, year, title, description, isActive } = await request.json();

    if (!volumeNumber || !year || !title) {
      return NextResponse.json({ error: 'Volume number, year, and title are required' }, { status: 400 });
    }

    const volume = await db.volume.create({
      data: {
        volumeNumber: Number(volumeNumber),
        year: Number(year),
        title,
        description,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json({ success: true, volume });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id, volumeNumber, year, title, description, isActive } = await request.json();

    if (!id) return NextResponse.json({ error: 'Volume ID is required' }, { status: 400 });

    const updated = await db.volume.update({
      where: { id: Number(id) },
      data: {
        ...(volumeNumber !== undefined && { volumeNumber: Number(volumeNumber) }),
        ...(year !== undefined && { year: Number(year) }),
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });

    return NextResponse.json({ success: true, volume: updated });
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

    if (!id) return NextResponse.json({ error: 'Volume ID is required' }, { status: 400 });

    await db.volume.delete({ where: { id: Number(id) } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
