import {api} from './client'

// Store
export const updateStore = (slug, data) => api.put(`/stores/${slug}`, data).then(r => r.data)

// Banners
export const createBanner = (slug, data) => api.post(`/stores/${slug}/banners`, data).then(r => r.data)
export const updateBanner = (slug, id, data) => api.put(`/stores/${slug}/banners/${id}`, data).then(r => r.data)
export const deleteBanner = (slug, id) => api.delete(`/stores/${slug}/banners/${id}`)

// Categories
export const createCategory = (slug, data) => api.post(`/stores/${slug}/categories`, data).then(r => r.data)
export const updateCategory = (slug, id, data) => api.put(`/stores/${slug}/categories/${id}`, data).then(r => r.data)
export const deleteCategory = (slug, id) => api.delete(`/stores/${slug}/categories/${id}`)

// Products
export const createProduct = (slug, data) => api.post(`/stores/${slug}/products`, data).then(r => r.data)
export const updateProduct = (slug, id, data) => api.put(`/stores/${slug}/products/${id}`, data).then(r => r.data)
export const deleteProduct = (slug, id) => api.delete(`/stores/${slug}/products/${id}`)

export const createStore = (data) => api.post('/stores', data).then(r => r.data)

export const fetchAllStores = () => api.get('/admin/stores').then(r => r.data)
export const fetchUsers = () => api.get('/admin/users').then(r => r.data)
export const createStoreAdmin = (data) => api.post('/admin/users', data).then(r => r.data)
export const deleteUser = (id) => api.delete(`/admin/users/${id}`)