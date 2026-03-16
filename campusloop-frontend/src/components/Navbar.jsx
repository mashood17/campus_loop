import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
              onClick={logout}
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
            onClick={logout}
            className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}