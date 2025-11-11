import axios, { AxiosInstance } from 'axios'

class ApiClient {
  private client: AxiosInstance
  private token: string | null

  constructor() {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
  this.client = axios.create({ baseURL, withCredentials: true, headers: { 'Content-Type': 'application/json' } })
    this.token = null
  }

  setToken(token: string | null) {
    this.token = token
  }

  private withAuth(headers?: Record<string, string>) {
    const h: Record<string, string> = { ...(headers || {}) }
    if (this.token) h['Authorization'] = `Bearer ${this.token}`
    return h
  }

  get(url: string, config: any = {}) {
    return this.client.get(url, { ...config, headers: this.withAuth(config.headers) })
  }

  post(url: string, data?: any, config: any = {}) {
    return this.client.post(url, data, { ...config, headers: this.withAuth(config.headers) })
  }

  upload(file: File) {
    const form = new FormData()
    form.append('file', file)
    return this.client.post('/api/upload', form, {
      headers: { ...this.withAuth(), 'Content-Type': 'multipart/form-data' }
    })
  }

  // Convenience helpers
  searchUsers(query: string) {
    const params = new URLSearchParams({ query })
    return this.get(`/api/users/search?${params.toString()}`)
  }
  getAllPosts() {
    return this.get('/api/posts/all')
  }

  put(url: string, data?: any, config: any = {}) {
    return this.client.put(url, data, { ...config, headers: this.withAuth(config.headers) })
  }

  delete(url: string, config: any = {}) {
    return this.client.delete(url, { ...config, headers: this.withAuth(config.headers) })
  }
}

export const api = new ApiClient()
