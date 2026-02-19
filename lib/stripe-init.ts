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
      initialized = true;
    } catch (error) {
      console.error('Failed to initialize Stripe:', error);
      initPromise = null;
    }
  })();

  return initPromise;
}
