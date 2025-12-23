import { useState, useEffect } from 'react'
import { X, Camera, BadgeCheck } from 'lucide-react'
import './AddAccountModal.css'

const initialFormData = {
  username: '',
  fullName: '',
  bio: '',
  postsCount: 0,
  followersCount: 0,
  followingCount: 0,
  isVerified: false,
  avatar: null
}

function AddAccountModal({ isOpen, onClose, onAddAccount, editAccount, onEditAccount }) {
  const [formData, setFormData] = useState(initialFormData)
  const [avatarPreview, setAvatarPreview] = useState(null)

  const isEditMode = !!editAccount

  // Load edit account data when modal opens in edit mode
  useEffect(() => {
    if (isOpen && editAccount) {
      setFormData({
        username: editAccount.username || '',
        fullName: editAccount.fullName || '',
        bio: editAccount.bio || '',
        postsCount: editAccount.postsCount || 0,
        followersCount: editAccount.followersCount || 0,
        followingCount: editAccount.followingCount || 0,
        isVerified: editAccount.isVerified || false,
        avatar: editAccount.avatar || null
      })
      setAvatarPreview(editAccount.avatar || null)
    } else if (isOpen && !editAccount) {
      // Reset form when opening in create mode
      setFormData(initialFormData)
      setAvatarPreview(null)
    }
  }, [isOpen, editAccount])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleNumberChange = (e) => {
    const { name, value } = e.target
    // Allow empty string for better mobile UX, store as empty or number
    if (value === '') {
      setFormData(prev => ({
        ...prev,
        [name]: ''
      }))
    } else {
      // Remove leading zeros and parse
      const cleanValue = value.replace(/^0+/, '') || '0'
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(cleanValue) || 0
      }))
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Compress image before saving to localStorage
      const reader = new FileReader()
      reader.onloadend = () => {
        const img = new Image()
        img.onload = () => {
          // Create canvas to resize image
          const canvas = document.createElement('canvas')
          const maxSize = 200 // Max width/height for avatar
          let width = img.width
          let height = img.height

          // Calculate new dimensions
          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width
              width = maxSize
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height
              height = maxSize
            }
          }

          canvas.width = width
          canvas.height = height

          // Draw and compress
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)

          // Convert to base64 with compression (0.7 quality)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7)

          setAvatarPreview(compressedDataUrl)
          setFormData(prev => ({
            ...prev,
            avatar: compressedDataUrl
          }))
        }
        img.src = reader.result
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!formData.username.trim()) return

    // Ensure number fields are numbers (convert empty string to 0)
    const cleanedFormData = {
      ...formData,
      postsCount: parseInt(formData.postsCount) || 0,
      followersCount: parseInt(formData.followersCount) || 0,
      followingCount: parseInt(formData.followingCount) || 0
    }

    try {
      const saved = localStorage.getItem('insta_accounts')
      const accounts = saved ? JSON.parse(saved) : []

      if (isEditMode) {
        // Update existing account
        const updatedAccounts = accounts.map(acc => {
          if (acc.id === editAccount.id) {
            return {
              ...acc,
              ...cleanedFormData,
              username: cleanedFormData.username.trim(),
              fullName: cleanedFormData.fullName.trim() || cleanedFormData.username.trim()
            }
          }
          return acc
        })
        localStorage.setItem('insta_accounts', JSON.stringify(updatedAccounts))

        // Call parent callback
        if (onEditAccount) {
          onEditAccount(updatedAccounts.find(acc => acc.id === editAccount.id))
        }
      } else {
        // Create new account
        const newAccount = {
          id: Date.now().toString(),
          ...cleanedFormData,
          username: cleanedFormData.username.trim(),
          fullName: cleanedFormData.fullName.trim() || cleanedFormData.username.trim(),
          isActive: false
        }

        // If this is the first account, make it active
        if (accounts.length === 0) {
          newAccount.isActive = true
        }

        accounts.push(newAccount)
        localStorage.setItem('insta_accounts', JSON.stringify(accounts))

        // Call parent callback
        if (onAddAccount) {
          onAddAccount(newAccount)
        }
      }

      // Reset form
      setFormData(initialFormData)
      setAvatarPreview(null)
      onClose()
    } catch (error) {
      console.error('Error saving account:', error)
      alert('Failed to save account. Storage may be full.')
    }
  }

  if (!isOpen) return null

  const handleOverlayClick = (e) => {
    // Only close if clicking directly on the overlay, not on children
    if (e.target === e.currentTarget) {
      e.preventDefault()
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>{isEditMode ? 'Edit Account' : 'Create Account'}</h2>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form className="modal-form" onSubmit={handleSubmit}>
          {/* Avatar Upload */}
          <div className="avatar-upload-section">
            <label className="avatar-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                hidden
              />
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar preview" className="avatar-preview" />
              ) : (
                <div className="avatar-placeholder">
                  <Camera size={32} />
                  <span>Add Photo</span>
                </div>
              )}
            </label>
          </div>

          {/* Username */}
          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="johndoe"
              required
            />
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>

          {/* Bio */}
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>

          {/* Stats Row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="postsCount">Posts</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                id="postsCount"
                name="postsCount"
                value={formData.postsCount === 0 ? '' : formData.postsCount}
                onChange={handleNumberChange}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label htmlFor="followersCount">Followers</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                id="followersCount"
                name="followersCount"
                value={formData.followersCount === 0 ? '' : formData.followersCount}
                onChange={handleNumberChange}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label htmlFor="followingCount">Following</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                id="followingCount"
                name="followingCount"
                value={formData.followingCount === 0 ? '' : formData.followingCount}
                onChange={handleNumberChange}
                placeholder="0"
              />
            </div>
          </div>

          {/* Verified Toggle */}
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isVerified"
                checked={formData.isVerified}
                onChange={handleChange}
              />
              <BadgeCheck size={18} className="verified-icon" />
              <span>Verified Account</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-btn"
            disabled={!formData.username.trim()}
            onClick={(e) => {
              // Backup click handler for mobile
              if (formData.username.trim()) {
                handleSubmit(e)
              }
            }}
          >
            {isEditMode ? 'Save Changes' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddAccountModal
