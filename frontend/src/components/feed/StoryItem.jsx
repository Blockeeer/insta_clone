import { Plus, User } from 'lucide-react'
import './StoryItem.css'

function StoryItem({ story, onClick }) {
  const { username, avatar, isOwn, hasStory } = story

  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <button className="story-item" onClick={handleClick}>
      <div className={`story-avatar-wrapper ${hasStory ? 'has-story' : ''} ${isOwn && !hasStory ? 'own-story' : ''}`}>
        <div className="story-avatar">
          {avatar ? (
            <img src={avatar} alt={username} />
          ) : (
            <div className="avatar-placeholder">
              <User size={32} />
            </div>
          )}
        </div>
        {isOwn && (
          <div className="story-add-btn">
            <Plus size={14} strokeWidth={3} />
          </div>
        )}
      </div>
      <span className="story-username">
        {isOwn ? 'Your story' : username.length > 11 ? username.slice(0, 11) + '...' : username}
      </span>
    </button>
  )
}

export default StoryItem
