import { ChangeEvent, FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function SignupPage() {
  const { signup } = useAuth()
  const nav = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      await signup(username, email, password, fullName)
      setSuccess('Account created! Redirecting to login...')
      setTimeout(() => nav('/login'), 1000)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Signup failed')
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
        <div className="ig-card ig-p-md ig-mb-sm" style={{ padding: '40px 40px 20px' }}>
          {/* Logo */}
          <h1
            style={{
              fontSize: '48px',
              fontFamily: 'cursive',
              textAlign: 'center',
              marginBottom: '12px'
            }}
          >
            Instagram
          </h1>

          {/* Subtitle */}
          <p
            style={{
              textAlign: 'center',
              color: 'var(--ig-text-secondary)',
              fontWeight: 600,
              fontSize: '17px',
              marginBottom: '20px',
              lineHeight: 1.4
            }}
          >
            Sign up to see photos and videos from your friends.
          </p>

          {/* Facebook Signup */}
          <button
            className="ig-btn-primary"
            style={{
              width: '100%',
              marginBottom: '16px'
            }}
          >
            <span style={{ fontSize: '18px', marginRight: '8px' }}>📘</span>
            Log in with Facebook
          </button>

          {/* OR Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              margin: '16px 0',
              color: 'var(--ig-text-secondary)'
            }}
          >
            <div style={{ flex: 1, height: '1px', background: 'var(--ig-border)' }} />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--ig-border)' }} />
          </div>

          {/* Signup Form */}
          <form onSubmit={onSubmit} style={{ display: 'grid', gap: '6px' }}>
            <input
              className="ig-input"
              placeholder="Mobile Number or Email"
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
              autoFocus
            />
            <input
              className="ig-input"
              placeholder="Full Name"
              value={fullName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
            />
            <input
              className="ig-input"
              placeholder="Username"
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              required
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

            {success && (
              <div
                style={{
                  color: 'var(--ig-success)',
                  fontSize: '12px',
                  textAlign: 'center',
                  padding: '8px',
                  marginTop: '8px'
                }}
              >
                {success}
              </div>
            )}

            <p
              style={{
                fontSize: '12px',
                color: 'var(--ig-text-secondary)',
                textAlign: 'center',
                margin: '12px 0 16px',
                lineHeight: 1.4
              }}
            >
              People who use our service may have uploaded your contact information to Instagram.{' '}
              <a href="#">Learn More</a>
            </p>

            <p
              style={{
                fontSize: '12px',
                color: 'var(--ig-text-secondary)',
                textAlign: 'center',
                marginBottom: '16px',
                lineHeight: 1.4
              }}
            >
              By signing up, you agree to our <a href="#">Terms</a>, <a href="#">Privacy Policy</a>{' '}
              and <a href="#">Cookies Policy</a>.
            </p>

            <button
              className="ig-btn-primary"
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '8px'
              }}
            >
              {loading ? 'Signing up...' : 'Sign up'}
            </button>
          </form>
        </div>

        {/* Login Card */}
        <div className="ig-card ig-p-md ig-mb-sm" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '14px' }}>
            Have an account?{' '}
            <Link to="/login" style={{ fontWeight: 600 }}>
              Log in
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
