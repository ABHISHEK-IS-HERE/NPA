/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { validateOrderInput } from '@/lib/validators';
import { sendOrderConfirmation } from '@/lib/email';
import { getOrderAccessToken, verifyOrderAccessToken } from '@/lib/orderAuth';

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

    // 1. Fetch live pricing from database to prevent client-side price tampering
    const [dbPlans, dbIssues, dbSettings] = await Promise.all([
      db.subscriptionPlan.findMany(),
      db.issue.findMany({ select: { id: true, printPrice: true, title: true } }),
      db.siteSetting.findFirst({ where: { id: 1 } }),
    ]);

    const planMap = new Map(dbPlans.map((p) => [String(p.id), p.priceInr]));
    const issueMap = new Map(dbIssues.map((i) => [String(i.id), i.printPrice || 450]));

    const apcOnlinePrice = parseInt(dbSettings?.apcOnline?.replace(/[^0-9]/g, '') || '1800', 10);
    const apcPrintPrice = parseInt(dbSettings?.apcPrint?.replace(/[^0-9]/g, '') || '2300', 10);

    // Verify each item price against verified catalog
    const verifiedItems = items.map((item) => {
      let verifiedPrice = item.price;
      const idStr = String(item.id);

      if (planMap.has(idStr)) {
        verifiedPrice = planMap.get(idStr)!;
      } else if (issueMap.has(idStr) || issueMap.has(idStr.replace(/^issue-/, ''))) {
        const cleanIssueId = idStr.replace(/^issue-/, '');
        verifiedPrice = issueMap.get(cleanIssueId) || 450;
      } else if (item.title.toLowerCase().includes('online publication apc') || item.title.toLowerCase().includes('apc online')) {
        verifiedPrice = apcOnlinePrice;
      } else if (item.title.toLowerCase().includes('print copy apc') || item.title.toLowerCase().includes('apc print')) {
        verifiedPrice = apcPrintPrice;
      } else {
        const matchedPlan = dbPlans.find(
          (p) => p.title.toLowerCase().trim() === item.title.toLowerCase().trim()
        );
        if (matchedPlan) {
          verifiedPrice = matchedPlan.priceInr;
        }
      }

      return {
        ...item,
        price: verifiedPrice,
      };
    });

    // Summary of purchased items
    const summaryTitle = verifiedItems
      .map((item) => `${item.title} (x${item.quantity})`)
      .join(', ');

    // Calculate verified total amount server-side
    const totalAmount = verifiedItems.reduce((sum, it) => sum + it.price * it.quantity, 0);

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
        itemsJson: JSON.stringify(verifiedItems),
        notes,
      },
    });

    const orderNumber = `NRJBE-ORD-${order.id.toString().padStart(4, '0')}`;
    const accessToken = getOrderAccessToken(order.id, order.email);

    // Dispatch order confirmation email asynchronously
    sendOrderConfirmation(
      order.email,
      order.subscriberName,
      orderNumber,
      order.amount,
      order.planTitle,
      accessToken
    ).catch((err) => console.error('Error sending order confirmation email:', err));

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber,
      accessToken,
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
    const token = url.searchParams.get('token');
    const verifyEmail = url.searchParams.get('email')?.toLowerCase().trim();
    const verifyPhone = url.searchParams.get('phone')?.trim();

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

      // Public verification: require valid token OR matching email OR matching phone
      const isTokenValid = verifyOrderAccessToken(order.id, order.email, token);
      const isEmailValid = Boolean(verifyEmail && order.email.toLowerCase() === verifyEmail);
      const cleanOrderPhone = order.phone.replace(/[^0-9]/g, '');
      const cleanInputPhone = verifyPhone ? verifyPhone.replace(/[^0-9]/g, '') : '';
      const isPhoneValid = Boolean(cleanInputPhone.length >= 8 && cleanOrderPhone.endsWith(cleanInputPhone.slice(-8)));

      if (!isTokenValid && !isEmailValid && !isPhoneValid) {
        return NextResponse.json(
          { error: 'Unauthorized: Security token or matching email/phone verification required.' },
          { status: 401 }
        );
      }

      // Return masked PII for verified public request
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
      // Prevent single/double digit integer brute-force enumeration
      if (/^\d{1,4}$/.test(query) && !admin) {
        return NextResponse.json(
          { error: 'Specific tracking consignment number or complete phone/email required.' },
          { status: 400 }
        );
      }

      const cleanId = query.replace(/[^0-9]/g, '');
      let order = null;

      if (cleanId && admin) {
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
