# CampusLoop — Backend API

> REST API + WebSocket server for CampusLoop — the college intelligence platform built with Flask, PostgreSQL, and Flask-SocketIO.

![Python](https://img.shields.io/badge/Python-3.13-blue?logo=python)
![Flask](https://img.shields.io/badge/Flask-3.x-black?logo=flask)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql)
![WebSockets](https://img.shields.io/badge/WebSockets-SocketIO-black?logo=socket.io)
![Deployed](https://img.shields.io/badge/Deployed-Render-46E3B7?logo=render)
![Tests](https://img.shields.io/badge/Tests-21%20passing-brightgreen?logo=pytest)

---

## Live API

🚀 **[campusloop-api.onrender.com](https://campusloop-api.onrender.com)**

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Python + Flask | Backend framework |
| PostgreSQL | Primary database |
| SQLAlchemy + Flask-Migrate | ORM and database migrations |
| Flask-SocketIO + Eventlet | Real-time WebSocket rooms |
| Flask-JWT-Extended | Access + refresh token authentication |
| bcrypt | Password hashing |
| Gunicorn | Production WSGI server |
| pytest | Backend unit testing |
| Locust | Load testing |

---

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login — returns access + refresh token | No |
| POST | `/refresh` | Get new access token | Refresh token |
| GET | `/me` | Get current logged-in user | Yes |

### Posts — `/api/posts`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/feed` | Get personalised feed by branch | Yes |
| POST | `/create` | Create new post | Yes |
| GET | `/<post_id>` | Get single post | Yes |
| DELETE | `/<post_id>` | Delete own post | Yes |
| POST | `/<post_id>/upvote` | Toggle upvote | Yes |
| POST | `/<post_id>/bookmark` | Toggle bookmark | Yes |
| GET | `/search` | Search posts by keyword + filters | Yes |
| GET | `/placement` | Get placement posts filtered by company | Yes |
| GET | `/companies` | Get distinct company names | Yes |

### Notifications — `/api/notifications`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | Get all notifications + unread count | Yes |
| PUT | `/read-all` | Mark all notifications as read | Yes |
| PUT | `/<id>/read` | Mark single notification as read | Yes |

### Users — `/api/users`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/profile/<user_id>` | Get public profile | Yes |
| PUT | `/profile/update` | Update own profile | Yes |
| GET | `/techmap` | Get all users filterable by skill/branch | Yes |
| GET | `/bookmarks` | Get bookmarked posts | Yes |

---

## WebSocket Events

| Event | Direction | Description |
|---|---|---|
| `connect` | Client → Server | Client connects on login |
| `join_branch` | Client → Server | Client joins branch room (e.g. "CSE") |
| `new_post` | Server → Client | Fired when post created in branch |
| `notification_update` | Server → Client | Triggers bell refresh |
| `disconnect` | Client → Server | Client leaves room |

---

## Database Schema

```
users         — id, name, email, password_hash, branch, year, skills[], bio, is_open_to_collab
posts         — id, user_id, title, body, category, branch_target[], deadline, is_anonymous, upvote_count, company_name
notifications — id, user_id, post_id, message, is_read
bookmarks     — id, user_id, post_id
upvotes       — id, user_id, post_id
```

---

## Project Structure

```
campusloop-backend/
├── app.py              — App factory, blueprints, SocketIO init
├── config.py           — Environment config
├── extensions.py       — db, jwt, socketio, migrate instances
├── models/
│   ├── user.py
│   ├── post.py
│   ├── notification.py
│   ├── bookmark.py
│   └── upvote.py
├── routes/
│   ├── auth.py
│   ├── posts.py
│   ├── notifications.py
│   └── users.py
├── sockets/
│   └── events.py       — WebSocket connect, join_branch, disconnect
├── migrations/         — Alembic migration files
├── tests/
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_posts.py
│   ├── test_notifications.py
│   └── locustfile.py
├── requirements.txt
├── Procfile
└── .env
```

---

## Getting Started

### Prerequisites
- Python 3.11+
- PostgreSQL 15
- pip

### Installation

```bash
# Clone the repository
git clone https://github.com/mashood17/campus_loop.git
cd campus_loop/campusloop-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Environment Variables

Create a `.env` file in `campusloop-backend/`:

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost/campusloop
JWT_SECRET_KEY=your-long-random-secret-key-minimum-32-chars
FLASK_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Database Setup

```bash
# Create database in PostgreSQL
createdb campusloop

# Run migrations
flask db upgrade
```

### Run Locally

```bash
python app.py
```

API runs at `http://localhost:5000`

---

## Testing

### Unit Tests

```bash
# Create test database first
createdb campusloop_test

# Run all tests
pytest tests/ -v
```

**Results: 21/21 tests passing**

```
tests/test_auth.py::test_register_success PASSED
tests/test_auth.py::test_login_success PASSED
tests/test_auth.py::test_get_me PASSED
tests/test_posts.py::test_create_post_success PASSED
tests/test_posts.py::test_get_feed PASSED
tests/test_posts.py::test_upvote_toggle PASSED
...
21 passed in 2.43s
```

### Load Testing

```bash
cd tests
locust -f locustfile.py --host=http://localhost:5000
```

Open `http://localhost:8089` → 50 users → 5 spawn rate

**Load Test Results — 50 Concurrent Users:**

| Endpoint | Avg Response | RPS |
|---|---|---|
| GET /api/posts/feed | 72ms | 8.92 |
| GET /api/notifications/ | 52ms | 5.39 |
| GET /api/posts/search | 35-72ms | ~3.5 |
| GET /api/users/techmap | 52ms | 3.36 |
| POST /api/posts/create | 69ms | 1.72 |
| **Total** | **120ms avg** | **23.72** |

---

## Deployment

Deployed on **Render** (free tier):

- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `gunicorn --worker-class eventlet -w 1 --timeout 120 app:app`
- **Database:** PostgreSQL on Render free tier
- Migrations run automatically on startup via `flask db upgrade`

---

## Architecture Decisions

**Why Flask over Django?**
Flask is lightweight and gives full control over structure. For an API-first app with WebSockets, Flask + Flask-SocketIO is simpler to configure than Django Channels.

**Why PostgreSQL ARRAY for skills and branch_target?**
Avoids a separate join table for simple string arrays. PostgreSQL natively supports array operations — simpler schema, faster queries for this scale.

**Why JWT with short expiry + refresh tokens?**
15-minute access tokens limit damage if a token is stolen. 7-day refresh tokens keep users logged in without re-entering passwords. Auto-refresh in the Axios interceptor makes this invisible to users.

**Why denormalize upvote_count on posts?**
Counting upvote rows on every feed request would be slow at scale. Storing the count directly on the post table means one column read instead of a COUNT query — faster feed loading.

---

## Author

**Mahammad Mashood**
[github.com/mashood17](https://github.com/mashood17)

---
