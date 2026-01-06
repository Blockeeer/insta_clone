import { useState, useRef, useEffect } from 'react'
import { MoreHorizontal, User, Edit2, Trash2 } from 'lucide-react'
import './Post.css'

// Instagram Like icon (heart)
const LikeIcon = ({ filled }) => (
  <svg aria-label="Like" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
    {filled ? (
      <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938Z"/>
    ) : (
      <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"/>
    )}
  </svg>
)

// Instagram Comment icon
const CommentIcon = () => (
  <svg aria-label="Comment" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
    <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"/>
  </svg>
)

// Repost/Repeat icon (two curved arrows - compact)
const RepostIcon = () => (
  <svg aria-label="Repost" fill="none" height="24" role="img" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 1l4 4-4 4"/>
    <path d="M14 5h-8a4 4 0 0 0-4 4v4"/>
    <path d="M10 22l-4-4 4-4"/>
    <path d="M7 18h7a4 4 0 0 0 4-4v-4"/>
  </svg>
)

// Instagram Share icon
const ShareIcon = () => (
  <svg aria-label="Share" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
    <path d="M13.973 20.046 21.77 6.928C22.8 5.195 21.55 3 19.535 3H4.466C2.138 3 .984 5.825 2.646 7.456l4.842 4.752 1.723 7.121c.548 2.266 3.571 2.721 4.762.717Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"/>
    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="7.488" x2="15.515" y1="12.208" y2="7.641"/>
  </svg>
)

// Instagram Save/Bookmark icon
const SaveIcon = ({ filled }) => (
  <svg aria-label="Save" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
    <polygon fill={filled ? "currentColor" : "none"} points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
  </svg>
)

function Post({ post, onLike, onEdit, onDelete }) {
  const [showFullCaption, setShowFullCaption] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef(null)
  const { user, imageUrl, caption, likesCount, commentsCount, isLiked, isSuggested } = post

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toLocaleString()
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const truncatedCaption = caption && caption.length > 100 && !showFullCaption
    ? caption.slice(0, 100) + '...'
    : caption

  return (
    <article className="post">
      {/* Post Header */}
      <div className="post-header">
        <div className="post-user">
          <div className="post-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.username} />
            ) : (
              <User size={20} />
            )}
          </div>
          <div className="post-user-info">
            <div className="post-username-row">
              <span className="post-username">{user.username}</span>
              {isSuggested && (
                <>
                  <span className="post-dot">•</span>
                  <button
                    className={`post-follow-btn ${isFollowing ? 'following' : ''}`}
                    onClick={() => setIsFollowing(!isFollowing)}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </>
              )}
            </div>
            {isSuggested && (
              <span className="post-suggested">Suggested for you</span>
            )}
          </div>
        </div>
        <div className="post-more-container" ref={menuRef}>
          <button className="post-more-btn" onClick={() => setShowMenu(!showMenu)}>
            <MoreHorizontal size={20} />
          </button>
          {showMenu && (
            <div className="post-menu">
              <button
                className="post-menu-item"
                onClick={() => {
                  onEdit && onEdit(post)
                  setShowMenu(false)
                }}
              >
                <Edit2 size={16} />
                <span>Edit</span>
              </button>
              <button
                className="post-menu-item delete"
                onClick={() => {
                  onDelete && onDelete(post.id)
                  setShowMenu(false)
                }}
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Image */}
      <div className="post-image">
        <img src={imageUrl} alt="Post" onDoubleClick={() => onLike(post.id)} />
        {/* Pagination dots for carousel */}
        <div className="post-pagination">
          <span className="pagination-dot active"></span>
        </div>
      </div>

      {/* Post Actions - Inline with counts like Twitter/X style */}
      <div className="post-actions-inline">
        <div className="post-actions-left">
          <button
            className={`action-btn-inline ${isLiked ? 'liked' : ''}`}
            onClick={() => onLike(post.id)}
          >
            <LikeIcon filled={isLiked} />
            <span className="action-count">{formatCount(likesCount)}</span>
          </button>
          <button className="action-btn-inline">
            <CommentIcon />
            <span className="action-count">{formatCount(commentsCount)}</span>
          </button>
          <button className="action-btn-inline">
            <RepostIcon />
            <span className="action-count">{formatCount(post.repostsCount || 0)}</span>
          </button>
          <button className="action-btn-inline">
            <ShareIcon />
            <span className="action-count">{formatCount(post.sharesCount || 0)}</span>
          </button>
        </div>
        <button className={`action-btn-inline save-btn ${isSaved ? 'saved' : ''}`} onClick={() => setIsSaved(!isSaved)}>
          <SaveIcon filled={isSaved} />
        </button>
      </div>

      {/* Post Info */}
      <div className="post-info">
        {caption && (
          <div className="post-description">
            <span className="post-description-username">{user.username}</span>
            <span className="post-description-text">{truncatedCaption}</span>
            {caption.length > 100 && !showFullCaption && (
              <button
                className="post-description-more"
                onClick={() => setShowFullCaption(true)}
              >
                more
              </button>
            )}
          </div>
        )}

        {post.createdAt && (
          <span className="post-date">{formatDate(post.createdAt)}</span>
        )}
      </div>
    </article>
  )
}

export default Post
