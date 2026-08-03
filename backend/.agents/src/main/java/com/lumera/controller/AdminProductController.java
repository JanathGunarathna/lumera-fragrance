package com.lumera.controller;

import com.lumera.dto.ProductRequest;
import com.lumera.entity.Product;
import com.lumera.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductService productService;

    @GetMapping
    public List<Product> getAll() {
        return productService.getAllForAdmin();
    }

    @PostMapping
    public Product create(@RequestBody ProductRequest req) {
        return productService.create(req);
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody ProductRequest req) {
        return productService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        productService.delete(id);
    }
}
