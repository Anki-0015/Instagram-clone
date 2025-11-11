import { Outlet, Link, useLocation } from 'react-router-dom'
import InstagramHeader from './InstagramHeader'
import { useAuth } from '../auth/AuthContext'

export default function Layout() {
  const location = useLocation()
  const { user } = useAuth()

  return (
    <div style={{ minHeight: '100vh' }}>
      <InstagramHeader />
      <main style={{ paddingTop: 60, maxWidth: 975, margin: '0 auto', padding: '60px 20px 20px' }}>
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav
        className="ig-mobile-nav"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 50,
          background: 'var(--ig-primary-background)',
          borderTop: '1px solid var(--ig-border)',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 100,
          padding: '0 20px'
        }}
      >
        <Link
          to="/"
          style={{
            fontSize: '24px',
            opacity: location.pathname === '/' ? 1 : 0.5,
            transition: 'opacity 0.2s'
          }}
        >
          🏠
        </Link>
        <Link
          to="/explore"
          style={{
            fontSize: '24px',
            opacity: location.pathname === '/explore' ? 1 : 0.5,
            transition: 'opacity 0.2s'
          }}
        >
          🔍
        </Link>
        <button
          onClick={() => {/* TODO: Open create modal */}}
          style={{
            fontSize: '24px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0
          }}
        >
          ➕
        </button>
        <Link
          to={`/u/${user?.username}`}
          style={{
            fontSize: '24px',
            opacity: location.pathname.startsWith('/u/') ? 1 : 0.5,
            transition: 'opacity 0.2s'
          }}
        >
          👤
        </Link>
      </nav>
    </div>
  )
}
