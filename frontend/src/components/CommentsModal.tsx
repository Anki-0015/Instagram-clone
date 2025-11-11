import { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../auth/AuthContext'

interface User {
  id: number
  username: string
  profilePicture?: string
}

interface Comment {
  id: number
  content: string
  user: User
  createdAt: string
}

interface CommentsModalProps {
  postId: number
  postImage: string
  postUser: User
  postCaption?: string
  onClose: () => void
}

export default function CommentsModal({
  postId,
  postImage,
  postUser,
  postCaption,
  onClose
}: CommentsModalProps) {
  const { user: currentUser } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    loadComments()
  }, [postId])

  const loadComments = async () => {
    try {
      const res: any = await api.get(`/api/posts/${postId}/comments`)
      setComments(res.data)
    } catch (err) {
      console.error('Failed to load comments', err)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    setPosting(true)
    try {
      const res: any = await api.post(`/api/posts/${postId}/comments`, {
        content: newComment.trim()
      })
      setComments([...comments, res.data])
      setNewComment('')
    } catch (err) {
      console.error('Failed to post comment', err)
    } finally {
      setPosting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    if (diff < 60) return `${diff}s`
    if (diff < 3600) return `${Math.floor(diff / 60)}m`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`
    return `${Math.floor(diff / 604800)}w`
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.65)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--ig-primary-background)',
          borderRadius: 'var(--ig-radius-md)',
          display: 'flex',
          maxWidth: 1200,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Left: Image */}
        <div
          style={{
            flex: '0 0 60%',
            background: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img
            src={postImage}
            alt="Post"
            style={{
              maxWidth: '100%',
              maxHeight: '90vh',
              objectFit: 'contain'
            }}
          />
        </div>

        {/* Right: Comments */}
        <div
          style={{
            flex: '0 0 40%',
            display: 'flex',
            flexDirection: 'column',
            maxWidth: 500
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: 14,
              borderBottom: '1px solid var(--ig-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div className="ig-flex ig-gap-sm">
              <Link to={`/u/${postUser.username}`} onClick={onClose}>
                <img
                  src={postUser.profilePicture || 'https://i.pravatar.cc/32'}
                  alt={postUser.username}
                  className="ig-avatar-sm"
                />
              </Link>
              <Link to={`/u/${postUser.username}`} onClick={onClose}>
                <strong>{postUser.username}</strong>
              </Link>
            </div>
            <button
              className="ig-btn-text"
              onClick={onClose}
              style={{ fontSize: '24px' }}
            >
              ✕
            </button>
          </div>

          {/* Comments List */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 16
            }}
          >
            {/* Post Caption as first comment */}
            {postCaption && (
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  marginBottom: 16
                }}
              >
                <Link to={`/u/${postUser.username}`} onClick={onClose}>
                  <img
                    src={postUser.profilePicture || 'https://i.pravatar.cc/32'}
                    alt={postUser.username}
                    className="ig-avatar-sm"
                  />
                </Link>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: 4 }}>
                    <Link to={`/u/${postUser.username}`} onClick={onClose}>
                      <strong style={{ marginRight: 6 }}>{postUser.username}</strong>
                    </Link>
                    <span>{postCaption}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Comments */}
            {comments.length === 0 && !postCaption && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ig-text-secondary)' }}>
                No comments yet.
                <br />
                Start the conversation.
              </div>
            )}
            {comments.map(comment => (
              <div
                key={comment.id}
                style={{
                  display: 'flex',
                  gap: 12,
                  marginBottom: 16
                }}
              >
                <Link to={`/u/${comment.user.username}`} onClick={onClose}>
                  <img
                    src={comment.user.profilePicture || 'https://i.pravatar.cc/32'}
                    alt={comment.user.username}
                    className="ig-avatar-sm"
                  />
                </Link>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: 4 }}>
                    <Link to={`/u/${comment.user.username}`} onClick={onClose}>
                      <strong style={{ marginRight: 6 }}>{comment.user.username}</strong>
                    </Link>
                    <span>{comment.content}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ig-text-secondary)' }}>
                    {formatDate(comment.createdAt)} ago
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment Form */}
          <div
            style={{
              borderTop: '1px solid var(--ig-border)',
              padding: 16
            }}
          >
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
              <input
                className="ig-input"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewComment(e.target.value)}
                disabled={posting}
                style={{ flex: 1, padding: '8px 12px' }}
              />
              <button
                type="submit"
                className="ig-btn-primary"
                disabled={posting || !newComment.trim()}
              >
                {posting ? '...' : 'Post'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
