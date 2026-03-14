# EdgeFinder Setup Guide

Complete guide to setting up, configuring, and deploying the EdgeFinder trading strategy platform.

---

## 1. Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** (included with Node.js)
- **Vercel CLI** (optional, for deployment) - Install with `npm i -g vercel`
- **Git** - [Download](https://git-scm.com/)

Verify your installation:

```bash
node --version    # Should be 18.x or higher
npm --version     # Should be 9.x or higher
```

---

## 2. Quick Start (Demo Mode)

Everything works out of the box without any external accounts. Demo mode uses local storage for data, mock authentication, and sample data for all features.

```bash
# Clone the repository
git clone <your-repo-url> edgefinder
cd edgefinder

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**What works in demo mode:**
- Full dashboard with sample data
- Strategy builder with 200+ indicators
- Backtesting engine with sample equity curves
- Leaderboard with sample rankings (persisted in localStorage)
- Pricing page (no real payments)
- All UI components and animations

---

## 3. Supabase Setup (Real Auth)

Supabase provides authentication, database, and real-time features.

### 3.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Click **New Project**
3. Choose your organization, give it a name (e.g., "EdgeFinder"), and set a database password
4. Select a region close to your users
5. Wait for the project to finish provisioning (~2 minutes)

### 3.2 Get Your API Keys

1. In your Supabase dashboard, go to **Settings > API**
2. Copy these values:
   - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) -- keep this secret!

### 3.3 Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open the file `supabase/schema.sql` from this project
4. Paste the entire contents into the SQL Editor
5. Click **Run**

This creates all necessary tables: `profiles`, `strategies`, `leaderboard_entries`, `subscriptions`, along with Row Level Security policies, triggers, and indexes.

### 3.4 Enable Google OAuth

1. In your Supabase dashboard, go to **Authentication > Providers**
2. Find **Google** and enable it
3. You will need a Google OAuth Client ID and Secret:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Go to **APIs & Services > Credentials**
   - Click **Create Credentials > OAuth Client ID**
   - Set application type to **Web application**
   - Add authorized redirect URI: `https://<your-supabase-project>.supabase.co/auth/v1/callback`
   - Copy the Client ID and Client Secret
4. Paste them into the Supabase Google provider settings
5. Save

### 3.5 Configure Auth URLs

1. In Supabase, go to **Authentication > URL Configuration**
2. Set **Site URL** to your Vercel URL (e.g., `https://edgefinder.vercel.app`)
3. Add **Redirect URLs**:
   - `https://your-domain.vercel.app/api/auth/callback`
   - `http://localhost:3000/api/auth/callback` (for local development)

---

## 4. Stripe Setup (Real Payments)

Stripe handles subscription billing for Pro and Elite tiers.

### 4.1 Create a Stripe Account

1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete the onboarding process (you can use test mode initially)

### 4.2 Create Subscription Products

In your Stripe Dashboard, go to **Products** and create these 4 subscription products:

| Product Name | Price | Billing |
|---|---|---|
| EdgeFinder Pro Monthly | $29/month | Recurring monthly |
| EdgeFinder Pro Annual | $290/year | Recurring yearly |
| EdgeFinder Elite Monthly | $79/month | Recurring monthly |
| EdgeFinder Elite Annual | $790/year | Recurring yearly |

For each product:
1. Click **Add Product**
2. Enter the name and description
3. Set the price as recurring
4. After creating, copy the **Price ID** (starts with `price_`)

You will have 4 price IDs to use in your environment variables.

### 4.3 Set Up Webhooks

1. Go to **Developers > Webhooks**
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://your-domain.vercel.app/api/stripe/webhook`
4. Select these events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)

### 4.4 Get API Keys

1. Go to **Developers > API Keys**
2. Copy the **Publishable key** (starts with `pk_test_` or `pk_live_`)
3. Copy the **Secret key** (starts with `sk_test_` or `sk_live_`)

---

## 5. Environment Variables

### 5.1 Local Development

Create a `.env.local` file in the project root with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_test_your-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
STRIPE_PRO_MONTHLY_PRICE_ID=price_xxxxxxxxxxxx
STRIPE_PRO_ANNUAL_PRICE_ID=price_xxxxxxxxxxxx
STRIPE_ELITE_MONTHLY_PRICE_ID=price_xxxxxxxxxxxx
STRIPE_ELITE_ANNUAL_PRICE_ID=price_xxxxxxxxxxxx

# Resend (transactional emails)
RESEND_API_KEY=re_your-api-key

# ConvertKit (email marketing)
CONVERTKIT_API_KEY=your-convertkit-key
CONVERTKIT_FORM_ID=your-form-id

