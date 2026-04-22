package com.pruebatecnica.users.dto;

import com.pruebatecnica.users.entity.Rol;
import com.pruebatecnica.users.entity.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String nombres;
    private String apellidos;
    private String direccionEnvio;
    private String email;
    private LocalDate fechaNacimiento;
    private Rol rol;

    public static UserResponse from(UserEntity entity) {
        return UserResponse.builder()
                .id(entity.getId())
                .nombres(entity.getNombres())
                .apellidos(entity.getApellidos())
                .direccionEnvio(entity.getDireccionEnvio())
                .email(entity.getEmail())
                .fechaNacimiento(entity.getFechaNacimiento())
                .rol(entity.getRol())
                .build();
    }
}
