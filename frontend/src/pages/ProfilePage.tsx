import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'

export default function ProfilePage() {
  const { username } = useParams()
  const [user, setUser] = useState<any | null>(null)
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    if (!username) return
    api.get(`/api/users/username/${username}`).then((res: any) => setUser(res.data))
  }, [username])

  useEffect(() => {
    if (!user) return
    api.get(`/api/posts/user/${user.id}`).then((res: any) => setPosts(res.data))
  }, [user])

  if (!user) return <div>Loading…</div>

  return (
    <div>
      <div className="card" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <img src={user.profilePicture || 'https://i.pravatar.cc/100'} alt="avatar" style={{ width: 80, height: 80, borderRadius: '50%' }} />
        <div>
          <h2>@{user.username}</h2>
          <p>{user.fullName}</p>
          <p>{user.bio}</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <span><strong>{user.postsCount}</strong> posts</span>
            <span><strong>{user.followersCount}</strong> followers</span>
            <span><strong>{user.followingCount}</strong> following</span>
          </div>
        </div>
      </div>

      <div className="grid">
        {posts.map(p => (
          <img key={p.id} src={p.imageUrl} alt="post" />
        ))}
      </div>
    </div>
  )
}
