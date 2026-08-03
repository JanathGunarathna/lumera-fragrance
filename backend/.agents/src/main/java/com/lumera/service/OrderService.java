package com.lumera.service;

import com.lumera.dto.OrderRequest;
import com.lumera.entity.*;
import com.lumera.repository.CartItemRepository;
import com.lumera.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;

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
        order.setTotalAmount(total);

        // COD orders start PENDING/UNPAID; card/UPI orders are marked paid once /api/payments/pay succeeds
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

    public Order markPaid(Long orderId, String paymentMethod) {
        Order order = getById(orderId);
        order.setPaymentStatus("PAID");
        order.setPaymentMethod(paymentMethod);
        order.setStatus(OrderStatus.PAID);
        return orderRepository.save(order);
    }
}
