package com.tijary.magazine.repository;

import com.tijary.magazine.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStoreIdOrderByCreatedAtDesc(Long storeId);
    List<Order> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<Order> findAllByOrderByCreatedAtDesc(); // for SUPER_ADMIN cross-store view
}
