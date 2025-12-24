import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronRight, User, X, Check } from 'lucide-react'
import NoteBubble from '../components/feed/NoteBubble'
import ChatInput from '../components/chat/ChatInput'
import MessageList from '../components/chat/MessageList'
import ChatHeader from '../components/chat/ChatHeader'
import './Messages.css'
import '../pages/Chat.css'

// Camera icon SVG (white color)
const CameraIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
)

// iOS style back chevron (matches native iOS back button) - white color
const IosBackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M15 19l-7-7 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Filter/slider icon (two horizontal lines with circles at edges)
const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    {/* Top slider - circle at left edge */}
    <line x1="4" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="8" cy="7" r="3.5"/>
    {/* Bottom slider - circle at right edge */}
    <line x1="4" y1="17" x2="20" y2="17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="16" cy="17" r="3.5"/>
  </svg>
)

// Instagram eye-off icon (for hidden requests)
const EyeSlashIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.936 8.014A12.792 12.792 0 0 0 .559 11.82a1 1 0 0 0 1.881.677 10.987 10.987 0 0 1 1.988-3.15 1 1 0 1 0-1.492-1.332Zm20.271 13.779-5.916-5.916a4.969 4.969 0 0 0 .133-.582.983.983 0 0 0-1.107-1.108 3.315 3.315 0 0 1-.678.038l-3.366-3.366a3.3 3.3 0 0 1 .036-.676.99.99 0 0 0-1.134-1.107 4.623 4.623 0 0 0-.553.132L8.13 6.717a10.395 10.395 0 0 1 13.429 5.779 1 1 0 0 0 1.881-.677C23.413 11.74 20.542 4 12 4a12.104 12.104 0 0 0-5.367 1.22L2.207.792A1 1 0 0 0 .793 2.207l21 21a1 1 0 0 0 1.414-1.414ZM11.382 14.9l-3.044-3.03a1.005 1.005 0 0 0-1.636.326 5.495 5.495 0 0 0 1.31 6.074 5.495 5.495 0 0 0 6.075 1.31 1.005 1.005 0 0 0 .325-1.636Z" fillRule="evenodd"/>
  </svg>
)

// Flag icon (for reporting/flagging) - Instagram style
const FlagIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 21V4"/>
    <path d="M5 4L19 4L15 9L19 15H5"/>
  </svg>
)

// Horizontal 3 dots (more options) icon
const MoreDotsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="6" cy="12" r="2"/>
    <circle cx="12" cy="12" r="2"/>
    <circle cx="18" cy="12" r="2"/>
  </svg>
)

// Instagram New Message icon
const NewMessageIcon = () => (
  <svg aria-label="New message" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
    <path d="M12.202 3.203H5.25a3 3 0 0 0-3 3V18.75a3 3 0 0 0 3 3h12.547a3 3 0 0 0 3-3v-6.952" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
    <path d="M10.002 17.226H6.774v-3.228L18.607 2.165a1.417 1.417 0 0 1 2.004 0l1.224 1.225a1.417 1.417 0 0 1 0 2.004Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16.848" x2="20.076" y1="3.924" y2="7.153"/>
  </svg>
)

// Verified badge - Instagram style (starburst shape with blue fill, white checkmark)
const VerifiedBadge = () => (
  <svg className="verified-badge" width="18" height="18" viewBox="0 0 40 40" fill="none">
    <path d="M19.998 3.094L24.19 7.283L29.882 6.155L30.985 11.867L36.906 13.994L34.76 19.998L36.906 26.002L30.985 28.13L29.882 33.842L24.19 32.714L19.998 36.906L15.81 32.714L10.118 33.842L9.015 28.13L3.094 26.002L5.24 19.998L3.094 13.994L9.015 11.867L10.118 6.155L15.81 7.283L19.998 3.094Z" fill="#0095F6"/>
    <path d="M17.5 27L11 20.5L13.5 18L17.5 22L26.5 13L29 15.5L17.5 27Z" fill="white"/>
  </svg>
)

// Get active account from localStorage
const getActiveAccount = () => {
  const saved = localStorage.getItem('insta_accounts')
  if (saved) {
    const accounts = JSON.parse(saved)
    const activeAccount = accounts.find(acc => acc.isActive)
    return activeAccount || null
  }
  return null
}

// Get all other accounts (potential chat partners)
const getOtherAccounts = () => {
  const saved = localStorage.getItem('insta_accounts')
  if (saved) {
    const accounts = JSON.parse(saved)
    const activeAccount = accounts.find(acc => acc.isActive)
    if (activeAccount) {
      return accounts.filter(acc => acc.id !== activeAccount.id)
    }
  }
  return []
}

// Get conversations from localStorage
const getConversations = () => {
  const saved = localStorage.getItem('insta_conversations')
  if (saved) {
    return JSON.parse(saved)
  }
  return []
}

// Save conversations to localStorage
const saveConversations = (conversations) => {
  localStorage.setItem('insta_conversations', JSON.stringify(conversations))
}

// Get message requests (messages from users not in accepted conversations)
const getMessageRequests = () => {
  const saved = localStorage.getItem('insta_message_requests')
  if (saved) {
    return JSON.parse(saved)
  }
  return []
}

// Save message requests to localStorage
const saveMessageRequests = (requests) => {
  localStorage.setItem('insta_message_requests', JSON.stringify(requests))
}

