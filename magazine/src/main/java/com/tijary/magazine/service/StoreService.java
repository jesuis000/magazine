package com.tijary.magazine.service;

import com.tijary.magazine.controller.StoreController;
import com.tijary.magazine.dto.StoreSummary;
import com.tijary.magazine.entity.Store;
import com.tijary.magazine.repository.StoreRepository;
import com.tijary.magazine.security.AdminAccessGuard;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class StoreService {

    private final StoreRepository storeRepository;
    private final AdminAccessGuard adminAccessGuard;

    StoreService(StoreRepository storeRepository, AdminAccessGuard adminAccessGuard) {
        this.storeRepository = storeRepository;
        this.adminAccessGuard = adminAccessGuard;
    }

    public Optional<Store> getBySlug(String slug) {
        return storeRepository.findBySlug(slug);
    }

    public List<StoreSummary> listPublicStores() {
        return storeRepository.findAll().stream()
                .map(s -> new StoreSummary(s.getId(), s.getSlug(), s.getName(), s.getLogoUrl(), s.getThemeColor()))
                .toList();
    }

    @Transactional
    public Store updateStore(String slug, Store updates) {
//        adminAccessGuard.requireStoreAccess(getStore(slug));

        Store store = getStore(slug);

        store.setName(updates.getName());
        store.setLogoUrl(updates.getLogoUrl());
        store.setThemeColor(updates.getThemeColor());
        store.setCurrency(updates.getCurrency());
        store.setPhone(updates.getPhone());
        return storeRepository.save(store);
    }

    public Store getStore(String slug) {
        return storeRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Store not found with slug" + slug));
    }


    public Store createStore(Store input) {
        adminAccessGuard.requireStoreAccess(input);

        if (input.getSlug() == null || input.getSlug().isBlank()) {
            throw new RuntimeException("Slug is required");
        }

        String slug = input.getSlug().trim().toLowerCase();
        if (!slug.matches("^[a-z0-9-]+$")) {
            throw new RuntimeException("Slug can only contain lowercase letters, numbers, and hyphens");
        }

        if (storeRepository.findBySlug(slug).isPresent()) {
            throw new RuntimeException("This store link is already taken");
        }

        Store store = new Store();
        store.setSlug(slug);
        store.setName(input.getName());
        store.setLogoUrl(input.getLogoUrl());
        store.setThemeColor(input.getThemeColor());
        store.setCurrency(input.getCurrency() != null ? input.getCurrency() : "EGP");
        store.setPhone(input.getPhone());

        return storeRepository.save(store);
    }
}
