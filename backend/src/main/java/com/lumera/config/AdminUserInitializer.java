package com.lumera.config;

import com.lumera.entity.Role;
import com.lumera.entity.User;
import com.lumera.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AdminUserInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminUserInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        String adminEmail = "admin@lumera.com";
        String normalizedEmail = adminEmail.toLowerCase().trim();
        User admin = userRepository.findByEmailIgnoreCase(normalizedEmail).orElse(null);

        if (admin == null) {
            admin = new User();
            admin.setFullName("Lumera Admin");
            admin.setEmail(normalizedEmail);
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRole(Role.ROLE_ADMIN);
            admin.setEnabled(true);
            userRepository.save(admin);
            System.out.println("[AdminUserInitializer] Created default admin account: " + normalizedEmail);
            return;
        }

        boolean changed = false;
        if (!admin.getEmail().equals(normalizedEmail)) {
            admin.setEmail(normalizedEmail);
            changed = true;
        }
        if (admin.getRole() != Role.ROLE_ADMIN) {
            admin.setRole(Role.ROLE_ADMIN);
            changed = true;
        }
        if (!admin.isEnabled()) {
            admin.setEnabled(true);
            changed = true;
        }
        if (!passwordEncoder.matches("Admin@123", admin.getPassword())) {
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            changed = true;
        }

        if (changed) {
            userRepository.save(admin);
            System.out.println("[AdminUserInitializer] Updated default admin account: " + normalizedEmail);
        } else {
            System.out.println("[AdminUserInitializer] Default admin account already valid: " + normalizedEmail);
        }
    }
}
