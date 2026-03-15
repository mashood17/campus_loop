from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.post import Post
from models.user import User

posts_bp = Blueprint("posts", __name__)

# ─── CREATE POST ─────────────────────────────────────
@posts_bp.route("/create", methods=["POST"])
@jwt_required()
def create_post():
    user_id = get_jwt_identity()
    data = request.get_json()

    required = ["title", "body", "category"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    post = Post(
        user_id=user_id,
        title=data["title"],
        body=data["body"],
        category=data["category"],
        branch_target=data.get("branch_target", ["ALL"]),
        year_target=data.get("year_target", None),
        deadline=data.get("deadline", None),
        is_anonymous=data.get("is_anonymous", False)
    )

    db.session.add(post)
    db.session.commit()

    return jsonify({
        "message": "Post created successfully",
        "post": post.to_dict()
    }), 201


# ─── GET FEED ────────────────────────────────────────
@posts_bp.route("/feed", methods=["GET"])
@jwt_required()
def get_feed():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    category = request.args.get("category")

    posts = Post.query.filter(
        db.or_(
            db.cast(user.branch, db.String) == db.any_(Post.branch_target),
            db.cast("ALL", db.String) == db.any_(Post.branch_target)
        )
    )

    if category:
        posts = posts.filter_by(category=category)

    posts = posts.order_by(Post.created_at.desc()).all()

    return jsonify({
        "posts": [post.to_dict() for post in posts]
    }), 200


# ─── GET SINGLE POST ─────────────────────────────────
@posts_bp.route("/<post_id>", methods=["GET"])
@jwt_required()
def get_post(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"error": "Post not found"}), 404
    return jsonify({"post": post.to_dict()}), 200


# ─── DELETE POST ─────────────────────────────────────
@posts_bp.route("/<post_id>", methods=["DELETE"])
@jwt_required()
def delete_post(post_id):
    user_id = get_jwt_identity()
    post = Post.query.get(post_id)

    if not post:
        return jsonify({"error": "Post not found"}), 404
    if post.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(post)
    db.session.commit()

    return jsonify({"message": "Post deleted"}), 200