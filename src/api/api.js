import axios from 'axios'
import router from '@/router'

const api = axios.create({
  baseURL: 'https://expertconsig.pythonanywhere.com/admin/api/v1/',
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * REQUEST INTERCEPTOR
 * Injeta o access token automaticamente
 */
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

/**
 * RESPONSE INTERCEPTOR
 */
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    const response = error.response

    if (response && response.status === 401) {
      const code = response.data?.code

      // 🔴 LOGIN CONCORRENTE
      if (code === 'concurrent_login') {
        localStorage.clear()
        router.replace({ name: 'login' })
        return Promise.reject(error)
      }

      // 🔁 TOKEN EXPIRADO → REFRESH
      if (!originalRequest._retry) {
        originalRequest._retry = true

        const refresh = localStorage.getItem('refresh')
        if (!refresh) {
          localStorage.clear()
          router.replace({ name: 'login' })
          return Promise.reject(error)
        }

        try {
          const r = await axios.post(
            'http://127.0.0.1:8000/api/v1/authentication/token/refresh/',
            { refresh }
          )

          const newAccess = r.data.access
          localStorage.setItem('access', newAccess)

          originalRequest.headers.Authorization = `Bearer ${newAccess}`
          return api(originalRequest)

        } catch (e) {
          localStorage.clear()
          router.replace({ name: 'login' })
          return Promise.reject(e)
        }
      }
    }

    return Promise.reject(error)
  }
)

export default api
