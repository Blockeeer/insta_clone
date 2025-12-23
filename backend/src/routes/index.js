const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./users');
const postRoutes = require('./posts');
const messageRoutes = require('./messages');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/messages', messageRoutes);

module.exports = router;