// Add a new conversation
// initiatorId is the user who started the conversation
// Only the initiator sees this as an active conversation initially
const addConversation = (initiatorId, otherUserId) => {
  const conversations = getConversations()
  // Check if conversation already exists for this initiator
  const exists = conversations.some(c =>
    c.initiatorId === initiatorId && c.otherUserId === otherUserId
  )
  if (!exists) {
    conversations.push({
      id: `conv_${Date.now()}`,
      initiatorId,
      otherUserId,
      participants: [initiatorId, otherUserId],
      createdAt: new Date().toISOString()
    })
    saveConversations(conversations)
  }
  return conversations
}

// Add a message request (when other user messages first)
const addMessageRequest = (fromUserId, toUserId, message) => {
  const requests = getMessageRequests()
  // Check if request already exists
  const existingRequest = requests.find(r => r.fromUserId === fromUserId && r.toUserId === toUserId)
  if (!existingRequest) {
    requests.push({
      id: `req_${Date.now()}`,
      fromUserId,
      toUserId,
      message,
      createdAt: new Date().toISOString(),
      status: 'pending', // pending, accepted, blocked, deleted
      isRead: false // track if request has been viewed
    })
    saveMessageRequests(requests)
  }
  return requests
}

// Mark a message request as read
const markRequestAsRead = (requestId) => {
  const requests = getMessageRequests()
  const updatedRequests = requests.map(r => {
    if (r.id === requestId) {
      return { ...r, isRead: true }
    }
    return r
  })
  saveMessageRequests(updatedRequests)
  return updatedRequests
}

// Accept a message request
const acceptMessageRequest = (requestId) => {
  const requests = getMessageRequests()
  const request = requests.find(r => r.id === requestId)
  if (request) {
    // Add to conversations
    addConversation(request.toUserId, request.fromUserId)
    // Remove from requests
    const updatedRequests = requests.filter(r => r.id !== requestId)
    saveMessageRequests(updatedRequests)
    return updatedRequests
  }
  return requests
}

// Delete a message request
const deleteMessageRequest = (requestId) => {
  const requests = getMessageRequests()
  const updatedRequests = requests.filter(r => r.id !== requestId)
  saveMessageRequests(updatedRequests)
  return updatedRequests
}

// Block a message request (and user)
const blockMessageRequest = (requestId) => {
  const requests = getMessageRequests()
  const request = requests.find(r => r.id === requestId)
  if (request) {
    // Add to blocked users list
    const blockedUsers = JSON.parse(localStorage.getItem('insta_blocked_users') || '[]')
    if (!blockedUsers.includes(request.fromUserId)) {
      blockedUsers.push(request.fromUserId)
      localStorage.setItem('insta_blocked_users', JSON.stringify(blockedUsers))
    }
    // Remove from requests
    const updatedRequests = requests.filter(r => r.id !== requestId)
    saveMessageRequests(updatedRequests)
    return updatedRequests
  }
  return requests
}

// Check if user has an active conversation with another user
// User has a conversation if:
// 1. They initiated the conversation (they are the initiator)
// 2. They accepted a request (which creates a conversation where they are the initiator)
const hasConversationWith = (currentUserId, otherUserId) => {
  const conversations = getConversations()
  return conversations.some(c =>
    c.initiatorId === currentUserId && c.otherUserId === otherUserId
  )
}

