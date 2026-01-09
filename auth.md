# GDG Sprint1 Authentication Guide

This document explains how authentication works in our Next.js app, how to run it locally with webhook testing, and how to deploy to production on Vercel.

## 🏗️ Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Next.js App   │────▶│     Clerk       │────▶│    Supabase     │
│   (Frontend)    │     │ (Auth Provider) │     │   (Database)    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        │                       │                       │
   User signs in          Manages auth            Stores user data
   via Clerk UI           sessions, tokens        in 'users' table
                                │
                                ▼
                    Webhook fires on user events
                    (create, update, delete)
                                │
                                ▼
                    ┌─────────────────────────┐
                    │  /api/webhooks/clerk    │
                    │  (Syncs to Supabase)    │
                    │  (Verified with Svix)   │
                    └─────────────────────────┘
```

## 🔐 How Authentication Works

### 1. User Authentication (Clerk)
- **Clerk** handles all user authentication (sign up, sign in, OAuth, etc.)
- The `ClerkProvider` wraps the app in `app/layout.tsx`
- The `middleware.ts` protects routes using `clerkMiddleware()`
- Clerk components like `SignIn`, `SignUp`, `UserButton` provide the UI
- Routes `/sign-in` and `/sign-up` use Clerk's hosted pages

### 2. User Data Sync (Webhook + Svix)
When a user signs up/updates/deletes in Clerk:
1. Clerk sends a webhook to `/api/webhooks/clerk`
2. The webhook verifies the signature using `svix` for security
3. User data is synced to the Supabase `users` table
4. Events handled: `user.created`, `user.updated`, `user.deleted`

### 3. Database (Supabase)
- User information is stored in the `users` table
- The `clerk_user_id` links Clerk users to Supabase records
- Use `supabaseAdmin` (service role) for server operations
- Use `supabase` (anon key) for client-side operations with RLS

---

## 🖥️ Running Locally

### Prerequisites
- Node.js 18+ or Bun
- Clerk account (https://clerk.com)
- Supabase account (https://supabase.com)

### Step 1: Install Dependencies
```bash
bun install
```

### Step 2: Set Up Environment Variables
Create `.env.local` from `.env.example`:
```bash
cp .env.example .env.local
```

Update `.env.local` with your values:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Clerk Webhooks
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 3: Create the Supabase Users Table
Go to Supabase Dashboard → SQL Editor and run the SQL from `supabase-schema.sql`:

```sql
-- Create users table in Supabase
CREATE TABLE IF NOT EXISTS users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id varchar NOT NULL UNIQUE,
  email varchar NOT NULL,
  first_name varchar,
  last_name varchar,
  image_url varchar,
  created_at timestamp with time zone DEFAULT timezone('utc', now()),
  updated_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Create an index on clerk_user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_clerk_user_id ON users(clerk_user_id);

-- Set up Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies...
-- (See supabase-schema.sql for complete setup)
```

### Step 4: Set Up Webhook for Local Development

**Using Svix Play (Recommended for Testing)**

1. Start your dev server:
   ```bash
   bun run dev
   ```

2. Go to [Svix Play](https://play.svix.com)
3. Click **"Create a new endpoint"**
4. Enter your local webhook URL: `http://localhost:3000/api/webhooks/clerk`
5. Copy the Svix Play URL (like `https://play.svix.com/in/c_xxx/`)

6. Go to **Clerk Dashboard** → **Webhooks** → **Create Endpoint**:
   - **Endpoint URL**: Use the Svix Play URL from step 5
   - **Events**: Select `user.created`, `user.updated`, `user.deleted`
   - Copy the **Signing Secret**

7. Add the signing secret to `.env.local`:
   ```env
   CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

8. Restart your dev server:
   ```bash
   bun run dev
   ```

**Alternative: Using ngrok**
```bash
# Install ngrok
npm install -g ngrok
# or download from https://ngrok.com

# Expose localhost:3000
ngrok http 3000

