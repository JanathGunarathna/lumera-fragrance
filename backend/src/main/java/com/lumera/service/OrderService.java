package com.lumera.service;

import com.lumera.dto.OrderRequest;
import com.lumera.entity.*;
import com.lumera.repository.CartItemRepository;
import com.lumera.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;

    @Transactional
    public Order placeOrder(User user, OrderRequest req) {
        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        if (cartItems.isEmpty()) {
            throw new IllegalStateException("Your cart is empty");
        }

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(req.getShippingAddress());
        order.setShippingPhone(req.getShippingPhone());
        order.setPaymentMethod(req.getPaymentMethod());
        order.setTransactionRef("LUM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        BigDecimal total = BigDecimal.ZERO;
        for (CartItem ci : cartItems) {
            Product p = ci.getProduct();
            BigDecimal unitPrice = p.getDiscountPrice() != null ? p.getDiscountPrice() : p.getPrice();
            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setProduct(p);
            oi.setProductName(p.getName());
            oi.setQuantity(ci.getQuantity());
            oi.setUnitPrice(unitPrice);
            order.getItems().add(oi);
            total = total.add(unitPrice.multiply(BigDecimal.valueOf(ci.getQuantity())));
        }
        // Keep the payable amount authoritative on the server.
        // Orders below $75 have an $8 shipping fee; orders at/above $75 ship free.
        BigDecimal shippingFee = total.compareTo(new BigDecimal("75.00")) >= 0
                ? BigDecimal.ZERO
                : new BigDecimal("8.00");
        order.setTotalAmount(total.add(shippingFee));

        // COD orders start PENDING/UNPAID; PayHere orders are paid after the verified gateway callback.
        Order saved = orderRepository.save(order);
        cartItemRepository.deleteByUser(user);
        return saved;
    }

    public List<Order> getUserOrders(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public Order getById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
    }

    public Order updateStatus(Long id, OrderStatus status) {
        Order order = getById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public Order save(Order order) {
        return orderRepository.save(order);
    }

    public Order markPaid(Long orderId, String paymentMethod) {
        return markPaidFromGateway(orderId, paymentMethod, null);
    }

    public Order markPaidFromGateway(Long orderId, String paymentMethod, String paymentId) {
        Order order = getById(orderId);

        if ("PAID".equalsIgnoreCase(order.getPaymentStatus())) {
            return order;
        }

        order.setPaymentStatus("PAID");
        order.setPaymentMethod(paymentMethod);
        order.setStatus(OrderStatus.PAID);

        if (paymentId != null && !paymentId.isBlank()) {
            order.setTransactionRef("PH-" + paymentId);
        }

        return orderRepository.save(order);
    }

    public Order markPaymentPending(Long orderId) {
        Order order = getById(orderId);
        order.setPaymentStatus("PENDING");
        return orderRepository.save(order);
    }

    public Order markPaymentFailed(Long orderId) {
        Order order = getById(orderId);
        if (!"PAID".equalsIgnoreCase(order.getPaymentStatus())) {
            order.setPaymentStatus("FAILED");
            order.setStatus(OrderStatus.PENDING);
        }
        return orderRepository.save(order);
    }
}
