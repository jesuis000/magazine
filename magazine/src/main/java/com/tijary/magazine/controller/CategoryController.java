package com.tijary.magazine.controller;

import com.tijary.magazine.entity.Category;
import com.tijary.magazine.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stores/{slug}/categories")
public class CategoryController {

    private final CategoryService categoryService;

    CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<Category>> getCategories(@PathVariable String slug) {
        return ResponseEntity.ok().body(categoryService.getCategories(slug));
    }

    @PostMapping
    public ResponseEntity<Category> createCategory(@PathVariable String slug, @RequestBody Category input) {
        return ResponseEntity.ok(categoryService.createCategory(slug, input));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable String slug, @PathVariable Long id, @RequestBody Category updates) {
        return ResponseEntity.ok(categoryService.updateCategory(slug, id, updates));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable String slug, @PathVariable Long id) {
        categoryService.deleteCategory(slug, id);
        return ResponseEntity.noContent().<Void>build();
    }
}
