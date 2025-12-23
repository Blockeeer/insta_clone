const { prisma } = require('../config/database');
const { uploadImage } = require('../config/cloudinary');
const fs = require('fs');

// Get feed posts
async function getFeed(req, res, next) {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Get posts from users the current user follows + own posts
    const following = await prisma.follow.findMany({
      where: { followerId: req.user.id },
      select: { followingId: true }
    });

    const followingIds = following.map(f => f.followingId);
    followingIds.push(req.user.id); // Include own posts

    const posts = await prisma.post.findMany({
      where: {
        userId: { in: followingIds }
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        },
        likes: {
          where: { userId: req.user.id },
          select: { id: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedPosts = posts.map(post => ({
      ...post,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      isLiked: post.likes.length > 0,
      likes: undefined,
      _count: undefined
    }));

    res.json({
      posts: formattedPosts,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    next(error);
  }
}

// Create post
async function createPost(req, res, next) {
  try {
    const { caption } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Upload image to cloudinary
    const imageUrl = await uploadImage(req.file.path, 'posts');

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    const post = await prisma.post.create({
      data: {
        caption,
        imageUrl,
        userId: req.user.id
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true
          }
        }
      }
    });

    res.status(201).json({
      post: {
        ...post,
        likesCount: 0,
        commentsCount: 0,
        isLiked: false
      }
    });
  } catch (error) {
    next(error);
  }
}

// Get single post
async function getPost(req, res, next) {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 20
        }
      }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if current user liked this post
    let isLiked = false;
    if (req.user) {
      const like = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId: req.user.id,
            postId: id
          }
        }
      });
      isLiked = !!like;
    }

    res.json({
      post: {
        ...post,
        likesCount: post._count.likes,
        commentsCount: post._count.comments,
        isLiked,
        _count: undefined
      }
    });
  } catch (error) {
    next(error);
  }
}

// Delete post
async function deletePost(req, res, next) {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await prisma.post.delete({
      where: { id }
    });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
}

// Like post
async function likePost(req, res, next) {
  try {
    const { id } = req.params;

    await prisma.like.create({
      data: {
        userId: req.user.id,
        postId: id
      }
    });

    res.json({ message: 'Post liked' });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Already liked this post' });
    }
    next(error);
  }
}

// Unlike post
async function unlikePost(req, res, next) {
  try {
    const { id } = req.params;

    await prisma.like.delete({
      where: {
        userId_postId: {
          userId: req.user.id,
          postId: id
        }
      }
    });

    res.json({ message: 'Post unliked' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Like not found' });
    }
    next(error);
  }
}

// Add comment
async function addComment(req, res, next) {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId: req.user.id,
        postId: id
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    });

    res.status(201).json({ comment });
  } catch (error) {
    next(error);
  }
}

// Get user posts
async function getUserPosts(req, res, next) {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const posts = await prisma.post.findMany({
      where: { userId },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      select: {
        id: true,
        imageUrl: true,
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      posts: posts.map(p => ({
        ...p,
        likesCount: p._count.likes,
        commentsCount: p._count.comments,
        _count: undefined
      }))
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getFeed,
  createPost,
  getPost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  getUserPosts
};
