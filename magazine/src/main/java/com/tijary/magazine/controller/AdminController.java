package com.tijary.magazine.controller;


import com.tijary.magazine.entity.Role;
import com.tijary.magazine.entity.Store;
import com.tijary.magazine.entity.User;
import com.tijary.magazine.repository.StoreRepository;
import com.tijary.magazine.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final StoreRepository storeRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminController(StoreRepository storeRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.storeRepository = storeRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/stores")
    public List<Store> listStores() {
        return storeRepository.findAll();
    }

    public record UserSummary(Long id, String email, String role, Long storeId) {
    }

    @GetMapping("/users")
    public List<UserSummary> listUsers() {
        return userRepository.findAll().stream()
                .map(u -> new UserSummary(u.getId(), u.getEmail(), u.getRole().name(), u.getStoreId()))
                .toList();
    }

    public record CreateUserRequest(String email, String password, Long storeId) {
    }

    @PostMapping("/users")
    public ResponseEntity<?> createStoreAdmin(@RequestBody CreateUserRequest req) {
        if (userRepository.findByEmail(req.email()).isPresent()) {
            return ResponseEntity.status(409).body(Map.of("error", "This email is already in use"));
        }
        if (!storeRepository.existsById(req.storeId())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Store not found"));
        }

        User user = new User();
        user.setEmail(req.email());
        user.setPasswordHash(passwordEncoder.encode(req.password()));
        user.setRole(Role.STORE_ADMIN);
        user.setStoreId(req.storeId());
        userRepository.save(user);

        return ResponseEntity.ok(new UserSummary(user.getId(), user.getEmail(), user.getRole().name(), user.getStoreId()));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) return ResponseEntity.notFound().build();
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}