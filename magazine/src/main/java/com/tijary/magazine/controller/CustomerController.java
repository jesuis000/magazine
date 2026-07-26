package com.tijary.magazine.controller;

import com.tijary.magazine.entity.Customer;
import com.tijary.magazine.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stores/{slug}/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public ResponseEntity<List<Customer>> list(@PathVariable String slug) {
        return ResponseEntity.ok(customerService.getCustomers(slug));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> detail(@PathVariable String slug, @PathVariable Long id) {
        return ResponseEntity.ok(customerService.customerDetails(slug, id));
    }
}