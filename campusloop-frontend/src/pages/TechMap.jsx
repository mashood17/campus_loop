import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import Navbar from "../components/Navbar";

const BRANCHES = ["All", "CSE", "ECE", "ME", "CE", "EEE"];
const POPULAR_SKILLS = ["React", "Python", "Flutter", "Java", "Node.js", "ML", "Django", "Firebase"];

export default function TechMap() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skillFilter, setSkillFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");
  const [collabOnly, setCollabOnly] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [branchFilter, collabOnly]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (branchFilter !== "All") params.append("branch", branchFilter);
      if (collabOnly) params.append("collab_only", "true");
      if (skillFilter) params.append("skill", skillFilter);

      const res = await api.get(`/api/users/techmap?${params.toString()}`);
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">TechMap</h2>
          <p className="text-gray-500 text-sm mt-1">
            Find students by technology stack — connect and collaborate
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">

          {/* Skill Search */}
          <form onSubmit={handleSkillSearch} className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Search by skill — React, Python, Flutter..."
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
            >
              Search
            </button>
          </form>

          {/* Popular Skills */}
          <div className="flex gap-2 flex-wrap mb-4">
            {POPULAR_SKILLS.map((skill) => (
              <button
                key={skill}
                onClick={() => {
                  setSkillFilter(skill);
                  setTimeout(fetchUsers, 100);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition
                  ${skillFilter === skill
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {skill}
              </button>
            ))}
          </div>

          {/* Branch Filter */}
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs text-gray-500 font-semibold">Branch:</span>
            {BRANCHES.map((branch) => (
              <button
                key={branch}
                onClick={() => setBranchFilter(branch)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition
                  ${branchFilter === branch
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {branch}
              </button>
            ))}

            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer ml-2">
              <input
                type="checkbox"
                checked={collabOnly}
                onChange={(e) => setCollabOnly(e.target.checked)}
                className="w-3 h-3"
              />
              Open to collaborate only
            </label>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4">
          {loading ? "Loading..." : `${users.length} student${users.length !== 1 ? "s" : ""} found`}
        </p>

        {/* Student Grid */}
        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading...</div>
        ) : users.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            No students found with that filter
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {users.map((u) => (
              <StudentCard key={u.id} student={u} currentUserId={user?.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StudentCard({ student, currentUserId }) {
  const isMe = student.id === currentUserId;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-800">
            {student.name}
            {isMe && (
              <span className="ml-2 text-xs text-blue-600 font-normal">(you)</span>
            )}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {student.branch} • Year {student.year}
          </p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
          student.is_open_to_collab
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-500"
        }`}>
          {student.is_open_to_collab ? "Open to collab" : "Busy"}
        </span>
      </div>

      {student.bio && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{student.bio}</p>
      )}

      <div className="flex flex-wrap gap-1 mb-3">
        {(student.skills || []).map((skill) => (
          <span
            key={skill}
            className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium"
          >
            {skill}
          </span>
        ))}
        {(!student.skills || student.skills.length === 0) && (
          <span className="text-xs text-gray-400">No skills added yet</span>
        )}
      </div>
    </div>
  );
}