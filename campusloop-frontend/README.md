# CampusLoop — Frontend

> The college intelligence platform built to replace WhatsApp chaos with a structured, real-time web platform for engineering students.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v3-38bdf8?logo=tailwindcss)
![Socket.io](https://img.shields.io/badge/Socket.io-realtime-black?logo=socket.io)
![Deployed](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)

---

## Live Demo

🚀 **[campus-loop-pi.vercel.app](https://campus-loop-pi.vercel.app)**

---

## What is CampusLoop?

CampusLoop solves four real problems every engineering student faces:

| Problem | Solution |
|---|---|
| Opportunities buried in WhatsApp groups | Opportunity Board with deadline sorting and real-time alerts |
| Senior knowledge disappearing every year | Knowledge Library — searchable, permanent, community-curated |
| Nobody knows who uses what technology | TechMap — filter all students by skill stack |
| Placement prep is scattered everywhere | PlacementHub — company-specific interview experiences |

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 + Vite | Frontend framework and build tool |
| Tailwind CSS v3 | Utility-first styling |
| React Router v6 | Client-side routing |
| Axios | HTTP client with JWT interceptors |
| Socket.io-client | Real-time WebSocket notifications |
| Context API | Global auth and socket state |

---

## Features

- **JWT Authentication** — Register, login, auto token refresh on expiry
- **Real-time Feed** — Posts appear instantly via WebSocket without refresh
- **Live Notifications** — Bell icon updates in real time when new posts hit your branch
- **Create Post** — Modal form with category, branch targeting, deadline, and anonymous options
- **Category Filter** — Filter feed by opportunity, resource, event, project, placement
- **TechMap** — Discover students by skill stack, filter by branch and collaboration status
- **PlacementHub** — Interview experiences filtered by company name
- **Search** — Debounced full-text search across all posts
- **Upvote System** — Optimistic UI updates with toggle support
- **Bookmarks** — Save posts to personal dashboard
- **Dashboard** — Saved posts, your posts, edit profile in one place
- **Responsive Design** — Mobile-first with hamburger menu
- **Loading Skeletons** — Animated placeholders while content loads
- **Toast Notifications** — Action feedback for upvotes, saves, and posts

---

## Project Structure

```
campusloop-frontend/
├── src/
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Feed.jsx
│   │   ├── TechMap.jsx
│   │   ├── Search.jsx
│   │   ├── Dashboard.jsx
│   │   └── PlacementHub.jsx
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── PostCard.jsx
│   │   ├── CreatePost.jsx
│   │   ├── NotificationBell.jsx
│   │   ├── SkeletonCard.jsx
│   │   ├── EmptyState.jsx
│   │   └── Toast.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── SocketContext.jsx
│   ├── hooks/
│   │   └── useToast.js
│   └── utils/
│       └── api.js
├── vercel.json
└── tailwind.config.cjs
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/mashood17/campus_loop.git
cd campus_loop/campusloop-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in `campusloop-frontend/`:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### Run Locally

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## Key Implementation Details

### JWT Auto-Refresh
Axios interceptor automatically refreshes expired access tokens using the refresh token — users never get logged out unexpectedly.

```js
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !original._retry) {
      // Auto refresh and retry original request
    }
  }
);
```

### Real-time Notifications
Socket.io connects on login and joins the user's branch room. When any post is created for that branch, the notification bell updates instantly without polling.

```js
socket.on("notification_update", () => {
  fetchNotifications(); // Bell count updates in real time
});
```

### Optimistic UI
Upvote count updates instantly on click before the server responds — reverts automatically on failure.

---

## Deployment

Deployed on **Vercel** with React Router support via `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Backend API: [campusloop-api.onrender.com](https://campusloop-api.onrender.com)

---

## Backend

The Flask REST API + WebSocket backend lives in `/campusloop-backend`.

See [backend README](../campusloop-backend/README.md) for setup instructions.

---

## Author

**Mahammad Mashood**  
[github.com/mashood17](https://github.com/mashood17)

---