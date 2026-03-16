import uuid
from datetime import datetime, timezone
from extensions import db

class Bookmark(db.Model):
    __tablename__ = "bookmarks"

    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String, db.ForeignKey("users.id"), nullable=False)
    post_id = db.Column(db.String, db.ForeignKey("posts.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))