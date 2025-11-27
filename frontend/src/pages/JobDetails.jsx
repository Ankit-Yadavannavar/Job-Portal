import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);

  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);

  const [err, setErr] = useState('');

  useEffect(() => {
    fetchJob();
  }, [id]);

  useEffect(() => {
    checkApplied();
  }, [id, user]);

  const fetchJob = async () => {
    setErr('');
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/jobs/${id}`);
      setJob(res.data);
    } catch (error) {
      console.error('Job details error:', error);
      setErr(error?.response?.data?.message || 'Failed to load job');
    } finally {
      setLoading(false);
    }
  };

  const checkApplied = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/applications/my`, {
        headers: { Authorization: `Bearer ${token || localStorage.getItem('token')}` }
      });
      const apps = Array.isArray(res.data) ? res.data : [];
      setHasApplied(apps.some(a => (a.job?._id || a.job?.id) === id));
    } catch (e) {
      // non-blocking
    }
  };

  const submitApplication = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please login to apply for jobs');
      navigate('/login');
      return;
    }

    // FRONTEND VALIDATION to match backend requirement
    const trimmed = coverLetter.trim();
    if (!trimmed || trimmed.length < 100) {
      alert('Cover letter is required and must be at least 100 characters.');
      return;
    }

    if (applying) return;
    setApplying(true);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/applications`,
        {
          jobId: job?._id || id,     // send a valid jobId
          coverLetter: trimmed       // required by backend
        },
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      alert('Application submitted successfully!');
      setShowApplicationForm(false);
      setCoverLetter('');
      setHasApplied(true);
    } catch (error) {
      console.error('Apply error:', error?.response || error);
      const msg = error?.response?.data?.message || 'Server error while submitting application';
      if (/already applied/i.test(msg)) {
        setShowApplicationForm(false);
        setHasApplied(true);
        alert('You have already applied for this job.');
      } else if (/job id/i.test(msg) || /cover letter/i.test(msg)) {
        // reflect backend validation message clearly
        alert(msg);
      } else {
        alert(msg);
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (err || !job) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Job not found</h2>
        {err && <p className="text-red-600 mb-4">{err}</p>}
        <Link to="/jobs" className="text-primary hover:underline">Back to Jobs</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
              <div className="flex items-center gap-4 text-gray-600 flex-wrap mt-2">
                <div className="flex items-center gap-1">
                  <BuildingOfficeIcon className="h-5 w-5" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPinIcon className="h-5 w-5" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BriefcaseIcon className="h-5 w-5" />
                  <span>{job.jobType || job.type}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-1">
                    <CurrencyDollarIcon className="h-5 w-5" />
                    <span>{job.salary}</span>
                  </div>
                )}
              </div>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                job.status === 'open' || job.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {job.status || 'active'}
            </span>
          </div>

          {/* Actions (no applicants badge) */}
          <div className="mt-4 flex gap-3">
            {user ? (
              hasApplied ? (
                <button
                  disabled
                  className="px-6 py-2 bg-green-100 text-green-700 rounded font-semibold flex items-center gap-2"
                >
                  <CheckCircleIcon className="h-5 w-5" />
                  Already Applied
                </button>
              ) : (
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="px-6 py-2 bg-primary text-white rounded font-semibold hover:bg-blue-700 transition"
                  disabled={!(job.status === 'open' || job.status === 'active')}
                >
                  {(job.status === 'open' || job.status === 'active') ? 'Apply Now' : 'Applications Closed'}
                </button>
              )
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 bg-primary text-white rounded font-semibold hover:bg-blue-700 transition"
              >
                Login to Apply
              </Link>
            )}

            {job.deadline && (
              <div className="px-6 py-2 border border-gray-300 text-gray-700 rounded font-semibold">
                <CalendarIcon className="h-4 w-4 inline mr-1" />
                Deadline: {new Date(job.deadline).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-3">Job Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>

          {Array.isArray(job.requirements) && job.requirements.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mt-6 mb-2">Requirements</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </>
          )}

          {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mt-6 mb-2">Responsibilities</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </>
          )}

          {Array.isArray(job.skills) && job.skills.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mt-6 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((s, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                    {s}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">Apply for {job.title}</h3>
              <button onClick={() => setShowApplicationForm(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <form onSubmit={submitApplication}>
              <div className="bg-blue-50 p-4 rounded border border-blue-200 mb-4">
                <p className="text-sm text-blue-900">
                  Your profile and resume (if uploaded) will be attached automatically.
                </p>
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter (required, min 100 characters)
              </label>
              <textarea
                rows="10"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Explain why you're a great fit for this role..."
                required
              />
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-gray-500">{coverLetter.trim().length}/100</span>
                {coverLetter.trim().length >= 100 && <span className="text-green-600">✓ Good to go</span>}
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={applying || coverLetter.trim().length < 100}
                  className="px-6 py-2 bg-primary text-white rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  className="px-6 py-2 border border-gray-300 rounded font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;