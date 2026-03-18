import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
import Navbar from "../components/Navbar";
import SkeletonCard from "../components/SkeletonCard";
import EmptyState from "../components/EmptyState";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";
import { Helmet } from 'react-helmet-async'


const CATEGORIES = ["all", "opportunity", "resource", "event", "project", "placement"];

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, [activeCategory]);

  // Refresh feed when user navigates back to this page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchPosts();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
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
    setPosts(prev => [newPost, ...prev]);
    showToast("Post shared successfully! 🎉");
  };

  const handleDeletePost = (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const handleEditPost = (postId, updatedPost) => {
    setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
  };

  return (
    <>
    <Helmet><title>Feed — CampusLoop</title></Helmet>
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}

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
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            emoji="📬"
            title="No posts yet"
            subtitle="Be the first to share an opportunity or resource!"
          />
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={handleDeletePost}
                onEdit={handleEditPost}
              />
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}