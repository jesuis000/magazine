package com.tijary.magazine.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;


@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String token = extractCookie(request, "access_token");

        if (token != null) {
            try {
                Claims claims = jwtService.parseToken(token);

                Long userId = Long.parseLong(claims.getSubject());
                String email = claims.get("email", String.class);
                String role = claims.get("role", String.class);
                Long storeId = claims.get("storeId") != null
                        ? Long.valueOf(claims.get("storeId").toString())
                        : null;

                AppUserPrincipal principal = new AppUserPrincipal(userId, email, role, storeId);

                var auth = new UsernamePasswordAuthenticationToken(
                        principal, null, List.of(new SimpleGrantedAuthority("ROLE_" + role)));

                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (Exception e) {
                // invalid/expired token — leave unauthenticated, downstream access rules handle it
                SecurityContextHolder.clearContext();
            }
        }

        chain.doFilter(request, response);
    }

    private String extractCookie(HttpServletRequest request, String name) {
        if (request.getCookies() == null) return null;
        for (Cookie c : request.getCookies()) {
            if (c.getName().equals(name)) return c.getValue();
        }
        return null;
    }
}
