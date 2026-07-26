package com.tijary.magazine.service;

import com.tijary.magazine.entity.Banner;
import com.tijary.magazine.entity.Store;
import com.tijary.magazine.repository.BannerRepository;
import com.tijary.magazine.repository.StoreRepository;
import com.tijary.magazine.security.AdminAccessGuard;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BannerService {
    private final BannerRepository bannerRepository;
    private final StoreRepository storeRepository;
    private final StoreService storeService;
    private final AdminAccessGuard adminAccessGuard;

    BannerService(BannerRepository bannerRepository,
                  StoreRepository storeRepository,
                  StoreService storeService,
                  AdminAccessGuard adminAccessGuard
                  ) {
        this.bannerRepository = bannerRepository;
        this.storeRepository = storeRepository;
        this.storeService = storeService;
        this.adminAccessGuard = adminAccessGuard;
    }

    public List<Banner> getBanners(String slug) {
        Store store = storeRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("store not found with slug" + slug));

        return bannerRepository.findByStoreIdOrderBySortOrderAsc(store.getId());
    }

    public Banner getBannerById(Long id) {
        return bannerRepository.findById(id).orElseThrow(() -> new RuntimeException("banner not found with id" + id));
    }

    public Banner createBanner(String slug, Banner input) {
        adminAccessGuard.requireStoreAccess(storeService.getStore(slug));

        Store store = storeService.getStore(slug);
        Banner banner = new Banner();
        banner.setStoreId(store.getId());

        banner.setImageUrl(input.getImageUrl());
        banner.setLinkUrl(input.getLinkUrl());
        banner.setSortOrder(input.getSortOrder());

        return bannerRepository.save(banner);
    }


    public Banner updateBanner(String slug, Long id, Banner bannerUpdates) {
        adminAccessGuard.requireStoreAccess(storeService.getStore(slug));

        Banner banner = getBannerById(id);
        banner.setImageUrl(bannerUpdates.getImageUrl());
        banner.setLinkUrl(bannerUpdates.getLinkUrl());
        banner.setSortOrder(bannerUpdates.getSortOrder());
        return bannerRepository.save(banner);
    }

    public void deleteBanner(String slug, Long id) {
        adminAccessGuard.requireStoreAccess(storeService.getStore(slug));

        if (bannerRepository.existsById(id)) {
            bannerRepository.deleteById(id);
        }
    }
}
