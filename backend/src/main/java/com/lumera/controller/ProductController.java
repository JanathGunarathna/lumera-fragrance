package com.lumera.controller;

import com.lumera.entity.Product;
import com.lumera.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public List<Product> getAll(@RequestParam(required = false) String category,
                                 @RequestParam(required = false) String q) {
        if (q != null && !q.isBlank()) return productService.search(q);
        if (category != null && !category.isBlank()) return productService.byCategory(category);
        return productService.getAllActive();
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return productService.getById(id);
    }
}
