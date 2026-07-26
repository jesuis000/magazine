package com.tijary.magazine.repository;

import com.tijary.magazine.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    List<Customer> findByStoreIdOrderByCreatedAtDesc(Long storeId);
    Optional<Customer> findByStoreIdAndPhone(Long storeId, String phone);
    Optional<Customer> findByPhone(String phone);
}
