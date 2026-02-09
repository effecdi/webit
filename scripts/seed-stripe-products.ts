import { getUncachableStripeClient } from '../lib/stripe-client';

async function seedProducts() {
  const stripe = await getUncachableStripeClient();

  const existingProducts = await stripe.products.list({ limit: 100 });
  const existingNames = existingProducts.data.map(p => p.name);

  if (!existingNames.includes('WE:BEAT 고급 (Advanced)')) {
    console.log('Creating Advanced plan...');
    const advancedProduct = await stripe.products.create({
      name: 'WE:BEAT 고급 (Advanced)',
      description: '커플 통계 리포트, 무제한 저장공간, 우선 지원',
      metadata: {
        tier: 'advanced',
        features: 'couple_stats,unlimited_storage,priority_support',
      },
    });

    const advancedMonthly = await stripe.prices.create({
      product: advancedProduct.id,
      unit_amount: 1900,
      currency: 'krw',
      recurring: { interval: 'month' },
      metadata: { plan_type: 'monthly', display_price: '1,900원/월' },
    });

    const advancedYearly = await stripe.prices.create({
      product: advancedProduct.id,
      unit_amount: 18240,
      currency: 'krw',
      recurring: { interval: 'year' },
      metadata: { plan_type: 'yearly', display_price: '18,240원/년 (20% 할인)' },
    });

    console.log(`Advanced product: ${advancedProduct.id}`);
    console.log(`  Monthly price: ${advancedMonthly.id} (1,900 KRW/month)`);
    console.log(`  Yearly price: ${advancedYearly.id} (18,240 KRW/year)`);
  } else {
    console.log('Advanced plan already exists, skipping...');
  }

  if (!existingNames.includes('WE:BEAT 프리미엄 (Premium)')) {
    console.log('Creating Premium plan...');
    const premiumProduct = await stripe.products.create({
      name: 'WE:BEAT 프리미엄 (Premium)',
      description: 'AI 추천, 프리미엄 테마, 데이터 분석 포함 모든 기능',
      metadata: {
        tier: 'premium',
        features: 'couple_stats,unlimited_storage,priority_support,ai_recommendations,premium_themes,data_analytics',
      },
    });

    const premiumMonthlyDating = await stripe.prices.create({
      product: premiumProduct.id,
      unit_amount: 4900,
      currency: 'krw',
      recurring: { interval: 'month' },
      metadata: { plan_type: 'monthly', mode: 'dating', display_price: '4,900원/월' },
    });

    const premiumMonthlyFamily = await stripe.prices.create({
      product: premiumProduct.id,
      unit_amount: 6900,
      currency: 'krw',
      recurring: { interval: 'month' },
      metadata: { plan_type: 'monthly', mode: 'family', display_price: '6,900원/월' },
    });

    const premiumYearlyDating = await stripe.prices.create({
      product: premiumProduct.id,
      unit_amount: 47040,
      currency: 'krw',
      recurring: { interval: 'year' },
      metadata: { plan_type: 'yearly', mode: 'dating', display_price: '47,040원/년 (20% 할인)' },
    });

    const premiumYearlyFamily = await stripe.prices.create({
      product: premiumProduct.id,
      unit_amount: 66240,
      currency: 'krw',
      recurring: { interval: 'year' },
      metadata: { plan_type: 'yearly', mode: 'family', display_price: '66,240원/년 (20% 할인)' },
    });

    console.log(`Premium product: ${premiumProduct.id}`);
    console.log(`  Monthly Dating: ${premiumMonthlyDating.id} (4,900 KRW/month)`);
    console.log(`  Monthly Family: ${premiumMonthlyFamily.id} (6,900 KRW/month)`);
    console.log(`  Yearly Dating: ${premiumYearlyDating.id} (47,040 KRW/year)`);
    console.log(`  Yearly Family: ${premiumYearlyFamily.id} (66,240 KRW/year)`);
  } else {
    console.log('Premium plan already exists, skipping...');
  }

  console.log('\nDone! Products and prices created in Stripe.');
  console.log('Webhooks will sync them to the database automatically.');
}

seedProducts().catch(console.error);
