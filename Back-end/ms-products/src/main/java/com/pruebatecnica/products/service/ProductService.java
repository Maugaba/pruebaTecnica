package com.pruebatecnica.products.service;

import com.pruebatecnica.products.dto.ProductRequest;
import com.pruebatecnica.products.dto.ProductResponse;
import com.pruebatecnica.products.entity.ProductEntity;
import com.pruebatecnica.products.exception.NotFoundException;
import com.pruebatecnica.products.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductResponse> listActive() {
        return productRepository.findAllByActivoTrue().stream()
                .map(ProductResponse::from)
                .toList();
    }

    public List<ProductResponse> listAll() {
        return productRepository.findAll().stream()
                .map(ProductResponse::from)
                .toList();
    }

    public ProductResponse getById(Long id) {
        ProductEntity p = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Producto no encontrado"));
        return ProductResponse.from(p);
    }

    @Transactional
    public ProductResponse create(ProductRequest req) {
        ProductEntity entity = ProductEntity.builder()
                .nombre(req.getNombre().trim())
                .descripcion(req.getDescripcion().trim())
                .precio(req.getPrecio())
                .imagenUrl(req.getImagenUrl().trim())
                .categoria(req.getCategoria())
                .activo(Boolean.TRUE)
                .createdAt(LocalDateTime.now())
                .build();
        return ProductResponse.from(productRepository.save(entity));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest req) {
        ProductEntity entity = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Producto no encontrado"));
        entity.setNombre(req.getNombre().trim());
        entity.setDescripcion(req.getDescripcion().trim());
        entity.setPrecio(req.getPrecio());
        entity.setImagenUrl(req.getImagenUrl().trim());
        entity.setCategoria(req.getCategoria());
        entity.setUpdatedAt(LocalDateTime.now());
        return ProductResponse.from(productRepository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        ProductEntity entity = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Producto no encontrado"));
        entity.setActivo(Boolean.FALSE);
        entity.setUpdatedAt(LocalDateTime.now());
        productRepository.save(entity);
    }
}
