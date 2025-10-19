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

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    try {
      await signup(username, email, password, fullName)
      setSuccess('Signup successful. You can login now.')
      setTimeout(() => nav('/login'), 600)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Signup failed')
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <h2>Sign up</h2>
      <form className="form" onSubmit={onSubmit}>
  <input className="input" placeholder="Username" value={username} onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} />
  <input className="input" placeholder="Full name" value={fullName} onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)} />
  <input className="input" placeholder="Email" value={email} onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
  <div style={{ position: 'relative' }}>
    <input className="input" placeholder="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
    <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: 8, top: 8, background: 'transparent', border: 'none', cursor: 'pointer' }} aria-label={showPassword ? 'Hide password' : 'Show password'}>
      {showPassword ? 'Hide' : 'Show'}
    </button>
  </div>
        {error && <div className="card" style={{ borderColor: '#f33' }}>{error}</div>}
        {success && <div className="card" style={{ borderColor: '#0a0' }}>{success}</div>}
        <button className="button" type="submit">Create account</button>
      </form>
      <p>Have an account? <Link to="/login">Log in</Link></p>
    </div>
  )
}
