// frontend/src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

import Home from './pages/Home';
import JobListings from './pages/JobListings';
import JobDetails from './pages/JobDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import MyApplications from './pages/MyApplications';
import SkillDevelopment from './pages/SkillDevelopment';
import Counseling from './pages/Counseling';
import About from './pages/About';

import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

const FullPageSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Admin-only wrapper (no navbar/footer/chatbot)
const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <FullPageSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

// Non-admin wrapper (admins get redirected to admin dashboard)
const UserRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <FullPageSpinner />;
  if (user && user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <Chatbot />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<UserRoute><Register /></UserRoute>} />

          {/* Public/User routes (hidden from admin) */}
          <Route path="/" element={<UserRoute><Home /></UserRoute>} />
          <Route path="/jobs" element={<UserRoute><JobListings /></UserRoute>} />
          <Route path="/jobs/:id" element={<UserRoute><JobDetails /></UserRoute>} />
          <Route path="/skill-development" element={<UserRoute><SkillDevelopment /></UserRoute>} />
          <Route path="/counseling" element={<UserRoute><Counseling /></UserRoute>} />
          <Route path="/about" element={<UserRoute><About /></UserRoute>} />

          {/* Protected user routes */}
          <Route
            path="/profile"
            element={
              <UserRoute>
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              </UserRoute>
            }
          />
          <Route
            path="/my-applications"
            element={
              <UserRoute>
                <ProtectedRoute>
                  <MyApplications />
                </ProtectedRoute>
              </UserRoute>
            }
          />

          {/* Admin area (full desktop page) */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;