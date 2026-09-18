import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const plans = await db.subscriptionPlan.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ plans });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { title, planType, format, duration, priceInr, priceUsd, featuresJson, isPopular, isActive, order } = body;

    if (!title || priceInr === undefined) {
      return NextResponse.json({ error: 'Title and price are required' }, { status: 400 });
    }

    const plan = await db.subscriptionPlan.create({
      data: {
        title: title.trim(),
        planType: planType || 'Individual',
        format: format || 'Online',
        duration: duration || '1 Year',
        priceInr: Number(priceInr),
        priceUsd: priceUsd ? Number(priceUsd) : null,
        featuresJson: typeof featuresJson === 'string' ? featuresJson : JSON.stringify(featuresJson || []),
        isPopular: Boolean(isPopular),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        order: order !== undefined ? Number(order) : 0,
      },
    });

    return NextResponse.json({ success: true, plan });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { id, title, planType, format, duration, priceInr, priceUsd, featuresJson, isPopular, isActive, order } = body;

    if (!id) return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 });

    const updated = await db.subscriptionPlan.update({
      where: { id: Number(id) },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(planType !== undefined && { planType }),
        ...(format !== undefined && { format }),
        ...(duration !== undefined && { duration }),
        ...(priceInr !== undefined && { priceInr: Number(priceInr) }),
        ...(priceUsd !== undefined && { priceUsd: priceUsd ? Number(priceUsd) : null }),
        ...(featuresJson !== undefined && {
          featuresJson: typeof featuresJson === 'string' ? featuresJson : JSON.stringify(featuresJson),
        }),
        ...(isPopular !== undefined && { isPopular: Boolean(isPopular) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(order !== undefined && { order: Number(order) }),
      },
    });

    return NextResponse.json({ success: true, plan: updated });
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

    if (!id) return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 });

    await db.subscriptionPlan.delete({ where: { id: Number(id) } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
