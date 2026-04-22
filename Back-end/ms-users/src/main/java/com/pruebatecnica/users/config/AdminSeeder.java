package com.pruebatecnica.users.config;

import com.pruebatecnica.users.entity.Rol;
import com.pruebatecnica.users.entity.UserEntity;
import com.pruebatecnica.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private static final String ADMIN_EMAIL = "admin@admin.com";
    private static final String ADMIN_PASSWORD = "admin";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        userRepository.findAll().stream()
                .filter(u -> u.getRol() == null)
                .forEach(u -> {
                    u.setRol(Rol.CLIENTE);
                    userRepository.save(u);
                });

        if (userRepository.findByEmail(ADMIN_EMAIL).isPresent()) {
            log.info("Usuario administrador ya existe: {}", ADMIN_EMAIL);
            return;
        }

        UserEntity admin = UserEntity.builder()
                .nombres("Admin")
                .apellidos("Administrador")
                .direccionEnvio("Oficina central")
                .email(ADMIN_EMAIL)
                .fechaNacimiento(LocalDate.of(1990, 1, 1))
                .password(passwordEncoder.encode(ADMIN_PASSWORD))
                .rol(Rol.ADMIN)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(admin);
        log.info("Usuario administrador creado: {} / {}", ADMIN_EMAIL, ADMIN_PASSWORD);
    }
}
