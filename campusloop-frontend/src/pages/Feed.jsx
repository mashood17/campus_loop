import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
import Navbar from "../components/Navbar";

const CATEGORIES = ["all", "opportunity", "resource", "event", "project", "placement"];

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

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
      <Navbar />

      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6">

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