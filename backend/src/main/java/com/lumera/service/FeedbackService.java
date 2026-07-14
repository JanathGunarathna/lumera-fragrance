package com.lumera.service;

import com.lumera.dto.FeedbackRequest;
import com.lumera.entity.Feedback;
import com.lumera.entity.Product;
import com.lumera.entity.User;
import com.lumera.repository.FeedbackRepository;
import com.lumera.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final ProductRepository productRepository;

    public Feedback submit(User user, FeedbackRequest req) {
        Feedback fb = new Feedback();
        fb.setUser(user);
        fb.setRating(req.getRating());
        fb.setComment(req.getComment());
        if (req.getProductId() != null) {
            Product p = productRepository.findById(req.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));
            fb.setProduct(p);
        }
        return feedbackRepository.save(fb);
    }

    public List<Feedback> getSiteFeedback() {
        return feedbackRepository.findByProductIsNullAndApprovedTrueOrderByCreatedAtDesc();
    }

    public List<Feedback> getProductFeedback(Product product) {
        return feedbackRepository.findByProductAndApprovedTrueOrderByCreatedAtDesc(product);
    }

    public List<Feedback> getAllForAdmin() {
        return feedbackRepository.findAllByOrderByCreatedAtDesc();
    }

    public Feedback setApproved(Long id, boolean approved) {
        Feedback fb = feedbackRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Feedback not found"));
        fb.setApproved(approved);
        return feedbackRepository.save(fb);
    }

    public void delete(Long id) {
        feedbackRepository.deleteById(id);
    }
}
