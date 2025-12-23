import { useState } from 'react'
import StoryItem from './StoryItem'
import StoryViewer from './StoryViewer'
import './Stories.css'

function Stories({ stories, onAddStoryClick }) {
  const [selectedStory, setSelectedStory] = useState(null)

  const handleStoryClick = (story) => {
    // If it's own story without content, trigger add story modal
    if (story.isOwn && !story.hasStory) {
      if (onAddStoryClick) {
        onAddStoryClick()
      }
      return
    }
    // Only open viewer for stories that have content
    if (story.hasStory) {
      setSelectedStory(story)
    }
  }

  const handleCloseViewer = () => {
    setSelectedStory(null)
  }

  const handleNavigateStory = (story) => {
    setSelectedStory(story)
  }

  // Filter viewable stories (has story content)
  const viewableStories = stories.filter(s => s.hasStory || (!s.isOwn && s.hasStory))

  return (
    <>
      <div className="stories-container">
        <div className="stories-scroll">
          {stories.map((story) => (
            <StoryItem
              key={story.id}
              story={story}
              onClick={() => handleStoryClick(story)}
            />
          ))}
        </div>
      </div>

      {selectedStory && (
        <StoryViewer
          story={selectedStory}
          stories={stories.filter(s => s.hasStory)}
          onClose={handleCloseViewer}
          onNavigate={handleNavigateStory}
        />
      )}
    </>
  )
}

export default Stories
