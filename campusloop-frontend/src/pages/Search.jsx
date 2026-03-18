import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import PostCard from "../components/PostCard";
import Navbar from "../components/Navbar";
import { Helmet } from "react-helmet-async";

const CATEGORIES = ["all", "opportunity", "resource", "event", "project", "placement"];

export default function Search() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const debounceRef = useRef(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchResults(query, activeCategory);
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [query, activeCategory]);

  const fetchResults = async (q, cat) => {
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      params.append("q", q);
      if (cat !== "all") params.append("category", cat);
      const res = await api.get(`/api/posts/search?${params.toString()}`);
      setResults(res.data.posts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet><title>Search — CampusLoop</title></Helmet>
      <Navbar />

      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6">

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search posts, opportunities, resources..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full border border-gray-200 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
          />
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

        {/* Results */}
        {query.length < 2 ? (
          <div className="text-center text-gray-400 py-12">
            Type at least 2 characters to search
          </div>
        ) : loading ? (
          <div className="text-center text-gray-400 py-12">Searching...</div>
        ) : searched && results.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            No results found for "{query}"
          </div>
        ) : (
          <div className="space-y-4">
            {results.length > 0 && (
              <p className="text-sm text-gray-500 mb-2">
                {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
              </p>
            )}
            {results.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}