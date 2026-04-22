package com.pruebatecnica.users.controller;

import com.pruebatecnica.users.dto.AdminCreateUserRequest;
import com.pruebatecnica.users.dto.AdminUpdateUserRequest;
import com.pruebatecnica.users.dto.UpdateProfileRequest;
import com.pruebatecnica.users.dto.UserResponse;
import com.pruebatecnica.users.exception.UnauthorizedException;
import com.pruebatecnica.users.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(Authentication auth) {
        return ResponseEntity.ok(userService.getById(currentUserId(auth)));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateMe(Authentication auth,
                                                 @Valid @RequestBody UpdateProfileRequest req) {
        return ResponseEntity.ok(userService.update(currentUserId(auth), req));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> listAll() {
        return ResponseEntity.ok(userService.listAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> adminCreate(@Valid @RequestBody AdminCreateUserRequest req) {
        return ResponseEntity.ok(userService.adminCreate(req));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> adminGetOne(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> adminUpdate(@PathVariable Long id,
                                                    @Valid @RequestBody AdminUpdateUserRequest req) {
        return ResponseEntity.ok(userService.adminUpdate(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> adminDelete(@PathVariable Long id, Authentication auth) {
        userService.adminDelete(id, currentUserId(auth));
        return ResponseEntity.noContent().build();
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
}
