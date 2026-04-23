package com.pruebatecnica.orders.repository;

import com.pruebatecnica.orders.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Long> {

    List<OrderEntity> findAllByUserIdOrderByCreatedAtDesc(Long userId);

    List<OrderEntity> findAllByOrderByCreatedAtDesc();
}
