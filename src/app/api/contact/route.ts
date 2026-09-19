/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { validateContactInput } from '@/lib/validators';
import { sendContactAutoReply } from '@/lib/email';

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });

    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ messages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateContactInput(body);

    if (!validation.success || !validation.data) {
      return NextResponse.json(
        { error: validation.error || 'Invalid inquiry data.', errors: validation.errors },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = validation.data;

    await db.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
      },
    });

    // Dispatch auto-reply email asynchronously
    sendContactAutoReply(email, name, subject).catch((err) =>
      console.error('Error sending contact auto-reply email:', err)
    );

    return NextResponse.json({
      success: true,
      message: 'Your inquiry has been sent to the Editorial Office. We will get back to you shortly.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
