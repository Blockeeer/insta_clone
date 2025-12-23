import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Stories from '../components/feed/Stories'
import PostList from '../components/feed/PostList'
import UserSelectionModal from '../components/feed/UserSelectionModal'
import AddPostModal from '../components/modals/AddPostModal'
import './Dashboard.css'

// Get active account from localStorage
const getActiveAccount = () => {
  const saved = localStorage.getItem('insta_accounts')
  if (saved) {
    const accounts = JSON.parse(saved)
    const activeAccount = accounts.find(acc => acc.isActive)
    return activeAccount || { username: 'guest', avatar: null, id: 'guest' }
  }
  return { username: 'guest', avatar: null, id: 'guest' }
}

// Get all accounts from localStorage
const getAllAccounts = () => {
  const saved = localStorage.getItem('insta_accounts')
  if (saved) {
    return JSON.parse(saved)
  }
  return []
}

// Get stories from localStorage
const getStories = () => {
  const saved = localStorage.getItem('insta_stories')
  if (saved) {
    return JSON.parse(saved)
  }
  return []
}

// Save stories to localStorage
const saveStories = (accountIds) => {
  const stories = accountIds.map(id => ({
    accountId: id,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
  }))
  localStorage.setItem('insta_stories', JSON.stringify(stories))
}

// Get account IDs that have active stories
const getAccountIdsWithStories = () => {
  const stories = getStories()
  const now = new Date()
  // Filter out expired stories
  const activeStories = stories.filter(s => new Date(s.expiresAt) > now)
  return activeStories.map(s => s.accountId)
}

// Get posts from localStorage
const getSavedPosts = () => {
  const saved = localStorage.getItem('insta_posts')
  if (saved) {
    return JSON.parse(saved)
  }
  return []
}

// Save posts to localStorage
const savePosts = (posts) => {
  localStorage.setItem('insta_posts', JSON.stringify(posts))
}

const mockPosts = [
  {
    id: 1,
    user: {
      id: 'u1',
      username: 'samsreactions',
      avatar: 'https://i.pravatar.cc/150?img=10'
    },
    imageUrl: 'https://picsum.photos/seed/post1/600/750',
    caption: 'For $10 I\'ll come to your house and hot glue all your tv remotes together',
    likesCount: 93200,
    commentsCount: 261,
    isLiked: false,
    isSuggested: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    user: {
      id: 'u2',
      username: 'foodie_paradise',
      avatar: 'https://i.pravatar.cc/150?img=11'
    },
    imageUrl: 'https://picsum.photos/seed/post2/600/750',
    caption: 'Homemade pasta for dinner tonight. Nothing beats fresh ingredients!',
    likesCount: 892,
    commentsCount: 23,
    isLiked: true,
    isSuggested: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    user: {
      id: 'u3',
      username: 'sunset_lover',
      avatar: 'https://i.pravatar.cc/150?img=12'
    },
    imageUrl: 'https://picsum.photos/seed/post3/600/600',
    caption: 'Golden hour magic',
    likesCount: 2456,
    commentsCount: 89,
    isLiked: false,
    isSuggested: true,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 4,
    user: {
      id: 'u4',
      username: 'fitness_journey',
      avatar: 'https://i.pravatar.cc/150?img=13'
    },
    imageUrl: 'https://picsum.photos/seed/post4/600/800',
    caption: 'Morning workout done! Starting the day right with some cardio and strength training. Remember, consistency is key!',
    likesCount: 567,
    commentsCount: 34,
    isLiked: false,
    isSuggested: true,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  }
]

function Dashboard() {
  const location = useLocation()
  const [currentUser, setCurrentUser] = useState(getActiveAccount())
  const [posts, setPosts] = useState(() => {
    const savedPosts = getSavedPosts()
    return savedPosts.length > 0 ? savedPosts : mockPosts
  })
  const [showUserSelection, setShowUserSelection] = useState(false)
  const [showAddPostModal, setShowAddPostModal] = useState(false)
  const [storyAccountIds, setStoryAccountIds] = useState(getAccountIdsWithStories())

  // Get all accounts from localStorage
  const allAccounts = getAllAccounts()

  // Refresh data when location changes (user navigates back after account switch)
  useEffect(() => {
    setCurrentUser(getActiveAccount())
    setStoryAccountIds(getAccountIdsWithStories())
  }, [location])

  // Refresh when account is switched from the header dropdown
  useEffect(() => {
    const handleAccountChanged = () => {
      setCurrentUser(getActiveAccount())
      setStoryAccountIds(getAccountIdsWithStories())
    }

    window.addEventListener('accountChanged', handleAccountChanged)

    return () => {
      window.removeEventListener('accountChanged', handleAccountChanged)
    }
  }, [])

  // Also refresh when the page becomes visible (user switches back to this tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setCurrentUser(getActiveAccount())
        setStoryAccountIds(getAccountIdsWithStories())
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Listen for add post modal event from header
  useEffect(() => {
    const handleOpenAddPostModal = () => {
      setShowAddPostModal(true)
    }

    window.addEventListener('openAddPostModal', handleOpenAddPostModal)

    return () => {
      window.removeEventListener('openAddPostModal', handleOpenAddPostModal)
    }
  }, [])

  const handleAddStoryClick = () => {
    setShowUserSelection(true)
  }

  const handleUserSelectionConfirm = (users) => {
    // Save the selected user IDs to localStorage
    const selectedIds = users.map(u => u.id)
    saveStories(selectedIds)
    setStoryAccountIds(selectedIds)
  }

  // Check if current user has a story
  const currentUserHasStory = storyAccountIds.includes(currentUser.id)

  // Get accounts that have stories (excluding current user for the list)
  const accountsWithStories = allAccounts.filter(
    acc => storyAccountIds.includes(acc.id) && acc.id !== currentUser.id
  )

  // Build stories array
  const stories = [
    {
      id: currentUser.id || 'own',
      username: 'Your story',
      avatar: currentUser.avatar,
      isOwn: true,
      hasStory: currentUserHasStory
    },
    ...accountsWithStories.map(user => ({
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      fullName: user.fullName,
      hasStory: true
    }))
  ]

  // For the modal, show all accounts (including current user so they can add their own story)
  const availableUsersForModal = allAccounts

  // Get currently selected users for the modal (accounts that have stories)
  const selectedUsersForModal = allAccounts.filter(acc => storyAccountIds.includes(acc.id))

  const handleLike = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1
        }
      }
      return post
    })
    setPosts(updatedPosts)
    savePosts(updatedPosts)
  }

  const handleAddPost = (newPost) => {
    const updatedPosts = [newPost, ...posts]
    setPosts(updatedPosts)
    savePosts(updatedPosts)
  }

  return (
    <div className="dashboard">
      <Stories stories={stories} onAddStoryClick={handleAddStoryClick} />
      <PostList posts={posts} onLike={handleLike} />

      {showUserSelection && (
        <UserSelectionModal
          users={availableUsersForModal}
          selectedUsers={selectedUsersForModal}
          currentUserId={currentUser.id}
          onClose={() => setShowUserSelection(false)}
          onConfirm={handleUserSelectionConfirm}
        />
      )}

      {showAddPostModal && (
        <AddPostModal
          isOpen={showAddPostModal}
          onClose={() => setShowAddPostModal(false)}
          onAddPost={handleAddPost}
        />
      )}
    </div>
  )
}

export default Dashboard
