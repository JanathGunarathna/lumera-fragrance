package com.lumera.controller;

import com.lumera.dto.FeedbackRequest;
import com.lumera.entity.Feedback;
import com.lumera.entity.Product;
import com.lumera.entity.User;
import com.lumera.security.CurrentUser;
import com.lumera.service.FeedbackService;
import com.lumera.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final ProductService productService;

    @PostMapping
    public Feedback submit(@CurrentUser User user, @RequestBody FeedbackRequest req) {
        return feedbackService.submit(user, req);
    }

    @GetMapping("/public/site")
    public List<Feedback> siteFeedback() {
        return feedbackService.getSiteFeedback();
    }

    @GetMapping("/public/product/{productId}")
    public List<Feedback> productFeedback(@PathVariable Long productId) {
        Product p = productService.getById(productId);
        return feedbackService.getProductFeedback(p);
    }
}
