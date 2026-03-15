const CATEGORY_COLORS = {
  opportunity: "bg-green-100 text-green-700",
  resource: "bg-blue-100 text-blue-700",
  event: "bg-purple-100 text-purple-700",
  project: "bg-yellow-100 text-yellow-700",
  placement: "bg-red-100 text-red-700",
};

export default function PostCard({ post }) {
  const isExpiringSoon = () => {
    if (!post.deadline) return false;
    const deadline = new Date(post.deadline);
    const now = new Date();
    const diff = (deadline - now) / (1000 * 60 * 60);
    return diff <= 48 && diff > 0;
  };

  return (
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
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.body}</p>

      {/* Bottom row */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{post.author_name} • {post.author_branch}</span>
        <div className="flex items-center gap-3">
          {post.deadline && (
            <span>Deadline: {new Date(post.deadline).toLocaleDateString()}</span>
          )}
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}