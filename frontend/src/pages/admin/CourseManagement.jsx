import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    platform: '',
    description: '',
    duration: '',
    level: 'Beginner',
    skills: '',
    link: '',
    image: '🎓',
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/courses/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const courseData = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
    };

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingCourse) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/courses/${editingCourse._id}`, courseData, config);
        alert('Course updated successfully!');
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/courses`, courseData, config);
        alert('Course added successfully!');
      }
      
      setIsModalOpen(false);
      setEditingCourse(null);
      resetForm();
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course');
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      platform: course.platform,
      description: course.description,
      duration: course.duration || '',
      level: course.level || 'Beginner',
      skills: course.skills.join(', '),
      link: course.link || '',
      image: course.image || '🎓',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Course deleted successfully!');
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course');
    }
  };

  const toggleActive = async (course) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/courses/${course._id}`,
        { isActive: !course.isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCourses();
    } catch (error) {
      console.error('Error toggling course status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      platform: '',
      description: '',
      duration: '',
      level: 'Beginner',
      skills: '',
      link: '',
      image: '🎓',
    });
  };

  const emojis = ['🎓', '💻', '📊', '🎨', '📱', '🔒', '☁️', '🤖', '📈', '✍️'];

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600 mt-1">Manage skill development courses</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingCourse(null);
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            {/* Course Icon & Status */}
            <div className="flex items-start justify-between mb-4">
              <div className="text-5xl">{course.image}</div>
              <div className="flex items-center space-x-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={course.isActive}
                    onChange={() => toggleActive(course)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
            </div>

            {/* Course Info */}
            <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
            <p className="text-sm font-medium text-primary mb-2">{course.platform}</p>

            {/* Course Details */}
            <div className="space-y-1 mb-4">
              <p className="text-xs text-gray-600">
                <span className="font-semibold">Duration:</span> {course.duration || 'N/A'}
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-semibold">Level:</span> {course.level || 'N/A'}
              </p>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1 mb-4">
              {course.skills?.slice(0, 3).map((skill, i) => (
                <span key={i} className="px-2 py-1 bg-blue-100 text-primary text-xs rounded">
                  {skill}
                </span>
              ))}
              {course.skills?.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  +{course.skills.length - 3}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-2 pt-4 border-t">
              <button
                onClick={() => handleEdit(course)}
                className="flex-1 text-primary hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors flex items-center justify-center space-x-1"
              >
                <PencilIcon className="h-4 w-4" />
                <span className="text-sm">Edit</span>
              </button>
              <button
                onClick={() => handleDelete(course._id)}
                className="flex-1 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors flex items-center justify-center space-x-1"
              >
                <TrashIcon className="h-4 w-4" />
                <span className="text-sm">Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </h2>
                <button onClick={() => setIsModalOpen(false)}>
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Course Icon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Icon
                  </label>
                  <div className="flex space-x-2">
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: emoji })}
                        className={`text-3xl p-2 rounded-lg ${
                          formData.image === emoji ? 'bg-blue-100 ring-2 ring-primary' : 'hover:bg-gray-100'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Full Stack Web Development"
                  />
                </div>

                {/* Platform */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform *
                  </label>
                  <input
                    type="text"
                    name="platform"
                    value={formData.platform}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Coursera, Udemy, etc."
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Course description..."
                  />
                </div>

                {/* Duration & Level */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="6 months"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Level
                    </label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="All Levels">All Levels</option>
                    </select>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills (comma-separated) *
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>

                {/* Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Link
                  </label>
                  <input
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://coursera.org/..."
                  />
                </div>

                {/* Submit */}
                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingCourse ? 'Update Course' : 'Add Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;