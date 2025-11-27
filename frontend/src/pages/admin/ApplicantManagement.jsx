import React, { useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { API_URL } from '../../config';

const ApplicantManagement = () => {
  const { token } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('all');
  const [allApplications, setAllApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  // Fetch jobs and all applications on mount
  useEffect(() => {
    fetchJobs();
    fetchAllApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/jobs`);
      const list = res.data || [];
      setJobs(list);
      // Keep default "all" so admin sees apps immediately
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setErr(error?.response?.data?.message || 'Failed to load jobs');
    }
  };

  const fetchAllApplications = async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await axios.get(`${API_URL}/api/applications/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllApplications(res.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setErr(error?.response?.data?.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  // Map "under-review" to backend-supported "reviewed" if needed
  const normalizeStatus = (status) => (status === 'under-review' ? 'reviewed' : status);

  const updateStatus = async (appId, newStatusRaw) => {
    try {
      const status = normalizeStatus(newStatusRaw);
      await axios.put(
        `${API_URL}/api/applications/${appId}/status`,
        { status, note: `Updated to ${status}`, notes: `Updated to ${status}` },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchAllApplications();
      alert('Status updated successfully!');
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error?.response?.data?.message || 'Failed to update status');
    }
  };

  // Status colors
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    reviewed: 'bg-blue-100 text-blue-800',
    'under-review': 'bg-blue-100 text-blue-800',
    shortlisted: 'bg-green-100 text-green-800',
    interview: 'bg-purple-100 text-purple-800',
    rejected: 'bg-red-100 text-red-800',
    hired: 'bg-green-500 text-white',
  };

  // Filter applications by selected job
  const applications = useMemo(() => {
    if (selectedJob === 'all') return allApplications;
    return allApplications.filter((a) => {
      const j = a.job || {};
      return (j._id || j.id) === selectedJob;
    });
  }, [allApplications, selectedJob]);

  // Compute match score if backend didn't supply one
  const computeMatchScore = (job = {}, candidate = {}) => {
    try {
      let score = 0;
      const jobSkills = Array.isArray(job.skills) ? job.skills : [];
      const userSkills = Array.isArray(candidate.skills) ? candidate.skills : [];

      // 60% skills overlap
      if (jobSkills.length > 0 && userSkills.length > 0) {
        const matched = jobSkills.filter((s) =>
          userSkills.some((u) => String(u).toLowerCase() === String(s).toLowerCase())
        );
        score += (matched.length / jobSkills.length) * 60;
      }

      // 20% location match
      if (job.location && candidate.location) {
        const jl = String(job.location).toLowerCase();
        const ul = String(candidate.location).toLowerCase();
        if (jl.includes(ul) || ul.includes(jl)) score += 20;
      }

      // 20% loose boosts
      const jobType = job.jobType || job.type;
      if (jobType && candidate.experience) score += 10;
      if (
        job.category &&
        userSkills.some((s) => String(s).toLowerCase().includes(String(job.category).toLowerCase()))
      )
        score += 10;

      return Math.round(Math.min(100, score));
    } catch {
      return 0;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Applicant Management</h1>

      {/* Error */}
      {err && (
        <div className="bg-red-50 border border-red-200 rounded p-3 text-red-700">
          {err}
        </div>
      )}

      {/* Job Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Select Job:</label>
        <select
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">
            All Jobs ({allApplications.length} applications)
          </option>
          {jobs.map((job) => {
            const applicantsCount = Array.isArray(job.applicants) ? job.applicants.length : job.applicants || 0;
            return (
              <option key={job._id} value={job._id}>
                {job.title} - {job.company} ({applicantsCount} applicants)
              </option>
            );
          })}
        </select>
      </div>

      {/* Applications Table */}
      {applications.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No applications yet</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Job
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Match Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Skills
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {applications.map((app) => {
                const candidate = app.applicant || app.user || {};
                const job = app.job || {};
                const skills = Array.isArray(candidate.skills) ? candidate.skills : [];

                const ms =
                  typeof app.matchScore === 'number'
                    ? app.matchScore
                    : computeMatchScore(job, candidate);

                return (
                  <tr key={app._id}>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{candidate.name || '—'}</p>
                        <p className="text-sm text-gray-500">{candidate.email || '—'}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{job.title || '—'}</div>
                        <div className="text-gray-600">{job.company || '—'}</div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-lg font-semibold text-primary">
                        {Number.isFinite(ms) ? `${ms}%` : '—'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {skills.slice(0, 3).map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                        {skills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                            +{skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          statusColors[app.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app._id, e.target.value)}
                        className="px-3 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interview">Interview</option>
                        <option value="rejected">Rejected</option>
                        <option value="hired">Hired</option>
                        {/* legacy */}
                        <option value="under-review">Under Review (legacy)</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApplicantManagement;