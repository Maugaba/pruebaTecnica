package com.pruebatecnica.orders.dto;

import com.pruebatecnica.orders.entity.OrderItemEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {

    private Long id;
    private Long productId;
    private String productName;
    private String productImage;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal subtotal;

    public static OrderItemResponse from(OrderItemEntity i) {
        return OrderItemResponse.builder()
                .id(i.getId())
                .productId(i.getProductId())
                .productName(i.getProductName())
                .productImage(i.getProductImage())
                .price(i.getPrice())
                .quantity(i.getQuantity())
                .subtotal(i.getSubtotal())
                .build();
    }
}
