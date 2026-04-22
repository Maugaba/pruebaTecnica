package com.pruebatecnica.users.service;

import com.pruebatecnica.users.dto.AuthResponse;
import com.pruebatecnica.users.dto.LoginRequest;
import com.pruebatecnica.users.dto.RegisterRequest;
import com.pruebatecnica.users.dto.UserResponse;
import com.pruebatecnica.users.entity.Rol;
import com.pruebatecnica.users.entity.UserEntity;
import com.pruebatecnica.users.exception.BadRequestException;
import com.pruebatecnica.users.exception.UnauthorizedException;
import com.pruebatecnica.users.repository.UserRepository;
import com.pruebatecnica.users.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail().toLowerCase())) {
            throw new BadRequestException("El email ya esta registrado");
        }

        UserEntity user = UserEntity.builder()
                .nombres(req.getNombres().trim())
                .apellidos(req.getApellidos().trim())
                .direccionEnvio(req.getDireccionEnvio().trim())
                .email(req.getEmail().toLowerCase().trim())
                .fechaNacimiento(req.getFechaNacimiento())
                .password(passwordEncoder.encode(req.getPassword()))
                .rol(Rol.CLIENTE)
                .createdAt(LocalDateTime.now())
                .build();

        UserEntity saved = userRepository.save(user);
        String token = jwtService.generate(saved);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresIn(jwtService.getExpirationMs())
                .user(UserResponse.from(saved))
                .build();
    }

    public AuthResponse login(LoginRequest req) {
        UserEntity user = userRepository.findByEmail(req.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new UnauthorizedException("Credenciales invalidas"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Credenciales invalidas");
        }

        String token = jwtService.generate(user);
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresIn(jwtService.getExpirationMs())
                .user(UserResponse.from(user))
                .build();
    }
}
