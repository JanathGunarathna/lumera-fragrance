# Luméra Fragrance

Full-stack perfume e-commerce application.

## Stack

- React + Vite
- Tailwind CSS + Bootstrap
- Spring Boot 3.3.5
- Java 21
- Spring Security + JWT
- MySQL
- PayHere Checkout API

## PayHere integration

The application now uses PayHere's hosted Checkout API instead of collecting card/CVV details in the Luméra frontend.

Flow:

1. Customer places an order.
2. Backend creates the order and calculates the authoritative payable amount.
3. Frontend asks `/api/payments/payhere/initiate/{orderId}` for a server-generated checkout payload.
4. Browser POSTs that payload to PayHere.
5. PayHere processes card/payment details on its hosted checkout.
6. PayHere calls `/api/payments/payhere/notify`.
7. Backend verifies the PayHere MD5 signature and amount/currency before marking the order paid.
8. PayHere redirects the customer to the configured return/cancel page.

### Environment variables

Do not commit real secrets.

```text
DB_URL=jdbc:mysql://localhost:3306/lumera_db?useSSL=true&serverTimezone=UTC&createDatabaseIfNotExist=true
DB_USERNAME=root
DB_PASSWORD=your-password

JWT_SECRET=your-long-random-secret

PAYHERE_MERCHANT_ID=your-merchant-id
PAYHERE_MERCHANT_SECRET=your-merchant-secret
PAYHERE_CURRENCY=USD
PAYHERE_CHECKOUT_URL=https://sandbox.payhere.lk/pay/checkout

PAYHERE_RETURN_URL=https://your-domain.com/payment/success?orderId={orderId}
PAYHERE_CANCEL_URL=https://your-domain.com/payment/cancel?orderId={orderId}
PAYHERE_NOTIFY_URL=https://api.your-domain.com/api/payments/payhere/notify

CORS_ALLOWED_ORIGINS=https://your-domain.com
```

For production, change `PAYHERE_CHECKOUT_URL` to:

```text
https://www.payhere.lk/pay/checkout
```

The PayHere notification URL must be publicly reachable. PayHere does not send the server callback to localhost.

## Java

Use JDK 21.

```bash
java -version
./mvnw clean test
./mvnw clean package
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Important

The current seed products use USD-style prices. The PayHere currency is therefore configured as `USD` by default. If the store should sell in LKR, update the product prices in the database/admin panel and set:

```text
PAYHERE_CURRENCY=LKR
```

Never put `PAYHERE_MERCHANT_SECRET` in React or any client-side code.
