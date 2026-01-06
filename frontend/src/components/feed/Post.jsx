import { useState } from 'react'
import { MoreHorizontal, User } from 'lucide-react'
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

// Instagram Save/Bookmark icon
const SaveIcon = ({ filled }) => (
  <svg aria-label="Save" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
    <polygon fill={filled ? "currentColor" : "none"} points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
  </svg>
)

// Send/Direct message icon (paper airplane)
const SendIcon = () => (
  <svg aria-label="Send" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
    <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"/>
    <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"/>
  </svg>
)

function Post({ post, onLike }) {
  const [showFullCaption, setShowFullCaption] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const { user, imageUrl, caption, likesCount, commentsCount, isLiked, isSuggested } = post

  const formatCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toLocaleString()
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
        <button className="post-more-btn">
          <MoreHorizontal size={20} />
        </button>
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
            <SendIcon />
            <span className="action-count">{formatCount(post.sendsCount || 0)}</span>
          </button>
        </div>
        <button className={`action-btn-inline save-btn ${isSaved ? 'saved' : ''}`} onClick={() => setIsSaved(!isSaved)}>
          <SaveIcon filled={isSaved} />
        </button>
      </div>

      {/* Post Info */}
      <div className="post-info">

        {caption && (
          <div className="post-caption">
            <span className="post-caption-username">{user.username}</span>
            <span className="post-caption-text">{truncatedCaption}</span>
            {caption.length > 100 && !showFullCaption && (
              <button
                className="post-caption-more"
                onClick={() => setShowFullCaption(true)}
              >
                more
              </button>
            )}
          </div>
        )}

        {commentsCount > 0 && (
          <button className="post-comments-link">
            View all {commentsCount} comments
          </button>
        )}
      </div>
    </article>
  )
}

export default Post
