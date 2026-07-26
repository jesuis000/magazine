package com.tijary.magazine.controller;

import com.tijary.magazine.entity.Product;
import com.tijary.magazine.security.AdminAccessGuard;
import com.tijary.magazine.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stores/{slug}/products")
public class ProductController {

    private final ProductService productService;

    ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getProducts(
            @PathVariable String slug,
            @RequestParam(required = false) Long categoryId
    ) {
        return ResponseEntity.ok().body(productService.getProducts(slug, categoryId));
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@PathVariable String slug, @RequestBody Product input) {
        return ResponseEntity.ok(productService.createProduct(slug, input));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable String slug, @PathVariable Long id, @RequestBody Product updates) {
        return ResponseEntity.ok(productService.updateProduct(slug, id, updates));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String slug, @PathVariable Long id) {
        productService.deleteProduct(slug, id);
        return ResponseEntity.noContent().build();
    }
}
