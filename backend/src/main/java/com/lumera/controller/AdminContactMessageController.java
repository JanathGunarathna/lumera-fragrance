package com.lumera.controller;

import com.lumera.entity.ContactMessage;
import com.lumera.service.ContactMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/contact-messages")
@RequiredArgsConstructor
public class AdminContactMessageController {
    private final ContactMessageService contactMessageService;

    @GetMapping
    public List<ContactMessage> getAll() {
        return contactMessageService.getAll();
    }
}
