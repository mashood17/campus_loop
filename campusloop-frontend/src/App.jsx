import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import TechMap from "./pages/TechMap";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";



function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/feed" element={
              <ProtectedRoute><Feed /></ProtectedRoute>
            } />
            <Route path="/techmap" element={
              <ProtectedRoute><TechMap /></ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;