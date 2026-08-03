package com.lumera.dto;

import lombok.Data;

@Data
public class FeedbackRequest {
    private Long productId; // nullable for general feedback
    private Integer rating;
    private String comment;
}
