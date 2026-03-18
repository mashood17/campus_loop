import { useState } from "react";
import api from "../utils/api";
import Toast from "./Toast";
import useToast from "../hooks/useToast";

const CATEGORY_COLORS = {
  opportunity: "bg-green-100 text-green-700",
  resource: "bg-blue-100 text-blue-700",
  event: "bg-purple-100 text-purple-700",
  project: "bg-yellow-100 text-yellow-700",
  placement: "bg-red-100 text-red-700",
};

export default function PostCard({ post }) {
  const [upvoteCount, setUpvoteCount] = useState(post.upvote_count || 0);
  const [isUpvoted, setIsUpvoted] = useState(post.is_upvoted || false);
  const [isBookmarked, setIsBookmarked] = useState(post.is_bookmarked || false);
  const { toast, showToast, hideToast } = useToast();

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
      showToast("Failed to upvote", "error");
    }
  };

  const handleBookmark = async () => {
    const newState = !isBookmarked;
    setIsBookmarked(newState);
    try {
      await api.post(`/api/posts/${post.id}/bookmark`);
      showToast(newState ? "Post saved to bookmarks 🔖" : "Removed from bookmarks");
    } catch (err) {
      setIsBookmarked(!newState);
    }
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">

        {/* Top row */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${CATEGORY_COLORS[post.category] || "bg-gray-100 text-gray-600"}`}>
            {post.category}
          </span>
          {isExpiringSoon() && (
            <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
              ⏰ Expiring soon
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-base font-semibold text-gray-800 mb-1">{post.title}</h2>

        {/* Body */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{post.body}</p>

        {/* Bottom row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-gray-400">
            <span>{post.author_name} • {post.author_branch}</span>
            {post.deadline && (
              <span className="ml-2">· Due: {new Date(post.deadline).toLocaleDateString()}</span>
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
    </>
  );
}