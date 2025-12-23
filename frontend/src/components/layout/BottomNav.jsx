import { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'
import './BottomNav.css'

// Instagram Home icon (filled when active)
const HomeIcon = ({ active }) => (
  <svg aria-label="Home" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
    {active ? (
      <path d="m21.762 8.786-7-6.68a3.994 3.994 0 0 0-5.524 0l-7 6.681A4.017 4.017 0 0 0 1 11.68V19c0 2.206 1.794 4 4 4h3.005a1 1 0 0 0 1-1v-7.003a2.997 2.997 0 0 1 5.994 0V22a1 1 0 0 0 1 1H19c2.206 0 4-1.794 4-4v-7.32a4.02 4.02 0 0 0-1.238-2.894Z"/>
    ) : (
      <path d="M9.005 16.545a2.997 2.997 0 0 1 2.997-2.997A2.997 2.997 0 0 1 15 16.545V22h7V11.543L12 2 2 11.543V22h7.005Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"/>
    )}
  </svg>
)

// Instagram Reels icon
const ReelsIcon = () => (
  <svg aria-label="Reels" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
    <path d="M22.935 7.468c-.063-1.36-.307-2.142-.512-2.67a5.341 5.341 0 0 0-1.27-1.95 5.345 5.345 0 0 0-1.95-1.27c-.53-.206-1.311-.45-2.672-.513C15.333 1.012 14.976 1 12 1s-3.333.012-4.532.065c-1.36.063-2.142.307-2.67.512-.77.298-1.371.69-1.95 1.27a5.36 5.36 0 0 0-1.27 1.95c-.206.53-.45 1.311-.513 2.672C1.012 8.667 1 9.024 1 12s.012 3.333.065 4.532c.063 1.36.307 2.142.512 2.67.297.77.69 1.372 1.27 1.95.58.581 1.181.974 1.95 1.27.53.206 1.311.45 2.672.513C8.667 22.988 9.024 23 12 23s3.333-.012 4.532-.065c1.36-.063 2.142-.307 2.67-.512a5.33 5.33 0 0 0 1.95-1.27 5.356 5.356 0 0 0 1.27-1.95c.206-.53.45-1.311.513-2.672.053-1.198.065-1.555.065-4.531s-.012-3.333-.065-4.532Zm-1.998 8.972c-.05 1.07-.228 1.652-.38 2.04-.197.51-.434.874-.82 1.258a3.362 3.362 0 0 1-1.258.82c-.387.151-.97.33-2.038.379-1.162.052-1.51.063-4.441.063s-3.28-.01-4.44-.063c-1.07-.05-1.652-.228-2.04-.38a3.354 3.354 0 0 1-1.258-.82 3.362 3.362 0 0 1-.82-1.258c-.151-.387-.33-.97-.379-2.038C3.011 15.28 3 14.931 3 12s.01-3.28.063-4.44c.05-1.07.228-1.652.38-2.04.197-.51.434-.875.82-1.26a3.372 3.372 0 0 1 1.258-.819c.387-.15.97-.329 2.038-.378C8.72 3.011 9.069 3 12 3s3.28.01 4.44.063c1.07.05 1.652.228 2.04.38.51.197.874.433 1.258.82.385.382.622.747.82 1.258.151.387.33.97.379 2.038C20.989 8.72 21 9.069 21 12s-.01 3.28-.063 4.44Zm-4.584-6.828-5.25-3a2.725 2.725 0 0 0-2.745.01A2.722 2.722 0 0 0 6.988 9v6c0 .992.512 1.88 1.37 2.379.432.25.906.376 1.38.376.468 0 .937-.123 1.365-.367l5.25-3c.868-.496 1.385-1.389 1.385-2.388s-.517-1.892-1.385-2.388Zm-.993 3.04-5.25 3a.74.74 0 0 1-.748-.003.74.74 0 0 1-.374-.649V9a.74.74 0 0 1 .374-.65.737.737 0 0 1 .748-.002l5.25 3c.341.196.378.521.378.652s-.037.456-.378.651Z"/>
  </svg>
)

// Instagram Messages/Direct icon
const MessagesIcon = ({ active }) => (
  <svg aria-label="Messages" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
    {active ? (
      <path d="M13.973 20.046 21.77 6.928C22.8 5.195 21.55 3 19.535 3H4.466C2.138 3 .984 5.825 2.646 7.456l4.842 4.752 1.723 7.121c.548 2.266 3.571 2.721 4.762.717Z"/>
    ) : (
      <>
        <path d="M13.973 20.046 21.77 6.928C22.8 5.195 21.55 3 19.535 3H4.466C2.138 3 .984 5.825 2.646 7.456l4.842 4.752 1.723 7.121c.548 2.266 3.571 2.721 4.762.717Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"/>
        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="7.488" x2="15.515" y1="12.208" y2="7.641"/>
      </>
    )}
  </svg>
)

// Instagram Search icon
const SearchIcon = ({ active }) => (
  <svg aria-label="Search" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
    {active ? (
      <path d="M18.5 10.5a8 8 0 1 1-8-8 8 8 0 0 1 8 8Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"/>
    ) : (
      <path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
    )}
    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? "3" : "2"} x1="16.511" x2="22" y1="16.511" y2="22"/>
  </svg>
)

function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  const isMessages = location.pathname === '/messages' || location.pathname.startsWith('/chat/')
  const [userAvatar, setUserAvatar] = useState(null)

  // Get active user avatar from localStorage
  const getActiveUserAvatar = () => {
    const saved = localStorage.getItem('insta_accounts')
    if (saved) {
      const accounts = JSON.parse(saved)
      const activeAccount = accounts.find(acc => acc.isActive)
      return activeAccount?.avatar || null
    }
    return null
  }

  // Load avatar on mount and listen for storage changes
  useEffect(() => {
    setUserAvatar(getActiveUserAvatar())

    // Listen for storage changes (when account switches)
    const handleStorageChange = () => {
      setUserAvatar(getActiveUserAvatar())
    }

    window.addEventListener('storage', handleStorageChange)

    // Also listen for custom event for same-tab updates
    window.addEventListener('accountChanged', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('accountChanged', handleStorageChange)
    }
  }, [])

  // Re-check avatar when location changes (after switching account)
  useEffect(() => {
    setUserAvatar(getActiveUserAvatar())
  }, [location])

  return (
    <nav className="bottom-nav">
      {/* Home */}
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <HomeIcon active={isHome} />
      </NavLink>

      {/* Reels */}
      <button className="nav-item">
        <ReelsIcon />
      </button>

      {/* Messages - with notification dot */}
      <button className="nav-item" onClick={() => navigate('/messages')}>
        <div className="nav-icon-stack">
          <MessagesIcon active={isMessages} />
          <span className="nav-send-dot"></span>
        </div>
      </button>

      {/* Search */}
      <button className="nav-item">
        <SearchIcon active={false} />
      </button>

      {/* Profile */}
      <NavLink to="/profile" className={({ isActive }) => `nav-item nav-profile-btn ${isActive ? 'active' : ''}`}>
        <div className="nav-profile-wrapper">
          <div className="nav-profile-circle">
            {userAvatar ? (
              <img src={userAvatar} alt="Profile" className="nav-profile-img" />
            ) : (
              <User size={14} />
            )}
          </div>
          <span className="nav-profile-dot"></span>
        </div>
      </NavLink>
    </nav>
  )
}

export default BottomNav
