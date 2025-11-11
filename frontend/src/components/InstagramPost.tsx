import { useState } from 'react'
import { Link } from 'react-router-dom'

interface User {
  id: number
  username: string
  profilePicture?: string
}

interface InstagramPostProps {
  id: number
  imageUrl: string
  caption?: string
  user: User
  likesCount: number
  commentsCount: number
  isLiked: boolean
  isSaved?: boolean
  createdAt: string
  onLike: () => void
  onUnlike: () => void
  onComment?: () => void
  onSave?: () => void
  onUnsave?: () => void
}

export default function InstagramPost({
  imageUrl,
  caption,
  user,
  likesCount,
  commentsCount,
  isLiked,
  isSaved = false,
  createdAt,
  onLike,
  onUnlike,
  onComment,
  onSave,
  onUnsave
}: InstagramPostProps) {
  const [liked, setLiked] = useState(isLiked)
  const [likesNum, setLikesNum] = useState(likesCount)
  const [saved, setSaved] = useState(isSaved)
  const [showFullCaption, setShowFullCaption] = useState(false)

  const handleLike = async () => {
    if (liked) {
      await onUnlike()
      setLiked(false)
      setLikesNum(prev => Math.max(0, prev - 1))
    } else {
      await onLike()
      setLiked(true)
      setLikesNum(prev => prev + 1)
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

  const truncateCaption = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <article className="ig-card ig-mb-md" style={{ maxWidth: 470 }}>
      {/* Post Header */}
      <div className="ig-p-md ig-flex-between">
        <div className="ig-flex ig-gap-sm">
          <Link to={`/u/${user.username}`}>
            <img
              src={user.profilePicture || 'https://i.pravatar.cc/40'}
              alt={user.username}
              className="ig-avatar-sm"
            />
          </Link>
          <div>
            <Link to={`/u/${user.username}`}>
              <strong>{user.username}</strong>
            </Link>
          </div>
        </div>
        <button className="ig-btn-text" style={{ fontSize: '20px' }}>•••</button>
      </div>

      {/* Post Image */}
      <div style={{ width: '100%', aspectRatio: '1/1', position: 'relative' }}>
        <img
          src={imageUrl}
          alt="Post"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
          onDoubleClick={handleLike}
        />
      </div>

      {/* Post Actions */}
      <div className="ig-p-md">
        <div className="ig-flex-between ig-mb-sm">
          <div className="ig-flex ig-gap-md">
            <button
              className="ig-btn-text"
              onClick={handleLike}
              style={{ fontSize: '24px', padding: 0 }}
              aria-label={liked ? 'Unlike' : 'Like'}
            >
              {liked ? '❤️' : '🤍'}
            </button>
            <button
              className="ig-btn-text"
              onClick={onComment}
              style={{ fontSize: '24px', padding: 0 }}
              aria-label="Comment"
            >
              💬
            </button>
            <button
              className="ig-btn-text"
              style={{ fontSize: '24px', padding: 0 }}
              aria-label="Share"
            >
              📤
            </button>
          </div>
          <button
            className="ig-btn-text"
            style={{ fontSize: '24px', padding: 0 }}
            aria-label="Save"
            onClick={async () => {
              if (saved) {
                if (onUnsave) await onUnsave()
                setSaved(false)
              } else {
                if (onSave) await onSave()
                setSaved(true)
              }
            }}
          >
            {saved ? '📌' : '�'}
          </button>
        </div>

        {/* Likes Count */}
        {likesNum > 0 && (
          <div className="ig-mb-sm">
            <strong>{likesNum.toLocaleString()} {likesNum === 1 ? 'like' : 'likes'}</strong>
          </div>
        )}

        {/* Caption */}
        {caption && (
          <div className="ig-mb-sm">
            <Link to={`/u/${user.username}`}>
              <strong>{user.username}</strong>
            </Link>{' '}
            {showFullCaption ? caption : truncateCaption(caption)}
            {caption.length > 100 && !showFullCaption && (
              <button
                className="ig-btn-text ig-text-secondary"
                style={{ padding: 0, marginLeft: 4 }}
                onClick={() => setShowFullCaption(true)}
              >
                more
              </button>
            )}
          </div>
        )}

        {/* Comments Count */}
        {commentsCount > 0 && (
          <button
            className="ig-btn-text ig-text-secondary"
            style={{ padding: 0, marginBottom: 8 }}
            onClick={onComment}
          >
            View all {commentsCount} comments
          </button>
        )}

        {/* Timestamp */}
        <div className="ig-text-secondary ig-text-sm">
          {formatDate(createdAt)} ago
        </div>
      </div>
    </article>
  )
}
