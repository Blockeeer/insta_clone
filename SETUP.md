# Instagram Clone - Setup Guide

## Quick Start (Frontend Only - No Database Required)

The frontend uses **mock data** so you can see the UI immediately without any database setup!

### Step 1: Install Node.js
Download and install Node.js from: https://nodejs.org/
(Recommended: v18 or higher)

### Step 2: Run Frontend
```bash
cd frontend
npm install
npm run dev
```

### Step 3: Open in Browser
Go to: http://localhost:5173

You'll see:
- **Dashboard** (/) - Feed with posts and stories
- **Messages** (/messages) - Conversation list
- **Chat** (/chat/c1) - Chat interface

---

## Full Setup (With Database & Backend)

If you want to connect to a real database later:

### Database Options

#### Option A: PostgreSQL (Recommended)

1. **Install PostgreSQL**
   - Windows: Download from https://www.postgresql.org/download/windows/
   - Or use installer: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

2. **Create Database**
   ```sql
   CREATE DATABASE insta_clone;
   ```

3. **Update .env file**
   ```bash
   cd backend
   copy .env.example .env
   ```

   Edit `.env`:
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/insta_clone
   ```

4. **Run migrations**
   ```bash
   cd backend
   npm install
   npx prisma migrate dev
   npx prisma generate
   ```

#### Option B: SQLite (Easiest - No Installation)

1. **Change prisma schema** - Edit `backend/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = "file:./dev.db"
   }
   ```

2. **Run migrations**
   ```bash
   cd backend
   npm install
   npx prisma migrate dev
   ```

---

## Project Structure

```
insta_clone/
├── frontend/           # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/     # Header, BottomNav
│   │   │   ├── feed/       # Stories, Posts
│   │   │   ├── messages/   # Conversations
│   │   │   └── chat/       # Chat UI
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx   # Main feed
│   │   │   ├── Messages.jsx    # Contacts
│   │   │   └── Chat.jsx        # Chat
│   │   └── styles/
│   └── package.json
│
├── backend/            # Node.js + Express (optional)
│   ├── src/
│   ├── prisma/
│   └── package.json
│
└── SETUP.md           # This file
```

---

## What You'll See

### 1. Dashboard (Feed Page)
- Stories at the top
- Posts with images
- Like, comment, share buttons
- Dark theme (Instagram style)

### 2. Messages Page
- Search bar
- Primary/General/Requests tabs
- Conversation list with avatars
- Online indicators
- Unread message badges

### 3. Chat Page
- User info header with call/video buttons
- Message bubbles (gradient for sent messages)
- Typing indicator
- Message input with emoji, image, mic buttons

---

## Commands Summary

```bash
# Frontend only (recommended to start)
cd frontend
npm install
npm run dev

# Backend (optional, for API)
cd backend
npm install
npm run dev
```

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18 + Vite |
| Styling | CSS (Instagram dark theme) |
| Icons | Lucide React |
| Routing | React Router v6 |
| Backend | Express.js (optional) |
| Database | PostgreSQL/SQLite (optional) |
| ORM | Prisma (optional) |
