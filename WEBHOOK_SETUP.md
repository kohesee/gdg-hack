# 🚀 Quick Webhook Setup Guide

## 🔧 Fix Applied ✅
- **Fixed middleware.ts**: Updated to use `await auth.protect()` for Clerk v6.36.7 compatibility
- **Added webhook setup script**: Easy Svix Play configuration

## 🔗 Set Up Webhooks for Local Development

### ⚠️ **Important: Svix CLI Required for Local Development**

You **cannot** directly use `http://localhost:3000/api/webhooks/clerk` in Svix Play because it only accepts **public URLs**. You need the **Svix CLI** to create a tunnel.

### **Step 1: Install Svix CLI**

**Windows (Recommended):**
```bash
# Install Scoop if you don't have it
# Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
# irm get.scoop.sh | iex

# Add Svix bucket and install
scoop bucket add svix https://github.com/svix/scoop-svix.git
scoop install svix
```

**Alternative - Download Binary:**
1. Go to https://github.com/svix/svix-cli/releases
2. Download the Windows `.zip` file
3. Extract and add to your PATH

### **Step 2: Start Development Server**
```bash
bun run dev
```

### **Step 3: Start Svix CLI Tunnel**
```bash
# This creates a public URL that forwards to your localhost
svix listen http://localhost:3000/api/webhooks/clerk
```

**Output will look like:**
```
Webhook relay is now listening at
https://play.svix.com/in/c_pSbznmV2KCg38CY7zYpFBUktsgl/

All requests on this endpoint will be forwarded to your local URL:
http://localhost:3000/api/webhooks/clerk

View logs and debug information at
https://play.svix.com/view/c_pSbznmV2KCg38CY7zYpFBUktsgl/
```

### **Step 4: Configure Clerk Webhook**

1. **Go to [Clerk Dashboard](https://dashboard.clerk.com)**
2. **Navigate to Webhooks → Add Endpoint**
3. **Endpoint URL**: Use the Svix Play URL from step 3 (e.g., `https://play.svix.com/in/c_xxx/`)
4. **Events**: Select `user.created`, `user.updated`, `user.deleted`
5. **Save** and copy the **Signing Secret**

### **Step 5: Update Environment Variables**
```bash
# Add to your .env.local
CLERK_WEBHOOK_SECRET=whsec_your_signing_secret_here
```

### **Step 6: Restart Development Server**
```bash
bun run dev
```

## 🧪 Test the Setup

1. **Visit your app**: http://localhost:3000
2. **Sign up** with a new account
3. **Check Svix Play Dashboard**: You should see webhook events
4. **Check Supabase**: User should be created in the users table
5. **Visit Dashboard**: http://localhost:3000/dashboard

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `svix: command not found` | Install Svix CLI properly |
| Cannot use localhost URL | Must use Svix CLI tunnel, not direct localhost |
| Webhook not firing | Check Svix Play dashboard for events |
| User not in Supabase | Verify webhook secret and Supabase connection |

## 🎯 What's Fixed

- **✅ Middleware Error**: Updated to use `await auth.protect()` syntax
- **✅ Dashboard Route**: Exists at `/app/dashboard/page.tsx`
- **✅ Webhook Setup**: CLI-based tunnel setup for local development
- **✅ Svix Integration**: Proper relay mode with CLI

Your authentication system is now ready for development with proper webhook tunneling! 🎉