package com.tijary.magazine.controller;

import com.tijary.magazine.entity.Banner;
import com.tijary.magazine.service.BannerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stores/{slug}/banners")
public class BannerController {
    private final BannerService bannerService;

    BannerController(BannerService bannerService) {
        this.bannerService = bannerService;
    }

    @GetMapping
    public ResponseEntity<List<Banner>> getBanners(@PathVariable String slug) {
        return ResponseEntity.ok().body(bannerService.getBanners(slug));
    }

    @PostMapping
    public ResponseEntity<Banner> createBanner(@PathVariable String slug, @RequestBody Banner input) {
        return ResponseEntity.ok().body(bannerService.createBanner(slug, input));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Banner> updateBanner(@PathVariable String slug, @PathVariable Long id, @RequestBody Banner updates) {
        return ResponseEntity.ok().body(bannerService.updateBanner(slug, id, updates));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBanner(@PathVariable String slug, @PathVariable Long id) {
        bannerService.deleteBanner(slug, id);
        return ResponseEntity.noContent().build();
    }
}
