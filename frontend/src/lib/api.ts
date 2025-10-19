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

  put(url: string, data?: any, config: any = {}) {
    return this.client.put(url, data, { ...config, headers: this.withAuth(config.headers) })
  }

  delete(url: string, config: any = {}) {
    return this.client.delete(url, { ...config, headers: this.withAuth(config.headers) })
  }
}

export const api = new ApiClient()
