const express = require('express');
const router = express.Router();
const { authenticate, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getProfile,
  updateProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  searchUsers,
  getAllUsers
} = require('../controllers/userController');

// Get all users
router.get('/', authenticate, getAllUsers);

// Search users
router.get('/search', authenticate, searchUsers);

// Get user profile (optionally authenticated to check if following)
router.get('/:id', optionalAuth, getProfile);

// Update own profile
router.put('/profile', authenticate, upload.single('avatar'), updateProfile);

// Follow/Unfollow
router.post('/:id/follow', authenticate, followUser);
router.delete('/:id/follow', authenticate, unfollowUser);

// Get followers/following
router.get('/:id/followers', authenticate, getFollowers);
router.get('/:id/following', authenticate, getFollowing);

module.exports = router;
