/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import crypto from 'crypto';

/**
 * Generates a secure, unguessable HMAC token for an order.
 * Used for authenticated public access to order status and invoices
 * without requiring account creation.
 */
export function getOrderAccessToken(orderId: number, email: string): string {
  const secret = process.env.JWT_SECRET || 'npa-order-verification-fallback-secret';
  const data = `${orderId}:${email.toLowerCase().trim()}`;
  return crypto.createHmac('sha256', secret).update(data).digest('hex').substring(0, 24);
}

/**
 * Validates whether the provided token matches the expected order access token.
 */
export function verifyOrderAccessToken(orderId: number, email: string, providedToken?: string | null): boolean {
  if (!providedToken) return false;
  const expected = getOrderAccessToken(orderId, email);
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(providedToken));
  } catch {
    return false;
  }
}
