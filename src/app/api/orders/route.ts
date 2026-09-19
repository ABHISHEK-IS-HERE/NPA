/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { validateOrderInput } from '@/lib/validators';
import { sendOrderConfirmation } from '@/lib/email';

export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const validation = validateOrderInput(rawBody);

    if (!validation.success || !validation.data) {
      return NextResponse.json(
        { error: validation.error || 'Invalid order data.', errors: validation.errors },
        { status: 400 }
      );
    }

    const {
      subscriberName,
      organization,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      paymentMode,
      notes,
      items,
    } = validation.data;

    // Summary of purchased items
    const summaryTitle = items
      .map((item) => `${item.title} (x${item.quantity})`)
      .join(', ');

    // Calculate verified total amount server-side
    const totalAmount = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

    const order = await db.subscriptionOrder.create({
      data: {
        subscriberName,
        organization,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        planTitle: summaryTitle.substring(0, 190),
        amount: totalAmount,
        paymentMode,
        status: 'Pending',
        itemsJson: JSON.stringify(items),
        notes,
      },
    });

    const orderNumber = `NRJBE-ORD-${order.id.toString().padStart(4, '0')}`;

    // Dispatch order confirmation email asynchronously
    sendOrderConfirmation(
      order.email,
      order.subscriberName,
      orderNumber,
      order.amount,
      order.planTitle
    ).catch((err) => console.error('Error sending order confirmation email:', err));

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber,
      order,
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to record order' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const query = url.searchParams.get('query')?.trim();

    const admin = await getCurrentAdmin();

    // 1. Fetching single order by ID
    if (id) {
      const cleanId = id.replace(/[^0-9]/g, '');
      if (!cleanId) {
        return NextResponse.json({ error: 'Invalid order identifier.' }, { status: 400 });
      }

      const order = await db.subscriptionOrder.findUnique({
        where: { id: Number(cleanId) },
      });

      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      // If user is admin, return full order details
      if (admin) {
        return NextResponse.json({ order });
      }

      // If public request, mask sensitive PII
      return NextResponse.json({
        order: {
          id: order.id,
          orderNumber: `NRJBE-ORD-${order.id.toString().padStart(4, '0')}`,
          status: order.status,
          planTitle: order.planTitle,
          amount: order.amount,
          trackingNumber: order.trackingNumber,
          createdAt: order.createdAt,
          itemsJson: order.itemsJson,
          city: order.city,
          state: order.state,
          email: order.email.replace(/(.{2})(.*)(?=@)/, '$1***'),
          phone: order.phone.replace(/(\d{2})\d+(\d{2})/, '$1******$2'),
        },
      });
    }

    // 2. Query lookup (e.g. from dispatch tracking)
    if (query) {
      const cleanId = query.replace(/[^0-9]/g, '');
      let order = null;

      if (cleanId) {
        order = await db.subscriptionOrder.findUnique({
          where: { id: Number(cleanId) },
        });
      }

      if (!order) {
        order = await db.subscriptionOrder.findFirst({
          where: {
            OR: [
              { trackingNumber: { equals: query } },
              { phone: { equals: query } },
              { email: { equals: query.toLowerCase() } },
            ],
          },
        });
      }

      if (!order) {
        return NextResponse.json({ error: 'No subscription order found matching this reference.' }, { status: 404 });
      }

      if (admin) {
        return NextResponse.json({ order });
      }

      return NextResponse.json({
        order: {
          id: order.id,
          orderNumber: `NRJBE-ORD-${order.id.toString().padStart(4, '0')}`,
          status: order.status,
          planTitle: order.planTitle,
          amount: order.amount,
          trackingNumber: order.trackingNumber,
          createdAt: order.createdAt,
          itemsJson: order.itemsJson,
          city: order.city,
          state: order.state,
          email: order.email.replace(/(.{2})(.*)(?=@)/, '$1***'),
          phone: order.phone.replace(/(\d{2})\d+(\d{2})/, '$1******$2'),
        },
      });
    }

    // 3. Querying list of orders: strictly require Admin authentication
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin authentication required to view order listings.' }, { status: 401 });
    }

    const orders = await db.subscriptionOrder.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
