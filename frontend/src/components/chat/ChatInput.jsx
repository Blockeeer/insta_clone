import { useState } from 'react'
import './ChatInput.css'

// Camera icon with gradient circle (Instagram style)
const CameraIcon = () => (
  <div className="camera-gradient-circle">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  </div>
)

// Microphone icon
const MicIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
)

// Gallery/Image icon
const GalleryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
)

// Sticker/Emoji icon
const StickerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
    <line x1="9" y1="9" x2="9.01" y2="9"/>
    <line x1="15" y1="9" x2="15.01" y2="9"/>
  </svg>
)

// Plus icon in circle
const PlusCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="16"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
)

function ChatInput({ onSendMessage, onTyping }) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleChange = (e) => {
    setMessage(e.target.value)
    if (onTyping) {
      onTyping()
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="chat-input-container">
      <form className="chat-input-form" onSubmit={handleSubmit}>
        {/* Camera icon with gradient circle on the left */}
        <button type="button" className="input-camera-btn">
          <CameraIcon />
        </button>

        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Message..."
            value={message}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="message-input"
          />
        </div>

        {message.trim() ? (
          <button type="submit" className="send-btn">
            <div className="send-icon-circle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13.973 20.046 21.77 6.928C22.8 5.195 21.55 3 19.535 3H4.466C2.138 3 .984 5.825 2.646 7.456l4.842 4.752 1.723 7.121c.548 2.266 3.571 2.721 4.762.717Z"/>
                <line x1="7.488" x2="15.515" y1="12.208" y2="7.641"/>
              </svg>
            </div>
          </button>
        ) : (
          <div className="input-actions">
            <button type="button" className="input-action-btn">
              <MicIcon />
            </button>
            <button type="button" className="input-action-btn">
              <GalleryIcon />
            </button>
            <button type="button" className="input-action-btn">
              <StickerIcon />
            </button>
            <button type="button" className="input-action-btn">
              <PlusCircleIcon />
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

export default ChatInput
