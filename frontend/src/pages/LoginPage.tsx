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

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await login(username, password)
      nav('/')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <h2>Login</h2>
      <form className="form" onSubmit={onSubmit}>
  <input className="input" placeholder="Username" value={username} onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} />
  <div style={{ position: 'relative' }}>
    <input className="input" placeholder="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
    <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: 8, top: 8, background: 'transparent', border: 'none', cursor: 'pointer' }} aria-label={showPassword ? 'Hide password' : 'Show password'}>
      {showPassword ? 'Hide' : 'Show'}
    </button>
  </div>
        {error && <div className="card" style={{ borderColor: '#f33' }}>{error}</div>}
        <button className="button" type="submit">Login</button>
      </form>
      <p>Don’t have an account? <Link to="/signup">Sign up</Link></p>
    </div>
  )
}
