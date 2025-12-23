import { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import './PageTransition.css'

function PageTransition({ children }) {
  const location = useLocation()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [isAnimating, setIsAnimating] = useState(false)
  const prevPathRef = useRef(location.pathname)
  const prevChildrenRef = useRef(null)

  // Define page hierarchy for determining slide direction
  const getPageDepth = (path) => {
    if (path === '/') return 0
    if (path === '/messages') return 1
    if (path.startsWith('/chat/')) return 2
    if (path === '/manage-accounts') return 1
    return 0
  }

  useEffect(() => {
    const prevPath = prevPathRef.current
    const currentPath = location.pathname

    if (prevPath !== currentPath) {
      const prevDepth = getPageDepth(prevPath)
      const currentDepth = getPageDepth(currentPath)

      // Only animate when going forward (deeper into navigation)
      // Going back = no animation, just instant switch
      const isGoingForward = currentDepth > prevDepth

      if (isGoingForward) {
        // Store the previous children for the background
        prevChildrenRef.current = displayChildren

        // Start animation
        setIsAnimating(true)

        // Update displayed children immediately for the sliding page
        setDisplayChildren(children)

        // End animation after transition completes
        const timer = setTimeout(() => {
          setIsAnimating(false)
          prevChildrenRef.current = null
        }, 300) // Match CSS animation duration

        prevPathRef.current = currentPath

        return () => clearTimeout(timer)
      } else {
        // Going back - no animation, instant switch
        setDisplayChildren(children)
        prevPathRef.current = currentPath
      }
    } else {
      setDisplayChildren(children)
    }
  }, [location.pathname, children])

  return (
    <div className="page-transition-container">
      {/* Previous page (background) - stays visible during forward animation */}
      {isAnimating && prevChildrenRef.current && (
        <div className="page-transition-background">
          {prevChildrenRef.current}
        </div>
      )}

      {/* Current page (slides in when going forward) */}
      <div
        className={`page-transition-content ${
          isAnimating ? 'slide-in-right' : ''
        }`}
      >
        {displayChildren}
      </div>
    </div>
  )
}

export default PageTransition
