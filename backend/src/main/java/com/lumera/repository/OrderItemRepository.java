package com.lumera.repository;

import com.lumera.entity.OrderItem;
import com.lumera.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    long countByProduct(Product product);
}
