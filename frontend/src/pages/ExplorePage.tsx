import { useEffect, useMemo, useState, ChangeEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { api } from '../lib/api'

function useQuery() {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}

export default function ExplorePage() {
  const queryParams = useQuery()
  const initialQ = queryParams.get('q') || ''

  const [q, setQ] = useState(initialQ)
  const [searching, setSearching] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    // Load trending/all posts
    api.getAllPosts().then((res: any) => setPosts(res.data))
  }, [])

  useEffect(() => {
    // If initial query exists, run search
    if (initialQ) {
      setSearching(true)
      api.searchUsers(initialQ)
        .then((res: any) => setUsers(res.data))
        .finally(() => setSearching(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSearch = async () => {
    if (!q.trim()) {
      setUsers([])
      return
    }
    setSearching(true)
    try {
      const res: any = await api.searchUsers(q.trim())
      setUsers(res.data)
    } finally {
      setSearching(false)
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 24 }}>
      {/* Left: Search users */}
      <aside className="ig-card" style={{ padding: 16, alignSelf: 'start' }}>
        <h3 style={{ marginBottom: 12 }}>Search</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className="ig-input"
            value={q}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
            placeholder="Search users by name or username"
            onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
          />
          <button className="ig-btn-primary" onClick={onSearch} disabled={searching}>
            {searching ? '...' : 'Search'}
          </button>
        </div>

        <div style={{ marginTop: 16, display: 'grid', gap: 8 }}>
          {users.length === 0 && (
            <p className="ig-text-secondary" style={{ margin: 0 }}>No users yet</p>
          )}
          {users.map((u) => (
            <Link
              to={`/u/${u.username}`}
              key={u.id}
              className="ig-flex ig-gap-sm"
              style={{ alignItems: 'center', padding: '8px 4px', color: 'inherit' }}
            >
              <img
                src={u.profilePicture || 'https://i.pravatar.cc/40'}
                alt={u.username}
                className="ig-avatar-sm"
              />
              <div style={{ display: 'grid' }}>
                <strong style={{ lineHeight: 1.2 }}>{u.username}</strong>
                <span className="ig-text-secondary" style={{ lineHeight: 1.2 }}>{u.fullName || ''}</span>
              </div>
            </Link>
          ))}
        </div>
      </aside>

      {/* Right: Explore grid */}
      <section>
        <h3 style={{ marginBottom: 12 }}>Explore</h3>
        {posts.length === 0 ? (
          <div className="ig-card ig-p-md" style={{ textAlign: 'center' }}>
            <p className="ig-text-secondary">No posts yet. Create the first one!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
            {posts.map((post) => (
              <div key={post.id} style={{ aspectRatio: '1/1', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={post.imageUrl}
                  alt={post.caption || 'post'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div
                  style={{
                    position: 'absolute', inset: 0, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
                    background: 'rgba(0,0,0,0)', opacity: 0, transition: 'all .2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,.35)'; e.currentTarget.style.opacity = '1' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0)'; e.currentTarget.style.opacity = '0' }}
                >
                  <span>❤️ {post.likesCount || 0}</span>
                  <span>💬 {post.commentsCount || 0}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
