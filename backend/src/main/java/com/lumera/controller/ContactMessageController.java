package com.lumera.controller;

import com.lumera.dto.ContactMessageRequest;
import com.lumera.entity.ContactMessage;
import com.lumera.service.ContactMessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact-messages")
@RequiredArgsConstructor
public class ContactMessageController {
    private final ContactMessageService contactMessageService;

    @PostMapping
    public ContactMessage create(@Valid @RequestBody ContactMessageRequest request) {
        return contactMessageService.save(request);
    }
}
