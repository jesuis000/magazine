import { create } from 'zustand'

export const useCartStore = create((set, get) => ({
    items: {}, // { [productId]: { product, qty } }

    setQty: (product, qty) => {
        set((state) => {
            const items = { ...state.items }
            if (qty <= 0) {
                delete items[product.id]
            } else {
                items[product.id] = { product, qty }
            }
            return { items }
        })
    },

    getQty: (productId) => get().items[productId]?.qty ?? 0,

    totalItems: () => Object.keys(get().items).length,

    clearCart: () => set({ items: {} }),
}))