from locust import HttpUser, task, between
import random

# Shared token storage
TEST_EMAIL = "loadtest@campusloop.com"
TEST_PASSWORD = "testpass123"

class CampusLoopUser(HttpUser):
    wait_time = between(1, 3)
    token = None

    def on_start(self):
        """Try to register, then login"""
        # Try register — ignore if already exists
        self.client.post("/api/auth/register", json={
            "name": "Load Test User",
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD,
            "branch": "CSE",
            "year": 3
        })

        # Login
        res = self.client.post("/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })

        if res.status_code == 200:
            self.token = res.json()["access_token"]
        else:
            self.token = None

    def get_headers(self):
        if not self.token:
            return {}
        return {"Authorization": f"Bearer {self.token}"}

    @task(5)
    def get_feed(self):
        if self.token:
            self.client.get("/api/posts/feed", headers=self.get_headers())

    @task(3)
    def get_notifications(self):
        if self.token:
            self.client.get("/api/notifications/", headers=self.get_headers())

    @task(2)
    def search_posts(self):
        if self.token:
            keywords = ["internship", "react", "python", "hackathon", "TCS"]
            keyword = random.choice(keywords)
            self.client.get(
                f"/api/posts/search?q={keyword}",
                headers=self.get_headers()
            )

    @task(1)
    def create_post(self):
        if self.token:
            self.client.post("/api/posts/create", json={
                "title": f"Load Test Post {random.randint(1, 9999)}",
                "body": "This is an automated load test post",
                "category": "resource",
                "branch_target": ["CSE"]
            }, headers=self.get_headers())

    @task(2)
    def get_techmap(self):
        if self.token:
            self.client.get("/api/users/techmap", headers=self.get_headers())