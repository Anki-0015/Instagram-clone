import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'

type AuthContextType = {
  isAuthenticated: boolean
  token: string | null
  user: { id: number; username: string; email: string; profilePicture?: string; fullName?: string } | null
  login: (username: string, password: string) => Promise<void>
  signup: (username: string, email: string, password: string, fullName?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [user, setUser] = useState<AuthContextType['user']>(null)

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      api.setToken(token)
      api.get('/api/users/me')
        .then((res: any) => setUser(res.data))
        .catch(() => setUser(null))
    } else {
      localStorage.removeItem('token')
      api.setToken(null)
      setUser(null)
    }
  }, [token])

  const value = useMemo<AuthContextType>(() => ({
    isAuthenticated: !!token,
    token,
    user,
    async login(username: string, password: string) {
      const res = await api.post('/api/auth/login', { username, password })
      setToken(res.data.token)
    },
    async signup(username: string, email: string, password: string, fullName?: string) {
      await api.post('/api/auth/signup', { username, email, password, fullName })
    },
    logout() { setToken(null) }
  }), [token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
