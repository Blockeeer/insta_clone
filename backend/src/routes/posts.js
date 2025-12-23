const express = require('express');
const router = express.Router();
const { authenticate, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getFeed,
  createPost,
  getPost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  getUserPosts
} = require('../controllers/postController');

// Get feed
router.get('/feed', authenticate, getFeed);

// Get user's posts
router.get('/user/:userId', authenticate, getUserPosts);

// CRUD operations
router.post('/', authenticate, upload.single('image'), createPost);
router.get('/:id', optionalAuth, getPost);
router.delete('/:id', authenticate, deletePost);

// Like/Unlike
router.post('/:id/like', authenticate, likePost);
router.delete('/:id/like', authenticate, unlikePost);

// Comments
router.post('/:id/comments', authenticate, addComment);

module.exports = router;
