package com.pruebatecnica.products.config;

import com.pruebatecnica.products.entity.ProductEntity;
import com.pruebatecnica.products.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;

    @Value("${app.seed.enabled:true}")
    private boolean seedEnabled;

    @Override
    public void run(String... args) {
        if (!seedEnabled || productRepository.count() > 0) {
            return;
        }

        log.info("Cargando catalogo de productos deportivos (seed inicial)...");

        LocalDateTime now = LocalDateTime.now();
        List<ProductEntity> productos = List.of(
                ProductEntity.builder()
                        .nombre("Balon de Futbol Profesional")
                        .descripcion("Balon oficial tamano 5, costura a mano, cuero sintetico de alta resistencia.")
                        .precio(new BigDecimal("89.99"))
                        .imagenUrl("https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=800")
                        .categoria("Futbol")
                        .activo(true)
                        .createdAt(now)
                        .build(),
                ProductEntity.builder()
                        .nombre("Zapatillas Running Pro")
                        .descripcion("Zapatillas ligeras con amortiguacion de espuma y suela antideslizante para correr.")
                        .precio(new BigDecimal("249.90"))
                        .imagenUrl("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800")
                        .categoria("Running")
                        .activo(true)
                        .createdAt(now)
                        .build(),
                ProductEntity.builder()
                        .nombre("Raqueta de Tenis Carbono")
                        .descripcion("Raqueta profesional de fibra de carbono, peso 300g, encordado incluido.")
                        .precio(new BigDecimal("329.50"))
                        .imagenUrl("https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800")
                        .categoria("Tenis")
                        .activo(true)
                        .createdAt(now)
                        .build(),
                ProductEntity.builder()
                        .nombre("Mancuernas Ajustables 20kg")
                        .descripcion("Set de mancuernas ajustables hasta 20kg cada una, ideales para entrenamiento en casa.")
                        .precio(new BigDecimal("459.00"))
                        .imagenUrl("https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=800")
                        .categoria("Gimnasio")
                        .activo(true)
                        .createdAt(now)
                        .build(),
                ProductEntity.builder()
                        .nombre("Bicicleta de Montana MTB 29")
                        .descripcion("Cuadro de aluminio, 21 velocidades Shimano, frenos de disco hidraulicos.")
                        .precio(new BigDecimal("1899.00"))
                        .imagenUrl("https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800")
                        .categoria("Ciclismo")
                        .activo(true)
                        .createdAt(now)
                        .build(),
                ProductEntity.builder()
                        .nombre("Guantes de Boxeo 12oz")
                        .descripcion("Guantes de boxeo profesionales, cuero genuino, relleno multicapa.")
                        .precio(new BigDecimal("149.90"))
                        .imagenUrl("https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800")
                        .categoria("Boxeo")
                        .activo(true)
                        .createdAt(now)
                        .build(),
                ProductEntity.builder()
                        .nombre("Mat de Yoga Premium 6mm")
                        .descripcion("Colchoneta antideslizante de TPE ecologico, 6mm de grosor, incluye correa.")
                        .precio(new BigDecimal("79.90"))
                        .imagenUrl("https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800")
                        .categoria("Yoga")
                        .activo(true)
                        .createdAt(now)
                        .build(),
                ProductEntity.builder()
                        .nombre("Mochila Deportiva 30L")
                        .descripcion("Mochila resistente al agua con compartimento para laptop y botella termica.")
                        .precio(new BigDecimal("119.00"))
                        .imagenUrl("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800")
                        .categoria("Accesorios")
                        .activo(true)
                        .createdAt(now)
                        .build()
        );

        productRepository.saveAll(productos);
        log.info("Seed completado: {} productos insertados", productos.size());
    }
}
