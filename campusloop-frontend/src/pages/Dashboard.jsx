import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import PostCard from "../components/PostCard";
import NotificationBell from "../components/NotificationBell";
import Navbar from "../components/Navbar";
import { Helmet } from 'react-helmet-async'


const TABS = ["saved", "your posts", "edit profile"];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("saved");
  const [savedPosts, setSavedPosts] = useState([]);
  const [yourPosts, setYourPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Edit profile state
  const [bio, setBio] = useState(user?.bio || "");
  const [skills, setSkills] = useState(user?.skills?.join(", ") || "");
  const [isOpenToCollab, setIsOpenToCollab] = useState(user?.is_open_to_collab ?? true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    if (activeTab === "saved") fetchSaved();
    if (activeTab === "your posts") fetchYourPosts();
  }, [activeTab]);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/users/bookmarks");
      setSavedPosts(res.data.posts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchYourPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/posts/feed");
      const mine = res.data.posts.filter(p => p.user_id === user?.id);
      setYourPosts(mine);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      const skillsArray = skills
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0);

      await api.put("/api/users/profile/update", {
        bio,
        skills: skillsArray,
        is_open_to_collab: isOpenToCollab
      });
      setSaveMsg("Profile updated successfully!");
    } catch (err) {
      setSaveMsg("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <Helmet><title>Dashboard — CampusLoop</title></Helmet>
    
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <Navbar />


      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
              <p className="text-gray-500 text-sm mt-1">
                {user?.branch} • Year {user?.year}
              </p>
              <p className="text-gray-600 text-sm mt-2">{user?.bio || "No bio yet"}</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
              user?.is_open_to_collab
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}>
              {user?.is_open_to_collab ? "Open to collab" : "Busy"}
            </span>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {(user?.skills || []).map((skill) => (
              <span
                key={skill}
                className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium"
              >
                {skill}
              </span>
            ))}
            {(!user?.skills || user.skills.length === 0) && (
              <span className="text-xs text-gray-400">No skills added yet — edit profile to add</span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition
                ${activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-blue-400"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}

        {/* Saved Posts */}
        {activeTab === "saved" && (
          <div>
            {loading ? (
              <div className="text-center text-gray-400 py-12">Loading...</div>
            ) : savedPosts.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                No saved posts yet — bookmark posts from the feed
              </div>
            ) : (
              <div className="space-y-4">
                {savedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Your Posts */}
        {activeTab === "your posts" && (
          <div>
            {loading ? (
              <div className="text-center text-gray-400 py-12">Loading...</div>
            ) : yourPosts.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                You haven't posted anything yet
              </div>
            ) : (
              <div className="space-y-4">
                {yourPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Edit Profile */}
        {activeTab === "edit profile" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Edit Profile</h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell people what you're working on..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, Python, Flutter, ML..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Separate each skill with a comma
                </p>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOpenToCollab}
                  onChange={(e) => setIsOpenToCollab(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">
                  I'm open to collaborate on projects
                </span>
              </label>

              {saveMsg && (
                <p className={`text-sm font-medium ${
                  saveMsg.includes("success") ? "text-green-600" : "text-red-500"
                }`}>
                  {saveMsg}
                </p>
              )}

              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}