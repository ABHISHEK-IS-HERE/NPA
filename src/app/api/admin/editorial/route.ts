/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const members = await db.editorialMember.findMany({
      orderBy: [{ isEditorInChief: 'desc' }, { order: 'asc' }],
    });
    return NextResponse.json({ members });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { name, designation, department, institution, country, role, photoUrl, email, order, isEditorInChief } = body;

    if (!name || !designation || !institution) {
      return NextResponse.json({ error: 'Name, designation, and institution are required' }, { status: 400 });
    }

    const member = await db.editorialMember.create({
      data: {
        name: name.trim(),
        designation: designation.trim(),
        department: department?.trim() || null,
        institution: institution.trim(),
        country: country?.trim() || 'India',
        role: role?.trim() || 'Editorial Board Member',
        photoUrl: photoUrl || null,
        email: email?.trim() || null,
        order: order !== undefined ? Number(order) : 0,
        isEditorInChief: Boolean(isEditorInChief),
      },
    });

    return NextResponse.json({ success: true, member });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { id, name, designation, department, institution, country, role, photoUrl, email, order, isEditorInChief } = body;

    if (!id) return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });

    const updated = await db.editorialMember.update({
      where: { id: Number(id) },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(designation !== undefined && { designation: designation.trim() }),
        ...(department !== undefined && { department: department?.trim() || null }),
        ...(institution !== undefined && { institution: institution.trim() }),
        ...(country !== undefined && { country: country?.trim() || 'India' }),
        ...(role !== undefined && { role: role?.trim() || 'Editorial Board Member' }),
        ...(photoUrl !== undefined && { photoUrl }),
        ...(email !== undefined && { email: email?.trim() || null }),
        ...(order !== undefined && { order: Number(order) }),
        ...(isEditorInChief !== undefined && { isEditorInChief: Boolean(isEditorInChief) }),
      },
    });

    return NextResponse.json({ success: true, member: updated });
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

    if (!id) return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });

    await db.editorialMember.delete({ where: { id: Number(id) } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
