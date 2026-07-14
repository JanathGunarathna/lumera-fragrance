package com.lumera.controller;

import com.lumera.entity.User;
import com.lumera.security.CurrentUser;
import com.lumera.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

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
}
