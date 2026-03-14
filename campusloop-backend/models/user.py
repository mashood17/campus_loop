import uuid
from datetime import datetime, timezone
from app import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    branch = db.Column(db.String(50), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    skills = db.Column(db.ARRAY(db.String), default=[])
    bio = db.Column(db.Text, nullable=True)
    is_open_to_collab = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f"<User {self.name} | {self.branch} Year {self.year}>"

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "branch": self.branch,
            "year": self.year,
            "skills": self.skills or [],
            "bio": self.bio,
            "is_open_to_collab": self.is_open_to_collab,
            "created_at": self.created_at.isoformat()
        }