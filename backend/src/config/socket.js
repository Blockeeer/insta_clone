const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { prisma } = require('./database');

let io;

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Authentication middleware for socket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;

      // Update user online status
      await prisma.user.update({
        where: { id: decoded.userId },
        data: { isOnline: true }
      });

      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join user's personal room
    socket.join(`user:${socket.userId}`);

    // Join a conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`User ${socket.userId} joined conversation ${conversationId}`);
    });

    // Leave a conversation room
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
    });

    // Handle typing indicator
    socket.on('typing', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('user_typing', {
        userId: socket.userId,
        conversationId
      });
    });

    // Handle stop typing
    socket.on('stop_typing', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('user_stop_typing', {
        userId: socket.userId,
        conversationId
      });
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.userId}`);

      // Update user offline status
      await prisma.user.update({
        where: { id: socket.userId },
        data: {
          isOnline: false,
          lastSeen: new Date()
        }
      });

      // Broadcast user offline status
      io.emit('user_offline', { userId: socket.userId });
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}

module.exports = { initializeSocket, getIO };
