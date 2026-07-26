package com.tijary.magazine.controller;

import com.tijary.magazine.dto.OrderRequest;
import com.tijary.magazine.entity.Order;
import com.tijary.magazine.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stores/{slug}/orders")
public class OrderController {


    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<Order>> list(@PathVariable String slug) {
        return ResponseEntity.ok(orderService.list(slug));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> detail(@PathVariable String slug, @PathVariable Long id) {
        return ResponseEntity.ok(orderService.orderDetails(slug, id));
    }


    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String slug,
                                          @PathVariable Long id,
                                          @RequestBody OrderService.StatusUpdateRequest req) {
        return ResponseEntity.ok(orderService.updateStatus(slug, id, req));
    }

    @PostMapping
    public ResponseEntity<Order> create(@PathVariable String slug, @RequestBody OrderRequest req) {
        return ResponseEntity.ok(orderService.createOrder(slug, req));
    }
}
