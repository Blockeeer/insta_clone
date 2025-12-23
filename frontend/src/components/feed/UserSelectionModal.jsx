import { useState } from 'react'
import { X, User, Check } from 'lucide-react'
import './UserSelectionModal.css'

function UserSelectionModal({ users, selectedUsers, onClose, onConfirm, currentUserId }) {
  const [selected, setSelected] = useState(selectedUsers.map(u => u.id))

  const handleToggleUser = (userId) => {
    setSelected(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleConfirm = () => {
    const selectedUserObjects = users.filter(u => selected.includes(u.id))
    onConfirm(selectedUserObjects)
    onClose()
  }

  return (
    <div className="user-selection-overlay" onClick={onClose}>
      <div className="user-selection-modal" onClick={e => e.stopPropagation()}>
        <div className="user-selection-header">
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
          <h2>Add to Story</h2>
          <button type="button" className="done-btn" onClick={handleConfirm}>
            Done
          </button>
        </div>

        <div className="user-selection-list">
          {users.map(user => (
            <button
              type="button"
              key={user.id}
              className={`user-selection-item ${selected.includes(user.id) ? 'selected' : ''}`}
              onClick={() => handleToggleUser(user.id)}
            >
              <div className="user-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} />
                ) : (
                  <User size={24} />
                )}
              </div>
              <div className="user-info">
                <span className="user-name">{user.username}</span>
                {user.id === currentUserId && <span className="current-user-badge">You</span>}
              </div>
              <div className={`checkbox ${selected.includes(user.id) ? 'checked' : ''}`}>
                {selected.includes(user.id) && <Check size={14} strokeWidth={3} />}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserSelectionModal
