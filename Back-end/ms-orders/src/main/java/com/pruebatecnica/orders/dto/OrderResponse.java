package com.pruebatecnica.orders.dto;

import com.pruebatecnica.orders.entity.OrderEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private Long id;
    private Long userId;
    private BigDecimal total;
    private String estado;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;

    public static OrderResponse from(OrderEntity o) {
        return OrderResponse.builder()
                .id(o.getId())
                .userId(o.getUserId())
                .total(o.getTotal())
                .estado(o.getEstado().name())
                .createdAt(o.getCreatedAt())
                .items(o.getItems().stream().map(OrderItemResponse::from).toList())
                .build();
    }
}
