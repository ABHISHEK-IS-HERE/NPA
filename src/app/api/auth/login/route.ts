/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signAdminToken, AUTH_COOKIE_CONFIG } from '@/lib/auth';
import { isValidEmail } from '@/lib/validators';

// In-memory rate limiter for login attempts (IP and email based)
interface RateLimitRecord {
  count: number;
  lockedUntil: number;
  firstAttempt: number;
}

const loginAttempts = new Map<string, RateLimitRecord>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(key);
  if (!record) return false;

  // Currently locked
  if (record.lockedUntil > 0 && now < record.lockedUntil) {
    return true;
  }

  // Lock has expired, reset
  if (record.lockedUntil > 0 && now >= record.lockedUntil) {
    loginAttempts.delete(key);
    return false;
  }

  // Window expired (15 minutes from first attempt without lockout)
  if (now - record.firstAttempt > 15 * 60 * 1000) {
    loginAttempts.delete(key);
    return false;
  }

  return false;
}

function recordFailedAttempt(key: string) {
  const now = Date.now();
  const record = loginAttempts.get(key) || { count: 0, lockedUntil: 0, firstAttempt: now };
  record.count++;
  if (record.count >= 5) {
    record.lockedUntil = now + 15 * 60 * 1000; // 15-minute lockout
  }
  loginAttempts.set(key, record);
}

function clearAttempts(key: string) {
  loginAttempts.delete(key);
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    if (!isValidEmail(cleanEmail)) {
      return NextResponse.json({ error: 'Invalid email address format.' }, { status: 400 });
    }

    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown-ip';
    const rateLimitKey = `${clientIp}:${cleanEmail}`;

    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Too many failed login attempts. Please try again after 15 minutes.' },
        { status: 429 }
      );
    }

    const admin = await db.adminUser.findUnique({
      where: { email: cleanEmail },
    });

    // Constant time comparison simulation to mitigate timing attacks
    if (!admin) {
      recordFailedAttempt(cleanEmail);
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      recordFailedAttempt(cleanEmail);
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Success: reset attempts
    clearAttempts(cleanEmail);

    const token = await signAdminToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    const response = NextResponse.json({
      success: true,
      user: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    });

    response.cookies.set(AUTH_COOKIE_CONFIG.name, token, AUTH_COOKIE_CONFIG.options);

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
