import { NextRequest, NextResponse } from "next/server";
import { stripe, getSubscriptionTier, isStripeConfigured } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  if (!isStripeConfigured) {
    return NextResponse.json({ received: true });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        console.log("Checkout completed:", session.customer, session.subscription);
        // When Supabase is configured, update user's subscription tier here
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const priceId = subscription.items.data[0]?.price?.id;
        const tier = priceId ? getSubscriptionTier(priceId) : "free";
        console.log("Subscription updated:", subscription.customer, "Tier:", tier, "Status:", subscription.status);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        console.log("Subscription canceled:", subscription.customer);
        // Downgrade to free tier
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        console.log("Payment succeeded:", invoice.customer, "Amount:", invoice.amount_paid);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        console.log("Payment failed:", invoice.customer);
        // Mark subscription as past_due
        break;
      }
      default:
        console.log("Unhandled event type:", event.type);
    }
  } catch (error) {
    console.error("Error processing webhook event:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
