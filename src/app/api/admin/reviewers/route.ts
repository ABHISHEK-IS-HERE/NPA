/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { isValidEmail, sanitizeInput } from '@/lib/validators';

export async function GET(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase();

    const reviewers = await db.reviewer.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { reviews: true },
        },
      },
    });

    const filtered = search
      ? reviewers.filter(
          (r) =>
            r.name.toLowerCase().includes(search) ||
            r.institution.toLowerCase().includes(search) ||
            r.expertiseAreas.toLowerCase().includes(search)
        )
      : reviewers;

    return NextResponse.json({ reviewers: filtered });
  } catch (error: any) {
    console.error('Failed to fetch reviewers:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { name, email, institution, department, expertiseAreas } = body;

    if (!name || !email || !institution || !expertiseAreas) {
      return NextResponse.json(
        { error: 'Name, email, institution, and expertise areas are required.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address format.' }, { status: 400 });
    }

    const existing = await db.reviewer.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A reviewer with this email address already exists.' },
        { status: 409 }
      );
    }

    const reviewer = await db.reviewer.create({
      data: {
        name: sanitizeInput(name),
        email: email.toLowerCase().trim(),
        institution: sanitizeInput(institution),
        department: department ? sanitizeInput(department) : null,
        expertiseAreas: sanitizeInput(expertiseAreas),
        status: 'Active',
      },
    });

    return NextResponse.json({ success: true, reviewer }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create reviewer:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
