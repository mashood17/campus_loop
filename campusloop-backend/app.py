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
    CORS(app, origins=[app.config["FRONTEND_URL"]])
    socketio.init_app(app, cors_allowed_origins=app.config["FRONTEND_URL"])

    from models.user import User

    from routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    return app

if __name__ == "__main__":
    app = create_app()
    socketio.run(app, debug=True, port=5000)