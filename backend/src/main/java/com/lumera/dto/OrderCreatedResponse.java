package com.lumera.dto;

import com.lumera.entity.Order;
import com.lumera.entity.OrderStatus;

import java.math.BigDecimal;

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
