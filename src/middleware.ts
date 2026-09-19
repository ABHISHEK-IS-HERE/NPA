/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const TOKEN_COOKIE_NAME = 'npa_admin_token';

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return new TextEncoder().encode('npa-journal-portal-dev-secret-key-change-in-prod');
  }
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Protect Admin Page Routes (/admin/...)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(token, getJwtSecret());
    } catch {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete(TOKEN_COOKIE_NAME);
      return res;
    }
  }

  // 2. Protect Admin API Routes (/api/admin/...)
  if (pathname.startsWith('/api/admin')) {
    const isPublicPlanGet = pathname === '/api/admin/subscriptions/plans' && request.method === 'GET';
    const isPublicSettingsGet = pathname === '/api/admin/settings' && request.method === 'GET';

    if (!isPublicPlanGet && !isPublicSettingsGet) {
      const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
      }

      try {
        await jwtVerify(token, getJwtSecret());
      } catch {
        return NextResponse.json({ error: 'Unauthorized: Invalid or expired token.' }, { status: 401 });
      }
    }
  }

  // 3. Add Security Headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico|templates|uploads).*)',
  ],
};
