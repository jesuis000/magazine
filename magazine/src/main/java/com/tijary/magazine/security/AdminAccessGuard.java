package com.tijary.magazine.security;

import com.tijary.magazine.entity.Store;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AdminAccessGuard {

    /**
     * Throws 403 unless the current user is SUPER_ADMIN or a STORE_ADMIN for this exact store.
     */
    public void requireStoreAccess(Store store) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!(principal instanceof AppUserPrincipal user)) {
            throw new AccessDeniedException("Not authenticated");
        }

        if (user.isSuperAdmin()) return;

        if (user.getStoreId() == null || !user.getStoreId().equals(store.getId())) {
            throw new AccessDeniedException("Not authorized for this store");
        }
    }

    public AppUserPrincipal currentUser() {
        return (AppUserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}