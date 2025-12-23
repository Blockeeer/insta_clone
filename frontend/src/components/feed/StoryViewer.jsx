import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, User } from 'lucide-react'
import './StoryViewer.css'

function StoryViewer({ story, stories, onClose, onNavigate }) {
  const [progress, setProgress] = useState(0)
  const STORY_DURATION = 5000 // 5 seconds per story

  // Auto-progress timer
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          // Move to next story or close
          const currentIndex = stories.findIndex(s => s.id === story.id)
          if (currentIndex < stories.length - 1) {
            onNavigate(stories[currentIndex + 1])
            return 0
          } else {
            onClose()
            return 100
          }
        }
        return prev + (100 / (STORY_DURATION / 100))
      })
    }, 100)

    return () => clearInterval(interval)
  }, [story, stories, onClose, onNavigate])

  // Reset progress when story changes
  useEffect(() => {
    setProgress(0)
  }, [story.id])

  const handlePrevious = () => {
    const currentIndex = stories.findIndex(s => s.id === story.id)
    if (currentIndex > 0) {
      onNavigate(stories[currentIndex - 1])
    }
  }

  const handleNext = () => {
    const currentIndex = stories.findIndex(s => s.id === story.id)
    if (currentIndex < stories.length - 1) {
      onNavigate(stories[currentIndex + 1])
    } else {
      onClose()
    }
  }

  const currentIndex = stories.findIndex(s => s.id === story.id)

  return (
    <div className="story-viewer-overlay" onClick={onClose}>
      <div className="story-viewer-container" onClick={e => e.stopPropagation()}>
        {/* Progress bars */}
        <div className="story-progress-container">
          {stories.filter(s => !s.isOwn || s.hasStory).map((s, index) => (
            <div key={s.id} className="story-progress-bar">
              <div
                className="story-progress-fill"
                style={{
                  width: s.id === story.id
                    ? `${progress}%`
                    : stories.findIndex(st => st.id === s.id) < currentIndex
                      ? '100%'
                      : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="story-viewer-header">
          <div className="story-viewer-user">
            <div className="story-viewer-avatar-ring">
              <div className="story-viewer-avatar">
                {story.avatar ? (
                  <img src={story.avatar} alt={story.username} />
                ) : (
                  <User size={24} />
                )}
              </div>
            </div>
            <span className="story-viewer-username">
              {story.isOwn ? 'Your story' : story.username}
            </span>
            <span className="story-viewer-time">2h</span>
          </div>
          <button className="story-viewer-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Story Content */}
        <div className="story-viewer-content">
          {/* Placeholder story image */}
          <img
            src={story.storyImage || `https://picsum.photos/seed/${story.id}/400/700`}
            alt="Story"
            className="story-viewer-image"
          />
        </div>

        {/* Navigation areas */}
        <button className="story-nav story-nav-prev" onClick={handlePrevious}>
          <ChevronLeft size={32} />
        </button>
        <button className="story-nav story-nav-next" onClick={handleNext}>
          <ChevronRight size={32} />
        </button>
      </div>
    </div>
  )
}

export default StoryViewer
