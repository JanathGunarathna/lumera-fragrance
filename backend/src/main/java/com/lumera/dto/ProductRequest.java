package com.lumera.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {
    private String name;
    private String brand;
    private String category;
    private String gender;
    private String description;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private Integer stock;
    private String imageUrl;
    private String volume;
    private Boolean active;
}
