import {api} from './client'

export const fetchCustomers = (slug) => api.get(`/stores/${slug}/customers`).then(r => r.data)
export const fetchCustomerDetail = (slug, id) => api.get(`/stores/${slug}/customers/${id}`).then(r => r.data)