package com.lumera.controller;

import com.lumera.dto.CheckPasswordRequest;
import com.lumera.entity.User;
import com.lumera.security.CurrentUser;
import com.lumera.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/me")
    public User me(@CurrentUser User user) {
        return user;
    }

    @PutMapping("/me")
    public User updateMe(@CurrentUser User user, @RequestBody User update) {
        user.setFullName(update.getFullName());
        user.setPhone(update.getPhone());
        user.setAddress(update.getAddress());
        return userRepository.save(user);
    }

    @PostMapping("/check-password")
    public ResponseEntity<?> checkPassword(@CurrentUser User user, @Valid @RequestBody CheckPasswordRequest request) {
        boolean matches = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (matches) {
            return ResponseEntity.ok().body(new com.lumera.dto.ApiResponse(true, "Password is correct"));
        }
        return ResponseEntity.status(401).body(new com.lumera.dto.ApiResponse(false, "Incorrect password"));
    }
}
