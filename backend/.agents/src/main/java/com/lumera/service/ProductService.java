package com.lumera.service;

import com.lumera.dto.ProductRequest;
import com.lumera.entity.Product;
import com.lumera.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAllActive() {
        return productRepository.findByActiveTrue();
    }

    public List<Product> getAllForAdmin() {
        return productRepository.findAll();
    }

    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
    }

    public List<Product> search(String q) {
        return productRepository.search(q);
    }

    public List<Product> byCategory(String category) {
        return productRepository.findByCategoryAndActiveTrue(category);
    }

    public Product create(ProductRequest req) {
        Product p = new Product();
        applyRequest(p, req);
        return productRepository.save(p);
    }

    public Product update(Long id, ProductRequest req) {
        Product p = getById(id);
        applyRequest(p, req);
        return productRepository.save(p);
    }

    public void delete(Long id) {
        Product p = getById(id);
        p.setActive(false); // soft delete keeps order history intact
        productRepository.save(p);
    }

    private void applyRequest(Product p, ProductRequest req) {
        p.setName(req.getName());
        p.setBrand(req.getBrand());
        p.setCategory(req.getCategory());
        p.setGender(req.getGender());
        p.setDescription(req.getDescription());
        p.setPrice(req.getPrice());
        p.setDiscountPrice(req.getDiscountPrice());
        p.setStock(req.getStock() != null ? req.getStock() : 0);
        p.setImageUrl(req.getImageUrl());
        p.setVolume(req.getVolume());
        if (req.getActive() != null) p.setActive(req.getActive());
    }
}
