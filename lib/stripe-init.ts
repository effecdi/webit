import { runMigrations } from 'stripe-replit-sync';
import { getStripeSync } from '@/lib/stripe-client';

let initialized = false;
let initPromise: Promise<void> | null = null;

export async function ensureStripeInitialized() {
  if (initialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('DATABASE_URL not set, skipping Stripe init');
      return;
    }

    try {
      console.log('Initializing Stripe schema...');
      await runMigrations({ databaseUrl });
      console.log('Stripe schema ready');

      const stripeSync = await getStripeSync();

      const domain = process.env.REPLIT_DOMAINS?.split(',')[0] || process.env.REPLIT_DEV_DOMAIN;
      if (domain) {
        try {
          console.log('Setting up managed webhook...');
          const result = await stripeSync.findOrCreateManagedWebhook(
            `https://${domain}/api/stripe/webhook`
          );
          console.log('Webhook setup result:', JSON.stringify(result, null, 2).substring(0, 200));
        } catch (webhookErr: any) {
          console.warn('Webhook setup warning (non-fatal):', webhookErr.message);
        }
      }

      stripeSync.syncBackfill()
        .then(() => console.log('Stripe data synced'))
        .catch((err: any) => console.error('Error syncing Stripe data:', err));

      initialized = true;
    } catch (error) {
      console.error('Failed to initialize Stripe:', error);
      initPromise = null;
    }
  })();

  return initPromise;
}
