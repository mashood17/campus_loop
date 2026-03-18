import pytest
from app import create_app
from extensions import db as _db
import os

@pytest.fixture(scope="session")
def app():
    os.environ["DATABASE_URL"] = "postgresql://postgres:postgres123@localhost/campusloop_test"
    os.environ["JWT_SECRET_KEY"] = "test-secret-key"
    os.environ["FLASK_ENV"] = "testing"
    os.environ["FRONTEND_URL"] = "http://localhost:5173"

    app = create_app()
    app.config["TESTING"] = True

    with app.app_context():
        _db.create_all()
        yield app
        _db.drop_all()

@pytest.fixture(scope="session")
def client(app):
    return app.test_client()

@pytest.fixture(scope="session")
def auth_headers(client):
    # Register a test user
    client.post("/api/auth/register", json={
        "name": "Test User",
        "email": "testuser@test.com",
        "password": "testpass123",
        "branch": "CSE",
        "year": 3
    })

    # Login and get token
    res = client.post("/api/auth/login", json={
        "email": "testuser@test.com",
        "password": "testpass123"
    })

    token = res.get_json()["access_token"]
    return {"Authorization": f"Bearer {token}"}