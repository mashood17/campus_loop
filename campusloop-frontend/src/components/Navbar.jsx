import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <nav className="bg-white shadow-sm px-4 py-3 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto flex justify-between items-center">

        {/* Left — Logo */}
        <h1
          onClick={() => navigate("/feed")}
          className="text-lg font-bold text-blue-600 cursor-pointer"
        >
          CampusLoop
        </h1>

        {/* Desktop links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => navigate("/feed")}
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
          >
            Feed
          </button>
          <button
            onClick={() => navigate("/search")}
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
          >
            🔍 Search
          </button>
          <button
            onClick={() => navigate("/techmap")}
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
          >
            TechMap
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
          >
            Dashboard
          </button>
           <button
              onClick={() => navigate("/placement")}
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
            >
              PlacementHub
            </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <NotificationBell />

          {/* Hamburger — only on mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-600 text-xl"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          {/* Desktop user info */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="text-sm text-red-500 hover:underline"
            >
              Logout
            </button>
           
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-3 border-t border-gray-100 pt-3 space-y-2 px-2">
          <p className="text-xs text-gray-400 px-2">{user?.name} • {user?.branch}</p>
          <button
            onClick={() => { navigate("/feed"); setMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            Feed
          </button>
          <button
            onClick={() => { navigate("/search"); setMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            🔍 Search
          </button>
          <button
            onClick={() => { navigate("/techmap"); setMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            TechMap
          </button>
          <button
            onClick={() => { navigate("/dashboard"); setMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            Dashboard
          </button>
          <button
            onClick={() => { navigate("/placement"); setMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            PlacementHub
          </button>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
          
        </div>
      )}
      {/* Logout Confirmation Modal */}
{showLogoutConfirm && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
      <h3 className="text-lg font-bold text-gray-800 mb-2">
        Log out?
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        You'll need to log back in to access your feed.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => setShowLogoutConfirm(false)}
          className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={() => { logout(); setShowLogoutConfirm(false); }}
          className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition"
        >
          Log out
        </button>
      </div>
    </div>
  </div>
)}
    </nav>
  );
}