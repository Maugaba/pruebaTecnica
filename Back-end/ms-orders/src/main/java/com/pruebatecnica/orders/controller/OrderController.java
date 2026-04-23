package com.pruebatecnica.orders.controller;

import com.pruebatecnica.orders.dto.CreateOrderRequest;
import com.pruebatecnica.orders.dto.OrderResponse;
import com.pruebatecnica.orders.exception.UnauthorizedException;
import com.pruebatecnica.orders.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> create(Authentication auth,
                                                @Valid @RequestBody CreateOrderRequest req) {
        return ResponseEntity.ok(orderService.create(currentUserId(auth), req));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> list(Authentication auth) {
        return ResponseEntity.ok(orderService.listByUser(currentUserId(auth)));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponse>> listAll() {
        return ResponseEntity.ok(orderService.listAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOne(Authentication auth, @PathVariable Long id) {
        return ResponseEntity.ok(orderService.getById(id, currentUserId(auth), isAdmin(auth)));
    }

    private Long currentUserId(Authentication auth) {
        if (auth == null || auth.getPrincipal() == null) {
            throw new UnauthorizedException("No autenticado");
        }
        try {
            return Long.parseLong(auth.getPrincipal().toString());
        } catch (NumberFormatException ex) {
            throw new UnauthorizedException("Token invalido");
        }
    }

    private boolean isAdmin(Authentication auth) {
        if (auth == null || auth.getAuthorities() == null) return false;
        for (GrantedAuthority a : auth.getAuthorities()) {
            if ("ROLE_ADMIN".equals(a.getAuthority())) return true;
        }
        return false;
    }
}