# PostHog (analytics)
NEXT_PUBLIC_POSTHOG_KEY=phc_your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5.2 Variable Reference

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | For auth | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | For auth | Supabase anonymous/public API key |
| `SUPABASE_SERVICE_ROLE_KEY` | For auth | Supabase service role key (server-side only) |
| `STRIPE_SECRET_KEY` | For payments | Stripe secret API key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | For payments | Stripe publishable key (client-side) |
| `STRIPE_WEBHOOK_SECRET` | For payments | Stripe webhook signing secret |
| `STRIPE_PRO_MONTHLY_PRICE_ID` | For payments | Stripe Price ID for Pro monthly |
| `STRIPE_PRO_ANNUAL_PRICE_ID` | For payments | Stripe Price ID for Pro annual |
| `STRIPE_ELITE_MONTHLY_PRICE_ID` | For payments | Stripe Price ID for Elite monthly |
| `STRIPE_ELITE_ANNUAL_PRICE_ID` | For payments | Stripe Price ID for Elite annual |
| `RESEND_API_KEY` | Optional | Resend API key for transactional emails |
| `CONVERTKIT_API_KEY` | Optional | ConvertKit API key for email marketing |
| `CONVERTKIT_FORM_ID` | Optional | ConvertKit form ID for newsletter signup |
| `NEXT_PUBLIC_POSTHOG_KEY` | Optional | PostHog project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | Optional | PostHog instance host URL |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optional | Google Analytics 4 measurement ID |
| `NEXT_PUBLIC_APP_URL` | Yes | Your app's public URL |

---

## 6. Deploy to Vercel

### Option A: Vercel CLI

```bash
# Login to Vercel
npx vercel login

# Deploy to production
npx vercel --prod --yes
```

### Option B: GitHub Integration (Recommended)

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and click **Import Project**
3. Select your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Add your environment variables in **Settings > Environment Variables**
6. Click **Deploy**

Every push to `main` will trigger an automatic deployment.

### Setting Environment Variables on Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings > Environment Variables**
3. Add each variable from the list above
4. Make sure to set them for **Production**, **Preview**, and **Development** environments as needed
5. Redeploy after adding variables: **Deployments > Redeploy**

---

## 7. Going Live Checklist

Before switching from test/demo mode to production:

### Stripe

- [ ] Switch Stripe from **test mode** to **live mode** in the Stripe Dashboard
- [ ] Create new live-mode products and price IDs (test mode IDs will not work in live mode)
- [ ] Update all `STRIPE_*` environment variables with live mode keys
- [ ] Create a new webhook endpoint for live mode and update `STRIPE_WEBHOOK_SECRET`
- [ ] Test a complete payment flow end-to-end with a real card

### Supabase

- [ ] Verify your Supabase project is on an appropriate plan for your expected traffic
- [ ] Confirm all RLS (Row Level Security) policies are in place
- [ ] Update the Site URL in Supabase Auth settings to your production domain
- [ ] Ensure redirect URLs match your production domain

### Authentication

- [ ] Test the full signup flow (email + Google OAuth)
- [ ] Verify profile creation trigger works (new users get a profile row automatically)
- [ ] Test password reset flow
- [ ] Confirm email verification is working (if enabled)

### Payments

- [ ] Test the complete checkout flow for each plan (Pro Monthly, Pro Annual, Elite Monthly, Elite Annual)
- [ ] Verify webhook deliveries in the Stripe Dashboard (**Developers > Webhooks > Select endpoint > Recent deliveries**)
- [ ] Test subscription cancellation and reactivation
- [ ] Confirm subscription status syncs correctly between Stripe and your database

### General

- [ ] Verify all environment variables are set correctly on Vercel
- [ ] Test the PWA install flow on mobile (Add to Home Screen)
- [ ] Check that the service worker caches pages correctly
- [ ] Run Lighthouse audit for performance, accessibility, and PWA compliance
- [ ] Set up monitoring and error tracking (e.g., Sentry)
- [ ] Configure your custom domain in Vercel if applicable
- [ ] Update `NEXT_PUBLIC_APP_URL` to your production domain

---

## Troubleshooting

### "Module not found" errors
Run `npm install` to ensure all dependencies are installed.

### Supabase auth not working
- Verify your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Check that redirect URLs in Supabase Auth settings match your app URL
- Ensure the `handle_new_user` trigger exists by running the schema SQL

### Stripe webhooks failing
- Make sure your webhook endpoint URL is correct and publicly accessible
- Verify the `STRIPE_WEBHOOK_SECRET` matches the signing secret shown in Stripe Dashboard
- Check webhook delivery logs in Stripe for error details

### PWA not installing
- Ensure `manifest.json` is being served at `/manifest.json`
- Check that icons exist at `/icons/icon-192.png` and `/icons/icon-512.png`
- The service worker must be served over HTTPS (except on localhost)
- Run a Lighthouse PWA audit for specific issues

### Build errors
```bash
# Clear Next.js cache and rebuild
rm -rf .next
npm run build
```
