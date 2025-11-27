// frontend/src/pages/admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MagnifyingGlassIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, users]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/users`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const list = res.data || [];
      setUsers(list);
      setFiltered(list);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!search.trim()) {
      setFiltered(users);
      return;
    }
    const s = search.toLowerCase();
    setFiltered(
      users.filter(
        (u) =>
          u.name?.toLowerCase().includes(s) ||
          u.email?.toLowerCase().includes(s)
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Total registered users: {users.length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="relative max-w-xl">
          <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Users Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <UserGroupIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No users found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((u) => (
            <div
              key={u._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {u.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{u.name}</p>
                    <span
                      className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${
                        u.role === 'admin'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {u.role || 'user'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <div className="flex items-center">
                  <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="truncate">{u.email}</span>
                </div>
                {u.phone && (
                  <div className="flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{u.phone}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Optional: quick tags for skills (first 3) */}
              {Array.isArray(u.skills) && u.skills.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {u.skills.slice(0, 3).map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs"
                      >
                        {s}
                      </span>
                    ))}
                    {u.skills.length > 3 && (
                      <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">
                        +{u.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;