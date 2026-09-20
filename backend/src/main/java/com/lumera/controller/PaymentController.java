package com.lumera.controller;

import com.lumera.dto.ApiResponse;
import com.lumera.entity.Order;
import com.lumera.entity.User;
import com.lumera.security.CurrentUser;
import com.lumera.service.OrderService;
import com.lumera.service.PayHereService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final OrderService orderService;
    private final PayHereService payHereService;

    /**
     * Creates the server-generated PayHere checkout payload.
     * Card/CVV details are entered only on PayHere's hosted checkout page.
     */
    @PostMapping("/payhere/initiate/{orderId}")
    public Map<String, String> initiatePayHere(@CurrentUser User user, @PathVariable Long orderId) {
        Order order = orderService.getById(orderId);

        if (!order.getUser().getId().equals(user.getId())) {
            throw new SecurityException("You cannot pay for this order");
        }

        if ("PAID".equalsIgnoreCase(order.getPaymentStatus())) {
            throw new IllegalStateException("This order has already been paid");
        }

        order.setPaymentMethod("PAYHERE");
        orderService.save(order);

        Map<String, String> payload = payHereService.createCheckout(order);
        payload.put("action", payHereService.getCheckoutUrl());
        return payload;
    }

    /**
     * PayHere server-to-server callback.
     * This endpoint must be public and reachable from PayHere.
     */
    @PostMapping("/payhere/notify")
    public String payHereNotify(@RequestParam Map<String, String> params) {
        String merchantId = params.get("merchant_id");
        String orderId = params.get("order_id");
        String amount = params.get("payhere_amount");
        String currency = params.get("payhere_currency");
        String statusCode = params.get("status_code");
        String md5sig = params.get("md5sig");

        if (merchantId == null || orderId == null || amount == null
                || currency == null || statusCode == null || md5sig == null) {
            return "INVALID";
        }

        if (!payHereService.verifyNotification(
                merchantId, orderId, amount, currency, statusCode, md5sig)) {
            return "INVALID_SIGNATURE";
        }

        final Long id;
        try {
            id = Long.valueOf(orderId);
        } catch (NumberFormatException ex) {
            return "INVALID_ORDER";
        }

        final Order order;
        try {
            order = orderService.getById(id);
        } catch (IllegalArgumentException ex) {
            return "INVALID_ORDER";
        }

        if (!payHereService.amountMatches(order, amount, currency)) {
            return "INVALID_AMOUNT";
        }

        if ("2".equals(statusCode)) {
            String paymentId = params.get("payment_id");
            String method = params.getOrDefault("method", "PAYHERE");
            orderService.markPaidFromGateway(order.getId(), method, paymentId);
            return "OK";
        }

        if ("0".equals(statusCode)) {
            orderService.markPaymentPending(order.getId());
            return "OK";
        }

        orderService.markPaymentFailed(order.getId());
        return "OK";
    }

    /**
     * Retained as a backwards-compatible endpoint for old clients.
     * Real card payments are no longer simulated here.
     */
    @PostMapping("/pay")
    public ApiResponse legacyPaymentEndpoint() {
        return new ApiResponse(false,
                "Card payments now use the secure PayHere checkout. Please update the frontend.");
    }
}
