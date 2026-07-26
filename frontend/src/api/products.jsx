import { api } from './client'

export async function fetchProducts(slug, categoryId) {
    const { data } = await api.get(`/stores/${slug}/products`, {
        params: categoryId ? { categoryId } : {},
    })
    return data
}