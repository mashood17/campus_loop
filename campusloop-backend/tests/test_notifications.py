def test_get_notifications(client, auth_headers):
    res = client.get("/api/notifications/", headers=auth_headers)
    data = res.get_json()
    assert res.status_code == 200
    assert "notifications" in data
    assert "unread_count" in data


def test_get_notifications_no_auth(client):
    res = client.get("/api/notifications/")
    assert res.status_code == 401


def test_mark_all_read(client, auth_headers):
    res = client.put("/api/notifications/read-all", headers=auth_headers)
    assert res.status_code == 200

    # Verify unread count is 0
    res2 = client.get("/api/notifications/", headers=auth_headers)
    data = res2.get_json()
    assert data["unread_count"] == 0