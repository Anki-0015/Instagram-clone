import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useTheme } from '../theme/ThemeContext'
import { useEffect, useState, useRef } from 'react'

export default function InstagramHeader() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const debounceRef = useRef<number | undefined>(undefined)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    // Sync input with URL when on explore page
    if (location.pathname === '/explore') {
      const params = new URLSearchParams(location.search)
      setQ(params.get('q') || '')
    } else {
      setQ('')
    }
    setSearchResults([])
    setShowDropdown(false)
  }, [location])

  // Load unread notification count
  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const res: any = await (await import('../lib/api')).api.getUnreadCount()
        setUnreadCount(res.data.count || 0)
      } catch (err) {
        console.error('Failed to load notification count', err)
      }
    }
    loadUnreadCount()
    const interval = setInterval(loadUnreadCount, 30000) // Poll every 30s
    return () => clearInterval(interval)
  }, [])

  // Debounced search suggestions
  useEffect(() => {
    window.clearTimeout(debounceRef.current)
    if (!q || q.length < 2) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }
    debounceRef.current = window.setTimeout(async () => {
      try {
        setSearching(true)
        const res: any = await (await import('../lib/api')).api.searchUsers(q.trim())
        setSearchResults(res.data.slice(0, 5))
        setShowDropdown(true)
      } catch {
        setSearchResults([])
      } finally {
        setSearching(false)
      }
    }, 300)
    return () => window.clearTimeout(debounceRef.current)
  }, [q])

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'var(--ig-primary-background)',
        borderBottom: '1px solid var(--ig-border)',
        zIndex: 'var(--ig-z-header)'
      }}
    >
      <div
        style={{
          maxWidth: 975,
          margin: '0 auto',
          padding: '8px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ fontSize: '24px', fontWeight: 600, fontFamily: 'cursive' }}>
          Instagram
        </Link>

        {/* Search Bar */}
        <div style={{ flex: '0 1 268px', display: 'flex', gap: 8, position: 'relative' }} className="ig-header-search">
          <input
            className="ig-input"
            type="search"
            placeholder="🔍 Search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigate(`/explore${q ? `?q=${encodeURIComponent(q)}` : ''}`)
              }
            }}
            style={{ padding: '6px 16px', fontSize: '14px', flex: 1 }}
          />
          <button
            className="ig-btn-secondary"
            onClick={() => navigate(`/explore${q ? `?q=${encodeURIComponent(q)}` : ''}`)}
          >
            Search
          </button>
          {showDropdown && searchResults.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: 0,
                right: 0,
                background: 'var(--ig-primary-background)',
                border: '1px solid var(--ig-border)',
                borderRadius: 'var(--ig-radius-md)',
                boxShadow: 'var(--ig-shadow-modal)',
                zIndex: 1500,
                overflow: 'hidden'
              }}
            >
              {searching && (
                <div style={{ padding: '8px 12px', fontSize: 12, color: 'var(--ig-text-secondary)' }}>Searching...</div>
              )}
              {searchResults.map(u => (
                <button
                  key={u.id}
                  onClick={() => { navigate(`/u/${u.username}`); setShowDropdown(false) }}
                  style={{
                    display: 'flex',
                    gap: 8,
                    width: '100%',
                    padding: '8px 12px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ig-hover)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'none' }}
                >
                  <img src={u.profilePicture || 'https://i.pravatar.cc/32'} alt={u.username} className="ig-avatar-sm" />
                  <div style={{ display: 'grid' }}>
                    <strong style={{ fontSize: 13 }}>{u.username}</strong>
                    <span style={{ fontSize: 12, color: 'var(--ig-text-secondary)' }}>{u.fullName || ''}</span>
                  </div>
                </button>
              ))}
              <button
                onClick={() => navigate(`/explore${q ? `?q=${encodeURIComponent(q)}` : ''}`)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'none',
                  border: 'none',
                  borderTop: '1px solid var(--ig-border)',
                  fontSize: 12,
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ig-hover)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'none' }}
              >
                View all results
              </button>
            </div>
          )}
        </div>

        {/* Navigation Icons */}
        <nav className="ig-flex ig-gap-md ig-desktop-nav">
          <Link to="/" aria-label="Home">
            <span style={{ fontSize: '24px' }}>🏠</span>
          </Link>
          <Link to="/messages" aria-label="Messages">
            <span style={{ fontSize: '24px' }}>💬</span>
          </Link>
          <Link to="/create" aria-label="Create">
            <span style={{ fontSize: '24px' }}>➕</span>
          </Link>
          <Link to="/explore" aria-label="Explore">
            <span style={{ fontSize: '24px' }}>🧭</span>
          </Link>
          <div style={{ position: 'relative' }}>
            <button
              className="ig-btn-text"
              onClick={async () => {
                setShowNotifications(!showNotifications)
                if (!showNotifications) {
                  try {
                    const res: any = await (await import('../lib/api')).api.getUnreadNotifications()
                    setNotifications(res.data)
                  } catch (err) {
                    console.error('Failed to load notifications', err)
                  }
                }
              }}
              aria-label="Notifications"
              style={{ padding: 0, position: 'relative' }}
            >
              <span style={{ fontSize: '24px' }}>❤️</span>
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    background: '#ff3040',
                    color: '#fff',
                    borderRadius: '50%',
                    minWidth: 18,
                    height: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '0 4px'
                  }}
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 12px)',
                  right: 0,
                  width: 420,
                  maxHeight: '60vh',
                  overflowY: 'auto',
                  background: 'var(--ig-primary-background)',
                  border: '1px solid var(--ig-border)',
                  borderRadius: 'var(--ig-radius-md)',
                  boxShadow: 'var(--ig-shadow-modal)',
                  zIndex: 1500
                }}
              >
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--ig-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>Notifications</strong>
                  {notifications.length > 0 && (
                    <button
                      className="ig-btn-text"
                      onClick={async () => {
                        await (await import('../lib/api')).api.markAllNotificationsAsRead()
                        setNotifications([])
                        setUnreadCount(0)
                      }}
                      style={{ fontSize: 12, color: 'var(--ig-link)' }}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--ig-text-secondary)' }}>
                    No new notifications
                  </div>
                ) : (
                  notifications.map((notif: any) => (
                    <div
                      key={notif.id}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--ig-border)',
                        display: 'flex',
                        gap: 12,
                        cursor: 'pointer',
                        background: notif.isRead ? 'transparent' : 'var(--ig-hover)'
                      }}
                      onClick={async () => {
                        await (await import('../lib/api')).api.markNotificationAsRead(notif.id)
                        setShowNotifications(false)
                        if (notif.post) {
                          navigate(`/u/${notif.post.user.username}`)
                        }
                      }}
                    >
                      <img
                        src={notif.actor.profilePicture || 'https://i.pravatar.cc/40'}
                        alt={notif.actor.username}
                        className="ig-avatar-sm"
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: 4 }}>
                          <strong>{notif.actor.username}</strong>
                          {notif.type === 'LIKE' && ' liked your post'}
                          {notif.type === 'COMMENT' && ' commented on your post'}
                          {notif.type === 'FOLLOW' && ' started following you'}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--ig-text-secondary)' }}>
                          {(() => {
                            const diff = Math.floor((Date.now() - new Date(notif.createdAt).getTime()) / 1000)
                            if (diff < 60) return `${diff}s`
                            if (diff < 3600) return `${Math.floor(diff / 60)}m`
                            if (diff < 86400) return `${Math.floor(diff / 3600)}h`
                            if (diff < 604800) return `${Math.floor(diff / 86400)}d`
                            return `${Math.floor(diff / 604800)}w`
                          })()} ago
                        </div>
                      </div>
                      {notif.post && notif.post.imageUrl && (
                        <img
                          src={notif.post.imageUrl}
                          alt="Post"
                          style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 4 }}
                        />
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          
          {/* Profile Menu */}
          <div style={{ position: 'relative' }}>
            <button
              className="ig-btn-text"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{ padding: 0 }}
              aria-label="Profile menu"
            >
              <img
                src={user?.profilePicture || 'https://i.pravatar.cc/32'}
                alt={user?.username}
                className="ig-avatar-sm"
                style={{ border: showProfileMenu ? '2px solid var(--ig-text-primary)' : 'none' }}
              />
            </button>

            {showProfileMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  background: 'var(--ig-primary-background)',
                  border: '1px solid var(--ig-border)',
                  borderRadius: 'var(--ig-radius-md)',
                  boxShadow: 'var(--ig-shadow-modal)',
                  minWidth: 200,
                  overflow: 'hidden'
                }}
              >
                <Link
                  to={`/u/${user?.username}`}
                  className="ig-flex ig-gap-sm"
                  style={{
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'var(--ig-text-primary)'
                  }}
                  onClick={() => setShowProfileMenu(false)}
                >
                  <span>👤</span>
                  <span>Profile</span>
                </Link>
                <Link
                  to="/settings"
                  className="ig-flex ig-gap-sm"
                  style={{
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'var(--ig-text-primary)',
                    borderTop: '1px solid var(--ig-border)'
                  }}
                  onClick={() => setShowProfileMenu(false)}
                >
                  <span>⚙️</span>
                  <span>Settings</span>
                </Link>
                <button
                  className="ig-btn-text"
                  onClick={() => {
                    toggleTheme()
                    setShowProfileMenu(false)
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    color: 'var(--ig-text-primary)',
                    borderTop: '1px solid var(--ig-border)'
                  }}
                >
                  <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
                  <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
                </button>
                <button
                  className="ig-btn-text"
                  onClick={() => {
                    logout()
                    setShowProfileMenu(false)
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    color: 'var(--ig-text-primary)',
                    borderTop: '1px solid var(--ig-border)'
                  }}
                >
                  <span>🚪</span>
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
