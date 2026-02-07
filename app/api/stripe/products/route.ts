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
      prices: prices.data
        .filter((pr) => pr.product === p.id)
        .map((pr) => ({
          id: pr.id,
          unit_amount: pr.unit_amount,
          currency: pr.currency,
          recurring: pr.recurring ? { interval: pr.recurring.interval, interval_count: pr.recurring.interval_count } : null,
          metadata: pr.metadata,
        })),
    }));

    return NextResponse.json({ products: productList });
  } catch (error: any) {
    console.error('Products fetch error:', error);
    return NextResponse.json({ products: [] });
  }
}
