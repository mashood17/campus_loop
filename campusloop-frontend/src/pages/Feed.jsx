import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import PostCard from "../components/PostCard";
import NotificationBell from "../components/NotificationBell";
import CreatePost from "../components/CreatePost";
import { useNavigate } from "react-router-dom";


const CATEGORIES = ["all", "opportunity", "resource", "event", "project", "placement"];

export default function Feed() {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [activeCategory]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const url = activeCategory === "all"
        ? "/api/posts/feed"
        : `/api/posts/feed?category=${activeCategory}`;
      const res = await api.get(url);
      setPosts(res.data.posts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
  <div className="flex items-center gap-6">
    <h1 className="text-xl font-bold text-blue-600">CampusLoop</h1>
    <button
      onClick={() => navigate("/techmap")}
      className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
    >
      TechMap
    </button>
  </div>
  <div className="flex items-center gap-4">
    <span className="text-sm text-gray-600">{user?.name} • {user?.branch}</span>
    <NotificationBell />
    <button onClick={logout} className="text-sm text-red-500 hover:underline">
      Logout
    </button>
  </div>
</nav>

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Create Post */}
        <div className="mb-6">
          <CreatePost onPostCreated={handlePostCreated} />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition
                ${activeCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-blue-400"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts */}
        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            No posts yet. Be the first to post!
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}