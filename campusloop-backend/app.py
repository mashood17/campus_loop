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
    socketio.init_app(app, cors_allowed_origins="*")

    from models.user import User
    from models.post import Post
    from models.notification import Notification

    from routes.auth import auth_bp
    from routes.posts import posts_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(posts_bp, url_prefix="/api/posts")

    from sockets.events import handle_connect, handle_join_branch, handle_disconnect

    from routes.notifications import notifications_bp
    app.register_blueprint(notifications_bp, url_prefix="/api/notifications")

    return app

if __name__ == "__main__":
    app = create_app()
    socketio.run(app, debug=True, port=5000)