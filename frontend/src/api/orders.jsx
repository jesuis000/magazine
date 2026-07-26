import {api} from './client'

export async function submitOrder(slug, payload) {
    const { data } = await api.post(`/stores/${slug}/orders`, payload)
    return data
}

export const fetchOrders = (slug) => api.get(`/stores/${slug}/orders`).then(r => r.data)
export const fetchOrderDetail = (slug, id) => api.get(`/stores/${slug}/orders/${id}`).then(r => r.data)
export const updateOrderStatus = (slug, id, status) =>
    api.put(`/stores/${slug}/orders/${id}/status`, {status}).then(r => r.data)