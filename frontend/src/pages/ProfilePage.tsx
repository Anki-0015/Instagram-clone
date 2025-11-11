import { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../auth/AuthContext'
import { ProfileGridSkeleton } from '../components/Skeletons'
import { useToast } from '../components/ToastContext'

export default function ProfilePage() {
  const { username } = useParams()
  const { user: currentUser } = useAuth()
  const { showToast } = useToast()
  const [user, setUser] = useState<any | null>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [savedPosts, setSavedPosts] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts')
  const [following, setFollowing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [postsLoading, setPostsLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [newFullName, setNewFullName] = useState('')
  const [newBio, setNewBio] = useState('')
  const [newProfilePicUrl, setNewProfilePicUrl] = useState('')
  const [newProfilePicFile, setNewProfilePicFile] = useState<File | null>(null)

  const isOwnProfile = currentUser?.username === username

  useEffect(() => {
    if (!username) return
    api.get(`/api/users/username/${username}`).then((res: any) => {
      setUser(res.data)
      setFollowing(res.data.isFollowing || false)
    }).catch(() => showToast('Failed to load profile', 'error'))
  }, [username])

  useEffect(() => {
    if (!user) return
    setPostsLoading(true)
    Promise.all([
      api.get(`/api/posts/user/${user.id}`).then((res: any) => setPosts(res.data)),
      isOwnProfile ? api.getSavedPosts().then((res: any) => setSavedPosts(res.data)) : Promise.resolve()
    ]).finally(() => setPostsLoading(false))
  }, [user, isOwnProfile])

  const handleFollow = async () => {
    if (!user) return
    setLoading(true)
    try {
      if (following) {
        await api.delete(`/api/users/${user.id}/follow`)
        setFollowing(false)
        setUser({ ...user, followersCount: user.followersCount - 1 })
        showToast(`Unfollowed ${user.username}`, 'info')
      } else {
        await api.post(`/api/users/${user.id}/follow`)
        setFollowing(true)
        setUser({ ...user, followersCount: user.followersCount + 1 })
        showToast(`Following ${user.username}`, 'success')
      }
    } catch (error) {
      showToast('Failed to update follow status', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 935, margin: '0 auto' }}>
      {/* Profile Header */}
      <header style={{ padding: '30px 20px', marginBottom: '44px' }}>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
          {/* Profile Picture */}
          <div style={{ flex: '0 0 150px' }}>
            <img
              src={user.profilePicture || 'https://i.pravatar.cc/150'}
              alt={user.username}
              className="ig-avatar-lg"
              style={{ width: 150, height: 150 }}
            />
          </div>

          {/* Profile Info */}
          <div style={{ flex: 1 }}>
            <div className="ig-flex-between ig-mb-lg" style={{ alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 300 }}>{user.username}</h2>
              
              {isOwnProfile ? (
                <div className="ig-flex ig-gap-sm">
                  <button className="ig-btn-secondary" onClick={() => {
                    setEditing(true)
                    setNewFullName(user.fullName || '')
                    setNewBio(user.bio || '')
                    setNewProfilePicUrl(user.profilePicture || '')
                    setNewProfilePicFile(null)
                  }}>Edit profile</button>
                  <button className="ig-btn-secondary">View archive</button>
                  <button className="ig-btn-text" style={{ fontSize: '24px', padding: '4px 12px' }}>⚙️</button>
                </div>
              ) : (
                <div className="ig-flex ig-gap-sm">
                  <button
                    className={following ? 'ig-btn-secondary' : 'ig-btn-primary'}
                    onClick={handleFollow}
                    disabled={loading}
                    style={{ minWidth: 90 }}
                  >
                    {following ? 'Following' : 'Follow'}
                  </button>
                  <button className="ig-btn-secondary">Message</button>
                  <button className="ig-btn-text" style={{ fontSize: '20px', padding: '4px 12px' }}>👤+</button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="ig-flex ig-gap-md ig-mb-lg" style={{ gap: '40px' }}>
              <div>
                <strong>{user.postsCount || posts.length}</strong> posts
              </div>
              <div style={{ cursor: 'pointer' }}>
                <strong>{user.followersCount || 0}</strong> followers
              </div>
              <div style={{ cursor: 'pointer' }}>
                <strong>{user.followingCount || 0}</strong> following
              </div>
            </div>

            {/* Bio */}
            <div>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>{user.fullName}</div>
              {user.bio && (
                <div style={{ whiteSpace: 'pre-wrap', marginBottom: '4px' }}>{user.bio}</div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Story Highlights Placeholder */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          padding: '0 20px 44px',
          overflowX: 'auto'
        }}
      >
        {/* Placeholder for story highlights */}
      </div>

      {/* Tabs */}
      <div
        style={{
          borderTop: '1px solid var(--ig-border)',
          display: 'flex',
          justifyContent: 'center',
          gap: '60px'
        }}
      >
        <button
          className="ig-btn-text"
          onClick={() => setActiveTab('posts')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '16px 0',
            borderTop: activeTab === 'posts' ? '1px solid var(--ig-text-primary)' : '1px solid transparent',
            color: activeTab === 'posts' ? 'var(--ig-text-primary)' : 'var(--ig-text-secondary)',
            marginTop: '-1px',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '1px'
          }}
        >
          <span style={{ fontSize: '16px' }}>📊</span>
          POSTS
        </button>
        <button
          className="ig-btn-text"
          onClick={() => setActiveTab('saved')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '16px 0',
            borderTop: activeTab === 'saved' ? '1px solid var(--ig-text-primary)' : '1px solid transparent',
            color: activeTab === 'saved' ? 'var(--ig-text-primary)' : 'var(--ig-text-secondary)',
            marginTop: '-1px',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '1px'
          }}
        >
          <span style={{ fontSize: '16px' }}>🔖</span>
          SAVED
        </button>
      </div>

      {/* Posts Grid */}
      {activeTab === 'posts' && (
        postsLoading ? (
          <ProfileGridSkeleton />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '4px',
              padding: '0'
            }}
          >
            {posts.length === 0 ? (
              <div
                style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '60px 20px'
                }}
              >
                <div style={{ fontSize: '60px', marginBottom: '16px' }}>📷</div>
                <h2 style={{ marginBottom: '8px' }}>No Posts Yet</h2>
                {isOwnProfile && (
                  <p className="ig-text-secondary">When you share photos, they'll appear on your profile.</p>
                )}
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  style={{
                    aspectRatio: '1/1',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <img
                    src={post.imageUrl}
                    alt="Post"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                  {/* Hover overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0, 0, 0, 0)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '20px',
                      color: '#fff',
                      fontWeight: 600,
                      transition: 'background 0.2s',
                      opacity: 0
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)'
                      e.currentTarget.style.opacity = '1'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0)'
                      e.currentTarget.style.opacity = '0'
                    }}
                  >
                    <span>❤️ {post.likesCount || 0}</span>
                    <span>💬 {post.commentsCount || 0}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )
      )}

      {activeTab === 'saved' && (
        postsLoading ? (
          <ProfileGridSkeleton />
        ) : (
          <div>
            {!isOwnProfile ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '60px', marginBottom: '16px' }}>🔒</div>
                <h2 style={{ marginBottom: '8px' }}>Private</h2>
                <p className="ig-text-secondary">Only {user?.username} can see their saved posts.</p>
              </div>
            ) : savedPosts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '60px', marginBottom: '16px' }}>🔖</div>
                <h2 style={{ marginBottom: '8px' }}>Save</h2>
                <p className="ig-text-secondary">Save photos and videos that you want to see again.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                {savedPosts.map((post) => (
                  <div
                    key={post.id}
                    style={{
                      aspectRatio: '1/1',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    <img
                      src={post.imageUrl}
                      alt="Saved post"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '20px',
                        color: '#fff',
                        fontWeight: 600,
                        transition: 'background 0.2s',
                        opacity: 0
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)'
                        e.currentTarget.style.opacity = '1'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0)'
                        e.currentTarget.style.opacity = '0'
                      }}
                    >
                      <span>❤️ {post.likesCount || 0}</span>
                      <span>💬 {post.commentsCount || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      )}

      {editing && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setEditing(false)}
        >
          <div
            className="ig-card"
            style={{ width: '90%', maxWidth: 480, padding: 24 }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: 16 }}>Edit Profile</h2>
            <form
              onSubmit={async (e: FormEvent) => {
                e.preventDefault()
                try {
                  let profilePictureUrl = newProfilePicUrl.trim()
                  if (newProfilePicFile) {
                    const uploadRes = await api.upload(newProfilePicFile)
                    profilePictureUrl = uploadRes.data.url
                  }
                  await api.put('/api/users/me', {
                    fullName: newFullName,
                    bio: newBio,
                    profilePicture: profilePictureUrl || null
                  })
                  setUser({ ...user, fullName: newFullName, bio: newBio, profilePicture: profilePictureUrl })
                  setEditing(false)
                  showToast('Profile updated successfully', 'success')
                } catch (error) {
                  showToast('Failed to update profile', 'error')
                }
              }}
              style={{ display: 'grid', gap: 12 }}
            >
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <img
                  src={newProfilePicFile ? URL.createObjectURL(newProfilePicFile) : (newProfilePicUrl || user.profilePicture || 'https://i.pravatar.cc/80')}
                  alt="preview"
                  className="ig-avatar-md"
                />
                <div style={{ flex: 1 }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const f = e.target.files?.[0] || null
                      setNewProfilePicFile(f)
                    }}
                  />
                  <input
                    className="ig-input"
                    placeholder="Or image URL"
                    value={newProfilePicUrl}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => { setNewProfilePicUrl(e.target.value); setNewProfilePicFile(null) }}
                    style={{ marginTop: 8 }}
                  />
                </div>
              </div>
              <input
                className="ig-input"
                placeholder="Full name"
                value={newFullName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewFullName(e.target.value)}
              />
              <textarea
                className="ig-input"
                placeholder="Bio"
                value={newBio}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewBio(e.target.value)}
                rows={3}
                style={{ resize: 'vertical' }}
              />
              <div className="ig-flex ig-gap-sm">
                <button className="ig-btn-primary" type="submit" style={{ flex: 1 }}>Save</button>
                <button type="button" className="ig-btn-secondary" style={{ flex: 1 }} onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
