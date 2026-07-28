package com.tijary.magazine.config;

import com.tijary.magazine.entity.*;
import com.tijary.magazine.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataSeeder implements CommandLineRunner {
    private final StoreRepository storeRepository;
    private final BannerRepository bannerRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    @Value("${app.bootstrap-admin.email}")
    private String bootstrapAdminEmail;

    @Value("${app.bootstrap-admin.password}")
    private String bootstrapAdminPassword;

    DataSeeder(
            StoreRepository storeRepository,
            BannerRepository bannerRepository,
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.storeRepository = storeRepository;
        this.bannerRepository = bannerRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (this.storeRepository.findBySlug("myMarket").isEmpty()) {
            Store store = new Store();
            store.setSlug("myMarket");
            store.setName("Fresh Food Market");
            store.setThemeColor("#0d4d43");
            store.setCurrency("EGP");
            store.setPhone("19360");
            storeRepository.save(store);
        }
        Store store = storeRepository.findBySlug("myMarket").orElseThrow();

        if (bannerRepository.findByStoreIdOrderBySortOrderAsc(store.getId()).isEmpty()) {
            Banner b1 = new Banner();
            b1.setStoreId(store.getId());
//            b1.setImageUrl("/images/banners/myMarket-ban-one.png");
            b1.setSortOrder(0);
            bannerRepository.save(b1);

            Banner b2 = new Banner();
            b2.setStoreId(store.getId());
//            b2.setImageUrl("/images/banners/myMarket-ban-two.png");
            b2.setSortOrder(1);
            bannerRepository.save(b2);
        }

        if (categoryRepository.findByStoreIdOrderBySortOrderAsc(store.getId()).isEmpty()) {
            Category canned = new Category();
            canned.setStoreId(store.getId());
            canned.setName("معلبات");
//            canned.setBannerImage("/images/categories/canned-goods.jpg");
            canned.setSortOrder(0);
            categoryRepository.save(canned);

            Product p1 = new Product();
            p1.setStoreId(store.getId());
            p1.setCategoryId(canned.getId());
            p1.setName("هاينز مايونيز برطمان 180جم");
            p1.setUnitLabel("180 جم");
            p1.setPrice(new BigDecimal("20.00"));
//            p1.setImage("/images/products/heinz-mayo.jpg");
            p1.setSortOrder(0);
            productRepository.save(p1);

            Product p2 = new Product();
            p2.setStoreId(store.getId());
            p2.setCategoryId(canned.getId());
            p2.setName("هاينز صلصة 360 جم");
            p2.setUnitLabel("360 جم");
            p2.setPrice(new BigDecimal("15.00"));
            p2.setDiscountPrice(new BigDecimal("13.00")); // matches the "SALE" badge concept
//            p2.setImage("/images/products/heinz-sauce.jpg");
            p2.setSortOrder(1);
            productRepository.save(p2);

            Product p3 = new Product();
            p3.setStoreId(store.getId());
            p3.setCategoryId(canned.getId());
            p3.setName("حدائق كاليفورنيا تونة زيت نباتي 185جم");
            p3.setUnitLabel("185 جم");
            p3.setPrice(new BigDecimal("45.00"));
//            p3.setImage("/images/products/tuna.png");
            p3.setSortOrder(2);
            productRepository.save(p3);

            Product p4 = new Product();
            p4.setStoreId(store.getId());
            p4.setCategoryId(canned.getId());
            p4.setName("هاينز كاتشب باك 285جم");
            p4.setUnitLabel("285 جم");
            p4.setPrice(new BigDecimal("30.00"));
//            p4.setImage("/images/products/heinz-ketchup.jpg");
            p4.setSortOrder(3);
            productRepository.save(p4);

            Product p5 = new Product();
            p5.setStoreId(store.getId());
            p5.setCategoryId(canned.getId());
            p5.setName("هاينز كاتشب باك 285جم");
            p5.setUnitLabel("285 جم");
            p5.setPrice(new BigDecimal("30.00"));
//            p5.setImage("/images/products/heinz-ketchup.jpg");
            p5.setSortOrder(4);
            productRepository.save(p5);

            Product p6 = new Product();
            p6.setStoreId(store.getId());
            p6.setCategoryId(canned.getId());
            p6.setName("هاينز كاتشب باك 285جم");
            p6.setUnitLabel("285 جم");
            p6.setPrice(new BigDecimal("30.00"));
//            p6.setImage("/images/products/heinz-ketchup.jpg");
            p6.setSortOrder(5);
            productRepository.save(p6);

            Product p7 = new Product();
            p7.setStoreId(store.getId());
            p7.setCategoryId(canned.getId());
            p7.setName("هاينز كاتشب باك 285جم");
            p7.setUnitLabel("285 جم");
            p7.setPrice(new BigDecimal("30.00"));
//            p7.setImage("/images/products/heinz-ketchup.jpg");
            p7.setSortOrder(6);
            productRepository.save(p7);

            Product p8 = new Product();
            p8.setStoreId(store.getId());
            p8.setCategoryId(canned.getId());
            p8.setName("هاينز كاتشب باك 285جم");
            p8.setUnitLabel("285 جم");
            p8.setPrice(new BigDecimal("30.00"));
//            p8.setImage("/images/products/heinz-ketchup.jpg");
            p8.setSortOrder(7);
            productRepository.save(p8);
        }

        if (userRepository.findByEmail(bootstrapAdminEmail).isEmpty()) {
            User admin = new User();
            admin.setEmail(bootstrapAdminEmail);
            admin.setPasswordHash(passwordEncoder.encode(bootstrapAdminPassword));
            admin.setRole(Role.SUPER_ADMIN);
            userRepository.save(admin);
            System.out.println("⚠ Bootstrap SUPER_ADMIN created: " + bootstrapAdminEmail
                    + " — change ADMIN_PASSWORD env var before any real deployment.");
        }
    }
}
