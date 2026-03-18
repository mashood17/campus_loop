def test_register_success(client):
    res = client.post("/api/auth/register", json={
        "name": "New User",
        "email": "newuser@test.com",
        "password": "password123",
        "branch": "ECE",
        "year": 2
    })
    data = res.get_json()
    assert res.status_code == 201
    assert "access_token" in data
    assert data["user"]["email"] == "newuser@test.com"
    assert data["user"]["branch"] == "ECE"


def test_register_duplicate_email(client):
    # Register first time
    client.post("/api/auth/register", json={
        "name": "Duplicate User",
        "email": "duplicate@test.com",
        "password": "password123",
        "branch": "CSE",
        "year": 1
    })

    # Register again with same email
    res = client.post("/api/auth/register", json={
        "name": "Duplicate User",
        "email": "duplicate@test.com",
        "password": "password123",
        "branch": "CSE",
        "year": 1
    })
    assert res.status_code == 409


def test_register_missing_fields(client):
    res = client.post("/api/auth/register", json={
        "name": "Incomplete User"
        # missing email, password, branch, year
    })
    assert res.status_code == 400


def test_login_success(client):
    # Register first
    client.post("/api/auth/register", json={
        "name": "Login User",
        "email": "loginuser@test.com",
        "password": "password123",
        "branch": "CSE",
        "year": 3
    })

    # Login
    res = client.post("/api/auth/login", json={
        "email": "loginuser@test.com",
        "password": "password123"
    })
    data = res.get_json()
    assert res.status_code == 200
    assert "access_token" in data
    assert "refresh_token" in data


def test_login_wrong_password(client):
    res = client.post("/api/auth/login", json={
        "email": "loginuser@test.com",
        "password": "wrongpassword"
    })
    assert res.status_code == 401


def test_login_wrong_email(client):
    res = client.post("/api/auth/login", json={
        "email": "nobody@test.com",
        "password": "password123"
    })
    assert res.status_code == 401


def test_get_me(client, auth_headers):
    res = client.get("/api/auth/me", headers=auth_headers)
    data = res.get_json()
    assert res.status_code == 200
    assert "user" in data
    assert data["user"]["email"] == "testuser@test.com"


def test_get_me_no_token(client):
    res = client.get("/api/auth/me")
    assert res.status_code == 401