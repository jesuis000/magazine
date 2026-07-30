package com.tijary.magazine.service;

import com.tijary.magazine.dto.OrderRequest;
import com.tijary.magazine.entity.*;
import com.tijary.magazine.repository.*;
import com.tijary.magazine.security.AdminAccessGuard;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CustomerRepository customerRepository;
    private final AdminAccessGuard accessGuard;
    private final StoreService storeService;
    private final ProductRepository productRepository;


    public OrderService(OrderRepository orderRepository, OrderItemRepository orderItemRepository,
                        CustomerRepository customerRepository, StoreRepository storeRepository,
                        AdminAccessGuard accessGuard,
                        StoreService storeService,
                        ProductRepository productRepository
    ) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.customerRepository = customerRepository;
        this.accessGuard = accessGuard;
        this.storeService = storeService;
        this.productRepository = productRepository;
    }

    public List<Order> list(String slug) {
        Store store = storeService.getStore(slug);
        accessGuard.requireStoreAccess(store);
        return orderRepository.findByStoreIdOrderByCreatedAtDesc(store.getId());
    }

    public Map<String, Object> orderDetails(String slug, Long id) {
        Store store = storeService.getStore(slug);

        accessGuard.requireStoreAccess(store);

        Order order = orderRepository.findById(id).orElseThrow();
        List<OrderItem> items = orderItemRepository.findByOrderId(id);
        Customer customer = customerRepository.findById(order.getCustomerId()).orElse(null);

        Map<String, Object> orderDetailsMap = new HashMap<>();
        orderDetailsMap.put("order", order);
        orderDetailsMap.put("items", items);
        orderDetailsMap.put("customer", customer);
        return orderDetailsMap;
    }

    public record StatusUpdateRequest(String status) {
    }


    public Order updateStatus(String slug, Long id, StatusUpdateRequest req) {
        Store store = storeService.getStore(slug);
        accessGuard.requireStoreAccess(store);
        Order order = orderRepository.findById(id).orElseThrow();
        order.setStatus(OrderStatus.valueOf(req.status()));
        return orderRepository.save(order);
    }

    @Transactional
    public Order createOrder(String slug, OrderRequest req) {
        Store store = storeService.getStore(slug);

        if (req.phone == null || req.phone.isBlank()) {
            throw new RuntimeException("Phone is required");
        }
        if (req.items == null || req.items.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Upsert customer by (storeId, phone) — no separate save step needed
        Customer customer = customerRepository.findByStoreIdAndPhone(store.getId(), req.phone)
                .orElseGet(Customer::new);
        customer.setStoreId(store.getId());
        customer.setPhone(req.phone);
        customer.setName(req.name);
        customer.setArea(req.area);
        customer.setAddress(req.address);
        customer.setEmail(req.email);
        customer.setUpdatedAt(java.time.LocalDateTime.now());
        customer = customerRepository.save(customer);

        // Build line items from server-side product data — never trust client-submitted prices
        java.util.List<OrderItem> lineItems = new java.util.ArrayList<>();
        java.math.BigDecimal subtotal = java.math.BigDecimal.ZERO;
        java.math.BigDecimal totalSavings = java.math.BigDecimal.ZERO;
        int totalQty = 0;

        for (OrderRequest.Item reqItem : req.items) {
            Product product = productRepository.findById(reqItem.productId)
                    .orElseThrow(() -> new RuntimeException("Product not found: " + reqItem.productId));

            if (!product.getStoreId().equals(store.getId())) {
                throw new RuntimeException("Product does not belong to this store");
            }

            java.math.BigDecimal unitPrice = product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice();
            java.math.BigDecimal discount = product.getDiscountPrice() != null
                    ? product.getPrice().subtract(product.getDiscountPrice())
                    : java.math.BigDecimal.ZERO;
            java.math.BigDecimal lineTotal = unitPrice.multiply(java.math.BigDecimal.valueOf(reqItem.quantity));

            OrderItem item = new OrderItem();
            item.setProductId(product.getId());
            item.setProductName(product.getName());
            item.setUnitPrice(unitPrice);
            item.setDiscount(discount);
            item.setQty(reqItem.quantity);
            item.setLineTotal(lineTotal);
            lineItems.add(item);

            subtotal = subtotal.add(lineTotal);
            totalSavings = totalSavings.add(discount.multiply(java.math.BigDecimal.valueOf(reqItem.quantity)));
            totalQty += reqItem.quantity;
        }

        java.math.BigDecimal deliveryFee = "DELIVERY".equalsIgnoreCase(req.fulfillmentType)
                ? new java.math.BigDecimal("10.00")
                : java.math.BigDecimal.ZERO;

        Order order = new Order();
        order.setStoreId(store.getId());
        order.setCustomerId(customer.getId());
        order.setNotes(req.notesText);
        order.setDeliveryType(req.fulfillmentType);
        order.setDeliveryTime(req.deliverySlot);
        order.setPaymentMethod(req.paymentMethod);
        order.setItemCount(lineItems.size());
        order.setTotalQty(totalQty);
        order.setSavings(totalSavings);
        order.setDeliveryFee(deliveryFee);
        order.setNetTotal(subtotal.add(deliveryFee));
        order.setStatus(OrderStatus.PENDING);
        order = orderRepository.save(order);

        for (OrderItem item : lineItems) {
            item.setOrderId(order.getId());
            orderItemRepository.save(item);
        }

        return order;
    }
}