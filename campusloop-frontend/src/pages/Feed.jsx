import { useAuth } from "../context/AuthContext";

export default function Feed() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h1 className="text-2xl font-bold text-blue-600">Welcome to CampusLoop</h1>
          <p className="text-gray-600 mt-2">Logged in as <span className="font-semibold">{user?.name}</span></p>
          <p className="text-gray-500 text-sm">{user?.branch} • Year {user?.year}</p>
          <button
            onClick={logout}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}