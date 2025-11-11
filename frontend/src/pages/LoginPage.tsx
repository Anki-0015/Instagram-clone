import { ChangeEvent, FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(username, password)
      nav('/')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div style={{ width: '100%', maxWidth: 350 }}>
        {/* Main Card */}
        <div className="ig-card ig-p-md ig-mb-sm" style={{ padding: '40px' }}>
          {/* Logo */}
          <h1
            style={{
              fontSize: '48px',
              fontFamily: 'cursive',
              textAlign: 'center',
              marginBottom: '24px'
            }}
          >
            Instagram
          </h1>

          {/* Login Form */}
          <form onSubmit={onSubmit} style={{ display: 'grid', gap: '6px' }}>
            <input
              className="ig-input"
              placeholder="Phone number, username, or email"
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              required
              autoFocus
            />
            <div style={{ position: 'relative' }}>
              <input
                className="ig-input"
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                style={{ paddingRight: '60px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="ig-btn-text"
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '14px',
                  fontWeight: 600,
                  padding: '0 8px'
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {error && (
              <div
                style={{
                  color: 'var(--ig-error)',
                  fontSize: '12px',
                  textAlign: 'center',
                  padding: '8px',
                  marginTop: '8px'
                }}
              >
                {error}
              </div>
            )}

            <button
              className="ig-btn-primary"
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                marginTop: '8px',
                padding: '8px'
              }}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          {/* OR Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              margin: '24px 0',
              color: 'var(--ig-text-secondary)'
            }}
          >
            <div style={{ flex: 1, height: '1px', background: 'var(--ig-border)' }} />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--ig-border)' }} />
          </div>

          {/* Facebook Login */}
          <button
            className="ig-btn-text"
            style={{
              width: '100%',
              color: 'var(--ig-link)',
              fontWeight: 600,
              marginBottom: '24px'
            }}
          >
            <span style={{ fontSize: '18px', marginRight: '8px' }}>📘</span>
            Log in with Facebook
          </button>

          {/* Forgot Password */}
          <a
            href="/forgot-password"
            style={{
              display: 'block',
              textAlign: 'center',
              fontSize: '12px',
              color: 'var(--ig-text-primary)'
            }}
          >
            Forgot password?
          </a>
        </div>

        {/* Sign Up Card */}
        <div className="ig-card ig-p-md ig-mb-sm" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '14px' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ fontWeight: 600 }}>
              Sign up
            </Link>
          </span>
        </div>

        {/* Get the App */}
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ fontSize: '14px', marginBottom: '16px' }}>Get the app.</p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <img
              src="https://www.instagram.com/static/images/appstore-install-badges/badge_ios_english-en.png/180ae7a0bcf7.png"
              alt="Get it on App Store"
              style={{ height: '40px', cursor: 'pointer' }}
            />
            <img
              src="https://www.instagram.com/static/images/appstore-install-badges/badge_android_english-en.png/e9cd846dc748.png"
              alt="Get it on Google Play"
              style={{ height: '40px', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
