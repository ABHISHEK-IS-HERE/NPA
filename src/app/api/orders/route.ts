/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      subscriberName,
      organization,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      paymentMode = 'UPI / Net Banking',
      notes,
      items = [],
      amount,
    } = body;

    if (!subscriberName || !email || !phone || !address) {
      return NextResponse.json(
        { error: 'Name, email, phone, and delivery address are required.' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Your shopping cart is empty.' },
        { status: 400 }
      );
    }

    // Build planTitle summary
    const summaryTitle = items
      .map((item: any) => `${item.title} (x${item.quantity})`)
      .join(', ');

    // Calculate or verify total amount
    const totalAmount = amount || items.reduce((sum: number, it: any) => sum + it.price * it.quantity, 0);

    const order = await db.subscriptionOrder.create({
      data: {
        subscriberName,
        organization: organization || null,
        email,
        phone,
        address,
        city: city || null,
        state: state || null,
        pincode: pincode || null,
        planTitle: summaryTitle.substring(0, 190),
        amount: totalAmount,
        paymentMode,
        status: 'Pending',
        itemsJson: JSON.stringify(items),
        notes: notes || null,
      },
    });

    const orderNumber = `NRJBE-ORD-${order.id.toString().padStart(4, '0')}`;

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

    if (id) {
      const order = await db.subscriptionOrder.findUnique({
        where: { id: Number(id) },
      });
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json({ order });
    }

    const orders = await db.subscriptionOrder.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