# Use the ngrok URL in Clerk Dashboard
# Example: https://abc123.ngrok.io/api/webhooks/clerk
```

### Step 5: Test the Authentication Flow

1. Visit http://localhost:3000
2. Click **"Sign Up"** to create a new account
3. Complete the sign-up process
4. Check Svix Play dashboard to see webhook events
5. Check Supabase Dashboard → Table Editor → users table
6. Visit http://localhost:3000/dashboard to see protected content

---

## 🚀 Deploying to Vercel

### Step 1: Prepare for Production

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

2. **Get Production Clerk Keys:**
   - Go to Clerk Dashboard
   - Switch to **"Production"** environment
   - Copy the production publishable and secret keys

### Step 2: Deploy to Vercel

1. **Import Project:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Configure project settings

2. **Add Environment Variables:**
   In Vercel Dashboard → Settings → Environment Variables:
   ```env
   # Production Clerk Keys
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
   CLERK_SECRET_KEY=sk_live_...
   
   # Clerk URLs
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   
   # Supabase (same as local)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # Webhook secret (will be set in next step)
   CLERK_WEBHOOK_SECRET=whsec_...
   ```

3. **Deploy:**
   - Click **"Deploy"**
   - Wait for deployment to complete
   - Note your production URL (e.g., `https://your-app.vercel.app`)

### Step 3: Configure Production Webhook

1. **Create Production Webhook:**
   - Go to Clerk Dashboard → Webhooks
   - Create new endpoint or edit existing
   - **Endpoint URL**: `https://your-app.vercel.app/api/webhooks/clerk`
   - **Events**: `user.created`, `user.updated`, `user.deleted`
   - Copy the **Signing Secret**

2. **Update Webhook Secret:**
   - In Vercel Dashboard → Settings → Environment Variables
   - Update `CLERK_WEBHOOK_SECRET` with the new secret
   - Redeploy the application

### Step 4: Configure Custom Domain (Optional)

**If you have a custom domain (e.g., `myapp.com`):**

1. **Add Domain in Vercel:**
   - Vercel Dashboard → Domains
   - Add your custom domain

2. **Update DNS Records:**
   ```
   Type: CNAME
   Name: www (or @)
   Value: cname.vercel-dns.com
   ```

3. **Update Clerk Settings:**
   - Clerk Dashboard → Domains
   - Add your custom domain
   - Update webhook URL to use custom domain

---

## 🔧 Troubleshooting

### Webhook Issues

| Problem | Solution |
|---------|----------|
| Webhook not firing | Check Svix Play dashboard for events |
| "Error verifying webhook" | Verify `CLERK_WEBHOOK_SECRET` matches |
| User not created in Supabase | Check Supabase logs, verify service role key |
| "no svix headers" | Ensure webhook comes from Clerk/Svix |

### Development Issues

| Problem | Solution |
|---------|----------|
| Sign-in redirects to wrong URL | Check `NEXT_PUBLIC_CLERK_*_URL` env vars |
| Protected routes not working | Verify middleware.ts configuration |
| Supabase connection failed | Check URL and keys in .env.local |
| TypeScript errors | Run `bun run build` to check for issues |

### Common Commands

```bash
# Development
bun run dev          # Start dev server
bun run build        # Test production build
bun run start        # Start production server

# Debugging
bun run lint         # Check code quality
vercel logs          # View production logs
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `middleware.ts` | Protects routes, handles auth redirects |
| `app/layout.tsx` | ClerkProvider wrapper for entire app |
| `app/api/webhooks/clerk/route.ts` | Webhook handler with Svix verification |
| `lib/supabase.ts` | Supabase client configuration |
| `components/auth.tsx` | Authentication components and protection |
| `app/sign-in/[[...sign-in]]/page.tsx` | Sign-in page |
| `app/sign-up/[[...sign-up]]/page.tsx` | Sign-up page |
| `app/dashboard/page.tsx` | Example protected route |
| `supabase-schema.sql` | Database schema for users table |

---

## 🔒 Security Best Practices

1. **Environment Variables:**
   - Never commit `.env.local` to git
   - Use different keys for development/production
   - Rotate secrets regularly

2. **Webhook Security:**
   - Always verify webhook signatures with Svix
   - Use HTTPS in production
   - Log webhook events for debugging

3. **Database Security:**
   - Use Row Level Security (RLS) in Supabase
   - Service role key only on server-side
   - Regular backup and monitoring

4. **Clerk Configuration:**
   - Configure proper redirect URLs
   - Enable MFA for admin accounts
   - Monitor authentication logs

---

## 🚀 Next Steps

- **Email Templates:** Customize Clerk email templates
- **Social Providers:** Add Google, GitHub, Discord OAuth
- **User Profiles:** Extend user table with additional fields
- **Role-Based Access:** Implement user roles and permissions
- **Analytics:** Track user events and authentication metrics

For more advanced configurations, check the [Clerk Documentation](https://clerk.com/docs) and [Supabase Documentation](https://supabase.com/docs).