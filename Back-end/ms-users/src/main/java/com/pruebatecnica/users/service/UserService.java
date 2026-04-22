package com.pruebatecnica.users.service;

import com.pruebatecnica.users.dto.AdminCreateUserRequest;
import com.pruebatecnica.users.dto.AdminUpdateUserRequest;
import com.pruebatecnica.users.dto.UpdateProfileRequest;
import com.pruebatecnica.users.dto.UserResponse;
import com.pruebatecnica.users.entity.UserEntity;
import com.pruebatecnica.users.exception.BadRequestException;
import com.pruebatecnica.users.exception.NotFoundException;
import com.pruebatecnica.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse getById(Long id) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
        return UserResponse.from(user);
    }

    @Transactional
    public UserResponse update(Long id, UpdateProfileRequest req) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));

        user.setNombres(req.getNombres().trim());
        user.setApellidos(req.getApellidos().trim());
        user.setDireccionEnvio(req.getDireccionEnvio().trim());
        user.setFechaNacimiento(req.getFechaNacimiento());
        user.setUpdatedAt(LocalDateTime.now());

        return UserResponse.from(userRepository.save(user));
    }

    public List<UserResponse> listAll() {
        return userRepository.findAll().stream()
                .sorted((a, b) -> Long.compare(a.getId(), b.getId()))
                .map(UserResponse::from)
                .toList();
    }

    @Transactional
    public UserResponse adminCreate(AdminCreateUserRequest req) {
        String email = req.getEmail().toLowerCase().trim();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("El email ya esta registrado");
        }

        UserEntity user = UserEntity.builder()
                .nombres(req.getNombres().trim())
                .apellidos(req.getApellidos().trim())
                .direccionEnvio(req.getDireccionEnvio().trim())
                .email(email)
                .fechaNacimiento(req.getFechaNacimiento())
                .password(passwordEncoder.encode(req.getPassword()))
                .rol(req.getRol())
                .createdAt(LocalDateTime.now())
                .build();

        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public UserResponse adminUpdate(Long id, AdminUpdateUserRequest req) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));

        user.setNombres(req.getNombres().trim());
        user.setApellidos(req.getApellidos().trim());
        user.setDireccionEnvio(req.getDireccionEnvio().trim());
        user.setFechaNacimiento(req.getFechaNacimiento());
        user.setRol(req.getRol());
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            if (req.getPassword().length() < 6) {
                throw new BadRequestException("La contrasena debe tener al menos 6 caracteres");
            }
            user.setPassword(passwordEncoder.encode(req.getPassword()));
        }
        user.setUpdatedAt(LocalDateTime.now());

        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public void adminDelete(Long id, Long currentUserId) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
        if (user.getId().equals(currentUserId)) {
            throw new BadRequestException("No puedes eliminar tu propia cuenta");
        }
        userRepository.delete(user);
    }
}
