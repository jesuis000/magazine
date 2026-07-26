package com.tijary.magazine.controller;

import com.tijary.magazine.entity.Store;
import com.tijary.magazine.entity.User;
import com.tijary.magazine.repository.StoreRepository;
import com.tijary.magazine.repository.UserRepository;
import com.tijary.magazine.security.AppUserPrincipal;
import com.tijary.magazine.security.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final StoreRepository storeRepository;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService,
                          StoreRepository storeRepository
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.storeRepository = storeRepository;
    }

    public record LoginRequest(String email, String password) {
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpServletResponse response) {
        User user = userRepository.findByEmail(req.email()).orElse(null);

        if (user == null || !passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
        }

        String token = jwtService.generateToken(user);

        Cookie cookie = new Cookie("access_token", token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge((int) jwtService.getExpirationSeconds());
        response.addCookie(cookie);

        Map<String, Object> body = new HashMap<>();
        body.put("email", user.getEmail());
        body.put("role", user.getRole().name());
        body.put("storeId", user.getStoreId());
        body.put("storeSlug", user.getStoreId() != null
                ? storeRepository.findById(user.getStoreId()).map(Store::getSlug).orElse(null)
                : null);
        return ResponseEntity.ok(body);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("access_token", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof AppUserPrincipal user)) {
            return ResponseEntity.status(401).build();
        }
        Map<String, Object> body = new HashMap<>();
        body.put("email", user.getEmail());
        body.put("role", user.getRole());
        body.put("storeId", user.getStoreId());
        body.put("storeSlug", user.getStoreId() != null
                ? storeRepository.findById(user.getStoreId()).map(Store::getSlug).orElse(null)
                : null);
        return ResponseEntity.ok(body);
    }
}
