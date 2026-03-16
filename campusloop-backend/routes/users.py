from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.user import User

users_bp = Blueprint("users", __name__)

# ─── GET PUBLIC PROFILE ──────────────────────────────
@users_bp.route("/profile/<user_id>", methods=["GET"])
@jwt_required()
def get_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"user": user.to_dict()}), 200


# ─── UPDATE OWN PROFILE ──────────────────────────────
@users_bp.route("/profile/update", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.get_json()

    if data.get("bio") is not None:
        user.bio = data["bio"]
    if data.get("skills") is not None:
        user.skills = data["skills"]
    if data.get("is_open_to_collab") is not None:
        user.is_open_to_collab = data["is_open_to_collab"]

    db.session.commit()
    return jsonify({"user": user.to_dict()}), 200


# ─── TECHMAP ─────────────────────────────────────────
@users_bp.route("/techmap", methods=["GET"])
@jwt_required()
def techmap():
    skill = request.args.get("skill")
    branch = request.args.get("branch")
    collab_only = request.args.get("collab_only") == "true"

    query = User.query

    if branch:
        query = query.filter_by(branch=branch)

    if collab_only:
        query = query.filter_by(is_open_to_collab=True)

    users = query.all()

    # Filter by skill in Python since ARRAY contains is tricky
    if skill:
        users = [u for u in users if u.skills and skill.lower() in [s.lower() for s in u.skills]]

    return jsonify({
        "users": [u.to_dict() for u in users]
    }), 200


# ─── GET BOOKMARKED POSTS ────────────────────────────
@users_bp.route("/bookmarks", methods=["GET"])
@jwt_required()
def get_bookmarks():
    user_id = get_jwt_identity()
    from models.bookmark import Bookmark
    from models.post import Post

    bookmarks = Bookmark.query.filter_by(user_id=user_id).all()
    post_ids = [b.post_id for b in bookmarks]
    posts = Post.query.filter(Post.id.in_(post_ids)).all()

    return jsonify({
        "posts": [p.to_dict() for p in posts]
    }), 200