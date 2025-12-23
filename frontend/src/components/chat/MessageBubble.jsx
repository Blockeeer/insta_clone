import './MessageBubble.css'

function MessageBubble({ message, isOwn, showAvatar, avatar }) {
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className={`message-bubble-wrapper ${isOwn ? 'own' : 'other'}`}>
      {!isOwn && (
        <div className="message-avatar-space">
          {showAvatar && (
            <div className="message-avatar">
              {avatar ? (
                <img src={avatar} alt="User" />
              ) : (
                <span>U</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Time on left for own messages */}
      {isOwn && <span className="message-time">{formatTime(message.createdAt)}</span>}

      <div className={`message-bubble ${isOwn ? 'own' : 'other'}`}>
        <p className="message-content">{message.content}</p>
      </div>

      {/* Time on right for other's messages */}
      {!isOwn && <span className="message-time">{formatTime(message.createdAt)}</span>}
    </div>
  )
}

export default MessageBubble
