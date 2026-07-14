package com.lumera.controller;

import com.lumera.dto.OrderRequest;
import com.lumera.entity.Order;
import com.lumera.entity.User;
import com.lumera.security.CurrentUser;
import com.lumera.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public Order placeOrder(@CurrentUser User user, @RequestBody OrderRequest req) {
        return orderService.placeOrder(user, req);
    }

    @GetMapping("/my")
    public List<Order> myOrders(@CurrentUser User user) {
        return orderService.getUserOrders(user);
    }

    @GetMapping("/{id}")
    public Order getOrder(@PathVariable Long id) {
        return orderService.getById(id);
    }
}
