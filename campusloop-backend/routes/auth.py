from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity
)
import bcrypt
from extensions import db
from models.user import User

auth_bp = Blueprint("auth", __name__)

# ─── REGISTER ───────────────────────────────────────
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    # Validate required fields
    required = ["name", "email", "password", "branch", "year"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    # Check if email already exists
    existing = User.query.filter_by(email=data["email"]).first()
    if existing:
        return jsonify({"error": "Email already registered"}), 409

    # Hash the password
    password_hash = bcrypt.hashpw(
        data["password"].encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    # Create new user
    user = User(
        name=data["name"],
        email=data["email"],
        password_hash=password_hash,
        branch=data["branch"],
        year=int(data["year"]),
        skills=data.get("skills", []),
        bio=data.get("bio", "")
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "Account created successfully",
        "user": user.to_dict()
    }), 201


# ─── LOGIN ──────────────────────────────────────────
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password required"}), 400

    # Find user by email
    user = User.query.filter_by(email=data["email"]).first()
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    # Check password
    password_matches = bcrypt.checkpw(
        data["password"].encode("utf-8"),
        user.password_hash.encode("utf-8")
    )
    if not password_matches:
        return jsonify({"error": "Invalid email or password"}), 401

    # Generate tokens
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)

    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user.to_dict()
    }), 200


# ─── REFRESH TOKEN ──────────────────────────────────
@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    new_access_token = create_access_token(identity=identity)
    return jsonify({"access_token": new_access_token}), 200


# ─── GET CURRENT USER ───────────────────────────────
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"user": user.to_dict()}), 200