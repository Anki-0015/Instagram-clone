import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { api } from '../lib/api'
import { Link } from 'react-router-dom'

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [imageUrl, setImageUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [posting, setPosting] = useState(false)

  const loadFeed = () => {
    api.get('/api/posts/feed').then((res: any) => setPosts(res.data))
  }

  useEffect(() => { loadFeed() }, [])

  const onCreatePost = async (e: FormEvent) => {
    e.preventDefault()
    if (!imageUrl.trim()) return
    setPosting(true)
    try {
      await api.post('/api/posts', { imageUrl, caption })
      setImageUrl('')
      setCaption('')
      loadFeed()
    } finally {
      setPosting(false)
    }
  }

  const toggleLike = async (post: any) => {
    if (post.isLiked) {
      await api.delete(`/api/posts/${post.id}/like`)
      post.isLiked = false
      post.likesCount = Math.max(0, (post.likesCount || 1) - 1)
    } else {
      await api.post(`/api/posts/${post.id}/like`)
      post.isLiked = true
      post.likesCount = (post.likesCount || 0) + 1
    }
    setPosts([...posts])
  }

  return (
    <div>
      <h2>Feed</h2>

      <div className="card">
        <form className="form" onSubmit={onCreatePost}>
          <input className="input" placeholder="Image URL" value={imageUrl} onChange={(e: ChangeEvent<HTMLInputElement>) => setImageUrl(e.target.value)} />
          <input className="input" placeholder="Caption (optional)" value={caption} onChange={(e: ChangeEvent<HTMLInputElement>) => setCaption(e.target.value)} />
          <button className="button" type="submit" disabled={posting}>{posting ? 'Posting…' : 'Post'}</button>
        </form>
      </div>

      {posts.map((p: any) => (
        <div key={p.id} className="card">
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <strong><Link to={`/u/${p.user.username}`}>@{p.user.username}</Link></strong>
            <span style={{ color: '#666', fontSize: 12 }}>{new Date(p.createdAt).toLocaleString()}</span>
          </div>
          <img src={p.imageUrl} alt="post" style={{ width: '100%', borderRadius: 8 }} />
          {p.caption && <p>{p.caption}</p>}
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="button secondary" onClick={() => toggleLike(p)}>{p.isLiked ? 'Unlike' : 'Like'} ({p.likesCount || 0})</button>
            <button className="button secondary">Comments ({p.commentsCount || 0})</button>
          </div>
        </div>
      ))}
    </div>
  )
}
