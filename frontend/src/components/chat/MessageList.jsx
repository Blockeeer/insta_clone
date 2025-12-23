import MessageBubble from './MessageBubble'
import './MessageList.css'

// Format numbers like Instagram (1000 = 1,000, 10000 = 10K, 1000000 = 1M)
const formatCount = (num) => {
  if (num === undefined || num === null) return '0'

  const n = Number(num)

  // Less than 10,000 - show full number with commas
  if (n < 10000) {
    return n.toLocaleString()
  }

  // 10K - 999.9K
  if (n < 1000000) {
    const thousands = n / 1000
    // If it's a round number (e.g., 10000, 25000), show without decimal
    if (n % 1000 === 0 || thousands >= 100) {
      return Math.floor(thousands) + 'K'
    }
    // Show one decimal if there's a remainder (e.g., 10100 = 10.1K)
    const decimal = Math.floor((n % 1000) / 100)
    if (decimal > 0) {
      return Math.floor(thousands) + '.' + decimal + 'K'
    }
    return Math.floor(thousands) + 'K'
  }

  // 1M - 999.9M
  if (n < 1000000000) {
    const millions = n / 1000000
    // If it's a round number, show without decimal
    if (n % 1000000 === 0 || millions >= 100) {
      return Math.floor(millions) + 'M'
    }
    // Show one decimal if there's a remainder
    const decimal = Math.floor((n % 1000000) / 100000)
    if (decimal > 0) {
      return Math.floor(millions) + '.' + decimal + 'M'
    }
    return Math.floor(millions) + 'M'
  }

  // 1B+
  const billions = n / 1000000000
  if (n % 1000000000 === 0) {
    return Math.floor(billions) + 'B'
  }
  const decimal = Math.floor((n % 1000000000) / 100000000)
  if (decimal > 0) {
    return Math.floor(billions) + '.' + decimal + 'B'
  }
  return Math.floor(billions) + 'B'
}

function MessageList({ messages, currentUserId, otherUser }) {
  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = []
    let currentDate = null

    messages.forEach((message) => {
      const messageDate = new Date(message.createdAt).toDateString()

      if (messageDate !== currentDate) {
        currentDate = messageDate
        groups.push({
          date: message.createdAt,
          messages: [message]
        })
      } else {
        groups[groups.length - 1].messages.push(message)
      }
    })

    return groups
  }

  const formatDateHeader = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      })
    }
  }

  const messageGroups = groupMessagesByDate(messages)

  return (
    <div className="message-list">
      {/* Profile Info at top */}
      <div className="chat-profile-info">
        <div className="chat-profile-avatar">
          {otherUser.avatar ? (
            <img src={otherUser.avatar} alt={otherUser.username} />
          ) : (
            <div className="avatar-placeholder">
              {otherUser.username?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="chat-profile-name-row">
          <h3 className="chat-profile-name">{otherUser.fullName || otherUser.username}</h3>
          {otherUser.isVerified && (
            <svg className="chat-verified-badge" width="16" height="16" viewBox="0 0 40 40" fill="none">
              <path d="M19.998 3.094L24.19 7.283L29.882 6.155L30.985 11.867L36.906 13.994L34.76 19.998L36.906 26.002L30.985 28.13L29.882 33.842L24.19 32.714L19.998 36.906L15.81 32.714L10.118 33.842L9.015 28.13L3.094 26.002L5.24 19.998L3.094 13.994L9.015 11.867L10.118 6.155L15.81 7.283L19.998 3.094Z" fill="#0095F6"/>
              <path d="M17.5 27L11 20.5L13.5 18L17.5 22L26.5 13L29 15.5L17.5 27Z" fill="white"/>
            </svg>
          )}
        </div>
        <p className="chat-profile-username">{otherUser.username}</p>
        <p className="chat-profile-stats-line">
          {formatCount(otherUser.followersCount)} followers · {formatCount(otherUser.postsCount)} posts
        </p>
        <p className="chat-profile-follow-info">You've followed this Instagram account since 2025</p>

        <button className="view-profile-btn">View profile</button>
      </div>

      {/* Message Groups */}
      {messageGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="message-group">
          <div className="date-divider">
            <span>{formatDateHeader(group.date)}</span>
          </div>

          {group.messages.map((message, messageIndex) => {
            const isOwn = message.senderId === currentUserId || message.senderId === 'me'
            const showAvatar = !isOwn && (
              messageIndex === group.messages.length - 1 ||
              group.messages[messageIndex + 1]?.senderId !== message.senderId
            )

            return (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={isOwn}
                showAvatar={showAvatar}
                avatar={otherUser.avatar}
              />
            )
          })}
        </div>
      ))}

    </div>
  )
}

export default MessageList
