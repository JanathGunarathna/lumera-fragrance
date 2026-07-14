package com.lumera.dto;

import lombok.Data;

@Data
public class OrderRequest {
    private String shippingAddress;
    private String shippingPhone;
    private String paymentMethod; // CARD, UPI, COD
}
