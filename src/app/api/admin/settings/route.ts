/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const settings = await db.siteSetting.findFirst({ where: { id: 1 } });
    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    delete data.id;
    delete data.updatedAt;

    const updated = await db.siteSetting.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
