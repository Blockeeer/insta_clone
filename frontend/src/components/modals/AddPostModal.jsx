import { useState, useEffect } from 'react'
import { X, Image, User, ChevronDown } from 'lucide-react'
import './AddPostModal.css'

const initialFormData = {
  caption: '',
  likesCount: 0,
  commentsCount: 0,
  repostsCount: 0,
  sharesCount: 0,
  imageUrl: null
}

// Get all accounts from localStorage
const getAllAccounts = () => {
  const saved = localStorage.getItem('insta_accounts')
  if (saved) {
    return JSON.parse(saved)
  }
  return []
}

function AddPostModal({ isOpen, onClose, onAddPost }) {
  const [formData, setFormData] = useState(initialFormData)
  const [imagePreview, setImagePreview] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)

  // Load accounts when modal opens
  useEffect(() => {
    if (isOpen) {
      const allAccounts = getAllAccounts()
      setAccounts(allAccounts)
      // Default to active account or first account
      const activeAccount = allAccounts.find(acc => acc.isActive) || allAccounts[0]
      setSelectedAccount(activeAccount || null)
      // Reset form
      setFormData(initialFormData)
      setImagePreview(null)
    }
  }, [isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNumberChange = (e) => {
    const { name, value } = e.target
    if (value === '') {
      setFormData(prev => ({
        ...prev,
        [name]: ''
      }))
    } else {
      const cleanValue = value.replace(/^0+/, '') || '0'
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(cleanValue) || 0
      }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const img = new window.Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const maxSize = 600
          let width = img.width
          let height = img.height

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
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8)

          setImagePreview(compressedDataUrl)
          setFormData(prev => ({
            ...prev,
            imageUrl: compressedDataUrl
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

    if (!selectedAccount) {
      alert('Please select an account')
      return
    }

    const newPost = {
      id: Date.now(),
      user: {
        id: selectedAccount.id,
        username: selectedAccount.username,
        avatar: selectedAccount.avatar
      },
      imageUrl: formData.imageUrl || 'https://picsum.photos/seed/' + Date.now() + '/600/600',
      caption: formData.caption,
      likesCount: parseInt(formData.likesCount) || 0,
      commentsCount: parseInt(formData.commentsCount) || 0,
      repostsCount: parseInt(formData.repostsCount) || 0,
      sharesCount: parseInt(formData.sharesCount) || 0,
      isLiked: false,
      isSuggested: false,
      createdAt: new Date().toISOString()
    }

    if (onAddPost) {
      onAddPost(newPost)
    }

    // Reset form
    setFormData(initialFormData)
    setImagePreview(null)
    onClose()
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      e.preventDefault()
      onClose()
    }
  }

  const handleSelectAccount = (account) => {
    setSelectedAccount(account)
    setShowAccountDropdown(false)
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay add-post-modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container add-post-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>Create New Post</h2>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form className="modal-form" onSubmit={handleSubmit}>
          {/* Account Selector */}
          <div className="form-group">
            <label>Post as</label>
            <div className="account-selector" onClick={() => setShowAccountDropdown(!showAccountDropdown)}>
              {selectedAccount ? (
                <div className="selected-account">
                  <div className="account-avatar-small">
                    {selectedAccount.avatar ? (
                      <img src={selectedAccount.avatar} alt={selectedAccount.username} />
                    ) : (
                      <User size={16} />
                    )}
                  </div>
                  <span className="account-username">{selectedAccount.username}</span>
                </div>
              ) : (
                <span className="no-account">Select account</span>
              )}
              <ChevronDown size={18} className={`dropdown-chevron ${showAccountDropdown ? 'open' : ''}`} />
            </div>

            {/* Account Dropdown */}
            {showAccountDropdown && (
              <div className="account-dropdown">
                {accounts.length === 0 ? (
                  <div className="no-accounts-message">No accounts available</div>
                ) : (
                  accounts.map(account => (
                    <div
                      key={account.id}
                      className={`account-option ${selectedAccount?.id === account.id ? 'selected' : ''}`}
                      onClick={() => handleSelectAccount(account)}
                    >
                      <div className="account-avatar-small">
                        {account.avatar ? (
                          <img src={account.avatar} alt={account.username} />
                        ) : (
                          <User size={16} />
                        )}
                      </div>
                      <span>{account.username}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label>Post Image</label>
            <label className="image-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
              {imagePreview ? (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Post preview" className="image-preview" />
                  <div className="image-overlay">
                    <span>Change Image</span>
                  </div>
                </div>
              ) : (
                <div className="image-placeholder">
                  <Image size={48} />
                  <span>Add Photo</span>
                  <span className="image-hint">or leave empty for random image</span>
                </div>
              )}
            </label>
          </div>

          {/* Caption */}
          <div className="form-group">
            <label htmlFor="caption">Caption</label>
            <textarea
              id="caption"
              name="caption"
              value={formData.caption}
              onChange={handleChange}
              placeholder="Write a caption..."
              rows={3}
            />
          </div>

          {/* Stats Row */}
          <div className="form-row stats-row">
            <div className="form-group">
              <label htmlFor="likesCount">Likes</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                id="likesCount"
                name="likesCount"
                value={formData.likesCount === 0 ? '' : formData.likesCount}
                onChange={handleNumberChange}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label htmlFor="commentsCount">Comments</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                id="commentsCount"
                name="commentsCount"
                value={formData.commentsCount === 0 ? '' : formData.commentsCount}
                onChange={handleNumberChange}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label htmlFor="repostsCount">Reposts</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                id="repostsCount"
                name="repostsCount"
                value={formData.repostsCount === 0 ? '' : formData.repostsCount}
                onChange={handleNumberChange}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label htmlFor="sharesCount">Shares</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                id="sharesCount"
                name="sharesCount"
                value={formData.sharesCount === 0 ? '' : formData.sharesCount}
                onChange={handleNumberChange}
                placeholder="0"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-btn"
            disabled={!selectedAccount}
            onClick={(e) => {
              if (selectedAccount) {
                handleSubmit(e)
              }
            }}
          >
            Share Post
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddPostModal
