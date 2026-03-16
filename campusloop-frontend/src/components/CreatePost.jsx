import { useState } from "react";
import api from "../utils/api";

const CATEGORIES = ["opportunity", "resource", "event", "project", "placement"];
const BRANCHES = ["CSE", "ECE", "ME", "CE", "EEE"];

export default function CreatePost({ onPostCreated }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    body: "",
    category: "opportunity",
    branch_target: ["ALL"],
    deadline: "",
    is_anonymous: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const toggleBranch = (branch) => {
    if (branch === "ALL") {
      setFormData({ ...formData, branch_target: ["ALL"] });
      return;
    }
    let current = formData.branch_target.filter(b => b !== "ALL");
    if (current.includes(branch)) {
      current = current.filter(b => b !== branch);
    } else {
      current = [...current, branch];
    }
    setFormData({ ...formData, branch_target: current.length ? current : ["ALL"] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...formData,
        deadline: formData.deadline || null,
      };
      const res = await api.post("/api/posts/create", payload);
      onPostCreated(res.data.post);
      setOpen(false);
      setFormData({
        title: "",
        body: "",
        category: "opportunity",
        branch_target: ["ALL"],
        deadline: "",
        is_anonymous: false,
      });
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Create Post Button */}
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-white border-2 border-dashed border-blue-300 rounded-2xl px-5 py-4 text-blue-500 text-sm font-medium hover:border-blue-500 hover:bg-blue-50 transition text-left"
      >
        + Share an opportunity, resource, or update...
      </button>

      {/* Modal Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-5 sm:p-6 max-h-screen overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-800">Create Post</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Category */}
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition
                      ${formData.category === cat
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Title */}
              <input
                type="text"
                name="title"
                placeholder="Title — be specific and clear"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Body */}
              <textarea
                name="body"
                placeholder="Details — link, description, what students need to know..."
                value={formData.body}
                onChange={handleChange}
                required
                rows={4}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />

              {/* Branch Target */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  Target branches:
                </p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => toggleBranch("ALL")}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition
                      ${formData.branch_target.includes("ALL")
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    ALL
                  </button>
                  {BRANCHES.map((branch) => (
                    <button
                      key={branch}
                      type="button"
                      onClick={() => toggleBranch(branch)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition
                        ${formData.branch_target.includes(branch)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                      {branch}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deadline — only for opportunity */}
              {formData.category === "opportunity" && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">
                    Deadline (optional)
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Anonymous toggle — only for placement */}
              {formData.category === "placement" && (
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_anonymous"
                    checked={formData.is_anonymous}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  Post anonymously
                </label>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}