const { prisma } = require('../config/database');
const { uploadImage } = require('../config/cloudinary');
const fs = require('fs');

// Get user profile
async function getProfile(req, res, next) {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        fullName: true,
        bio: true,
        avatar: true,
        isOnline: true,
        lastSeen: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if current user follows this user
    let isFollowing = false;
    if (req.user) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: req.user.id,
            followingId: id
          }
        }
      });
      isFollowing = !!follow;
    }

    res.json({
      ...user,
      postsCount: user._count.posts,
      followersCount: user._count.followers,
      followingCount: user._count.following,
      isFollowing
    });
  } catch (error) {
    next(error);
  }
}

// Update user profile
async function updateProfile(req, res, next) {
  try {
    const { fullName, bio, username } = req.body;

    // Check if username is taken (if changing)
    if (username && username !== req.user.username) {
      const existingUser = await prisma.user.findUnique({
        where: { username }
      });

      if (existingUser) {
        return res.status(409).json({ error: 'Username already taken' });
      }
    }

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (bio !== undefined) updateData.bio = bio;
    if (username) updateData.username = username;

    // Handle avatar upload
    if (req.file) {
      const avatarUrl = await uploadImage(req.file.path, 'avatars');
      updateData.avatar = avatarUrl;
      // Clean up temp file
      fs.unlinkSync(req.file.path);
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        bio: true,
        avatar: true
      }
    });

    res.json({ user });
  } catch (error) {
    next(error);
  }
}

// Follow user
async function followUser(req, res, next) {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    // Check if user exists
    const userToFollow = await prisma.user.findUnique({
      where: { id }
    });

    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create follow relationship
    await prisma.follow.create({
      data: {
        followerId: req.user.id,
        followingId: id
      }
    });

    res.json({ message: 'User followed successfully' });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Already following this user' });
    }
    next(error);
  }
}

// Unfollow user
async function unfollowUser(req, res, next) {
  try {
    const { id } = req.params;

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: req.user.id,
          followingId: id
        }
      }
    });

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Not following this user' });
    }
    next(error);
  }
}

// Get followers
async function getFollowers(req, res, next) {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const followers = await prisma.follow.findMany({
      where: { followingId: id },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      followers: followers.map(f => f.follower),
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    next(error);
  }
}

// Get following
async function getFollowing(req, res, next) {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const following = await prisma.follow.findMany({
      where: { followerId: id },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      include: {
        following: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      following: following.map(f => f.following),
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    next(error);
  }
}

// Search users
async function searchUsers(req, res, next) {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: q, mode: 'insensitive' } },
          { fullName: { contains: q, mode: 'insensitive' } }
        ]
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      select: {
        id: true,
        username: true,
        fullName: true,
        avatar: true
      }
    });

    res.json({ users });
  } catch (error) {
    next(error);
  }
}

// Get all users
async function getAllUsers(req, res, next) {
  try {
    const { page = 1, limit = 50 } = req.query;

    const users = await prisma.user.findMany({
      skip: (page - 1) * limit,
      take: parseInt(limit),
      select: {
        id: true,
        username: true,
        fullName: true,
        avatar: true,
        bio: true,
        isOnline: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedUsers = users.map(user => ({
      ...user,
      postsCount: user._count.posts,
      followersCount: user._count.followers,
      followingCount: user._count.following,
      _count: undefined
    }));

    res.json({ users: formattedUsers });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  searchUsers,
  getAllUsers
};
