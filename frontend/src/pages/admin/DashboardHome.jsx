// frontend/src/pages/admin/DashboardHome.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BriefcaseIcon, UserGroupIcon, AcademicCapIcon, ChatBubbleLeftRightIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalCourses: 0,
    pendingCounseling: 0,
    totalUsers: 0,
    totalApplications: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [jobsRes, coursesRes, counselingRes, usersRes, applicationsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/jobs`, config),
        axios.get(`${process.env.REACT_APP_API_URL}/api/courses/all`, config),
        axios.get(`${process.env.REACT_APP_API_URL}/api/counseling?status=pending`, config),
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/users`, config),
        axios.get(`${process.env.REACT_APP_API_URL}/api/applications/admin/all`, config),
      ]);

      setStats({
        totalJobs: jobsRes.data.length,
        activeJobs: jobsRes.data.filter(j => j.status === 'open' || j.status === 'active').length,
        totalCourses: coursesRes.data.length,
        pendingCounseling: counselingRes.data.length,
        totalUsers: usersRes.data.length,
        totalApplications: applicationsRes.data.length,
      });

      setUsers(usersRes.data);
      setRecentApplications(applicationsRes.data.slice(0, 10));
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    { title: 'Total Jobs', value: stats.totalJobs, icon: BriefcaseIcon, color: 'blue' },
    { title: 'Active Jobs', value: stats.activeJobs, icon: BriefcaseIcon, color: 'green' },
    { title: 'Total Users', value: stats.totalUsers, icon: UserGroupIcon, color: 'indigo' },
    { title: 'Total Applications', value: stats.totalApplications, icon: DocumentTextIcon, color: 'purple' },
    { title: 'Total Courses', value: stats.totalCourses, icon: AcademicCapIcon, color: 'pink' },
    { title: 'Pending Requests', value: stats.pendingCounseling, icon: ChatBubbleLeftRightIcon, color: 'orange' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-blue-100 text-blue-800',
      shortlisted: 'bg-purple-100 text-purple-800',
      interview: 'bg-indigo-100 text-indigo-800',
      rejected: 'bg-red-100 text-red-800',
      hired: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredUsers = users
    .filter(u => u.name?.toLowerCase().includes(userSearch.toLowerCase()))
    .slice(0, 8);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                  <Icon className={`h-8 w-8 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Applications */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Job Applications</h2>
          <a href="/admin/applications" className="text-primary hover:underline text-sm">View All →</a>
        </div>
        
        {recentApplications.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No applications yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied For</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{app.applicant?.name || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{app.applicant?.email || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{app.job?.title || 'N/A'}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {app.job?.company || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Registered Users */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Registered Users</h2>
          <a href="/admin/users" className="text-primary hover:underline text-sm">View All →</a>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users by name..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {filteredUsers.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No users found</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredUsers.map(u => (
              <li key={u._id} className="p-3 border rounded-lg hover:shadow-sm transition">
                <p className="font-semibold text-gray-900">{u.name}</p>
                <p className="text-sm text-gray-600">{u.email}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/jobs"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-all text-center"
          >
            <BriefcaseIcon className="h-10 w-10 text-primary mx-auto mb-2" />
            <h3 className="font-semibold">Manage Jobs</h3>
            <p className="text-sm text-gray-600">Add, edit or delete jobs</p>
          </a>

          <a
            href="/admin/courses"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-all text-center"
          >
            <AcademicCapIcon className="h-10 w-10 text-primary mx-auto mb-2" />
            <h3 className="font-semibold">Manage Courses</h3>
            <p className="text-sm text-gray-600">Add or update courses</p>
          </a>

          <a
            href="/admin/counseling"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-all text-center"
          >
            <ChatBubbleLeftRightIcon className="h-10 w-10 text-primary mx-auto mb-2" />
            <h3 className="font-semibold">Counseling Requests</h3>
            <p className="text-sm text-gray-600">Review pending requests</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;