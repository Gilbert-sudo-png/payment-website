# Paystack Live API Key Setup Guide

This guide will help you set up your live Paystack API keys for production.

## 📋 Prerequisites

1. A Paystack account (sign up at https://paystack.com)
2. Your account must be activated and verified
3. Access to your Paystack dashboard

## 🔑 Getting Your Live API Keys

1. **Log in to Paystack Dashboard**
   - Go to https://dashboard.paystack.com
   - Sign in with your account credentials

2. **Navigate to Settings**
   - Click on **Settings** in the sidebar
   - Select **Developer** or **API Keys & Webhooks**

3. **Get Your Keys**
   - You'll see two keys:
     - **Public Key** (starts with `pk_live_`) - Used in frontend
     - **Secret Key** (starts with `sk_live_`) - Used in backend
   - Copy both keys (you'll need them in the next steps)

## ⚙️ Setting Up Environment Variables

### Frontend Setup

1. **Navigate to the frontend folder:**
   ```bash
   cd paystack-frontend
   ```

2. **Create a `.env` file:**
   - Copy the `.env.example` file:
     ```bash
     cp .env.example .env
     ```
   - Or create a new `.env` file manually

3. **Add your live public key:**
   ```env
   REACT_APP_PAYSTACK_PUBLIC_KEY=pk_live_YOUR_ACTUAL_LIVE_PUBLIC_KEY
   ```

4. **Optional: Update admin credentials:**
   ```env
   REACT_APP_ADMIN_EMAIL=your-admin-email@example.com
   REACT_APP_ADMIN_PASSWORD=your-secure-password
   ```

5. **Optional: Set API base URL (if deploying):**
   ```env
   REACT_APP_API_BASE_URL=https://your-backend-url.com
   ```

### Backend Setup

1. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```

2. **Create a `.env` file:**
   - Copy the `.env.example` file:
     ```bash
     cp .env.example .env
     ```
   - Or create a new `.env` file manually

3. **Add your live secret key:**
   ```env
   PAYSTACK_SECRET_KEY=sk_live_YOUR_ACTUAL_LIVE_SECRET_KEY
   ```

4. **Set production environment:**
   ```env
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://your-frontend-url.com
   ```

## 🔄 Restart Your Applications

After setting up the environment variables:

### Frontend:
```bash
cd paystack-frontend
npm start
```

### Backend:
```bash
cd backend
npm start
```

## ✅ Verification

1. **Test the Payment Flow:**
   - Go to your website
   - Try making a test payment
   - Check your Paystack dashboard to see if the transaction appears

2. **Check Console Logs:**
   - Make sure there are no errors about missing API keys
   - Verify that payments are being processed

## 🔒 Security Best Practices

1. **Never commit `.env` files to Git:**
   - Both `.env.example` files are already in `.gitignore`
   - Always use `.env.example` as a template

2. **Keep your secret key secure:**
   - Never share your secret key publicly
   - Don't include it in client-side code
   - Only use it in your backend server

3. **Use different keys for development and production:**
   - Test keys start with `pk_test_` and `sk_test_`
   - Live keys start with `pk_live_` and `sk_live_`

## 🚨 Important Notes

- **Test Mode vs Live Mode:**
  - Test keys won't process real payments
  - Live keys will process real money transactions
  - Make sure you're using the correct keys for your environment

- **Key Format:**
  - Public keys: `pk_live_xxxxxxxxxxxxx` or `pk_test_xxxxxxxxxxxxx`
  - Secret keys: `sk_live_xxxxxxxxxxxxx` or `sk_test_xxxxxxxxxxxxx`

- **Environment Variables:**
  - Frontend variables must start with `REACT_APP_` to be accessible
  - After changing `.env` files, restart your development server

## 📞 Need Help?

- Paystack Documentation: https://paystack.com/docs
- Paystack Support: support@paystack.com
- Check your Paystack dashboard for transaction logs

