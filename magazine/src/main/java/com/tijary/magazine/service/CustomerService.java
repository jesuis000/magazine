package com.tijary.magazine.service;

import com.tijary.magazine.entity.Customer;
import com.tijary.magazine.entity.Order;
import com.tijary.magazine.entity.Store;
import com.tijary.magazine.repository.CustomerRepository;
import com.tijary.magazine.repository.OrderRepository;
import com.tijary.magazine.repository.StoreRepository;
import com.tijary.magazine.security.AdminAccessGuard;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final AdminAccessGuard accessGuard;
    private final StoreService storeService;

    public CustomerService(CustomerRepository customerRepository,
                           OrderRepository orderRepository,
                           StoreRepository storeRepository,
                           AdminAccessGuard accessGuard,
                           StoreService storeService
    ) {
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
        this.accessGuard = accessGuard;
        this.storeService = storeService;
    }

    public List<Customer> getCustomers(String slug) {
        Store store = storeService.getStore(slug);

        accessGuard.requireStoreAccess(store);

        return customerRepository.findByStoreIdOrderByCreatedAtDesc(store.getId());

    }


    public Map<String, Object> customerDetails(String slug, Long id) {
        Store store = storeService.getStore(slug);

        accessGuard.requireStoreAccess(store);

        Customer customer = customerRepository.findById(id).orElseThrow();

        List<Order> orders = orderRepository.findByCustomerIdOrderByCreatedAtDesc(id);

        Map<String, Object> customerDetailsMap = new HashMap<>();

        customerDetailsMap.put("customer", customer);
        customerDetailsMap.put("orders", orders);
        return customerDetailsMap;
    }
}
