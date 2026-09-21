package com.lumera.controller;

import com.lumera.repository.FeedbackRepository;
import com.lumera.repository.OrderRepository;
import com.lumera.repository.ProductRepository;
import com.lumera.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    @GetMapping("/analytics")
    @Transactional(readOnly = true)
    public Map<String, Object> analytics() {
        List<com.lumera.entity.Order> orders = orderRepository.findAll();
        LocalDate today = LocalDate.now();
        Map<String, Object> analytics = new HashMap<>();

        analytics.put("daily", buckets(orders, today.minusDays(6), today, Bucket.DAILY));
        analytics.put("weekly", buckets(orders, today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).minusWeeks(7), today, Bucket.WEEKLY));
        analytics.put("monthly", buckets(orders, YearMonth.now().minusMonths(11).atDay(1), today, Bucket.MONTHLY));

        List<com.lumera.entity.Order> paidOrders = orders.stream()
                .filter(order -> "PAID".equalsIgnoreCase(order.getPaymentStatus()))
                .toList();
        Map<String, Integer> productUnits = new HashMap<>();
        paidOrders.forEach(order -> order.getItems().forEach(item ->
                productUnits.merge(item.getProductName(), item.getQuantity(), Integer::sum)));
        analytics.put("topProducts", productUnits.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(6)
                .map(entry -> Map.of("name", entry.getKey(), "units", entry.getValue()))
                .toList());
        analytics.put("orderStatuses", orders.stream().collect(Collectors.groupingBy(
                order -> order.getStatus().name(), LinkedHashMap::new, Collectors.counting())));
        return analytics;
    }

    private List<Map<String, Object>> buckets(List<com.lumera.entity.Order> orders,
                                               LocalDate start, LocalDate end, Bucket bucket) {
        List<Map<String, Object>> result = new ArrayList<>();
        LocalDate cursor = start;
        while (!cursor.isAfter(end)) {
            LocalDate bucketEnd = switch (bucket) {
                case DAILY -> cursor;
                case WEEKLY -> cursor.plusDays(6);
                case MONTHLY -> cursor.with(TemporalAdjusters.lastDayOfMonth());
            };
            LocalDate finalBucketEnd = bucketEnd.isAfter(end) ? end : bucketEnd;
            LocalDate bucketStart = cursor;
            List<com.lumera.entity.Order> matching = orders.stream()
                    .filter(order -> {
                        LocalDate date = order.getCreatedAt().toLocalDate();
                        return !date.isBefore(bucketStart) && !date.isAfter(finalBucketEnd);
                    }).toList();
            BigDecimal revenue = matching.stream()
                    .filter(order -> "PAID".equalsIgnoreCase(order.getPaymentStatus()))
                    .map(com.lumera.entity.Order::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            int units = matching.stream().flatMap(order -> order.getItems().stream())
                    .mapToInt(item -> item.getQuantity()).sum();
            result.add(Map.of(
                    "label", label(cursor, bucket),
                    "orders", matching.size(),
                    "revenue", revenue,
                    "units", units
            ));
            cursor = switch (bucket) {
                case DAILY -> cursor.plusDays(1);
                case WEEKLY -> cursor.plusWeeks(1);
                case MONTHLY -> cursor.plusMonths(1).withDayOfMonth(1);
            };
        }
        return result;
    }

    private String label(LocalDate date, Bucket bucket) {
        return switch (bucket) {
            case DAILY -> date.getMonthValue() + "/" + date.getDayOfMonth();
            case WEEKLY -> "W/C " + date.getMonthValue() + "/" + date.getDayOfMonth();
            case MONTHLY -> date.getMonth().name().substring(0, 3) + " " + date.getYear();
        };
    }

    private enum Bucket { DAILY, WEEKLY, MONTHLY }
}
