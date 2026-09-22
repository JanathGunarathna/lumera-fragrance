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



Never put `PAYHERE_MERCHANT_SECRET` in React or any client-side code.
