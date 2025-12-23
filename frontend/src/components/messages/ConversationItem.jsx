import { User, Camera } from 'lucide-react'
import './ConversationItem.css'

function ConversationItem({ conversation, onClick, currentUserId }) {
  const { participants, lastMessage, unreadCount } = conversation
  const participant = participants[0]

  const formatTime = (date) => {
    const now = new Date()
    const msgDate = new Date(date)
    const diffMs = now - msgDate
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`
    return `${Math.floor(diffDays / 7)}w`
  }

  const getMessagePreview = () => {
    if (!lastMessage) return 'No messages yet'

    const isOwnMessage = lastMessage.senderId === 'me' || lastMessage.senderId === currentUserId
    const prefix = isOwnMessage ? 'You: ' : ''
    const content = lastMessage.content

    if (content.length > 30) {
      return prefix + content.slice(0, 30) + '...'
    }
    return prefix + content
  }

  return (
    <button className="conversation-item" onClick={onClick}>
      <div className="conversation-avatar-wrapper">
        <div className="conversation-avatar">
          {participant.avatar ? (
            <img src={participant.avatar} alt={participant.username} />
          ) : (
            <User size={24} />
          )}
        </div>
        {participant.isOnline && <div className="online-indicator" />}
      </div>

      <div className="conversation-content">
        <div className="conversation-header">
          <span className={`conversation-name ${unreadCount > 0 ? 'unread' : ''}`}>
            {participant.fullName || participant.username}
          </span>
          {lastMessage && (
            <span className="conversation-time">{formatTime(lastMessage.createdAt)}</span>
          )}
        </div>
        <div className="conversation-preview">
          <span className={`message-preview ${unreadCount > 0 ? 'unread' : ''}`}>
            {getMessagePreview()}
          </span>
          {unreadCount > 0 && (
            <div className="unread-badge">{unreadCount}</div>
          )}
        </div>
      </div>

      <button className="camera-btn" onClick={(e) => e.stopPropagation()}>
        <Camera size={24} />
      </button>
    </button>
  )
}

export default ConversationItem
