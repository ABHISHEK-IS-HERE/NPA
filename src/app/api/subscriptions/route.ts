import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subscriberName, organization, email, phone, address, city, state, pincode, planTitle, amount, paymentMode, notes } = body;

    if (!subscriberName || !email || !phone || !address || !planTitle) {
      return NextResponse.json(
        { error: 'Subscriber name, email, phone, address, and plan are required' },
        { status: 400 }
      );
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
        planTitle,
        amount: Number(amount) || 3500,
        paymentMode: paymentMode || 'Bank Transfer / Cheque / UPI',
        status: 'Pending',
        notes: notes?.trim() || null,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: 'Subscription request received! Our circulation team will contact you shortly with the invoice and payment confirmation.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
