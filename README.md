# Payment Website - Paystack Integration

A complete payment processing system with React frontend and Node.js backend, integrated with Paystack payment gateway.

## Project Structure

```
payment website/
├── paystack-frontend/     # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── PaymentForm.js    # Payment form component
│   │   │   └── SuccessPage.js   # Success/receipt page
│   │   └── App.js
│   └── package.json
│
└── backend/                # Node.js/Express backend API
    ├── server.js           # Express server
    ├── database.js         # SQLite database operations
    └── package.json
```

## Payment Flow

1. **Frontend Form** - User enters name, email, amount, and payment reason
2. **Paystack Checkout** - User clicks "Pay" and Paystack checkout modal opens
3. **Payment Processing** - User completes payment via card, bank, or transfer
4. **Redirect** - Paystack redirects back with a reference number
5. **Backend Verification** - Backend verifies payment with Paystack API
6. **Database Storage** - Payment record is saved to database
7. **Success Page** - User sees receipt with payment details

## Quick Start

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd paystack-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
REACT_APP_PAYSTACK_PUBLIC_KEY=pk_test_YOUR_PUBLIC_KEY_HERE
REACT_APP_BACKEND_URL=http://localhost:5000
```

4. Start development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
PAYSTACK_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
```

4. Start server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

## Configuration

### Paystack Keys

Get your API keys from [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developer):

- **Public Key** (Frontend): Starts with `pk_test_` (testing) or `pk_live_` (production)
- **Secret Key** (Backend): Starts with `sk_test_` (testing) or `sk_live_` (production)

**Important:** 
- Never expose your secret key in the frontend
- Use test keys for development
- Switch to live keys only in production

## Features

### Frontend
- ✅ Modern, responsive payment form
- ✅ Form validation
- ✅ Paystack JavaScript SDK integration
- ✅ Success/receipt page with payment details
- ✅ Print receipt functionality

### Backend
- ✅ Payment verification with Paystack API
- ✅ SQLite database for payment records
- ✅ CORS enabled for frontend
- ✅ Error handling and validation
- ✅ RESTful API endpoints

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/verify-payment/:reference` - Verify payment
- `GET /api/payments` - Get all payments

## Database

Payments are stored in SQLite database (`backend/payments.db`) with the following information:
- Payment reference
- Amount and currency
- Payer details (name, email)
- Payment reason
- Transaction status
- Full Paystack response

## Development

### Running Both Servers

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd paystack-frontend
npm start
```

## Production Deployment

1. Build the frontend:
```bash
cd paystack-frontend
npm run build
```

2. Update environment variables with production Paystack keys

3. Deploy backend to your server (e.g., Heroku, AWS, DigitalOcean)

4. Configure frontend to point to production backend URL

## Security Notes

- ✅ Secret keys are stored server-side only
- ✅ Payment verification happens on backend
- ✅ Database file is excluded from git
- ✅ Environment variables for sensitive data

## Support

For Paystack API documentation, visit: https://paystack.com/docs/api/

