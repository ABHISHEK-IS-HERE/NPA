/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isValidEmail, isValidPhone } from '@/lib/validators';
import { sendOrderConfirmation } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      subscriberName,
      organization,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      planTitle,
      paymentMode,
      notes,
    } = body;

    if (!subscriberName || typeof subscriberName !== 'string' || subscriberName.trim().length < 2) {
      return NextResponse.json({ error: 'Subscriber name must be at least 2 characters.' }, { status: 400 });
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    if (!phone || !isValidPhone(phone)) {
      return NextResponse.json({ error: 'Please provide a valid phone number.' }, { status: 400 });
    }

    if (!address || typeof address !== 'string' || address.trim().length < 5) {
      return NextResponse.json({ error: 'A valid delivery address is required.' }, { status: 400 });
    }

    if (!planTitle || typeof planTitle !== 'string') {
      return NextResponse.json({ error: 'Please select a valid subscription plan.' }, { status: 400 });
    }

    // Verify price from database to prevent price tampering
    let verifiedAmount = 3500;
    const dbPlan = await db.subscriptionPlan.findFirst({
      where: {
        OR: [
          { title: { equals: planTitle.trim() } },
          { planType: { equals: planTitle.trim() } },
        ],
      },
    });

    if (dbPlan && dbPlan.priceInr) {
      verifiedAmount = dbPlan.priceInr;
    } else if (body.amount && Number(body.amount) > 0) {
      verifiedAmount = Math.max(100, Math.min(1000000, Number(body.amount)));
    }

    const order = await db.subscriptionOrder.create({
      data: {
        subscriberName: subscriberName.trim(),
        organization: organization?.trim() || null,
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        address: address.trim(),
        city: city?.trim() || null,
        state: state?.trim() || null,
        pincode: pincode?.trim() || null,
        planTitle: planTitle.trim(),
        amount: verifiedAmount,
        paymentMode: paymentMode || 'Bank Transfer / Cheque / UPI',
        status: 'Pending',
        notes: notes?.trim() || null,
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
    ).catch((err) => console.error('Error sending subscription confirmation email:', err));

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber,
      message: 'Subscription request received! Our circulation team will contact you shortly with the invoice and payment confirmation.',
    });
  } catch (error: any) {
    console.error('Subscription creation error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
