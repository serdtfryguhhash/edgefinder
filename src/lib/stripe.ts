import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
  typescript: true,
});

export const STRIPE_PRICES = {
  pro_monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "price_pro_monthly",
  pro_annual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID || "price_pro_annual",
  elite_monthly: process.env.STRIPE_ELITE_MONTHLY_PRICE_ID || "price_elite_monthly",
  elite_annual: process.env.STRIPE_ELITE_ANNUAL_PRICE_ID || "price_elite_annual",
};

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string,
  referralCode?: string
) {
  const metadata: Record<string, string> = {};
  if (referralCode) {
    metadata.referral_code = referralCode;
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
    subscription_data: {
      trial_period_days: 7,
      metadata,
    },
    allow_promotion_codes: true,
  });

  return session;
}

export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

export async function createOrRetrieveCustomer(
  email: string,
  name: string,
  userId: string
) {
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0];
  }

  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      supabase_user_id: userId,
    },
  });

  return customer;
}

export function getSubscriptionTier(priceId: string): "pro" | "elite" | "free" {
  if (
    priceId === STRIPE_PRICES.pro_monthly ||
    priceId === STRIPE_PRICES.pro_annual
  ) {
    return "pro";
  }
  if (
    priceId === STRIPE_PRICES.elite_monthly ||
    priceId === STRIPE_PRICES.elite_annual
  ) {
    return "elite";
  }
  return "free";
}
