package com.lumera.repository;

import com.lumera.entity.Feedback;
import com.lumera.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByProductAndApprovedTrueOrderByCreatedAtDesc(Product product);
    List<Feedback> findByProductIsNullAndApprovedTrueOrderByCreatedAtDesc();
    List<Feedback> findAllByOrderByCreatedAtDesc();
}