// Get last message between two users
const getLastMessage = (userId1, userId2) => {
  const saved = localStorage.getItem('insta_messages')
  if (saved) {
    const allMessages = JSON.parse(saved)
    const conversationMessages = allMessages.filter(msg =>
      (msg.senderId === userId1 && msg.receiverId === userId2) ||
      (msg.senderId === userId2 && msg.receiverId === userId1)
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    return conversationMessages[0] || null
  }
  return null
}

// Get unread count for a conversation
const getUnreadCount = (currentUserId, otherUserId) => {
  const saved = localStorage.getItem('insta_messages')
  if (saved) {
    const allMessages = JSON.parse(saved)
    return allMessages.filter(msg =>
      msg.senderId === otherUserId &&
      msg.receiverId === currentUserId &&
      !msg.isRead
    ).length
  }
  return 0
}

// Format relative time
const formatTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'now'
  if (diffMins < 60) return `${diffMins}m`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}d`
  return `${Math.floor(diffDays / 7)}w`
}

// Format time for request detail view (e.g., "MON 6:31PM")
const formatRequestTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const dayName = days[date.getDay()]
  let hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12 // 0 should be 12
  return `${dayName} ${hours}:${minutes}${ampm}`
}

// Format count (e.g., 25000000 -> "25M", 1500 -> "1.5K")
const formatCount = (count) => {
  if (!count) return '0'
  if (count >= 1000000) return `${(count / 1000000).toFixed(count % 1000000 === 0 ? 0 : 1)}M`
  if (count >= 1000) return `${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 1)}K`
  return count.toString()
}

// Get notes from localStorage
const getNotes = () => {
  const saved = localStorage.getItem('insta_notes')
  if (saved) {
    const notes = JSON.parse(saved)
    const now = new Date()
    // Filter out expired notes (24 hours)
    return notes.filter(n => new Date(n.expiresAt) > now)
  }
  return []
}

// Save a note to localStorage
const saveNote = (accountId, noteText) => {
  const notes = getNotes()
  // Remove existing note for this account
  const filteredNotes = notes.filter(n => n.accountId !== accountId)
  // Add new note
  if (noteText.trim()) {
    filteredNotes.push({
      accountId,
      noteText: noteText.trim(),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    })
  }
  localStorage.setItem('insta_notes', JSON.stringify(filteredNotes))
  return filteredNotes
}

// Get note for a specific account
const getNoteForAccount = (accountId) => {
  const notes = getNotes()
  return notes.find(n => n.accountId === accountId)
}


// Get/Set active message tab from localStorage
const getActiveMessageTab = () => {
  return localStorage.getItem('insta_message_tab') || 'primary'
}

const setActiveMessageTabStorage = (tab) => {
  localStorage.setItem('insta_message_tab', tab)
}

// Seed sample users for message requests (only runs once)
const seedSampleRequestUsers = () => {
  const seeded = localStorage.getItem('insta_request_users_seeded')
  if (seeded) return

  const activeAccount = getActiveAccount()
  if (!activeAccount) return

  const sampleUsers = [
    {
      id: 'sample_user_1',
      username: 'sydney_sweeney',
      fullName: 'Sydney Sweeney',
      avatar: null,
      isVerified: true,
      followersCount: 25000000,
      postsCount: 566,
      isActive: false
    },
    {
      id: 'sample_user_2',
      username: 'real_person',
      fullName: 'REAL PERSON',
      avatar: null,
      isVerified: false,
      followersCount: 150000,
      postsCount: 89,
      isActive: false
    },
    {
      id: 'sample_user_3',
      username: 'skullysally',
      fullName: 'Skully Sally',
      avatar: null,
      isVerified: false,
      followersCount: 45000,
      postsCount: 234,
      isActive: false
    },
    {
      id: 'sample_user_4',
      username: 'aaralyn_foxx',
      fullName: 'Aaralyn Foxx',
      avatar: null,
      isVerified: true,
      followersCount: 890000,
      postsCount: 412,
      isActive: false
    },
    {
      id: 'sample_user_5',
      username: 'magi_music',
      fullName: 'Magi',
      avatar: null,
      isVerified: false,
      followersCount: 12000,
      postsCount: 67,
      isActive: false
    }
  ]

  // Add sample users to accounts
  const saved = localStorage.getItem('insta_accounts')
  const accounts = saved ? JSON.parse(saved) : []

  sampleUsers.forEach(user => {
    if (!accounts.find(acc => acc.id === user.id)) {
      accounts.push(user)
    }
  })
  localStorage.setItem('insta_accounts', JSON.stringify(accounts))

  // Create message requests from these users to the active account
  const sampleMessages = [
    'Omg you described me as your type',
    'Hey! Love your content 💕',
    'Hi there! Can we chat?',
    'Your photos are amazing!',
    'Would love to collaborate sometime'
  ]

  const requests = getMessageRequests()
  sampleUsers.forEach((user, index) => {
    if (!requests.find(r => r.fromUserId === user.id && r.toUserId === activeAccount.id)) {
      requests.push({
        id: `req_sample_${index}`,
        fromUserId: user.id,
        toUserId: activeAccount.id,
        message: sampleMessages[index],
        createdAt: new Date(Date.now() - (index * 60 * 60 * 1000)).toISOString(), // stagger times
        status: 'pending',
        isRead: false
      })
    }
  })
  saveMessageRequests(requests)

  localStorage.setItem('insta_request_users_seeded', 'true')
}

function Messages() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(getActiveAccount())
  const [otherAccounts, setOtherAccounts] = useState([])
  const [notes, setNotes] = useState(getNotes())
  const [messageRequests, setMessageRequests] = useState([])
  const [showNoteEditModal, setShowNoteEditModal] = useState(false)
  const [showNewMessageModal, setShowNewMessageModal] = useState(false)
  const [showRequestsView, setShowRequestsView] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [editingNoteAccount, setEditingNoteAccount] = useState(null)
  const [noteText, setNoteText] = useState('')
  const [newMessageText, setNewMessageText] = useState('')
  const [selectedUserForChat, setSelectedUserForChat] = useState(null)
  const [showMoveMessageModal, setShowMoveMessageModal] = useState(false)
  const [acceptedRequestUser, setAcceptedRequestUser] = useState(null)
  const [activeTab, setActiveTab] = useState(getActiveMessageTab())
  const [isRequestAccepted, setIsRequestAccepted] = useState(false)
  const [acceptedChatMessages, setAcceptedChatMessages] = useState([]) // Messages for accepted request chat
  const messagesEndRef = useRef(null)
  // Animation states
  const [warningAnimating, setWarningAnimating] = useState(false) // warning sliding down
  const [modalAnimating, setModalAnimating] = useState(false) // modal sliding up
  const [modalClosing, setModalClosing] = useState(false) // modal closing animation
  const [showWarningBehindModal, setShowWarningBehindModal] = useState(false) // show warning behind modal
  const [warningExiting, setWarningExiting] = useState(false) // warning exiting after accept
  const [chatInputEntering, setChatInputEntering] = useState(false) // chat input sliding in

  // Handle tab change and persist to localStorage
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setActiveMessageTabStorage(tab)
    if (tab === 'requests') {
      setShowRequestsView(true)
      setSelectedRequest(null)
    } else {
      setShowRequestsView(false)
      setSelectedRequest(null)
    }
  }

  const refreshData = () => {
    const user = getActiveAccount()
    setCurrentUser(user)
    setOtherAccounts(getOtherAccounts())
    setNotes(getNotes())

    // Get requests for current user
    if (user) {
      const allRequests = getMessageRequests()
      setMessageRequests(allRequests.filter(r => r.toUserId === user.id && r.status === 'pending'))
    }
  }

  useEffect(() => {
    // Seed sample users for requests on first load
    seedSampleRequestUsers()
    refreshData()
  }, [])

  // Refresh when account is switched from the header dropdown
  useEffect(() => {
    const handleAccountChanged = () => {
      refreshData()
    }

    window.addEventListener('accountChanged', handleAccountChanged)

    return () => {
      window.removeEventListener('accountChanged', handleAccountChanged)
    }
  }, [])

  const handleConversationClick = (accountId) => {
    navigate(`/chat/${accountId}`)
  }

  // Click on "Your note" - opens edit modal directly for current user
  const handleYourNoteClick = () => {
    if (currentUser) {
      setEditingNoteAccount(currentUser)
      const existingNote = getNoteForAccount(currentUser.id)
      setNoteText(existingNote?.noteText || '')
      setShowNoteEditModal(true)
    }
  }

  // Click on a user's note bubble - opens edit modal for that user
  const handleNoteClick = (account) => {
    setEditingNoteAccount(account)
    const existingNote = getNoteForAccount(account.id)
    setNoteText(existingNote?.noteText || '')
    setShowNoteEditModal(true)
  }

  const handleSaveNote = () => {
    if (editingNoteAccount) {
      const updatedNotes = saveNote(editingNoteAccount.id, noteText)
      setNotes(updatedNotes)
    }
    setShowNoteEditModal(false)
    setEditingNoteAccount(null)
    setNoteText('')
  }

  const handleDeleteNote = () => {
    if (editingNoteAccount) {
      const updatedNotes = saveNote(editingNoteAccount.id, '')
      setNotes(updatedNotes)
    }
    setShowNoteEditModal(false)
    setEditingNoteAccount(null)
    setNoteText('')
  }

  const handleCloseNoteEditModal = () => {
    setShowNoteEditModal(false)
    setEditingNoteAccount(null)
    setNoteText('')
  }


  // New Message Modal handlers
  const handleNewMessageClick = () => {
    setShowNewMessageModal(true)
    setSelectedUserForChat(null)
    setNewMessageText('')
  }

  const handleSelectUserForChat = (account) => {
    setSelectedUserForChat(account)
  }

  const handleSendFirstMessage = () => {
    if (selectedUserForChat && newMessageText.trim() && currentUser) {
      // Check if there's already a conversation between these users
      const existingConversation = hasConversationWith(currentUser.id, selectedUserForChat.id)

      if (existingConversation) {
        // Already have a conversation, just add the message
        const messages = JSON.parse(localStorage.getItem('insta_messages') || '[]')
        messages.push({
          id: `msg_${Date.now()}`,
          senderId: currentUser.id,
          receiverId: selectedUserForChat.id,
          content: newMessageText.trim(),
          createdAt: new Date().toISOString(),
          isRead: false
        })
        localStorage.setItem('insta_messages', JSON.stringify(messages))
      } else {
        // No existing conversation - create conversation for sender only
        // The receiver will see this as a message request
        addConversation(currentUser.id, selectedUserForChat.id)

        // Save the message
        const messages = JSON.parse(localStorage.getItem('insta_messages') || '[]')
        messages.push({
          id: `msg_${Date.now()}`,
          senderId: currentUser.id,
          receiverId: selectedUserForChat.id,
          content: newMessageText.trim(),
          createdAt: new Date().toISOString(),
          isRead: false
        })
        localStorage.setItem('insta_messages', JSON.stringify(messages))

        // Create a message request for the recipient
        addMessageRequest(currentUser.id, selectedUserForChat.id, newMessageText.trim())
      }

      // Close modal and navigate to chat
      setShowNewMessageModal(false)
      setSelectedUserForChat(null)
      setNewMessageText('')
      refreshData()
      navigate(`/chat/${selectedUserForChat.id}`)
    }
  }

  const handleCloseNewMessageModal = () => {
    setShowNewMessageModal(false)
    setSelectedUserForChat(null)
    setNewMessageText('')
  }

  // Message Request handlers
  const handleAcceptRequest = () => {
    if (selectedRequest) {
      const requestAccount = getAccountById(selectedRequest.fromUserId)
      // Don't accept yet - just show the modal to choose category
      // The actual acceptance happens when user selects Primary or General
      setAcceptedRequestUser(requestAccount)

      // Step 1: Animate warning + buttons down
      setWarningAnimating(true)

      // Step 2: After warning slides down, show modal sliding up
      setTimeout(() => {
        setModalAnimating(true)
        setShowMoveMessageModal(true)

        // Reset modal animating after it slides up
        setTimeout(() => {
          setModalAnimating(false)
        }, 300)

        // Step 3: After modal fully shows (0.3s slide + 0.2s buffer), show warning behind the modal
        setTimeout(() => {
          setShowWarningBehindModal(true)
        }, 500) // Wait for modal to fully appear before showing warning behind
      }, 300) // Wait for warning slide-down to complete
    }
  }

  const handleMoveToCategory = (category) => {
    // Now actually accept the request when user chooses a category
    if (selectedRequest) {
      const updatedRequests = acceptMessageRequest(selectedRequest.id)
      setMessageRequests(updatedRequests.filter(r => r.toUserId === currentUser?.id && r.status === 'pending'))
      refreshData()

      // Load the initial message from the request as the first message in chat
      const reqAccount = otherAccounts.find(acc => acc.id === selectedRequest.fromUserId)
      if (reqAccount) {
        const initialMessage = {
          id: `m_req_${selectedRequest.id}`,
          content: selectedRequest.message,
          senderId: selectedRequest.fromUserId,
          receiverId: currentUser?.id,
          createdAt: selectedRequest.createdAt,
          isRead: true
        }

        // Also save to localStorage so it appears in the full chat
        const existingMessages = JSON.parse(localStorage.getItem('insta_messages') || '[]')
        const messageExists = existingMessages.some(m => m.id === initialMessage.id)
        if (!messageExists) {
          existingMessages.push(initialMessage)
          localStorage.setItem('insta_messages', JSON.stringify(existingMessages))
        }

        setAcceptedChatMessages([initialMessage])
      }
    }

    // Step 1: Animate modal closing (slide down + fade)
    setModalClosing(true)

    setTimeout(() => {
      setShowMoveMessageModal(false)
      setModalClosing(false)

      // Step 2: Show warning back (reset slide-down), visible for 0.5s, then exit
      setWarningAnimating(false) // Reset to show warning
      setShowWarningBehindModal(true) // Mark that warning should be visible

      setTimeout(() => {
        // Start warning exit animation
        setWarningExiting(true)

        // Chat input appears at 50% of warning animation (0.2s into 0.4s animation)
        setTimeout(() => {
          setChatInputEntering(true)
        }, 200) // Start chat input at 50% of warning animation

        // Step 3: After animations complete, set final state
        setTimeout(() => {
          setShowWarningBehindModal(false)
          setWarningExiting(false)
          setChatInputEntering(false)
          setIsRequestAccepted(true)
        }, 600) // Wait for both animations to complete (0.4s warning + 0.4s chat input overlap)
      }, 500) // Warning visible for 0.5s
    }, 300) // Modal close animation duration
  }

  const handleCancelMoveModal = () => {
    // Step 1: Animate modal closing
    setModalClosing(true)

    setTimeout(() => {
      setShowMoveMessageModal(false)
      setModalClosing(false)
      setAcceptedRequestUser(null)
      // Reset animation states - warning shows instantly back to normal
      setWarningAnimating(false)
      setShowWarningBehindModal(false)
    }, 300) // Modal close animation duration
  }

  // Handle sending message in accepted chat
  const handleSendAcceptedMessage = (messageText) => {
    if (!messageText || !currentUser || !requestAccount) return

    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      receiverId: requestAccount.id,
      content: messageText,
      createdAt: new Date().toISOString(),
      isRead: false
    }

    // Save the message to localStorage
    const messages = JSON.parse(localStorage.getItem('insta_messages') || '[]')
    messages.push(newMessage)
    localStorage.setItem('insta_messages', JSON.stringify(messages))

    // Add to local state to show in the chat
    setAcceptedChatMessages(prev => [...prev, newMessage])

    // Scroll to bottom after message is added
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  // Handle back button in request detail - reset accepted state
  const handleRequestDetailBack = () => {
    setSelectedRequest(null)
    setShowRequestsView(false)
    setIsRequestAccepted(false)
    setAcceptedRequestUser(null)
    setShowMoveMessageModal(false)
    setAcceptedChatMessages([]) // Reset messages
    // Reset all animation states
    setWarningAnimating(false)
    setModalAnimating(false)
    setModalClosing(false)
    setShowWarningBehindModal(false)
    setWarningExiting(false)
    setChatInputEntering(false)
  }

  const handleDeleteRequest = () => {
    if (selectedRequest) {
      const updatedRequests = deleteMessageRequest(selectedRequest.id)
      setMessageRequests(updatedRequests.filter(r => r.toUserId === currentUser?.id && r.status === 'pending'))
      setSelectedRequest(null)
    }
  }

  const handleBlockRequest = () => {
    if (selectedRequest) {
      const updatedRequests = blockMessageRequest(selectedRequest.id)
      setMessageRequests(updatedRequests.filter(r => r.toUserId === currentUser?.id && r.status === 'pending'))
      setSelectedRequest(null)
    }
  }

  // Get all accounts (including current user) for the selection modal
  const allAccounts = [currentUser, ...otherAccounts].filter(Boolean)

  // Get accounts that have notes (to display in the notes scroll)
  const accountsWithNotes = allAccounts.filter(acc =>
    notes.some(n => n.accountId === acc?.id)
  )

  // Get users that current user has a conversation with
  const usersWithConversations = otherAccounts.filter(account =>
    currentUser && hasConversationWith(currentUser.id, account.id)
  )

  // Build conversations list from users with conversations
  const conversationsList = usersWithConversations.map(account => {
    const lastMessage = currentUser ? getLastMessage(currentUser.id, account.id) : null
    const unreadCount = currentUser ? getUnreadCount(currentUser.id, account.id) : 0

    return {
      id: account.id,
      participant: {
        id: account.id,
        username: account.username,
        fullName: account.fullName,
        avatar: account.avatar,
        isVerified: account.isVerified
      },
      lastMessage: lastMessage ? {
        content: lastMessage.content,
        time: formatTime(lastMessage.createdAt),
        timestamp: new Date(lastMessage.createdAt).getTime(),
        isMine: lastMessage.senderId === currentUser?.id
      } : null,
      unreadCount,
      hasActiveStory: false
    }
  }).sort((a, b) => {
    // Sort by most recent message (newest first)
    const timeA = a.lastMessage?.timestamp || 0
    const timeB = b.lastMessage?.timestamp || 0
    return timeB - timeA
  })

  // Get account info for a request
  const getAccountById = (id) => {
    return otherAccounts.find(acc => acc.id === id) || null
  }

  // Get request account for the overlay
  const requestAccount = selectedRequest ? getAccountById(selectedRequest.fromUserId) : null

  return (
    <div className="messages-page-container">
      {/* Main Messages Page - always rendered */}
      <div className="messages-page">
      {/* Header */}
      <div className="messages-header">
        <div className="messages-header-left">
          <button className="back-btn-ios" onClick={() => navigate('/')}>
            <IosBackIcon />
          </button>
          <button className="username-dropdown">
            <span className="header-username">{currentUser?.username || 'Guest'}</span>
            {currentUser?.isVerified && <VerifiedBadge />}
            <ChevronDown size={18} />
          </button>
        </div>
        <div className="messages-header-right">
          <button className="more-options-btn">
            <MoreDotsIcon />
          </button>
          <button className="new-message-btn" onClick={handleNewMessageClick}>
            <NewMessageIcon />
          </button>
        </div>
      </div>

      {/* Meta AI Search Bar */}
      <div className="meta-search-section">
        <div className="meta-search-bar">
          <div className="meta-ai-icon">
            <div className="meta-ai-circle"></div>
          </div>
          <span className="meta-search-text">Ask Meta AI or Search</span>
          <div className="meta-mic-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              {/* Left bar - shorter */}
              <rect x="3" y="7" width="3" height="10" rx="1.5"/>
              {/* Middle bar - tallest */}
              <rect x="10.5" y="3" width="3" height="18" rx="1.5"/>
              {/* Right bar - same as left (shorter) */}
              <rect x="18" y="7" width="3" height="10" rx="1.5"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="notes-section">
        <div className="notes-scroll">
          {/* "Your note" - click to open edit modal for current user */}
          {(() => {
            const currentUserNote = currentUser ? getNoteForAccount(currentUser.id) : null
            return (
              <button className="note-item" onClick={handleYourNoteClick}>
                <div className="note-avatar-container">
                  <NoteBubble text={currentUserNote?.noteText || "Note..."} isEmpty={!currentUserNote} />
                  <div className="note-avatar">
                    {currentUser?.avatar ? (
                      <img src={currentUser.avatar} alt="Your note" />
                    ) : (
                      <User size={32} />
                    )}
                  </div>
                </div>
                <span className="note-label">Your note</span>
              </button>
            )
          })()}
          {/* Show only OTHER accounts that have notes (exclude current user) */}
          {accountsWithNotes
            .filter(account => account.id !== currentUser?.id)
            .map((account) => {
              const accountNote = notes.find(n => n.accountId === account.id)
              return (
                <button key={account.id} className="note-item" onClick={() => handleNoteClick(account)}>
                  <div className="note-avatar-container">
                    <NoteBubble text={accountNote?.noteText || ''} />
                    <div className="note-avatar">
                      {account.avatar ? (
                        <img src={account.avatar} alt={account.username} />
                      ) : (
                        <User size={32} />
                      )}
                    </div>
                  </div>
                  <span className="note-label">{account.username}</span>
                </button>
              )
            })}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="message-filter-tabs">
        <button className="filter-icon-btn">
          <FilterIcon />
          <ChevronDown size={14} />
        </button>
        <button
          className={`filter-tab ${activeTab === 'primary' ? 'active' : ''}`}
          onClick={() => handleTabChange('primary')}
        >
          <span className="tab-dot-container">
            <span className="tab-red-dot"></span>
          </span>
          Primary
          <span className="tab-count">8</span>
        </button>
        <button
          className={`filter-tab ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => handleTabChange('requests')}
        >
          <span className="tab-dot-container">
            {messageRequests.length > 0 && <span className="tab-red-dot"></span>}
          </span>
          Requests
          {messageRequests.length > 0 && <span className="tab-count">{messageRequests.length}</span>}
        </button>
        <button
          className={`filter-tab ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => handleTabChange('general')}
        >
          <span className="tab-dot-container">
            <span className="tab-red-dot"></span>
          </span>
          General
          <span className="tab-count">11</span>
        </button>
      </div>

      {/* Requests Tab Content */}
      {activeTab === 'requests' && (
        <div className="requests-tab-content">
          {/* Hidden requests link */}
          <button className="hidden-requests-btn">
            <EyeSlashIcon />
            <span>Hidden requests</span>
            <ChevronRight size={20} />
          </button>

          {/* Requests list */}
          <div className="requests-list-inline">
            {messageRequests.length === 0 ? (
              <div className="empty-requests">
                <p>No message requests</p>
              </div>
            ) : (
              [...messageRequests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(request => {
                const account = otherAccounts.find(acc => acc.id === request.fromUserId)
                if (!account) return null
                return (
                  <button
                    key={request.id}
                    className={`request-item ${!request.isRead ? 'unread' : ''}`}
                    onClick={() => {
                      // Mark as read when clicking
                      if (!request.isRead) {
                        const updatedRequests = markRequestAsRead(request.id)
                        setMessageRequests(updatedRequests.filter(r => r.toUserId === currentUser?.id && r.status === 'pending'))
                      }
                      setSelectedRequest(request)
                      setShowRequestsView(true)
                    }}
                  >
                    <div className="request-avatar">
                      {account.avatar ? (
                        <img src={account.avatar} alt={account.username} />
                      ) : (
                        <User size={24} />
                      )}
                    </div>
                    <div className="request-info">
                      <span className={`request-name ${!request.isRead ? 'unread' : ''}`}>{account.username}</span>
                      <span className="request-preview">
                        {request.message}
                        <span className="request-time-inline"> · {formatTime(request.createdAt)}</span>
                      </span>
                    </div>
                    {!request.isRead && <div className="request-unread-dot"></div>}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* Conversation List - Primary/General tabs */}
      {(activeTab === 'primary' || activeTab === 'general') && (
      <div className="conversation-list">
        {conversationsList.length === 0 ? (
          <div className="empty-conversations">
            <p>No conversations yet</p>
            <p className="empty-hint">Tap the edit button to start a new conversation!</p>
          </div>
        ) : (
          conversationsList.map((conversation) => {
            const participant = conversation.participant
            const lastMessage = conversation.lastMessage

            return (
              <button
                key={conversation.id}
                className="conversation-item"
                onClick={() => handleConversationClick(conversation.id)}
              >
                <div className="conversation-avatar-wrapper">
                  <div className={`conversation-avatar ${conversation.hasActiveStory ? 'has-story' : ''}`}>
                    {participant.avatar ? (
                      <img src={participant.avatar} alt={participant.username} />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                </div>

                <div className="conversation-content">
                  <div className="conversation-name-row">
                    <span className={`conversation-name ${conversation.unreadCount > 0 ? 'unread' : ''}`}>
                      {participant.username}
                    </span>
                    {participant.isVerified && <VerifiedBadge />}
                  </div>
                  <div className="conversation-preview-row">
                    {lastMessage ? (
                      <span className="message-preview">
                        {lastMessage.isMine && 'You: '}{lastMessage.content}
                        {lastMessage.time && <span className="message-time"> · {lastMessage.time}</span>}
                      </span>
                    ) : (
                      <span className="message-preview no-messages">Start a conversation</span>
                    )}
                  </div>
                </div>

                <div className="conversation-actions">
                  {conversation.unreadCount > 0 && (
                    <div className="unread-dot"></div>
                  )}
                  <CameraIcon />
                </div>
              </button>
            )
          })
        )}
      </div>
      )}

      {/* Note Edit Modal - for editing a specific user's note */}
      {showNoteEditModal && editingNoteAccount && (
        <div className="note-modal-overlay" onClick={handleCloseNoteEditModal}>
          <div className="note-modal" onClick={e => e.stopPropagation()}>
            <div className="note-modal-header">
              <h3>{editingNoteAccount.id === currentUser?.id ? 'Your note' : `${editingNoteAccount.username}'s note`}</h3>
              <button type="button" className="note-modal-close" onClick={handleCloseNoteEditModal}>
                <X size={24} />
              </button>
            </div>
            <div className="note-modal-content">
              <div className="note-modal-avatar">
                {editingNoteAccount.avatar ? (
                  <img src={editingNoteAccount.avatar} alt={editingNoteAccount.username} />
                ) : (
                  <User size={40} />
                )}
              </div>
              <textarea
                className="note-modal-input"
                placeholder="Share a thought..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value.slice(0, 60))}
                maxLength={60}
                rows={2}
              />
              <span className="note-char-count">{noteText.length}/60</span>
            </div>
            <div className="note-modal-actions">
              {getNoteForAccount(editingNoteAccount.id) && (
                <button type="button" className="note-delete-btn" onClick={handleDeleteNote}>
                  Delete
                </button>
              )}
              <button
                type="button"
                className="note-save-btn"
                onClick={handleSaveNote}
                disabled={!noteText.trim()}
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="note-modal-overlay" onClick={handleCloseNewMessageModal}>
          <div className="new-message-modal" onClick={e => e.stopPropagation()}>
            <div className="note-modal-header">
              <button type="button" className="note-modal-close" onClick={handleCloseNewMessageModal}>
                <X size={24} />
              </button>
              <h3>New message</h3>
              <div style={{ width: 24 }}></div>
            </div>

            {!selectedUserForChat ? (
              // User selection list
              <div className="new-message-user-list">
                <p className="new-message-subtitle">Suggested</p>
                {otherAccounts.length === 0 ? (
                  <div className="empty-users">
                    <p>No other accounts available</p>
                    <button className="create-account-btn" onClick={() => navigate('/manage-accounts')}>
                      Create Account
                    </button>
                  </div>
                ) : (
                  otherAccounts.map(account => {
                    const hasConversation = currentUser && hasConversationWith(currentUser.id, account.id)
                    return (
                      <button
                        key={account.id}
                        type="button"
                        className="new-message-user-item"
                        onClick={() => handleSelectUserForChat(account)}
                      >
                        <div className="new-message-user-avatar">
                          {account.avatar ? (
                            <img src={account.avatar} alt={account.username} />
                          ) : (
                            <User size={24} />
                          )}
                        </div>
                        <div className="new-message-user-info">
                          <span className="new-message-user-name">{account.username}</span>
                          {account.fullName && <span className="new-message-user-fullname">{account.fullName}</span>}
                        </div>
                        {hasConversation && (
                          <span className="has-conversation-badge">
                            <Check size={16} />
                          </span>
                        )}
                      </button>
                    )
                  })
                )}
              </div>
            ) : (
              // Chat input view
              <div className="new-message-chat-view">
                <div className="selected-user-header">
                  <div className="selected-user-avatar">
                    {selectedUserForChat.avatar ? (
                      <img src={selectedUserForChat.avatar} alt={selectedUserForChat.username} />
                    ) : (
                      <User size={32} />
                    )}
                  </div>
                  <div className="selected-user-info">
                    <span className="selected-user-name">{selectedUserForChat.username}</span>
                    {selectedUserForChat.fullName && (
                      <span className="selected-user-fullname">{selectedUserForChat.fullName}</span>
                    )}
                  </div>
                  <button className="change-user-btn" onClick={() => setSelectedUserForChat(null)}>
                    Change
                  </button>
                </div>
                <div className="new-message-input-section">
                  <textarea
                    className="new-message-input"
                    placeholder="Write a message..."
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    rows={3}
                    autoFocus
                  />
                  <button
                    className="send-first-message-btn"
                    onClick={handleSendFirstMessage}
                    disabled={!newMessageText.trim()}
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Move Messages Modal - appears after accepting a request */}
      {showMoveMessageModal && acceptedRequestUser && (
        <div className={`move-message-modal-overlay ${modalClosing ? 'fading-out' : ''}`}>
          <div className={`move-message-modal ${modalAnimating ? 'slide-up' : ''} ${modalClosing ? 'slide-down-fade' : ''}`}>
            <div className="move-message-content">
              <p className="move-message-title">
                Move messages from {acceptedRequestUser.username} into:
              </p>
              <button
                className="move-option-btn primary"
                onClick={() => handleMoveToCategory('primary')}
              >
                Primary
              </button>
              <button
                className="move-option-btn general"
                onClick={() => handleMoveToCategory('general')}
              >
                General
              </button>
            </div>
            <button
              className="move-cancel-btn"
              onClick={handleCancelMoveModal}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      </div>

      {/* Request Detail Overlay - slides in from right when a request is selected */}
      {showRequestsView && selectedRequest && requestAccount && (
        <div className="request-detail-overlay">
          {/* Show full chat page when accepted, otherwise show request detail */}
          {isRequestAccepted ? (
            <div className="chat-page request-detail-slide">
              <ChatHeader
                user={requestAccount}
                onBack={handleRequestDetailBack}
                isAccepted={true}
              />

              <MessageList
                messages={acceptedChatMessages}
                currentUserId={currentUser?.id}
                otherUser={requestAccount}
              />

              <div ref={messagesEndRef} />

              <ChatInput
                onSendMessage={handleSendAcceptedMessage}
              />
            </div>
          ) : (
            <div className="messages-page request-detail-slide">
              {/* Header with iOS back button - compact style with avatar */}
              <div className="messages-header request-detail-header">
                <div className="request-header-left">
                  <button className="back-btn-ios" onClick={handleRequestDetailBack}>
                    <IosBackIcon />
                  </button>

                  <div className="request-header-user-info">
                    <div className="request-header-avatar">
                      {requestAccount.avatar ? (
                        <img src={requestAccount.avatar} alt={requestAccount.username} />
                      ) : (
                        <User size={16} />
                      )}
                    </div>
                    <span className="request-header-username">
                      {requestAccount.username}
                      {requestAccount.isVerified && <VerifiedBadge />}
                    </span>
                    <ChevronRight size={16} className="request-header-chevron" />
                  </div>
                </div>
                {/* Always show flag icon */}
                <button className="request-header-flag-btn">
                  <FlagIcon />
                </button>
              </div>

              <div className="request-detail-view">
                <div className="request-profile-section">
                  <div className="request-avatar-large">
                    {requestAccount.avatar ? (
                      <img src={requestAccount.avatar} alt={requestAccount.username} />
                    ) : (
                      <User size={64} />
                    )}
                  </div>
                  <h2 className="request-fullname">
                    {requestAccount.fullName || requestAccount.username}
                    {requestAccount.isVerified && <VerifiedBadge />}
                  </h2>
                  <p className="request-username">
                    {requestAccount.username}
                  </p>
                  <p className="request-stats">
                    {formatCount(requestAccount.followersCount)} followers · {formatCount(requestAccount.postsCount)} posts
                  </p>
                  <p className="request-follow-info">
                    You've followed this Instagram account since 2025
                  </p>
                  <button className="view-profile-btn">View profile</button>
                </div>

                <div className="request-message-section">
                  <p className="request-time">
                    {formatRequestTime(selectedRequest.createdAt)}
                  </p>
                  <div className="request-message-bubble">
                    <div className="request-message-avatar">
                      {requestAccount.avatar ? (
                        <img src={requestAccount.avatar} alt={requestAccount.username} />
                      ) : (
                        <User size={16} />
                      )}
                    </div>
                    <span className="request-message-text">{selectedRequest.message}</span>
                  </div>
                </div>

                {/* Show warning and actions when pending */}
                <div className={`request-warning-container ${warningAnimating ? 'slide-down' : ''} ${showWarningBehindModal ? 'behind-modal' : ''} ${warningExiting ? 'exit-down' : ''}`}>
                  <div className="request-warning">
                    <p>Accept message request from {requestAccount.fullName || requestAccount.username} ({requestAccount.username})?</p>
                    <p className="request-warning-text">
                      If you accept, they will also be able to call you and see info such as your activity status and when you've read messages.
                    </p>
                  </div>

                  <div className="request-actions">
                    <button className="request-action-btn block" onClick={handleBlockRequest}>Block</button>
                    <button className="request-action-btn delete" onClick={handleDeleteRequest}>Delete</button>
                    <button className="request-action-btn accept" onClick={handleAcceptRequest}>Accept</button>
                  </div>
                </div>

                {/* Chat input behind warning - ready to slide in */}
                {chatInputEntering && (
                  <div className="chat-input-entering">
                    <ChatInput
                      onSendMessage={handleSendAcceptedMessage}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Messages
