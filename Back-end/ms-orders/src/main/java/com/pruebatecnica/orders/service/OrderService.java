package com.pruebatecnica.orders.service;

import com.pruebatecnica.orders.client.ProductClient;
import com.pruebatecnica.orders.client.ProductDto;
import com.pruebatecnica.orders.dto.CreateOrderRequest;
import com.pruebatecnica.orders.dto.OrderItemRequest;
import com.pruebatecnica.orders.dto.OrderResponse;
import com.pruebatecnica.orders.entity.OrderEntity;
import com.pruebatecnica.orders.entity.OrderItemEntity;
import com.pruebatecnica.orders.exception.BadRequestException;
import com.pruebatecnica.orders.exception.NotFoundException;
import com.pruebatecnica.orders.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductClient productClient;

    @Transactional
    public OrderResponse create(Long userId, CreateOrderRequest req) {
        OrderEntity order = OrderEntity.builder()
                .userId(userId)
                .estado(OrderEntity.Status.CREATED)
                .createdAt(LocalDateTime.now())
                .total(BigDecimal.ZERO)
                .build();

        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequest ir : req.getItems()) {
            ProductDto product = productClient.findById(ir.getProductId());
            if (product == null) {
                throw new NotFoundException("Producto " + ir.getProductId() + " no existe");
            }
            if (Boolean.FALSE.equals(product.getActivo())) {
                throw new BadRequestException("El producto '" + product.getNombre() + "' no esta disponible");
            }

            BigDecimal subtotal = product.getPrecio().multiply(BigDecimal.valueOf(ir.getQuantity()));

            OrderItemEntity item = OrderItemEntity.builder()
                    .productId(product.getId())
                    .productName(product.getNombre())
                    .productImage(product.getImagenUrl())
                    .price(product.getPrecio())
                    .quantity(ir.getQuantity())
                    .subtotal(subtotal)
                    .build();

            order.addItem(item);
            total = total.add(subtotal);
        }

        order.setTotal(total);
        OrderEntity saved = orderRepository.save(order);
        return OrderResponse.from(saved);
    }

    public List<OrderResponse> listByUser(Long userId) {
        return orderRepository.findAllByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(OrderResponse::from)
                .toList();
    }

    public List<OrderResponse> listAll() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(OrderResponse::from)
                .toList();
    }

    public OrderResponse getById(Long orderId, Long userId, boolean isAdmin) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Pedido no encontrado"));
        if (!isAdmin && !order.getUserId().equals(userId)) {
            throw new NotFoundException("Pedido no encontrado");
        }
        return OrderResponse.from(order);
    }
}
