def test_create_post_success(client, auth_headers):
    res = client.post("/api/posts/create", json={
        "title": "Test Internship",
        "body": "This is a test internship post",
        "category": "opportunity",
        "branch_target": ["CSE"],
        "deadline": "2026-12-31"
    }, headers=auth_headers)

    data = res.get_json()
    assert res.status_code == 201
    assert data["post"]["title"] == "Test Internship"
    assert data["post"]["category"] == "opportunity"


def test_create_post_missing_fields(client, auth_headers):
    res = client.post("/api/posts/create", json={
        "title": "Incomplete Post"
        # missing body and category
    }, headers=auth_headers)
    assert res.status_code == 400


def test_create_post_no_auth(client):
    res = client.post("/api/posts/create", json={
        "title": "Unauthorized Post",
        "body": "Should not work",
        "category": "opportunity"
    })
    assert res.status_code == 401


def test_get_feed(client, auth_headers):
    res = client.get("/api/posts/feed", headers=auth_headers)
    data = res.get_json()
    assert res.status_code == 200
    assert "posts" in data
    assert isinstance(data["posts"], list)


def test_get_feed_with_category_filter(client, auth_headers):
    res = client.get("/api/posts/feed?category=opportunity", headers=auth_headers)
    data = res.get_json()
    assert res.status_code == 200
    for post in data["posts"]:
        assert post["category"] == "opportunity"


def test_search_posts(client, auth_headers):
    res = client.get("/api/posts/search?q=internship", headers=auth_headers)
    data = res.get_json()
    assert res.status_code == 200
    assert "posts" in data


def test_search_empty_query(client, auth_headers):
    res = client.get("/api/posts/search?q=", headers=auth_headers)
    data = res.get_json()
    assert res.status_code == 200
    assert data["posts"] == []


def test_upvote_post(client, auth_headers):
    # Create a post first
    create_res = client.post("/api/posts/create", json={
        "title": "Upvote Test Post",
        "body": "Testing upvote feature",
        "category": "resource"
    }, headers=auth_headers)

    post_id = create_res.get_json()["post"]["id"]

    # Upvote it
    res = client.post(f"/api/posts/{post_id}/upvote", headers=auth_headers)
    data = res.get_json()
    assert res.status_code == 200
    assert data["upvoted"] == True
    assert data["upvote_count"] == 1


def test_upvote_toggle(client, auth_headers):
    # Create a post
    create_res = client.post("/api/posts/create", json={
        "title": "Toggle Upvote Post",
        "body": "Testing toggle",
        "category": "resource"
    }, headers=auth_headers)

    post_id = create_res.get_json()["post"]["id"]

    # Upvote
    client.post(f"/api/posts/{post_id}/upvote", headers=auth_headers)

    # Remove upvote
    res = client.post(f"/api/posts/{post_id}/upvote", headers=auth_headers)
    data = res.get_json()
    assert data["upvoted"] == False
    assert data["upvote_count"] == 0


def test_bookmark_post(client, auth_headers):
    # Create a post
    create_res = client.post("/api/posts/create", json={
        "title": "Bookmark Test Post",
        "body": "Testing bookmark",
        "category": "resource"
    }, headers=auth_headers)

    post_id = create_res.get_json()["post"]["id"]

    # Bookmark it
    res = client.post(f"/api/posts/{post_id}/bookmark", headers=auth_headers)
    data = res.get_json()
    assert res.status_code == 200
    assert data["bookmarked"] == True