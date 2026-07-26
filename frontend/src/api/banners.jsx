import {api} from './client.jsx'

export async function fetchBanners(slug) {
    const {data} = await api.get(`/stores/${slug}/banners`)
    return data
}