import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('STRIPE_SECRET_KEY is not defined in environment variables');
}

const apiKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build';

export const stripe = new Stripe(apiKey, {
    apiVersion: '2025-01-27' as any, // Use latest stable
    typescript: true,
});
