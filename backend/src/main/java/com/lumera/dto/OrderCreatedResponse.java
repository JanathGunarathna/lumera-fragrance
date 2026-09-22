package com.lumera.dto;

import java.math.BigDecimal;

import com.lumera.entity.Order;
import com.lumera.entity.OrderStatus;

public record OrderCreatedResponse(
        Long id,
        String transactionRef,
        BigDecimal totalAmount,
        String paymentMethod,
        String paymentStatus,
        OrderStatus status
) {
    public static OrderCreatedResponse from(Order order) {
        return new OrderCreatedResponse(
                order.getId(),
                order.getTransactionRef(),
                order.getTotalAmount(),
                order.getPaymentMethod(),
                order.getPaymentStatus(),
                order.getStatus()
        );
    }
}
