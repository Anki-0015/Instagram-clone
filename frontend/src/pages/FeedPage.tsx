import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { api } from '../lib/api'
import InstagramPost from '../components/InstagramPost'

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [imageUrl, setImageUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState('')
  const [posting, setPosting] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const loadFeed = () => {
    api.get('/api/posts/feed').then((res: any) => setPosts(res.data))
  }

  useEffect(() => { loadFeed() }, [])

  const onCreatePost = async (e: FormEvent) => {
    e.preventDefault()
    if (!imageUrl.trim() && !file) return
    setPosting(true)
    try {
      let finalUrl = imageUrl.trim()
      if (file) {
        const res = await api.upload(file)
        finalUrl = res.data.url
      }
      await api.post('/api/posts', { imageUrl: finalUrl, caption })
      setImageUrl('')
      setFile(null)
      setCaption('')
      setShowCreateModal(false)
      loadFeed()
    } finally {
      setPosting(false)
    }
  }

  const handleLike = async (postId: number) => {
    await api.post(`/api/posts/${postId}/like`)
  }

  const handleUnlike = async (postId: number) => {
    await api.delete(`/api/posts/${postId}/like`)
  }

  return (
    <div style={{ maxWidth: 630, margin: '0 auto' }}>
      {/* Create Post Button */}
      <button
        className="ig-btn-primary ig-mb-lg"
        onClick={() => { setShowCreateModal(true); setFile(null); setImageUrl(''); setCaption('') }}
        style={{ width: '100%' }}
      >
        ➕ Create New Post
      </button>

      {/* Create Post Modal */}
      {showCreateModal && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              zIndex: 'var(--ig-z-overlay)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => setShowCreateModal(false)}
          >
            <div
              className="ig-card"
              style={{
                width: '90%',
                maxWidth: 500,
                padding: 'var(--ig-spacing-lg)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="ig-mb-md">Create New Post</h2>
              <form onSubmit={onCreatePost} style={{ display: 'grid', gap: 'var(--ig-spacing-md)' }}>
                <div style={{ display: 'grid', gap: 8 }}>
                  <input
                    className="ig-input"
                    placeholder="Paste image URL or choose file"
                    value={imageUrl}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setImageUrl(e.target.value)}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const f = e.target.files?.[0] || null
                      setFile(f)
                    }}
                  />
                </div>
                {file ? (
                  <div style={{ aspectRatio: '1/1', overflow: 'hidden', borderRadius: 'var(--ig-radius-md)' }}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ) : imageUrl ? (
                  <div style={{ aspectRatio: '1/1', overflow: 'hidden', borderRadius: 'var(--ig-radius-md)' }}>
                    <img
                      src={imageUrl}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                ) : null}
                <textarea
                  className="ig-input"
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCaption(e.target.value)}
                  rows={3}
                  style={{ resize: 'vertical', fontFamily: 'var(--ig-font-family)' }}
                />
                <div className="ig-flex ig-gap-sm">
                  <button className="ig-btn-primary" type="submit" disabled={posting || (!imageUrl && !file)} style={{ flex: 1 }}>
                    {posting ? 'Posting...' : 'Share'}
                  </button>
                  <button
                    className="ig-btn-secondary"
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Feed Posts */}
      {posts.length === 0 ? (
        <div className="ig-card ig-p-md" style={{ textAlign: 'center' }}>
          <h3 className="ig-mb-md">Welcome to Instagram!</h3>
          <p className="ig-text-secondary ig-mb-md">
            Follow people to see their posts in your feed
          </p>
          <button className="ig-btn-primary" onClick={() => window.location.href = '/explore'}>
            Explore People
          </button>
        </div>
      ) : (
        posts.map((post: any) => (
          <InstagramPost
            key={post.id}
            {...post}
            onLike={() => handleLike(post.id)}
            onUnlike={() => handleUnlike(post.id)}
          />
        ))
      )}
    </div>
  )
}
