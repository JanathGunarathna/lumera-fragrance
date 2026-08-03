package com.lumera.controller;

import com.lumera.dto.ApiResponse;
import com.lumera.dto.PaymentRequest;
import com.lumera.entity.Order;
import com.lumera.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * Simulated payment gateway integration. In production this would call out to
 * Stripe/Razorpay/PayPal and verify a webhook signature before marking an order paid.
 * Card details are never persisted server-side.
 */
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final OrderService orderService;

    @PostMapping("/pay")
    public ApiResponse pay(@RequestBody PaymentRequest req) {
        Order order = orderService.getById(req.getOrderId());

        if ("CARD".equalsIgnoreCase(req.getPaymentMethod())) {
            if (req.getCardNumber() == null || req.getCardNumber().replaceAll("\\s", "").length() < 12) {
                return new ApiResponse(false, "Invalid card number");
            }
        }

        orderService.markPaid(order.getId(), req.getPaymentMethod());
        return new ApiResponse(true, "Payment successful. Order confirmed.");
    }
}
