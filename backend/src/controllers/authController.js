const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');

// Generate JWT token
function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

// Register new user
async function register(req, res, next) {
  try {
    const { username, email, password, fullName } = req.body;

    // Validate input
    if (!username || !email || !password || !fullName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(409).json({
        error: existingUser.email === email
          ? 'Email already registered'
          : 'Username already taken'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        fullName
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        avatar: true,
        bio: true,
        createdAt: true
      }
    });

    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Registration successful',
      user,
      token
    });
  } catch (error) {
    next(error);
  }
}

// Login user
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update online status
    await prisma.user.update({
      where: { id: user.id },
      data: { isOnline: true }
    });

    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        bio: user.bio
      },
      token
    });
  } catch (error) {
    next(error);
  }
}

// Logout user
async function logout(req, res, next) {
  try {
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        isOnline: false,
        lastSeen: new Date()
      }
    });

    res.json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
}

// Get current user
async function getCurrentUser(req, res) {
  res.json({ user: req.user });
}

module.exports = {
  register,
  login,
  logout,
  getCurrentUser
};
