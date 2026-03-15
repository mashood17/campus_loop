import uuid
from datetime import datetime, timezone
from extensions import db

class Notification(db.Model):
    __tablename__ = "notifications"

    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String, db.ForeignKey("users.id"), nullable=False)
    post_id = db.Column(db.String, db.ForeignKey("posts.id"), nullable=True)
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "post_id": self.post_id,
            "message": self.message,
            "is_read": self.is_read,
            "created_at": self.created_at.isoformat()
        }