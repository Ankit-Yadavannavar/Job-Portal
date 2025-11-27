// frontend/src/pages/MyApplications.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BriefcaseIcon,
  MapPinIcon,
  CalendarIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

const MyApplications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const fetchApplications = async () => {
    setErr('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/applications/my`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApps(res.data || []);
    } catch (error) {
      console.error('MyApplications fetch error:', error);
      const msg = error?.response?.data?.message || 'Failed to load applications';
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/applications/my/${applicationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchApplications();
      alert('Application withdrawn successfully');
    } catch (error) {
      console.error('Withdraw error:', error);
      alert(error?.response?.data?.message || 'Failed to withdraw application');
    }
  };

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600">Track all the jobs you’ve applied to</p>
      </div>

      {err && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {err}
        </div>
      )}

      {apps.length === 0 ? (
        <div className="text-center text-gray-500 py-16">
          <XCircleIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>No applications found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {apps.map((a) => (
            <div key={a._id} className="bg-white rounded-lg shadow p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <BriefcaseIcon className="h-5 w-5 text-primary" />
                    {a.job?.title || 'Job'}
                  </h3>
                  <p className="text-gray-700">{a.job?.company || ''}</p>
                  <div className="flex gap-4 text-sm text-gray-600 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="h-4 w-4" />
                      {a.job?.location || '—'}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      Applied on {new Date(a.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 text-xs rounded-full font-medium capitalize ${
                      a.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : a.status === 'reviewed'
                        ? 'bg-blue-100 text-blue-800'
                        : a.status === 'shortlisted'
                        ? 'bg-purple-100 text-purple-800'
                        : a.status === 'interview'
                        ? 'bg-indigo-100 text-indigo-800'
                        : a.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : a.status === 'hired'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {a.status}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                {a.status === 'pending' && (
                  <button
                    onClick={() => withdraw(a._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                  >
                    Withdraw
                  </button>
                )}
                <a
                  href={`/jobs/${a.job?._id}`}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition text-sm"
                >
                  View Job
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;