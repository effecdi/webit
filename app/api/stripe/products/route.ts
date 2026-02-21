import { NextResponse } from 'next/server';
import { getUncachableStripeClient } from '@/lib/stripe-client';

export async function GET() {
  try {
    const stripe = await getUncachableStripeClient();

    const [products, prices] = await Promise.all([
      stripe.products.list({ active: true, limit: 10 }),
      stripe.prices.list({ active: true, limit: 30 }),
    ]);

    const productList = products.data.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      metadata: p.metadata,
      active: p.active,
      prices: prices.data
        .filter((pr) => pr.product === p.id)
        .map((pr) => ({
          id: pr.id,
          unit_amount: pr.unit_amount,
          currency: pr.currency,
          active: pr.active,
          recurring: pr.recurring
            ? {
                interval: pr.recurring.interval,
                interval_count: pr.recurring.interval_count,
              }
            : null,
          metadata: pr.metadata,
        })),
    }));

    return NextResponse.json({ products: productList });
  } catch (error: unknown) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { products: [], error: 'Failed to fetch products from Stripe' },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const stripe = await getUncachableStripeClient();
    const body = await req.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 },
      );
    }

    const { type, id, metadata, active } = body as {
      type?: 'product' | 'price';
      id?: string;
      metadata?: Record<string, string>;
      active?: boolean;
    };

    if (!type || !id) {
      return NextResponse.json(
        { error: 'Missing type or id' },
        { status: 400 },
      );
    }

    if (type === 'product') {
      const updated = await stripe.products.update(id, {
        metadata,
        active,
      });
      return NextResponse.json({
        id: updated.id,
        name: updated.name,
        description: updated.description,
        metadata: updated.metadata,
        active: updated.active,
      });
    }

    if (type === 'price') {
      const updated = await stripe.prices.update(id, {
        metadata,
        active,
      });
      return NextResponse.json({
        id: updated.id,
        unit_amount: updated.unit_amount,
        currency: updated.currency,
        metadata: updated.metadata,
        active: updated.active,
        recurring: updated.recurring
          ? {
              interval: updated.recurring.interval,
              interval_count: updated.recurring.interval_count,
            }
          : null,
      });
    }

    return NextResponse.json(
      { error: 'Unsupported type' },
      { status: 400 },
    );
  } catch (error: unknown) {
    console.error('Products update error:', error);
    return NextResponse.json(
      { error: 'Failed to update Stripe object' },
      { status: 500 },
    );
  }
}
