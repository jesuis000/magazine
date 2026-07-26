package com.tijary.magazine.repository;

import com.tijary.magazine.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByStoreIdAndCategoryIdOrderBySortOrderAsc(Long storeId, Long categoryId);

    List<Product> findByStoreIdOrderBySortOrderAsc(Long storeId);

    @Transactional
    @Modifying
    void deleteByCategoryId(Long categoryId);
}
