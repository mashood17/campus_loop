import { useState, useEffect, useRef } from "react";
import api from "../utils/api";
import Toast from "./Toast";
import useToast from "../hooks/useToast";
import { useAuth } from "../context/AuthContext";
import timeAgo from "../utils/timeAgo";
import Linkify from "../utils/linkify";

const CATEGORY_COLORS = {
  opportunity: "bg-green-100 text-green-700",
  resource: "bg-blue-100 text-blue-700",
  event: "bg-purple-100 text-purple-700",
  project: "bg-yellow-100 text-yellow-700",
  placement: "bg-red-100 text-red-700",
};

export default function PostCard({ post, onDelete, onEdit }) {
  const { user } = useAuth();
  const [upvoteCount, setUpvoteCount] = useState(post.upvote_count || 0);
  const [isUpvoted, setIsUpvoted] = useState(post.is_upvoted || false);
  const [isBookmarked, setIsBookmarked] = useState(post.is_bookmarked || false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editBody, setEditBody] = useState(post.body);
  const [editLoading, setEditLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  const menuRef = useRef(null);

  const isOwner = user?.id === post.user_id;
  const isLong = post.body.length > 150;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isExpiringSoon = () => {
    if (!post.deadline) return false;
    const deadline = new Date(post.deadline);
    const now = new Date();
    const diff = (deadline - now) / (1000 * 60 * 60);
    return diff <= 48 && diff > 0;
  };

  const handleUpvote = async () => {
    setIsUpvoted(!isUpvoted);
    setUpvoteCount(isUpvoted ? upvoteCount - 1 : upvoteCount + 1);
    try {
      const res = await api.post(`/api/posts/${post.id}/upvote`);
      setUpvoteCount(res.data.upvote_count);
      setIsUpvoted(res.data.upvoted);
      showToast(res.data.upvoted ? "Upvoted! ▲" : "Upvote removed", res.data.upvoted ? "success" : "info");
    } catch (err) {
      setIsUpvoted(!isUpvoted);
      setUpvoteCount(upvoteCount);
    }
  };

  const handleBookmark = async () => {
    const newState = !isBookmarked;
    setIsBookmarked(newState);
    try {
      await api.post(`/api/posts/${post.id}/bookmark`);
      showToast(newState ? "Post saved 🔖" : "Removed from bookmarks");
    } catch (err) {
      setIsBookmarked(!newState);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/posts/${post.id}`);
      showToast("Post deleted successfully");
      setShowDeleteConfirm(false);
      if (onDelete) onDelete(post.id);
    } catch (err) {
      showToast("Failed to delete post", "error");
    }
  };

  const handleEdit = async () => {
    setEditLoading(true);
    try {
      const res = await api.put(`/api/posts/${post.id}`, {
        title: editTitle,
        body: editBody,
      });
      showToast("Post updated successfully ✓");
      setShowEditModal(false);
      if (onEdit) onEdit(post.id, res.data.post);
    } catch (err) {
      showToast("Failed to update post", "error");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">

        {/* Top row */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${CATEGORY_COLORS[post.category] || "bg-gray-100 text-gray-600"}`}>
            {post.category}
          </span>
          <div className="flex items-center gap-2">
            {isExpiringSoon() && (
              <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                ⏰ Expiring soon
              </span>
            )}

            {/* Three dot menu — owner only */}
            {isOwner && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-100 transition font-bold text-lg"
                >
                  ⋮
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 z-20">
                    <button
                      onClick={() => { setShowEditModal(true); setMenuOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-xl"
                    >
                      ✏️ Edit post
                    </button>
                    <button
                      onClick={() => { setShowDeleteConfirm(true); setMenuOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-b-xl"
                    >
                      🗑️ Delete post
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-base font-semibold text-gray-800 mb-2">
          {post.title}
        </h2>

        {/* Body — expandable */}
        <div className="mb-3">
          <p className={`text-sm text-gray-600 leading-relaxed ${!expanded && isLong ? "line-clamp-3" : ""}`}>
            <Linkify text={post.body} />
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-blue-500 font-semibold mt-1 hover:text-blue-700 transition"
            >
              {expanded ? "Show less ▲" : "Read more ▼"}
            </button>
          )}
        </div>

        {/* Company tag for placement */}
        {post.company_name && (
          <span className="inline-block bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            {post.company_name}
          </span>
        )}

        {/* Bottom row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-50">
          <div className="text-xs text-gray-400">
            <span>{post.author_name} • {post.author_branch}</span>
            <span className="ml-2">· {timeAgo(post.created_at)}</span>
            {post.deadline && (
              <span className="ml-2">
                · Due: {new Date(post.deadline).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full transition
                ${isUpvoted
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              ▲ {upvoteCount}
            </button>

            <button
              onClick={handleBookmark}
              className={`text-xs font-semibold px-3 py-1 rounded-full transition
                ${isBookmarked
                  ? "bg-yellow-400 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {isBookmarked ? "Saved ✓" : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Delete Post?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. The post will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800">Edit Post</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Title"
              />
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                rows={5}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Body"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEdit}
                  disabled={editLoading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}