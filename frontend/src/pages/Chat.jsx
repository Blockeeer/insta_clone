import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ChatHeader from '../components/chat/ChatHeader'
import MessageList from '../components/chat/MessageList'
import ChatInput from '../components/chat/ChatInput'
import './Chat.css'

// Get active account from localStorage
const getActiveAccount = () => {
  const saved = localStorage.getItem('insta_accounts')
  if (saved) {
    const accounts = JSON.parse(saved)
    return accounts.find(acc => acc.isActive) || null
  }
  return null
}

// Get account by ID
const getAccountById = (id) => {
  const saved = localStorage.getItem('insta_accounts')
  if (saved) {
    const accounts = JSON.parse(saved)
    return accounts.find(acc => acc.id === id) || null
  }
  return null
}

// Get messages between two users from localStorage
const getMessages = (userId1, userId2) => {
  const saved = localStorage.getItem('insta_messages')
  if (saved) {
    const allMessages = JSON.parse(saved)
    // Filter messages between these two users
    return allMessages.filter(msg =>
      (msg.senderId === userId1 && msg.receiverId === userId2) ||
      (msg.senderId === userId2 && msg.receiverId === userId1)
    ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  }
  return []
}

// Save a new message to localStorage
const saveMessage = (message) => {
  const saved = localStorage.getItem('insta_messages')
  const allMessages = saved ? JSON.parse(saved) : []
  allMessages.push(message)
  localStorage.setItem('insta_messages', JSON.stringify(allMessages))
}

// Check if user has an active conversation with another user (accepted)
const hasConversationWith = (currentUserId, otherUserId) => {
  const saved = localStorage.getItem('insta_conversations')
  if (saved) {
    const conversations = JSON.parse(saved)
    return conversations.some(c =>
      c.initiatorId === currentUserId && c.otherUserId === otherUserId
    )
  }
  return false
}

function Chat() {
  const { conversationId } = useParams() // conversationId is the other user's ID
  const navigate = useNavigate()

  const [currentUser, setCurrentUser] = useState(getActiveAccount())
  const [otherUser, setOtherUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [isAccepted, setIsAccepted] = useState(true)

  const messagesEndRef = useRef(null)

  // Load current user and other user
  useEffect(() => {
    const active = getActiveAccount()
    setCurrentUser(active)

    if (conversationId) {
      const other = getAccountById(conversationId)
      setOtherUser(other)

      // Check if this is an accepted conversation
      if (active && other) {
        const accepted = hasConversationWith(active.id, other.id)
        setIsAccepted(accepted)
      }
    }
  }, [conversationId])

  // Load messages when users are set
  useEffect(() => {
    if (currentUser && otherUser) {
      const chatMessages = getMessages(currentUser.id, otherUser.id)
      setMessages(chatMessages)
    }
  }, [currentUser, otherUser])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = (content) => {
    if (!currentUser || !otherUser) return

    const newMessage = {
      id: `m${Date.now()}`,
      content,
      senderId: currentUser.id,
      receiverId: otherUser.id,
      createdAt: new Date().toISOString(),
      isRead: false
    }

    // Save to localStorage
    saveMessage(newMessage)

    // Update state
    setMessages(prev => [...prev, newMessage])
  }

  // Typing indicator removed - only makes sense in real-time chat
  // where the OTHER user's typing status is received from a server
  const handleTyping = () => {
    // No-op: Don't show typing indicator for current user
  }

  // Show loading or redirect if no users
  if (!currentUser) {
    return (
      <div className="chat-page">
        <div className="chat-empty-state">
          <p>Please create an account first</p>
          <button onClick={() => navigate('/manage-accounts')}>Create Account</button>
        </div>
      </div>
    )
  }

  if (!otherUser) {
    return (
      <div className="chat-page">
        <div className="chat-empty-state">
          <p>User not found</p>
          <button onClick={() => navigate('/messages')}>Back to Messages</button>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-page">
      <ChatHeader
        user={otherUser}
        onBack={() => navigate('/messages')}
        isAccepted={isAccepted}
      />

      <MessageList
        messages={messages}
        currentUserId={currentUser.id}
        otherUser={otherUser}
      />

      <div ref={messagesEndRef} />

      <ChatInput
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
      />
    </div>
  )
}

export default Chat
