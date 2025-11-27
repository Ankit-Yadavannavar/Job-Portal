import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AcademicCapIcon, ClockIcon, SignalIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

const SkillDevelopment = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/courses`);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Skill Development</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Upskill yourself with these curated courses and boost your career prospects
        </p>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="card hover:border-primary border border-transparent transition-all">
            {/* Course Icon */}
            <div className="text-5xl mb-4 text-center">{course.image}</div>

            {/* Course Info */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{course.description}</p>
              <p className="text-sm font-medium text-primary">{course.platform}</p>
            </div>

            {/* Course Details */}
            <div className="space-y-2 mb-4">
              {course.duration && (
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  <span>{course.duration}</span>
                </div>
              )}
              {course.level && (
                <div className="flex items-center text-sm text-gray-600">
                  <SignalIcon className="h-4 w-4 mr-2" />
                  <span>{course.level}</span>
                </div>
              )}
            </div>

            {/* Skills Tags */}
            <div className="mb-4">
              <p className="text-sm font-semibold mb-2">Skills you'll learn:</p>
              <div className="flex flex-wrap gap-2">
                {course.skills?.map((skill, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-100 text-primary text-xs rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Enroll Button */}
            {course.link ? (
              <a
                href={course.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary block text-center w-full flex items-center justify-center space-x-2"
              >
                <span>Enroll Now</span>
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </a>
            ) : (
              <button className="btn-primary block text-center w-full" disabled>
                Coming Soon
              </button>
            )}
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <AcademicCapIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No courses available at the moment</p>
        </div>
      )}

      {/* Additional Resources */}
      <div className="mt-16 bg-blue-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Free Learning Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-2">📚 Documentation</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">MDN Web Docs</a></li>
              <li><a href="https://reactjs.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">React Documentation</a></li>
              <li><a href="https://nodejs.org/docs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Node.js Docs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">🎥 YouTube Channels</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="https://www.youtube.com/@freecodecamp" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">freeCodeCamp</a></li>
              <li><a href="https://www.youtube.com/@TraversyMedia" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Traversy Media</a></li>
              <li><a href="https://www.youtube.com/@Fireship" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Fireship</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">💻 Practice Platforms</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="https://leetcode.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">LeetCode</a></li>
              <li><a href="https://www.hackerrank.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">HackerRank</a></li>
              <li><a href="https://www.codewars.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Codewars</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillDevelopment;