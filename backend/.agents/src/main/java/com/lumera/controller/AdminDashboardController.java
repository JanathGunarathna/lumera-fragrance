package com.lumera.controller;

import com.lumera.repository.FeedbackRepository;
import com.lumera.repository.OrderRepository;
import com.lumera.repository.ProductRepository;
import com.lumera.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final FeedbackRepository feedbackRepository;

    @GetMapping("/summary")
    public Map<String, Object> summary() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalProducts", productRepository.count());
        stats.put("totalOrders", orderRepository.count());
        stats.put("totalFeedback", feedbackRepository.count());

        BigDecimal revenue = orderRepository.findAll().stream()
                .filter(o -> "PAID".equals(o.getPaymentStatus()))
                .map(com.lumera.entity.Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("totalRevenue", revenue);
        return stats;
    }
}
