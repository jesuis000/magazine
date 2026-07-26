import axios from "axios";



export const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    withXSRFToken: true,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config
        const isCsrfFailure = error.response?.status === 403 && !original._retried

        if (isCsrfFailure) {
            original._retried = true
            // Any GET through the CSRF filter regenerates the cookie
            await api.get('/auth/me').catch(() => {})
            return api(original)
        }

        return Promise.reject(error)
    }
)