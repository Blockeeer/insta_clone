import { useState, useRef } from 'react'
import './ChatInput.css'

// Camera icon with gradient circle (Instagram style)
const CameraIcon = () => (
  <div className="camera-gradient-circle">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  </div>
)

// Search icon with transparent circle background (centered like camera)
const SearchIcon = () => (
  <div className="search-icon-circle">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  </div>
)

// Voice Clip icon (Instagram style)
const VoiceClipIcon = () => (
  <svg aria-label="Voice Clip" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
    <path d="M19.5 10.671v.897a7.5 7.5 0 0 1-15 0v-.897" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
    <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="12" x2="12" y1="19.068" y2="22"></line>
    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="8.706" x2="15.104" y1="22" y2="22"></line>
    <path d="M12 15.745a4 4 0 0 1-4-4V6a4 4 0 0 1 8 0v5.745a4 4 0 0 1-4 4Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
  </svg>
)

// Add Photo or Video icon (Instagram style)
const AddPhotoIcon = () => (
  <svg aria-label="Add Photo or Video" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
    <path d="M6.549 5.013A1.557 1.557 0 1 0 8.106 6.57a1.557 1.557 0 0 0-1.557-1.557Z" fillRule="evenodd"></path>
    <path d="m2 18.605 3.901-3.9a.908.908 0 0 1 1.284 0l2.807 2.806a.908.908 0 0 0 1.283 0l5.534-5.534a.908.908 0 0 1 1.283 0l3.905 3.905" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
    <path d="M18.44 2.004A3.56 3.56 0 0 1 22 5.564h0v12.873a3.56 3.56 0 0 1-3.56 3.56H5.568a3.56 3.56 0 0 1-3.56-3.56V5.563a3.56 3.56 0 0 1 3.56-3.56Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
  </svg>
)

// GIF or Sticker icon (Instagram style)
const StickerIcon = () => (
  <svg aria-label="Choose a GIF or sticker" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
    <path d="M13.11 22H7.416A5.417 5.417 0 0 1 2 16.583V7.417A5.417 5.417 0 0 1 7.417 2h9.166A5.417 5.417 0 0 1 22 7.417v5.836a2.083 2.083 0 0 1-.626 1.488l-6.808 6.664A2.083 2.083 0 0 1 13.11 22Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
    <circle cx="8.238" cy="9.943" r="1.335"></circle>
    <circle cx="15.762" cy="9.943" r="1.335"></circle>
    <path d="M15.174 15.23a4.887 4.887 0 0 1-6.937-.301" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
    <path d="M22 10.833v1.629a1.25 1.25 0 0 1-1.25 1.25h-1.79a5.417 5.417 0 0 0-5.417 5.417v1.62a1.25 1.25 0 0 1-1.25 1.25H9.897" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
  </svg>
)

// Plus icon in circle (Instagram style)
const PlusCircleIcon = () => (
  <svg aria-label="Load more comments" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
    <circle cx="12.001" cy="12.005" fill="none" r="10.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="7.001" x2="17.001" y1="12.005" y2="12.005"></line>
    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="12.001" x2="12.001" y1="7.005" y2="17.005"></line>
  </svg>
)

// AI Pen with shining star icon (like Instagram)
const AIMagicPenIcon = () => (
  <svg aria-label="AI" height="24" role="img" viewBox="0 0 24 24" width="24" className="ai-magic-icon">
    {/* Pen body - closed box shape, filled white */}
    <path d="M14 6L18 10L9 19L5 19L5 15L14 6Z" fill="#FFFFFF" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".1"/>
    {/* Eraser part - box with more rounded top corners, filled white, moved up-left for gap */}
    <path d="M16 4L16.5 3.5Q17.5 2 18.5 3L20.5 5Q22 6 21 7L20.5 7.5L20 8Z" fill="#FFFFFF" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"/>
    {/* Small 4-point star at bottom right */}
    <path d="M20 15l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5z" fill="#FFFFFF"/>
  </svg>
)

function ChatInput({ onSendMessage, onTyping }) {
  const [message, setMessage] = useState('')
  const inputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage('')
      // Delay keyboard dismiss by 1.5 seconds
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.blur()
        }
      }, 1500)
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

  // Check if message has more than one word (word + space + at least one letter)
  // e.g., "hello w" triggers the AI icon
  const showAiIcon = message.includes(' ') && message.trim().split(/\s+/).length >= 2 && message.trim().split(/\s+/)[1].length > 0

  return (
    <div className="chat-input-container">
      <form className="chat-input-form" onSubmit={handleSubmit}>
        {/* Camera/Search icon with gradient circle on the left */}
        <button type="button" className="input-camera-btn">
          {message.length > 0 ? <SearchIcon /> : <CameraIcon />}
        </button>

        <div className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            placeholder="Message..."
            value={message}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="message-input"
          />
        </div>

        {message.trim() ? (
          <div className="send-actions">
            {showAiIcon && (
              <button type="button" className="ai-magic-btn">
                <AIMagicPenIcon />
              </button>
            )}
            <button type="submit" className="send-btn">
              <div className="send-icon-circle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13.973 20.046 21.77 6.928C22.8 5.195 21.55 3 19.535 3H4.466C2.138 3 .984 5.825 2.646 7.456l4.842 4.752 1.723 7.121c.548 2.266 3.571 2.721 4.762.717Z"/>
                  <line x1="7.488" x2="15.515" y1="12.208" y2="7.641"/>
                </svg>
              </div>
            </button>
          </div>
        ) : (
          <div className="input-actions">
            <button type="button" className="input-action-btn">
              <VoiceClipIcon />
            </button>
            <button type="button" className="input-action-btn">
              <AddPhotoIcon />
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
