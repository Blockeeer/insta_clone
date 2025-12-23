# Instagram Clone - Project Structure & Technical Stack

## Overview
A mobile-first web application cloning Instagram's core features with 3 main interfaces:
1. **Dashboard/Feed Page** - Main feed with posts
2. **Contacts/Messages Page** - List of conversations
3. **Chat Page** - Individual chat interface

---

## Technology Stack Recommendations

### Frontend Options (Choose One)

| Option | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| **React.js** | Large ecosystem, component-based, great for SPAs | Requires build setup | ⭐ **Recommended** |
| **Vue.js** | Easy to learn, great docs, lightweight | Smaller ecosystem | Good alternative |
| **Vanilla JS** | No dependencies, fast initial load | More boilerplate code | For simplicity |

**My Recommendation: React.js** with Vite for fast development and hot reload.

### Backend (Node.js)

| Framework | Pros | Cons | Recommendation |
|-----------|------|------|----------------|
| **Express.js** | Simple, flexible, huge ecosystem | Minimal structure | ⭐ **Recommended** |
| **Fastify** | Very fast, schema validation | Smaller community | Good for performance |
| **NestJS** | TypeScript, structured, scalable | Steeper learning curve | For large projects |

**My Recommendation: Express.js** - Simple, well-documented, perfect for this project.

### Database Options

| Database | Type | Pros | Cons | Recommendation |
|----------|------|------|------|----------------|
| **PostgreSQL** | SQL | Reliable, ACID compliant, great for relations | More setup | ⭐ **Recommended** |
| **MongoDB** | NoSQL | Flexible schema, easy start | Less structured | Good for rapid prototyping |
| **MySQL** | SQL | Popular, well-supported | Less features than PostgreSQL | Good alternative |

**My Recommendation: PostgreSQL** with Prisma ORM for type-safe database queries.

### Real-time Communication (for Chat)

| Option | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| **Socket.IO** | Easy to use, fallbacks, rooms support | Slightly heavier | ⭐ **Recommended** |
| **ws** | Lightweight, fast | More manual work | For simple needs |

**My Recommendation: Socket.IO** - Perfect for chat functionality with room support.

### Additional Tools

- **Authentication**: JWT (JSON Web Tokens) + bcrypt for password hashing
- **File Upload**: Multer + Cloudinary (for image storage)
- **Validation**: Joi or Zod
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest + Supertest

---

## Project Structure

```
insta_clone/
├── backend/                    # Node.js Backend
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   │   ├── database.js    # Database connection
│   │   │   ├── socket.js      # Socket.IO config
│   │   │   └── cloudinary.js  # Image upload config
│   │   ├── controllers/       # Route handlers
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── postController.js
│   │   │   ├── messageController.js
│   │   │   └── chatController.js
│   │   ├── middleware/        # Custom middleware
│   │   │   ├── auth.js        # JWT verification
│   │   │   ├── upload.js      # File upload handling
│   │   │   └── errorHandler.js
│   │   ├── models/            # Database models
│   │   │   ├── User.js
│   │   │   ├── Post.js
│   │   │   ├── Message.js
│   │   │   ├── Conversation.js
│   │   │   └── Follow.js
│   │   ├── routes/            # API routes
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── posts.js
│   │   │   ├── messages.js
│   │   │   └── index.js
│   │   ├── services/          # Business logic
│   │   │   ├── authService.js
│   │   │   ├── userService.js
│   │   │   ├── postService.js
│   │   │   └── chatService.js
│   │   ├── utils/             # Utility functions
│   │   │   ├── helpers.js
│   │   │   └── validators.js
│   │   ├── socket/            # Socket.IO handlers
│   │   │   └── chatHandler.js
│   │   └── app.js             # Express app setup
│   ├── prisma/                # Prisma ORM
│   │   └── schema.prisma      # Database schema
│   ├── package.json
│   ├── .env.example
│   └── server.js              # Entry point
│
├── frontend/                   # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── assets/            # Static assets
│   │   │   ├── icons/
│   │   │   └── images/
│   │   ├── components/        # Reusable components
│   │   │   ├── common/        # Shared components
│   │   │   │   ├── Avatar.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   └── Modal.jsx
│   │   │   ├── layout/        # Layout components
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── BottomNav.jsx
│   │   │   │   └── Layout.jsx
│   │   │   ├── feed/          # Dashboard components
│   │   │   │   ├── Post.jsx
│   │   │   │   ├── PostList.jsx
│   │   │   │   ├── Stories.jsx
│   │   │   │   └── StoryItem.jsx
│   │   │   ├── messages/      # Message components
│   │   │   │   ├── ConversationList.jsx
│   │   │   │   ├── ConversationItem.jsx
│   │   │   │   └── SearchBar.jsx
│   │   │   └── chat/          # Chat components
│   │   │       ├── ChatHeader.jsx
│   │   │       ├── MessageBubble.jsx
│   │   │       ├── MessageList.jsx
│   │   │       └── ChatInput.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Dashboard.jsx  # Feed/Home page
│   │   │   ├── Messages.jsx   # Contacts list
│   │   │   ├── Chat.jsx       # Chat interface
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── context/           # React Context
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── hooks/             # Custom hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useSocket.js
│   │   │   └── useFetch.js
│   │   ├── services/          # API services
│   │   │   ├── api.js         # Axios instance
│   │   │   ├── authService.js
│   │   │   ├── postService.js
│   │   │   └── chatService.js
│   │   ├── styles/            # CSS files
│   │   │   ├── globals.css
│   │   │   ├── variables.css
│   │   │   └── components/
│   │   ├── utils/             # Utility functions
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
└── PROJECT_STRUCTURE.md        # This file
```

---

## Database Schema (PostgreSQL with Prisma)

### Core Tables

1. **Users** - User accounts
2. **Posts** - Feed posts with images
3. **Conversations** - Chat conversations (1-to-1 or group)
4. **Messages** - Individual messages
5. **Follows** - Follow relationships
6. **Likes** - Post likes
7. **Comments** - Post comments

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile
- `POST /api/users/:id/follow` - Follow user
- `DELETE /api/users/:id/follow` - Unfollow user
- `GET /api/users/:id/followers` - Get followers
- `GET /api/users/:id/following` - Get following

### Posts (Dashboard)
- `GET /api/posts/feed` - Get feed posts
- `POST /api/posts` - Create post
- `GET /api/posts/:id` - Get single post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like post
- `DELETE /api/posts/:id/like` - Unlike post

### Messages/Chat
- `GET /api/conversations` - Get all conversations
- `POST /api/conversations` - Create conversation
- `GET /api/conversations/:id/messages` - Get messages
- `POST /api/conversations/:id/messages` - Send message
- `PUT /api/messages/:id/read` - Mark as read

---

## Socket Events (Real-time Chat)

### Client → Server
- `join_conversation` - Join a chat room
- `leave_conversation` - Leave a chat room
- `send_message` - Send a message
- `typing` - User is typing
- `stop_typing` - User stopped typing

### Server → Client
- `new_message` - New message received
- `user_typing` - Someone is typing
- `user_online` - User came online
- `user_offline` - User went offline
- `message_read` - Message was read

---

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone and install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

2. **Set up environment variables**
```bash
# Copy example env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. **Set up database**
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

4. **Run development servers**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/insta_clone
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
PORT=5000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```
