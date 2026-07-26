package com.tijary.magazine.repository;

import com.tijary.magazine.entity.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {
    List<Banner> findByStoreIdOrderBySortOrderAsc(Long storeId);
}
