import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("taskflow_user");
    const token = localStorage.getItem("taskflow_token");
    if (savedUser && token) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing saved user data:", error);
        localStorage.removeItem("taskflow_user");
        localStorage.removeItem("taskflow_token");
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    console.log("User logged in:", userData);
    setUser(userData);
    localStorage.setItem("taskflow_user", JSON.stringify(userData));
    localStorage.setItem("taskflow_token", token);
  };

  const handleSignup = (userData, token) => {
    console.log("User signed up:", userData);
    setUser(userData);
    localStorage.setItem("taskflow_user", JSON.stringify(userData));
    localStorage.setItem("taskflow_token", token);
  };

  const handleLogout = () => {
    console.log("User logged out");
    setUser(null);
    localStorage.removeItem("taskflow_user");
    localStorage.removeItem("taskflow_token");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/auth/login"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/auth/signup"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <SignupPage onSignup={handleSignup} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <DashboardPage user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
