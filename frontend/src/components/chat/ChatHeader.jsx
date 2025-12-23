import { User, ChevronRight } from 'lucide-react'
import './ChatHeader.css'

// iOS style back chevron (matches native iOS back button) - white color
const IosBackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M15 19l-7-7 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Verified badge - Instagram style (starburst shape with blue fill, white checkmark)
const VerifiedBadge = () => (
  <svg className="verified-badge" width="14" height="14" viewBox="0 0 40 40" fill="none">
    <path d="M19.998 3.094L24.19 7.283L29.882 6.155L30.985 11.867L36.906 13.994L34.76 19.998L36.906 26.002L30.985 28.13L29.882 33.842L24.19 32.714L19.998 36.906L15.81 32.714L10.118 33.842L9.015 28.13L3.094 26.002L5.24 19.998L3.094 13.994L9.015 11.867L10.118 6.155L15.81 7.283L19.998 3.094Z" fill="#0095F6"/>
    <path d="M17.5 27L11 20.5L13.5 18L17.5 22L26.5 13L29 15.5L17.5 27Z" fill="white"/>
  </svg>
)

// Flag icon (for reporting/flagging) - Instagram style
const FlagIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 21V4"/>
    <path d="M5 4L19 4L15 9L19 15H5"/>
  </svg>
)

function ChatHeader({ user, onBack, isAccepted = true }) {

  // Not accepted - show minimal header with info icon only
  if (!isAccepted) {
    return (
      <header className="chat-header chat-header-request">
        <div className="chat-header-left">
          <button className="back-btn-ios" onClick={onBack}>
            <IosBackIcon />
          </button>

          <div className="chat-user-info-request">
            <div className="chat-avatar-small">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} />
              ) : (
                <User size={16} />
              )}
            </div>
            <div className="chat-user-names">
              <div className="chat-name-row">
                <span className="chat-fullname">{user.fullName || user.username}</span>
                {user.isVerified && <VerifiedBadge />}
              </div>
              <span className="chat-username-sub">{user.username}</span>
            </div>
            <ChevronRight size={16} className="chevron-icon" />
          </div>
        </div>

        <div className="chat-header-actions">
          <button className="header-action-btn">
            <FlagIcon />
          </button>
        </div>
      </header>
    )
  }

  // Accepted - show same header style with flag icon
  return (
    <header className="chat-header chat-header-request">
      <div className="chat-header-left">
        <button className="back-btn-ios" onClick={onBack}>
          <IosBackIcon />
        </button>

        <div className="chat-user-info-request">
          <div className="chat-avatar-small">
            {user.avatar ? (
              <img src={user.avatar} alt={user.username} />
            ) : (
              <User size={16} />
            )}
          </div>
          <div className="chat-user-names">
            <div className="chat-name-row">
              <span className="chat-fullname">{user.fullName || user.username}</span>
              {user.isVerified && <VerifiedBadge />}
            </div>
            <span className="chat-username-sub">{user.username}</span>
          </div>
          <ChevronRight size={16} className="chevron-icon" />
        </div>
      </div>

      <div className="chat-header-actions">
        <button className="header-action-btn">
          <FlagIcon />
        </button>
      </div>
    </header>
  )
}

export default ChatHeader
