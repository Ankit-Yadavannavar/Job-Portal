// frontend/src/pages/admin/Analytics.jsx
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import {
  UserGroupIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const Bar = ({ label, count, max, color = 'bg-blue-600' }) => {
  const width = max > 0 ? Math.max((count / max) * 100, 3) : 0;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-700">{label}</span>
        <span className="text-gray-500">{count}</span>
      </div>
      <div className="w-full bg-gray-100 rounded h-3 overflow-hidden">
        <div className={`${color} h-3 rounded`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
};

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    todayUsers: 0,
    todayApplications: 0,
    applicationsByStatus: [],
  });
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [statsRes, usersRes, jobsRes, appsRes] = await Promise.all([
          axios.get(`${API_URL}/api/admin/stats`, config),
          axios.get(`${API_URL}/api/admin/users?fields=names`, config),
          axios.get(`${API_URL}/api/jobs`, config),
          axios.get(`${API_URL}/api/applications/admin/all`, config),
        ]);

        setStats({
          totalUsers: statsRes.data?.totalUsers || 0,
          totalJobs: statsRes.data?.totalJobs || 0,
          totalApplications: statsRes.data?.totalApplications || 0,
          todayUsers: statsRes.data?.todayUsers || 0,
          todayApplications: statsRes.data?.todayApplications || 0,
          applicationsByStatus: statsRes.data?.applicationsByStatus || [],
        });

        setUsers(usersRes.data || []);
        setJobs(jobsRes.data || []);
        setApplications(appsRes.data || []);
      } catch (err) {
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Users over last 7 days
  const usersPerDay = useMemo(() => {
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      return d;
    });
    const counts = days.map((d) =>
      users.filter((u) => new Date(u.createdAt).setHours(0, 0, 0, 0) === d.getTime()).length
    );
    return { days, counts, max: Math.max(...counts, 1) };
  }, [users]);

  const topJobs = useMemo(() => {
    const map = new Map();
    for (const app of applications) {
      const j = app.job || {};
      const key = j._id || j.id;
      if (!key) continue;
      const prev = map.get(key) || { id: key, title: j.title || 'Untitled', company: j.company || '', count: 0 };
      prev.count += 1;
      map.set(key, prev);
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count).slice(0, 7);
  }, [applications]);

  const appsByStatus = useMemo(() => {
    const raw = stats.applicationsByStatus?.length
      ? stats.applicationsByStatus
      : (() => {
          const map = new Map();
          applications.forEach((a) => {
            const st = a.status || 'pending';
            map.set(st, (map.get(st) || 0) + 1);
          });
          return Array.from(map.entries()).map(([status, count]) => ({ _id: status, count }));
        })();

    const statusColor = {
      pending: 'bg-yellow-500',
      reviewed: 'bg-blue-500',
      shortlisted: 'bg-purple-600',
      interview: 'bg-indigo-600',
      rejected: 'bg-red-600',
      hired: 'bg-green-600',
    };

    const max = raw.reduce((m, r) => Math.max(m, r.count), 0);
    const items = raw.map((r) => ({ label: r._id, count: r.count, color: statusColor[r._id] || 'bg-gray-600' }));
    return { items, max };
  }, [stats, applications]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <ArrowTrendingUpIcon className="h-4 w-4 mr-1" /> +{stats.todayUsers} today
            </p>
          </div>
          <UserGroupIcon className="h-10 w-10 text-indigo-600" />
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Jobs</p>
            <p className="text-2xl font-bold">{stats.totalJobs}</p>
          </div>
          <BriefcaseIcon className="h-10 w-10 text-blue-600" />
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Applications</p>
            <p className="text-2xl font-bold">{stats.totalApplications}</p>
            <p className="text-xs text-green-600 mt-1">+{stats.todayApplications} today</p>
          </div>
          <DocumentTextIcon className="h-10 w-10 text-purple-600" />
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold">
              {applications.filter((a) => a.status === 'pending').length}
            </p>
          </div>
          <ChartBarIcon className="h-10 w-10 text-yellow-600" />
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Hired</p>
            <p className="text-2xl font-bold">
              {applications.filter((a) => a.status === 'hired').length}
            </p>
          </div>
          <ChartBarIcon className="h-10 w-10 text-green-600" />
        </div>
      </div>

      {/* Applications by Status */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-bold mb-4">Applications by Status</h3>
        {appsByStatus.items.length === 0 ? (
          <p className="text-gray-500">No data</p>
        ) : (
          <div>
            {appsByStatus.items.map((it) => (
              <Bar key={it.label} label={it.label} count={it.count} max={appsByStatus.max} color={it.color} />
            ))}
          </div>
        )}
      </div>

      {/* Top Jobs by Applications */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-bold mb-4">Top Jobs by Applications</h3>
        {applications.length === 0 ? (
          <p className="text-gray-500">No applications yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applications</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {topJobs.map((j) => (
                  <tr key={j.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{j.title}</td>
                    <td className="px-4 py-3 text-gray-700">{j.company}</td>
                    <td className="px-4 py-3 text-gray-900 font-semibold">{j.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Users (last 7 days trend) */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-bold mb-4">New Users (last 7 days)</h3>
        <div className="grid grid-cols-7 gap-3 items-end h-28">
          {usersPerDay.counts.map((c, idx) => {
            const day = usersPerDay.days[idx];
            const height = usersPerDay.max > 0 ? (c / usersPerDay.max) * 100 : 0;
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-8 bg-indigo-500 rounded-t" style={{ height: `${height}%` }} />
                <div className="text-xs text-gray-500 mt-1">
                  {day.toLocaleDateString(undefined, { weekday: 'short' })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Analytics;