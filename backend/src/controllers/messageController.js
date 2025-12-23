const { prisma } = require('../config/database');
const { getIO } = require('../config/socket');

// Get all conversations for current user
async function getConversations(req, res, next) {
  try {
    const conversations = await prisma.conversationParticipant.findMany({
      where: { userId: req.user.id },
      include: {
        conversation: {
          include: {
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    fullName: true,
                    avatar: true,
                    isOnline: true,
                    lastSeen: true
                  }
                }
              }
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              select: {
                id: true,
                content: true,
                createdAt: true,
                senderId: true,
                isRead: true
              }
            }
          }
        }
      },
      orderBy: {
        conversation: {
          updatedAt: 'desc'
        }
      }
    });

    // Format conversations
    const formattedConversations = conversations.map(cp => {
      const conv = cp.conversation;
      const otherParticipants = conv.participants
        .filter(p => p.userId !== req.user.id)
        .map(p => p.user);

      const lastMessage = conv.messages[0] || null;

      // Count unread messages
      const unreadCount = conv.messages.filter(
        m => !m.isRead && m.senderId !== req.user.id
      ).length;

      return {
        id: conv.id,
        isGroup: conv.isGroup,
        groupName: conv.groupName,
        groupAvatar: conv.groupAvatar,
        participants: otherParticipants,
        lastMessage,
        unreadCount,
        updatedAt: conv.updatedAt
      };
    });

    res.json({ conversations: formattedConversations });
  } catch (error) {
    next(error);
  }
}

// Create new conversation
async function createConversation(req, res, next) {
  try {
    const { participantIds, isGroup = false, groupName } = req.body;

    if (!participantIds || participantIds.length === 0) {
      return res.status(400).json({ error: 'Participants are required' });
    }

    // For 1-on-1 chat, check if conversation already exists
    if (!isGroup && participantIds.length === 1) {
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          isGroup: false,
          AND: [
            {
              participants: {
                some: { userId: req.user.id }
              }
            },
            {
              participants: {
                some: { userId: participantIds[0] }
              }
            }
          ]
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  fullName: true,
                  avatar: true,
                  isOnline: true
                }
              }
            }
          }
        }
      });

      if (existingConversation) {
        return res.json({ conversation: existingConversation });
      }
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        isGroup,
        groupName: isGroup ? groupName : null,
        participants: {
          create: [
            { userId: req.user.id },
            ...participantIds.map(id => ({ userId: id }))
          ]
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
                avatar: true,
                isOnline: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({ conversation });
  } catch (error) {
    next(error);
  }
}

// Get messages for a conversation
async function getMessages(req, res, next) {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Verify user is participant
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        userId_conversationId: {
          userId: req.user.id,
          conversationId
        }
      }
    });

    if (!participant) {
      return res.status(403).json({ error: 'Not a participant of this conversation' });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      include: {
        sender: {
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

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: req.user.id },
        isRead: false
      },
      data: { isRead: true }
    });

    res.json({
      messages: messages.reverse(),
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    next(error);
  }
}

// Send message
async function sendMessage(req, res, next) {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    // Verify user is participant
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        userId_conversationId: {
          userId: req.user.id,
          conversationId
        }
      }
    });

    if (!participant) {
      return res.status(403).json({ error: 'Not a participant of this conversation' });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        content,
        senderId: req.user.id,
        conversationId
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true
          }
        }
      }
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });

    // Emit message via Socket.IO
    const io = getIO();
    io.to(`conversation:${conversationId}`).emit('new_message', message);

    res.status(201).json({ message });
  } catch (error) {
    next(error);
  }
}

// Mark messages as read
async function markAsRead(req, res, next) {
  try {
    const { conversationId } = req.params;

    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: req.user.id },
        isRead: false
      },
      data: { isRead: true }
    });

    // Notify sender that messages were read
    const io = getIO();
    io.to(`conversation:${conversationId}`).emit('messages_read', {
      conversationId,
      readBy: req.user.id
    });

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
  markAsRead
};
