package com.tijary.magazine.security;

import lombok.Getter;

@Getter
public class AppUserPrincipal {

    private final Long userId;
    private final String email;
    private final String role;
    private final Long storeId;

    public AppUserPrincipal(Long userId, String email, String role, Long storeId) {
        this.userId = userId;
        this.email = email;
        this.role = role;
        this.storeId = storeId;
    }

    public boolean isSuperAdmin() {
        return "SUPER_ADMIN".equals(role);
    }
}
