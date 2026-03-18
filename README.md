# CampusLoop 🎓

> A full-stack real-time college intelligence platform — replacing WhatsApp chaos with structured, branch-targeted information flow for engineering students.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Flask](https://img.shields.io/badge/Flask-3.x-black?logo=flask)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql)
![WebSockets](https://img.shields.io/badge/WebSockets-realtime-black?logo=socket.io)
![Tests](https://img.shields.io/badge/Tests-21%20passing-brightgreen?logo=pytest)
![Deployed](https://img.shields.io/badge/Deployed-Live-success)

---

## 🚀 Live Demo

| | URL |
|---|---|
| **Frontend** | [campus-loop-pi.vercel.app](https://campus-loop-pi.vercel.app) |
| **Backend API** | [campusloop-api.onrender.com](https://campusloop-api.onrender.com) |

---

## 💡 Why CampusLoop?

Every engineering college has the same four problems:

**Problem 1 — Opportunities get buried**
Someone shares an internship link in a 200-person WhatsApp group at 11pm. By morning it's buried under 80 messages. Students miss critical deadlines.

**Problem 2 — Senior knowledge disappears**
Every batch of seniors has notes, project reports, and placement experiences. When they graduate, all of it disappears. Juniors start from scratch every year.

**Problem 3 — Nobody knows who works on what**
You want to learn React but don't know a single person in college who uses it. There's a student two classrooms away building the same stack — but you never meet.

**Problem 4 — Placement prep is scattered**
DSA on one YouTube channel, system design on another, interview experiences on LinkedIn. No single place exists for your college's specific placement context.

**CampusLoop solves all four.**

---

## ✨ Features

### 📋 Opportunity Feed
- Posts categorised as opportunity, resource, event, project, placement
- Branch-targeted posts — CSE students only see CSE-relevant content
- Deadline field with **⏰ Expiring Soon** badge for posts within 48 hours
- Real-time notifications via WebSocket when new posts hit your branch
- Upvote system — best content rises to the top
- Bookmark posts to your personal dashboard

### 🗺️ TechMap — Student Skills Directory
- Every student adds their tech stack to their profile
- Filter all students by skill — "Show me everyone using React"
- Open to Collaborate badge — find teammates instantly
- Branch filter — narrow by department

### 🏢 PlacementHub
- Interview experiences tagged by company name
- Filter by company — "Show me everyone who interviewed at Infosys"
- Anonymous posting option for sensitive experiences
- Sorted by upvotes — most trusted experiences first

### 🔍 Search
- Full-text search across all posts
- Debounced input — no API spam on every keystroke
- Filter by category while searching

### 🔔 Real-time Notifications
- WebSocket rooms per branch
- Bell icon updates instantly when new posts arrive
- Unread count badge
- Mark all read in one click

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework |
| Tailwind CSS v3 | Styling |
| React Router v6 | Client routing |
| Axios | HTTP client with auto token refresh |
| Socket.io-client | Real-time WebSocket |
| Context API | Global state management |

### Backend
| Technology | Purpose |
|---|---|
| Python + Flask | REST API |
| PostgreSQL | Database |
| SQLAlchemy + Flask-Migrate | ORM + migrations |
| Flask-SocketIO + Eventlet | WebSocket server |
| Flask-JWT-Extended | Auth tokens |
| bcrypt | Password hashing |
| Gunicorn | Production server |

### Testing & DevOps
| Technology | Purpose |
|---|---|
| pytest | 21 backend unit tests |
| Locust | Load testing — 50 concurrent users |
| Vercel | Frontend deployment |
| Render | Backend + database deployment |

---

## 📊 Load Test Results

Tested under **50 concurrent users** using Locust:

| Endpoint | Avg Response Time | RPS |
|---|---|---|
| GET /api/posts/feed | **72ms** | 8.92 |
| GET /api/notifications/ | **52ms** | 5.39 |
| GET /api/posts/search | **35-72ms** | ~3.5 |
| GET /api/users/techmap | **52ms** | 3.36 |
| POST /api/posts/create | **69ms** | 1.72 |
| **Total** | **120ms avg** | **23.72 RPS** |

---

## 📁 Repository Structure

```
campus_loop/
├── campusloop-frontend/     # React + Vite application
│   ├── src/
│   │   ├── pages/           # Login, Register, Feed, TechMap, Dashboard...
│   │   ├── components/      # Navbar, PostCard, NotificationBell...
│   │   ├── context/         # AuthContext, SocketContext
│   │   ├── hooks/           # useToast
│   │   └── utils/           # Axios instance with interceptors
│   └── README.md
│
├── campusloop-backend/      # Flask REST API + WebSocket server
│   ├── models/              # User, Post, Notification, Upvote, Bookmark
│   ├── routes/              # auth, posts, notifications, users
│   ├── sockets/             # WebSocket events
│   ├── tests/               # pytest + Locust
│   └── README.md
│
└── README.md                # You are here
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 15

### Quick Start

```bash
# Clone the repo
git clone https://github.com/mashood17/campus_loop.git
cd campus_loop

# Setup backend
cd campusloop-backend
python -m venv venv
.\venv\Scripts\activate        # Windows
pip install -r requirements.txt
# Create .env file (see campusloop-backend/README.md)
flask db upgrade
python app.py

# Setup frontend (new terminal)
cd campusloop-frontend
npm install
# Create .env file (see campusloop-frontend/README.md)
npm run dev
```

Frontend → `http://localhost:5173`
Backend → `http://localhost:5000`

---

## 🧪 Tests

```bash
cd campusloop-backend
pytest tests/ -v
# 21 passed in 2.43s
```

---

## 📸 Screenshots

### Feed
> Real-time post feed with category filters, upvotes, and bookmarks

### TechMap
> Student skills directory filterable by technology and branch

### PlacementHub
> Company-specific interview experiences with anonymous posting

### Dashboard
> Personal saved posts, your posts, and profile editor

---

## 🏗️ Architecture Highlights

**Real-time notifications** — Flask-SocketIO creates a room per branch. When a post is created, the server emits to that room. All connected users in that branch receive the notification instantly without polling.

**JWT auto-refresh** — Axios interceptor catches 401 responses, silently refreshes the access token using the refresh token, then retries the original request. Users never get logged out unexpectedly.

**Optimistic UI** — Upvote count updates instantly on click before the server confirms. Reverts automatically on failure. Makes the app feel instant.

**Branch-targeted feed** — Posts are targeted to specific branches or ALL. The feed query filters using PostgreSQL's `ANY()` operator on the array column — only relevant posts reach each student.

---

## 👨‍💻 Author

**Mahammad Mashood**
[![GitHub](https://img.shields.io/badge/GitHub-mashood17-black?logo=github)](https://github.com/mashood17)

---

## 📄 License

MIT — feel free to fork and adapt for your own college.

---

> Built as a full-stack portfolio project demonstrating real-time web development with React, Flask, PostgreSQL, and WebSockets.