import uuid
from datetime import datetime, timezone
from extensions import db

class Post(db.Model):
    __tablename__ = "posts"

    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    body = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    # opportunity / resource / event / project / placement
    branch_target = db.Column(db.ARRAY(db.String), default=["ALL"])
    year_target = db.Column(db.ARRAY(db.Integer), nullable=True)
    deadline = db.Column(db.Date, nullable=True)
    is_anonymous = db.Column(db.Boolean, default=False)
    upvote_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationship — lets us access post.author directly
    author = db.relationship("User", backref="posts")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "author_name": self.author.name if not self.is_anonymous else "Anonymous",
            "author_branch": self.author.branch,
            "title": self.title,
            "body": self.body,
            "category": self.category,
            "branch_target": self.branch_target or ["ALL"],
            "year_target": self.year_target,
            "deadline": self.deadline.isoformat() if self.deadline else None,
            "is_anonymous": self.is_anonymous,
            "upvote_count": self.upvote_count,
            "created_at": self.created_at.isoformat()
        }