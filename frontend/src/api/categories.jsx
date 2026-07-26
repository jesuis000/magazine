import { api } from './client'

export async function fetchCategories(slug) {
    const { data } = await api.get(`/stores/${slug}/categories`)
    return data
}