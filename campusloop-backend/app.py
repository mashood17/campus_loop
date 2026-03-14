from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import Config

db = SQLAlchemy()
jwt = JWTManager()
socketio = SocketIO()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    CORS(app, origins=[app.config["FRONTEND_URL"]])
    socketio.init_app(app, cors_allowed_origins=app.config["FRONTEND_URL"])

    # Import models here so Flask-Migrate can detect them
    from models.user import User

    return app

if __name__ == "__main__":
    app = create_app()
    socketio.run(app, debug=True, port=5000)