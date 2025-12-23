const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Helper to get auth token
const getToken = () => localStorage.getItem('auth_token')

// Helper for API requests
async function request(endpoint, options = {}) {
  const token = getToken()

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  const response = await fetch(`${API_URL}${endpoint}`, config)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong')
  }

  return data
}

// Auth API
export const authAPI = {
  register: (userData) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  logout: () => request('/auth/logout', {
    method: 'POST',
  }),

  getCurrentUser: () => request('/auth/me'),
}

// Users API
export const usersAPI = {
  getProfile: (userId) => request(`/users/${userId}`),

  updateProfile: (formData) => {
    const token = getToken()
    return fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData, // FormData for file upload
    }).then(res => res.json())
  },

  searchUsers: (query) => request(`/users/search?q=${encodeURIComponent(query)}`),

  getAllUsers: () => request('/users'),

  followUser: (userId) => request(`/users/${userId}/follow`, {
    method: 'POST',
  }),

  unfollowUser: (userId) => request(`/users/${userId}/follow`, {
    method: 'DELETE',
  }),

  getFollowers: (userId) => request(`/users/${userId}/followers`),

  getFollowing: (userId) => request(`/users/${userId}/following`),
}

// Posts API
export const postsAPI = {
  getFeed: (page = 1) => request(`/posts/feed?page=${page}`),

  getPost: (postId) => request(`/posts/${postId}`),

  createPost: (formData) => {
    const token = getToken()
    return fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    }).then(res => res.json())
  },

  deletePost: (postId) => request(`/posts/${postId}`, {
    method: 'DELETE',
  }),

  likePost: (postId) => request(`/posts/${postId}/like`, {
    method: 'POST',
  }),

  unlikePost: (postId) => request(`/posts/${postId}/like`, {
    method: 'DELETE',
  }),

  getComments: (postId) => request(`/posts/${postId}/comments`),

  addComment: (postId, content) => request(`/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  }),
}

// Messages API
export const messagesAPI = {
  getConversations: () => request('/messages/conversations'),

  getConversation: (conversationId) => request(`/messages/conversations/${conversationId}`),

  getMessages: (conversationId) => request(`/messages/conversations/${conversationId}/messages`),

  sendMessage: (conversationId, content) => request(`/messages/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  }),

  createConversation: (participantIds) => request('/messages/conversations', {
    method: 'POST',
    body: JSON.stringify({ participantIds }),
  }),
}

export default {
  auth: authAPI,
  users: usersAPI,
  posts: postsAPI,
  messages: messagesAPI,
}
