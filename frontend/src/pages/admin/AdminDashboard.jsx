// frontend/src/pages/admin/AdminDashboard.jsx
import React, { useContext } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  HomeIcon,
  UserGroupIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  ChartBarIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

import DashboardHome from './DashboardHome';
import UserManagement from './UserManagement';
import JobManagement from './JobManagement';
import ApplicantManagement from './ApplicantManagement';
import Analytics from './Analytics';
import CourseManagement from './CourseManagement';
import CounselingManagement from './CounselingManagement';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  // DO NOT redirect here. AdminRoute in App.js already guards access.

  const menuItems = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: HomeIcon },
    { path: '/admin/users', name: 'Users', icon: UserGroupIcon },
    { path: '/admin/jobs', name: 'Jobs', icon: BriefcaseIcon },
    { path: '/admin/applications', name: 'Applications', icon: DocumentTextIcon },
    { path: '/admin/analytics', name: 'Analytics', icon: ChartBarIcon },
    { path: '/admin/courses', name: 'Courses', icon: AcademicCapIcon },
    { path: '/admin/counseling', name: 'Counseling', icon: ChatBubbleLeftRightIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white fixed h-full overflow-y-auto">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-gray-400 mt-1">JobPortal</p>
        </div>

        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="bg-primary rounded-full h-10 w-10 flex items-center justify-center font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div>
              <p className="font-medium">{user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-400">{user?.email || ''}</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-800">
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1">
        <Routes>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/jobs" element={<JobManagement />} />
          <Route path="/applications" element={<ApplicantManagement />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/courses" element={<CourseManagement />} />
          <Route path="/counseling" element={<CounselingManagement />} />
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;