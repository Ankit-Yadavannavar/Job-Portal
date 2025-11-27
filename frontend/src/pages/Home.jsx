import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  MagnifyingGlassIcon, 
  BriefcaseIcon, 
  AcademicCapIcon, 
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  TrophyIcon,
  CheckBadgeIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const { user } = useContext(AuthContext);

  const features = [
    {
      icon: MagnifyingGlassIcon,
      title: 'Smart Job Search',
      description: 'AI-powered job matching based on your skills and preferences',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
    },
    {
      icon: BriefcaseIcon,
      title: 'Career Growth',
      description: 'Personalized recommendations to advance your career',
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    {
      icon: AcademicCapIcon,
      title: 'Skill Development',
      description: 'Access curated courses to enhance your expertise',
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'AI Assistant',
      description: 'Multilingual chatbot for instant job recommendations',
      color: 'text-orange-500',
      bgColor: 'bg-orange-100',
    },
  ];

  const stats = [
    { icon: BriefcaseIcon, value: '10,000+', label: 'Active Jobs' },
    { icon: UserGroupIcon, value: '50,000+', label: 'Job Seekers' },
    { icon: CheckBadgeIcon, value: '5,000+', label: 'Hired' },
    { icon: TrophyIcon, value: '500+', label: 'Companies' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Different for logged in users */}
      {user ? (
        // Logged In User Hero
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Ready to take the next step in your career?
              </p>
              
              {/* Quick Actions for Logged In Users */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-4xl mx-auto">
                <Link 
                  to="/jobs" 
                  className="bg-white text-primary px-6 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg flex items-center justify-center space-x-2"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                  <span>Find Jobs</span>
                </Link>
                <Link 
                  to="/my-applications" 
                  className="bg-white bg-opacity-20 backdrop-blur-lg text-white px-6 py-4 rounded-lg font-semibold hover:bg-opacity-30 transition-all border-2 border-white flex items-center justify-center space-x-2"
                >
                  <BriefcaseIcon className="h-5 w-5" />
                  <span>My Applications</span>
                </Link>
                <Link 
                  to="/profile" 
                  className="bg-white bg-opacity-20 backdrop-blur-lg text-white px-6 py-4 rounded-lg font-semibold hover:bg-opacity-30 transition-all border-2 border-white flex items-center justify-center space-x-2"
                >
                  <UserGroupIcon className="h-5 w-5" />
                  <span>Update Profile</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Guest User Hero
        <div className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Find Your Dream Job<br />
                <span className="text-yellow-300">Today</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                Connect with top employers and discover opportunities that match your skills
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  to="/register" 
                  className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-all shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>Get Started Free</span>
                  <ArrowRightIcon className="h-5 w-5" />
                </Link>
                <Link 
                  to="/jobs" 
                  className="bg-white bg-opacity-20 backdrop-blur-lg text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-30 transition-all border-2 border-white"
                >
                  Browse Jobs
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="h-10 w-10 text-primary mx-auto mb-2" />
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-gray-600 mt-1">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Why Choose JobPortal?</h2>
          <p className="text-gray-600 text-lg">Everything you need to land your dream job</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center group hover:scale-105 transition-transform">
                <div className={`${feature.bgColor} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow`}>
                  <Icon className={`h-10 w-10 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 text-lg">Get hired in 3 simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="bg-blue-100 text-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
              <p className="text-gray-600">Sign up and complete your profile with skills, experience, and preferences</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Matched</h3>
              <p className="text-gray-600">Our AI finds the best jobs for you based on your profile and preferences</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="bg-purple-100 text-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Apply & Get Hired</h3>
              <p className="text-gray-600">Apply with one click and track your application status in real-time</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
            <p className="text-blue-100 text-xl mb-8">Join thousands of job seekers finding their perfect career match</p>
            <Link 
              to="/register" 
              className="inline-block bg-yellow-400 text-blue-900 px-10 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-all shadow-xl"
            >
              Create Free Account Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;