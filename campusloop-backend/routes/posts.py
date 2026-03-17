from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db, socketio
from models.post import Post
from models.user import User
from models.notification import Notification
from models.upvote import Upvote
from models.bookmark import Bookmark

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

    # Create notifications for branch users
    if "ALL" in post.branch_target:
        target_users = User.query.filter(User.id != user_id).all()
    else:
        target_users = User.query.filter(
            User.branch.in_(post.branch_target),
            User.id != user_id
        ).all()

    for target_user in target_users:
        notification = Notification(
            user_id=target_user.id,
            post_id=post.id,
            message=f"New {post.category} post: {post.title}"
        )
        db.session.add(notification)

    db.session.commit()

    # Emit real-time events
    for branch in post.branch_target:
        socketio.emit("new_post", {
            "title": post.title,
            "category": post.category,
            "author": post.author.name
        }, room=branch)
        socketio.emit("notification_update", room=branch)

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

    posts_query = Post.query.filter(
        db.or_(
            db.cast(user.branch, db.String) == db.any_(Post.branch_target),
            db.cast("ALL", db.String) == db.any_(Post.branch_target)
        )
    )

    if category:
        posts_query = posts_query.filter_by(category=category)

    posts = posts_query.order_by(Post.created_at.desc()).all()

    # Get user's upvotes and bookmarks for these posts
    post_ids = [p.id for p in posts]
    user_upvotes = {u.post_id for u in Upvote.query.filter(
        Upvote.user_id == user_id,
        Upvote.post_id.in_(post_ids)
    ).all()}
    user_bookmarks = {b.post_id for b in Bookmark.query.filter(
        Bookmark.user_id == user_id,
        Bookmark.post_id.in_(post_ids)
    ).all()}

    result = []
    for post in posts:
        post_dict = post.to_dict()
        post_dict["is_upvoted"] = post.id in user_upvotes
        post_dict["is_bookmarked"] = post.id in user_bookmarks
        result.append(post_dict)

    return jsonify({"posts": result}), 200


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


# ─── TOGGLE UPVOTE ───────────────────────────────────
@posts_bp.route("/<post_id>/upvote", methods=["POST"])
@jwt_required()
def toggle_upvote(post_id):
    user_id = get_jwt_identity()

    post = Post.query.get(post_id)
    if not post:
        return jsonify({"error": "Post not found"}), 404

    existing = Upvote.query.filter_by(user_id=user_id, post_id=post_id).first()

    if existing:
        # Remove upvote
        db.session.delete(existing)
        post.upvote_count = max(0, post.upvote_count - 1)
        upvoted = False
    else:
        # Add upvote
        upvote = Upvote(user_id=user_id, post_id=post_id)
        db.session.add(upvote)
        post.upvote_count += 1
        upvoted = True

    db.session.commit()

    return jsonify({
        "upvoted": upvoted,
        "upvote_count": post.upvote_count
    }), 200


# ─── TOGGLE BOOKMARK ─────────────────────────────────
@posts_bp.route("/<post_id>/bookmark", methods=["POST"])
@jwt_required()
def toggle_bookmark(post_id):
    user_id = get_jwt_identity()

    post = Post.query.get(post_id)
    if not post:
        return jsonify({"error": "Post not found"}), 404

    existing = Bookmark.query.filter_by(user_id=user_id, post_id=post_id).first()

    if existing:
        db.session.delete(existing)
        bookmarked = False
    else:
        bookmark = Bookmark(user_id=user_id, post_id=post_id)
        db.session.add(bookmark)
        bookmarked = True

    db.session.commit()

    return jsonify({
        "bookmarked": bookmarked
    }), 200
    

# ─── SEARCH POSTS ────────────────────────────────────
@posts_bp.route("/search", methods=["GET"])
@jwt_required()
def search_posts():
    keyword = request.args.get("q", "").strip()
    category = request.args.get("category")
    branch = request.args.get("branch")

    if not keyword:
        return jsonify({"posts": []}), 200

    query = Post.query.filter(
        db.or_(
            Post.title.ilike(f"%{keyword}%"),
            Post.body.ilike(f"%{keyword}%")
        )
    )

    if category:
        query = query.filter_by(category=category)

    if branch:
        query = query.filter(
            db.or_(
                db.cast(branch, db.String) == db.any_(Post.branch_target),
                db.cast("ALL", db.String) == db.any_(Post.branch_target)
            )
        )

    posts = query.order_by(Post.created_at.desc()).all()

    return jsonify({
        "posts": [post.to_dict() for post in posts]
    }), 200
    
    
# ─── GET PLACEMENT POSTS ─────────────────────────────
@posts_bp.route("/placement", methods=["GET"])
@jwt_required()
def get_placement_posts():
    company = request.args.get("company")

    query = Post.query.filter_by(category="placement")

    if company:
        query = query.filter(Post.company_name.ilike(f"%{company}%"))

    posts = query.order_by(Post.upvote_count.desc()).all()

    return jsonify({
        "posts": [post.to_dict() for post in posts]
    }), 200


# ─── GET ALL COMPANIES ────────────────────────────────
@posts_bp.route("/companies", methods=["GET"])
@jwt_required()
def get_companies():
    results = db.session.query(Post.company_name)\
        .filter(Post.category == "placement")\
        .filter(Post.company_name != None)\
        .distinct().all()

    companies = [r[0] for r in results if r[0]]
    return jsonify({"companies": companies}), 200