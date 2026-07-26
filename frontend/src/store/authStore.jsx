import { create } from 'zustand'
import { login as apiLogin, logout as apiLogout, fetchMe } from '../api/auth'

export const useAuthStore = create((set) => ({
    user: null,
    status: 'idle', // 'idle' | 'loading' | 'authenticated' | 'unauthenticated'

    checkSession: async () => {
        set({ status: 'loading' })
        try {
            const user = await fetchMe()
            set({ user, status: 'authenticated' })
        } catch {
            set({ user: null, status: 'unauthenticated' })
        }
    },


    login: async (email, password) => {
        await apiLogin(email, password)
        const user = await fetchMe()          // extra GET right after login — guarantees the CSRF cookie exists
        set({ user, status: 'authenticated' })
        return user
    },

    logout: async () => {
        await apiLogout()
        set({ user: null, status: 'unauthenticated' })
    },
}))