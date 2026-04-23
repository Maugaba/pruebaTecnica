package com.pruebatecnica.orders.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {

    @NotEmpty(message = "El carrito no puede estar vacio")
    @Valid
    private List<OrderItemRequest> items;
}
