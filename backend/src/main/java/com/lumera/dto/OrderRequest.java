package com.lumera.dto;

import lombok.Data;

@Data
public class OrderRequest {
    private String shippingAddress;
    private String shippingPhone;
    private String alternatePhone;
    private String customerName;
    private String customerEmail;
    private String paymentMethod; // PAYHERE, COD, BANK_TRANSFER
}
