package com.tijary.magazine.service;

import com.tijary.magazine.entity.Category;
import com.tijary.magazine.entity.Store;
import com.tijary.magazine.repository.CategoryRepository;
import com.tijary.magazine.repository.ProductRepository;
import com.tijary.magazine.repository.StoreRepository;
import com.tijary.magazine.security.AdminAccessGuard;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final StoreRepository storeRepository;
    private final StoreService storeService;
    private final ProductRepository productRepository;
    private final ProductService productService;
    private final AdminAccessGuard adminAccessGuard;

    CategoryService(CategoryRepository categoryRepository,
                    StoreRepository storeRepository,
                    StoreService storeService,
                    ProductRepository productRepository,
                    ProductService productService,
                    AdminAccessGuard adminAccessGuard
                    ) {
        this.categoryRepository = categoryRepository;
        this.storeRepository = storeRepository;
        this.storeService = storeService;
        this.productRepository = productRepository;
        this.productService = productService;
        this.adminAccessGuard = adminAccessGuard;
    }


    public List<Category> getCategories(String slug) {
        Store store = storeService.getStore(slug);
        return categoryRepository.findByStoreIdOrderBySortOrderAsc(store.getId());

    }

    public Category createCategory(String slug, Category input) {
        adminAccessGuard.requireStoreAccess(storeService.getStore(slug));

        Store store = storeService.getStore(slug);
        Category category = new Category();
        category.setStoreId(store.getId());
        category.setName(input.getName());
        category.setBannerImage(input.getBannerImage());
        category.setSortOrder(input.getSortOrder());
        return categoryRepository.save(category);
    }


    public Category updateCategory(String slug, Long id, Category updates) {
        adminAccessGuard.requireStoreAccess(storeService.getStore(slug));

        Category category = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("category not found"));
        category.setSortOrder(updates.getSortOrder());
        category.setName(updates.getName());
        category.setBannerImage(updates.getBannerImage());
        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(String slug, Long id) {
        adminAccessGuard.requireStoreAccess(storeService.getStore(slug));

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("category not found for id" + id));
        productService.deleteCategoryProducts(category.getId());
        categoryRepository.deleteById(id);
    }
}
