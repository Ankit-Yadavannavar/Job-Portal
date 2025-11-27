import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { UserCircleIcon, PencilIcon, CheckIcon, DocumentTextIcon, ArrowUpOnSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const { user, token } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    skills: [],
    experience: '',
    education: '',
    jobPreferences: {
      category: '',
      location: '',
      jobType: '',
      minSalary: '',
    },
    resume: null,
  });
  const [newSkill, setNewSkill] = useState('');
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => { if (user) fetchUserProfile(); }, [user]);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/user/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData(res.data);
    } catch (e) {
      console.error('Error fetching profile:', e);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (s) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(x => x !== s) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Name cannot be changed
      const payload = { ...formData };
      delete payload.name;
      delete payload.resume;

      const res = await axios.put(
        `${API_URL}/api/user/${user._id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormData(res.data);
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (e) {
      console.error('Error updating profile:', e);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Resume must be under 5MB');
      return;
    }
    const data = new FormData();
    data.append('resume', file);
    setResumeUploading(true);
    try {
      const res = await axios.put(
        `${API_URL}/api/user/${user._id}/resume`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormData(prev => ({ ...prev, resume: res.data.resume }));
      alert('Resume updated!');
    } catch (e) {
      console.error('Resume upload error:', e);
      alert('Failed to upload resume');
    } finally {
      setResumeUploading(false);
    }
  };

  const handleResumeDelete = async () => {
    if (!window.confirm('Remove your current resume?')) return;
    try {
      await axios.delete(
        `${API_URL}/api/user/${user._id}/resume`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormData(prev => ({ ...prev, resume: null }));
      alert('Resume removed.');
    } catch (e) {
      console.error('Resume delete error:', e);
      alert('Failed to remove resume');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-blue-600 px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <UserCircleIcon className="h-20 w-20 text-white" />
              <div className="text-white">
                <h1 className="text-3xl font-bold">{formData.name}</h1>
                <p className="text-blue-100">{formData.email}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white text-primary px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-100 transition-all"
            >
              {isEditing ? (<><CheckIcon className="h-5 w-5" /><span>Cancel</span></>) : (<><PencilIcon className="h-5 w-5" /><span>Edit Profile</span></>)}
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name (locked) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500"
                />
                <p className="text-xs text-gray-400 mt-1">Contact support to change your name</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="e.g., 2 years"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.skills?.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-primary text-white rounded-full text-sm flex items-center space-x-2">
                  <span>{skill}</span>
                  {isEditing && (
                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-white hover:text-red-200">×</button>
                  )}
                </span>
              ))}
            </div>
            {isEditing && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  placeholder="Add a skill"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button type="button" onClick={handleAddSkill} className="btn-primary">Add</button>
              </div>
            )}
          </div>

          {/* Job Preferences */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Job Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Category</label>
                <input
                  type="text"
                  name="jobPreferences.category"
                  value={formData.jobPreferences?.category || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="e.g., IT, Marketing"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Location</label>
                <input
                  type="text"
                  name="jobPreferences.location"
                  value={formData.jobPreferences?.location || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                <select
                  name="jobPreferences.jobType"
                  value={formData.jobPreferences?.jobType || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                >
                  <option value="">Select Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Salary</label>
                <input
                  type="text"
                  name="jobPreferences.minSalary"
                  value={formData.jobPreferences?.minSalary || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="e.g., ₹5 LPA"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Education</h2>
            <textarea
              name="education"
              value={formData.education || ''}
              onChange={handleChange}
              disabled={!isEditing}
              rows="3"
              placeholder="Your educational background..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
            />
          </div>

          {/* Resume */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <DocumentTextIcon className="h-6 w-6 mr-2 text-primary" />
              Resume
            </h2>

            {formData.resume ? (
              <div className="mb-3 flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50 p-3 rounded gap-3">
                <a
                  href={`${API_URL}/${formData.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  View current resume
                </a>
                <div className="flex gap-3">
                  <label className="inline-flex items-center space-x-2 cursor-pointer text-primary hover:text-blue-700">
                    <ArrowUpOnSquareIcon className="h-5 w-5" />
                    <span>Replace Resume</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => handleResumeUpload(e.target.files[0])}
                      disabled={resumeUploading}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleResumeDelete}
                    className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ) : (
              <label className="inline-flex items-center space-x-2 cursor-pointer text-primary hover:text-blue-700">
                <ArrowUpOnSquareIcon className="h-5 w-5" />
                <span>Upload Resume</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => handleResumeUpload(e.target.files[0])}
                  disabled={resumeUploading}
                />
              </label>
            )}

            {resumeUploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
          </div>

          {isEditing && (
            <div className="flex justify-end">
              <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;