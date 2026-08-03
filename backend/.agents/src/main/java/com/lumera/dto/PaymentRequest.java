package com.lumera.dto;

import lombok.Data;

@Data
public class PaymentRequest {
    private Long orderId;
    private String paymentMethod; // CARD, UPI, COD
    private String cardNumber;    // last 4 digits stored/simulated only
    private String cardHolder;
    private String expiry;
    private String cvv;           // never persisted
}
