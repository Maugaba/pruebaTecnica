package com.pruebatecnica.products.dto;

import com.pruebatecnica.products.entity.ProductEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Long id;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private String imagenUrl;
    private String categoria;
    private Boolean activo;

    public static ProductResponse from(ProductEntity e) {
        return ProductResponse.builder()
                .id(e.getId())
                .nombre(e.getNombre())
                .descripcion(e.getDescripcion())
                .precio(e.getPrecio())
                .imagenUrl(e.getImagenUrl())
                .categoria(e.getCategoria())
                .activo(e.getActivo())
                .build();
    }
}
