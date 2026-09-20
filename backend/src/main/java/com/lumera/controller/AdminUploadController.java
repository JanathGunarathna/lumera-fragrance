package com.lumera.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/uploads")
public class AdminUploadController {

    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp", "image/gif");

    private final Path uploadPath;

    public AdminUploadController(@Value("${app.upload.dir}") String uploadDir) {
        this.uploadPath = Path.of(uploadDir).toAbsolutePath().normalize();
    }

    @PostMapping(value = "/product-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, String> uploadProductImage(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Choose an image to upload");
        }
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("Only JPG, PNG, WEBP, and GIF images are allowed");
        }

        String extension = switch (file.getContentType()) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            default -> throw new IllegalArgumentException("Unsupported image type");
        };
        String filename = UUID.randomUUID() + extension;

        Files.createDirectories(uploadPath);
        Files.copy(file.getInputStream(), uploadPath.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
        return Map.of("imageUrl", "/uploads/" + filename);
    }
}
