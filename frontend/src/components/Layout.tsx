import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()
  return (
    <div>
      <header className="header">
        <div className="header-inner container">
          <Link className="brand" to="/">Instaclone</Link>
          <nav className="nav">
            {user && <Link to={`/u/${user.username}`}>@{user.username}</Link>}
            <button className="button secondary" onClick={logout}>Logout</button>
          </nav>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </div>
  )
}
