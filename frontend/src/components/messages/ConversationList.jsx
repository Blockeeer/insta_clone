import ConversationItem from './ConversationItem'
import './ConversationList.css'

function ConversationList({ conversations, onConversationClick, currentUserId }) {
  if (conversations.length === 0) {
    return (
      <div className="conversation-list-empty">
        <div className="empty-icon">
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
            <circle cx="48" cy="48" r="46" stroke="currentColor" strokeWidth="4"/>
            <path d="M28 38h40M28 48h28M28 58h36" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        </div>
        <h3>Your messages</h3>
        <p>Send private messages to a friend</p>
        <button className="btn btn-primary">Send message</button>
      </div>
    )
  }

  return (
    <div className="conversation-list">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          onClick={() => onConversationClick(conversation.id)}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  )
}

export default ConversationList
