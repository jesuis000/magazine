package com.tijary.magazine.config;

import com.tijary.magazine.security.CsrfCookieFilter;
import com.tijary.magazine.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public CookieCsrfTokenRepository csrfTokenRepository() {
        CookieCsrfTokenRepository repo = CookieCsrfTokenRepository.withHttpOnlyFalse();
        repo.setCookieCustomizer(cookie -> cookie.maxAge(java.time.Duration.ofHours(8)));
        return repo;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf
                        .csrfTokenRepository(csrfTokenRepository())
                        .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler())
                        .ignoringRequestMatchers("/api/auth/login")
                )
                .addFilterAfter(new CsrfCookieFilter(), CsrfFilter.class)
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Anything that isn't an API call is the React app itself (or its static assets) —
                        // let the browser load it freely. Real access control still happens at the /api/** layer below.
                        .requestMatchers(request -> !request.getRequestURI().startsWith("/api")).permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/stores/*/orders").permitAll()   // ← replaces .requestMatchers("/api/orders").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/stores/*/categories", "/api/stores/*/products", "/api/stores/*/banners").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/stores/{slug}").permitAll()
                        .requestMatchers("/images/**", "/uploads/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/stores").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("SUPER_ADMIN")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:5173",
                "https://*.ngrok-free.app",
                "https://daily-offers-magazine.up.railway.app"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true); // required for cookies to be sent cross-request

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Scope this to the API only — static assets (index.html, /assets/**) are same-origin
        // and must never be subject to CORS origin checks, or module-script/style requests
        // (which the browser sends with an Origin header even same-origin) get wrongly 403'd.
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }
}