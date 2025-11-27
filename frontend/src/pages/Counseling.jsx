import React, { useState, useContext } from 'react';
import axios from 'axios';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { AuthContext } from '../context/AuthContext';

const Counseling = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/counseling`, formData);
      setSubmitted(true);
      setTimeout(() => {
        setFormData({ 
          name: user?.name || '', 
          email: user?.email || '', 
          phone: user?.phone || '', 
          message: '' 
        });
        setSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting counseling request:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Career Counseling</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Get personalized career guidance from our expert counselors
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Benefits Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">How We Can Help You</h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Career Path Planning</h3>
                <p className="text-gray-600 text-sm">
                  Get expert guidance on choosing the right career path based on your skills and interests
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Resume Review & Optimization</h3>
                <p className="text-gray-600 text-sm">
                  Professional resume critique and suggestions to make your CV stand out
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Interview Preparation</h3>
                <p className="text-gray-600 text-sm">
                  Mock interviews, tips, and strategies to ace your job interviews
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Skill Gap Analysis</h3>
                <p className="text-gray-600 text-sm">
                  Identify skills you need to develop for your dream job
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Industry Insights</h3>
                <p className="text-gray-600 text-sm">
                  Stay updated with latest industry trends and job market analysis
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Salary Negotiation</h3>
                <p className="text-gray-600 text-sm">
                  Learn strategies to negotiate better salary and benefits
                </p>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="mt-8 bg-blue-50 p-6 rounded-lg">
            <p className="text-gray-700 italic mb-3">
              "The career counseling session helped me identify my strengths and land my dream job. Highly recommended!"
            </p>
            <p className="font-semibold">- Priya Sharma, Software Engineer</p>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Book a Free Counseling Session</h2>
            
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Request Submitted!</h3>
                <p className="text-gray-600">
                  We'll contact you within 24 hours to schedule your session.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tell us about your career goals *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="I'm looking for guidance on transitioning to a data science career..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary text-lg py-3 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Request Free Counseling'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By submitting, you agree to receive counseling session details via email and phone
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Counseling;