import {api} from './client.jsx'

export async function fetchStore(slug) {
    const {data} = await api.get(`stores/${slug}`)
    return data
}

export async function fetchStores() {
    const {data} = await api.get('stores')
    return data
}