package com.tijary.magazine.controller;

import com.tijary.magazine.entity.Store;
import com.tijary.magazine.repository.StoreRepository;
import com.tijary.magazine.security.AdminAccessGuard;
import com.tijary.magazine.service.StoreService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/stores")
public class StoreController {
    private final StoreService storeService;
    private final AdminAccessGuard adminAccessGuard;

    StoreController(StoreService storeService, AdminAccessGuard adminAccessGuard) {
        this.storeService = storeService;
        this.adminAccessGuard = adminAccessGuard;
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Store> getBySlug(@PathVariable String slug) {
        return storeService
                .getBySlug(slug)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{slug}")
    public ResponseEntity<Store> updateStore(@PathVariable String slug, @RequestBody Store storeUpdates) {
        return ResponseEntity.ok().body(storeService.updateStore(slug, storeUpdates));
    }

    @PostMapping
    public ResponseEntity<Store> createStore(@RequestBody Store input) {
        var principal = adminAccessGuard.currentUser();
        if (!principal.isSuperAdmin()) {
            throw new RuntimeException("Only super admins can create stores");
        }
        return ResponseEntity.ok().body(storeService.createStore(input));
    }
}
