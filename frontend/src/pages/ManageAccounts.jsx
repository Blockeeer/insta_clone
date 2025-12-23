import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, BadgeCheck, Eye, Repeat, Trash2, MoreVertical, Plus, Pencil } from 'lucide-react'
import AddAccountModal from '../components/modals/AddAccountModal'
import './ManageAccounts.css'

// iOS style back chevron (matches native iOS back button) - white color
const IosBackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M15 19l-7-7 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function ManageAccounts() {
  const navigate = useNavigate()
  const [accounts, setAccounts] = useState([])
  const [activeMenu, setActiveMenu] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)

  // Load accounts from localStorage
  const loadAccounts = () => {
    const saved = localStorage.getItem('insta_accounts')
    if (saved) {
      setAccounts(JSON.parse(saved))
    }
  }

  useEffect(() => {
    loadAccounts()
  }, [])

  const handleAddAccount = (newAccount) => {
    // Reload accounts from localStorage
    loadAccounts()
  }

  const handleEditAccount = (account) => {
    setEditingAccount(account)
    setShowAddModal(true)
    setActiveMenu(null)
  }

  const handleEditComplete = (updatedAccount) => {
    // Reload accounts from localStorage
    loadAccounts()
    setEditingAccount(null)
  }

  const handleCloseModal = () => {
    setShowAddModal(false)
    setEditingAccount(null)
  }

  const handleSwitchAccount = (accountId) => {
    const updatedAccounts = accounts.map(acc => ({
      ...acc,
      isActive: acc.id === accountId
    }))
    localStorage.setItem('insta_accounts', JSON.stringify(updatedAccounts))
    setAccounts(updatedAccounts)
    setActiveMenu(null)
  }

  const handleDeleteAccount = (accountId) => {
    const filteredAccounts = accounts.filter(acc => acc.id !== accountId)
    // If deleted account was active, make the first remaining one active
    if (filteredAccounts.length > 0 && !filteredAccounts.some(acc => acc.isActive)) {
      filteredAccounts[0].isActive = true
    }
    localStorage.setItem('insta_accounts', JSON.stringify(filteredAccounts))
    setAccounts(filteredAccounts)
    setActiveMenu(null)
  }

  const handleViewProfile = (account) => {
    // Navigate to profile page
    navigate(`/profile/${account.id}`)
    setActiveMenu(null)
  }

  const formatCount = (count) => {
    if (!count) return '0'
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  return (
    <div className="manage-accounts-page">
      {/* Header */}
      <div className="manage-header">
        <button className="back-btn-ios" onClick={() => navigate(-1)}>
          <IosBackIcon />
        </button>
        <h1>Users</h1>
        <button className="add-account-btn" onClick={() => {
          setEditingAccount(null)
          setShowAddModal(true)
        }}>
          <Plus size={24} />
        </button>
      </div>

      {/* Empty State */}
      {accounts.length === 0 && (
        <div className="empty-state">
          <User size={48} />
          <p>No users yet</p>
          <button onClick={() => {
            setEditingAccount(null)
            setShowAddModal(true)
          }} className="add-first-btn">
            Create First Account
          </button>
        </div>
      )}

      {/* Accounts List */}
      {accounts.length > 0 && (
        <div className="accounts-list">
          {accounts.map((account) => (
            <div key={account.id} className={`account-card ${account.isActive ? 'active' : ''}`}>
              {/* Account Info */}
              <div className="account-card-main">
                <div className="account-card-avatar">
                  {account.avatar ? (
                    <img src={account.avatar} alt={account.username} />
                  ) : (
                    <User size={28} />
                  )}
                  {account.isActive && <div className="active-badge">Active</div>}
                </div>

                <div className="account-card-info">
                  <div className="account-card-username">
                    {account.username}
                    {account.isVerified && (
                      <BadgeCheck size={16} className="verified-badge" />
                    )}
                  </div>
                  <div className="account-card-name">{account.fullName}</div>
                  {account.bio && (
                    <div className="account-card-bio">{account.bio}</div>
                  )}
                </div>

                <button
                  className="account-menu-btn"
                  onClick={() => setActiveMenu(activeMenu === account.id ? null : account.id)}
                >
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Stats */}
              <div className="account-card-stats">
                <div className="stat">
                  <span className="stat-value">{formatCount(account.postsCount)}</span>
                  <span className="stat-label">posts</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{formatCount(account.followersCount)}</span>
                  <span className="stat-label">followers</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{formatCount(account.followingCount)}</span>
                  <span className="stat-label">following</span>
                </div>
              </div>

              {/* Action Menu */}
              {activeMenu === account.id && (
                <div className="account-actions-menu">
                  <button
                    className="action-menu-item"
                    onClick={() => handleEditAccount(account)}
                  >
                    <Pencil size={18} />
                    <span>Edit Account</span>
                  </button>
                  <button
                    className="action-menu-item"
                    onClick={() => handleViewProfile(account)}
                  >
                    <Eye size={18} />
                    <span>View Profile</span>
                  </button>
                  {!account.isActive && (
                    <button
                      className="action-menu-item"
                      onClick={() => handleSwitchAccount(account.id)}
                    >
                      <Repeat size={18} />
                      <span>Switch to this account</span>
                    </button>
                  )}
                  <button
                    className="action-menu-item delete"
                    onClick={() => handleDeleteAccount(account.id)}
                  >
                    <Trash2 size={18} />
                    <span>Delete Account</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Info Text */}
      <div className="manage-info">
        <p>Create multiple accounts to simulate real Instagram conversations.</p>
      </div>

      {/* Add/Edit Account Modal */}
      <AddAccountModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onAddAccount={handleAddAccount}
        editAccount={editingAccount}
        onEditAccount={handleEditComplete}
      />
    </div>
  )
}

export default ManageAccounts
