from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, jwt, socketio, migrate

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    CORS(app, origins="*")
    socketio.init_app(
        app,
        cors_allowed_origins="*",
        async_mode="eventlet"
    )

    from models.user import User
    from models.post import Post
    from models.notification import Notification
    from models.upvote import Upvote
    from models.bookmark import Bookmark

    from routes.auth import auth_bp
    from routes.posts import posts_bp
    from routes.notifications import notifications_bp
    from routes.users import users_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(posts_bp, url_prefix="/api/posts")
    app.register_blueprint(notifications_bp, url_prefix="/api/notifications")
    app.register_blueprint(users_bp, url_prefix="/api/users")

    from sockets.events import handle_connect, handle_join_branch, handle_disconnect

    return app

app = create_app()

if __name__ == "__main__":
    socketio.run(app, debug=False, port=5000)