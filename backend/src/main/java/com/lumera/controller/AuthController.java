package com.lumera.controller;

import com.lumera.dto.AuthResponse;
import com.lumera.dto.LoginRequest;
import com.lumera.dto.RegisterRequest;
import com.lumera.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(@Valid @RequestBody LoginRequest req) {
        AuthResponse resp = authService.login(req);
        if (!"ROLE_ADMIN".equals(resp.getRole())) {
            return ResponseEntity.status(403).body(new com.lumera.dto.ApiResponse(false, "Not an admin account"));
        }
        return ResponseEntity.ok(resp);
    }
}
