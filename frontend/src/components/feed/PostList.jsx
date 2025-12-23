import Post from './Post'
import './PostList.css'

function PostList({ posts, onLike }) {
  if (posts.length === 0) {
    return (
      <div className="post-list-empty">
        <p>No posts yet</p>
        <span>Follow some users to see their posts here!</span>
      </div>
    )
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <Post key={post.id} post={post} onLike={onLike} />
      ))}
    </div>
  )
}

export default PostList
