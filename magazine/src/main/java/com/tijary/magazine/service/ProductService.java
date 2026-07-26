package com.tijary.magazine.service;

import com.tijary.magazine.entity.Product;
import com.tijary.magazine.entity.Store;
import com.tijary.magazine.repository.ProductRepository;
import com.tijary.magazine.repository.StoreRepository;
import com.tijary.magazine.security.AdminAccessGuard;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final StoreService storeService;
    private final AdminAccessGuard adminAccessGuard;

    ProductService(ProductRepository productRepository,
                   StoreRepository storeRepository,
                   StoreService storeService,
                   AdminAccessGuard adminAccessGuard
    ) {
        this.productRepository = productRepository;
        this.storeRepository = storeRepository;
        this.storeService = storeService;
        this.adminAccessGuard = adminAccessGuard;
    }

    public List<Product> getProducts(String slug, Long categoryId) {
        Store store = storeRepository.findBySlug(slug).get();

        return (categoryId != null)
                ? productRepository.findByStoreIdAndCategoryIdOrderBySortOrderAsc(store.getId(), categoryId)
                : productRepository.findByStoreIdOrderBySortOrderAsc(store.getId());
    }

    public void deleteCategoryProducts(Long categoryId) {
        productRepository.deleteByCategoryId(categoryId);
    }

    @Transactional
    public Product createProduct(String slug, Product input) {
        Store store = storeService.getStore(slug);

        adminAccessGuard.requireStoreAccess(store);

        input.setId(null);
        input.setStoreId(store.getId());
        return productRepository.save(input);
    }

    public Product updateProduct(String slug, Long id, Product updates) {
        adminAccessGuard.requireStoreAccess(storeService.getStore(slug));

        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("product not found with id" + id));


        p.setName(updates.getName());
        p.setImage(updates.getImage());
        p.setUnitLabel(updates.getUnitLabel());
        p.setPrice(updates.getPrice());
        p.setDiscountPrice(updates.getDiscountPrice());
        p.setInStock(updates.getInStock());
        p.setCategoryId(updates.getCategoryId());
        p.setSortOrder(updates.getSortOrder());
        return productRepository.save(p);
    }

    public void deleteProduct(String slug, Long id) {
        adminAccessGuard.requireStoreAccess(storeService.getStore(slug));

        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
        }
    }
}
