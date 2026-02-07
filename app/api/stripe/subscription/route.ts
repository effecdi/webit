import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserId } from '@/lib/auth';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { ensureStripeInitialized } from '@/lib/stripe-init';

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureStripeInitialized();

    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user?.stripeCustomerId) {
      return NextResponse.json({ subscription: null, plan: 'free' });
    }

    const result = await db.execute(sql`
      SELECT 
        s.id,
        s.status,
        s.current_period_start,
        s.current_period_end,
        s.cancel_at_period_end,
        p.name as product_name,
        p.metadata as product_metadata,
        pr.unit_amount,
        pr.currency,
        pr.recurring
      FROM stripe.subscriptions s
      LEFT JOIN stripe.subscription_items si ON si.subscription = s.id
      LEFT JOIN stripe.prices pr ON si.price = pr.id
      LEFT JOIN stripe.products p ON pr.product = p.id
      WHERE s.customer = ${user.stripeCustomerId}
      AND s.status IN ('active', 'trialing')
      ORDER BY s.created DESC
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return NextResponse.json({ subscription: null, plan: user.subscriptionPlan || 'free' });
    }

    const sub = result.rows[0] as any;
    const tier = sub.product_metadata?.tier || user.subscriptionPlan || 'advanced';

    return NextResponse.json({
      subscription: {
        id: sub.id,
        status: sub.status,
        currentPeriodEnd: sub.current_period_end,
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        productName: sub.product_name,
        amount: sub.unit_amount,
        currency: sub.currency,
        interval: sub.recurring?.interval,
      },
      plan: tier,
    });
  } catch (error: any) {
    console.error('Subscription fetch error:', error);
    return NextResponse.json({ subscription: null, plan: 'free' });
  }
}
