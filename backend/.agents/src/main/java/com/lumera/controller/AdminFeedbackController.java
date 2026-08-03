package com.lumera.controller;

import com.lumera.entity.Feedback;
import com.lumera.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/feedback")
@RequiredArgsConstructor
public class AdminFeedbackController {

    private final FeedbackService feedbackService;

    @GetMapping
    public List<Feedback> getAll() {
        return feedbackService.getAllForAdmin();
    }

    @PatchMapping("/{id}/approve")
    public Feedback approve(@PathVariable Long id, @RequestParam boolean approved) {
        return feedbackService.setApproved(id, approved);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        feedbackService.delete(id);
    }
}
