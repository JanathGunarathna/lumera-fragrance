package com.lumera.controller;

import com.lumera.dto.CartItemRequest;
import com.lumera.entity.CartItem;
import com.lumera.entity.User;
import com.lumera.security.CurrentUser;
import com.lumera.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public List<CartItem> getCart(@CurrentUser User user) {
        return cartService.getCart(user);
    }

    @PostMapping
    public CartItem addItem(@CurrentUser User user, @RequestBody CartItemRequest req) {
        return cartService.addItem(user, req.getProductId(), req.getQuantity() == null ? 1 : req.getQuantity());
    }

    @PutMapping("/{id}")
    public CartItem updateQty(@CurrentUser User user, @PathVariable Long id, @RequestBody CartItemRequest req) {
        return cartService.updateQuantity(user, id, req.getQuantity());
    }

    @DeleteMapping("/{id}")
    public void removeItem(@CurrentUser User user, @PathVariable Long id) {
        cartService.removeItem(user, id);
    }
}
