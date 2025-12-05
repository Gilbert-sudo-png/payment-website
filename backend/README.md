# Paystack Payment Backend

Backend API server for verifying Paystack payments and storing payment records.

## Features

- ✅ Payment verification with Paystack API
- ✅ SQLite database for storing payment records
- ✅ CORS enabled for frontend integration
- ✅ RESTful API endpoints

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
PAYSTACK_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
```

**Important:** Get your Paystack secret key from [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developer)

- For testing: Use a key that starts with `sk_test_`
- For production: Use a key that starts with `sk_live_`

### 3. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status.

### Verify Payment
```
GET /api/verify-payment/:reference
```
Verifies a payment with Paystack using the transaction reference.

**Response (Success):**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "reference": "ref_1234567890",
    "amount": "5000.00",
    "currency": "NGN",
    "status": "success",
    "name": "John Doe",
    "email": "john@example.com",
    "reason": "School fees",
    "transaction_date": "2024-01-15T10:30:00.000Z"
  }
}
```

### Get All Payments
```
GET /api/payments
```
Retrieves all payment records from the database.

## Database

The backend uses SQLite to store payment records. The database file (`payments.db`) is automatically created in the `backend` directory.

**Payments Table Schema:**
- `id` - Primary key
- `reference` - Unique payment reference
- `amount` - Payment amount
- `currency` - Currency code (e.g., NGN)
- `status` - Payment status
- `name` - Payer's name
- `email` - Payer's email
- `reason` - Payment reason
- `transaction_date` - Transaction date from Paystack
- `paystack_response` - Full Paystack API response (JSON)
- `created_at` - Record creation timestamp

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `400` - Bad Request (invalid reference, payment failed)
- `404` - Payment reference not found
- `500` - Server error

## Security Notes

- Never commit your `.env` file to version control
- Keep your Paystack secret key secure
- Use environment variables for all sensitive configuration
- The database file (`payments.db`) is excluded from git

