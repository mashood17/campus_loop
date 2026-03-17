import { useState, useEffect } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";

export default function PlacementHub() {
  const [posts, setPosts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCompany, setActiveCompany] = useState("all");

  useEffect(() => {
    fetchCompanies();
    fetchPosts();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [activeCompany]);

  const fetchCompanies = async () => {
    try {
      const res = await api.get("/api/posts/companies");
      setCompanies(res.data.companies);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const url = activeCompany === "all"
        ? "/api/posts/placement"
        : `/api/posts/placement?company=${activeCompany}`;
      const res = await api.get(url);
      setPosts(res.data.posts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6">

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">PlacementHub</h2>
          <p className="text-gray-500 text-sm mt-1">
            Interview experiences, prep resources and placement timelines
          </p>
        </div>

        {/* Company Filter */}
        {companies.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 mb-2">
              Filter by company:
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setActiveCompany("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition
                  ${activeCompany === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-blue-400"
                  }`}
              >
                All Companies
              </button>
              {companies.map((company) => (
                <button
                  key={company}
                  onClick={() => setActiveCompany(company)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition
                    ${activeCompany === company
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-blue-400"
                    }`}
                >
                  {company}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Posts */}
        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            No placement experiences yet — be the first to share!
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PlacementCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PlacementCard({ post }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">

      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        {post.company_name && (
          <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
            {post.company_name}
          </span>
        )}
        <span className="text-xs text-gray-400">
          ▲ {post.upvote_count} upvotes
        </span>
      </div>

      {/* Title */}
      <h2 className="text-base font-semibold text-gray-800 mb-1">
        {post.title}
      </h2>

      {/* Body */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{post.body}</p>

      {/* Bottom */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{post.author_name} • {post.author_branch}</span>
        <span>{new Date(post.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
}