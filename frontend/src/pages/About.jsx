import React from 'react';
import { 
  UserGroupIcon, 
  TrophyIcon, 
  HeartIcon, 
  LightBulbIcon,
  CheckBadgeIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const About = () => {
  const values = [
    {
      icon: TrophyIcon,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from matching candidates to providing support.'
    },
    {
      icon: HeartIcon,
      title: 'Integrity',
      description: 'We maintain transparency and honesty in all our interactions with job seekers and employers.'
    },
    {
      icon: LightBulbIcon,
      title: 'Innovation',
      description: 'We leverage cutting-edge AI technology to revolutionize the job search experience.'
    },
    {
      icon: UserGroupIcon,
      title: 'Inclusivity',
      description: 'We believe in equal opportunities for all, regardless of background or experience level.'
    },
  ];

  const team = [
    {
      name: 'Ankit Yadav',
      role: 'Founder & CEO',
      image: '👨‍💼',
      bio: 'Passionate about connecting talent with opportunities'
    },
    {
      name: 'Priya Sharma',
      role: 'Head of Technology',
      image: '👩‍💻',
      bio: 'AI and ML expert driving our matching algorithm'
    },
    {
      name: 'Rahul Singh',
      role: 'Career Counselor',
      image: '👨‍🏫',
      bio: '10+ years of experience in career guidance'
    },
    {
      name: 'Neha Gupta',
      role: 'HR Partnerships',
      image: '👩‍💼',
      bio: 'Building bridges between companies and candidates'
    },
  ];

  const stats = [
    { icon: UserGroupIcon, value: '50,000+', label: 'Active Job Seekers' },
    { icon: CheckBadgeIcon, value: '5,000+', label: 'Successful Placements' },
    { icon: GlobeAltIcon, value: '500+', label: 'Partner Companies' },
    { icon: TrophyIcon, value: '95%', label: 'Satisfaction Rate' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">About JobPortal</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Empowering careers through AI-driven job matching and personalized support
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-blue-50 p-8 rounded-2xl">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              To revolutionize the job search experience by leveraging artificial intelligence
              and personalized matching algorithms. We aim to make job hunting stress-free,
              efficient, and successful for every candidate while helping companies find the
              perfect talent.
            </p>
          </div>
          
          <div className="bg-indigo-50 p-8 rounded-2xl">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              To become India's most trusted job portal, known for transparency, innovation,
              and successful career placements. We envision a future where every job seeker
              finds their dream career and every company finds the perfect match through our
              intelligent platform.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="h-12 w-12 text-primary mx-auto mb-3" />
                  <p className="text-4xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
          <p className="text-gray-600 text-lg">The principles that guide everything we do</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Our Story */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6 text-center">Our Story</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              JobPortal was founded in 2024 with a simple yet powerful vision: to make job searching
              smarter, faster, and more effective. Our founders, experienced professionals from the
              tech and HR industries, noticed a significant gap in the job market – candidates were
              struggling to find relevant opportunities, and companies were overwhelmed with irrelevant
              applications.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              We developed an AI-powered platform that analyzes candidate profiles, understands their
              skills and preferences, and matches them with the most suitable job opportunities. Our
              intelligent chatbot provides 24/7 support in multiple languages, making job search
              accessible to everyone.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Today, we're proud to serve thousands of job seekers and partner with hundreds of companies
              across India, helping them achieve their goals and build successful careers.
            </p>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-gray-600 text-lg">The people behind your success</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow text-center">
              <div className="text-6xl mb-4">{member.image}</div>
              <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
              <p className="text-primary font-medium mb-2">{member.role}</p>
              <p className="text-gray-600 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Join Us?</h2>
          <p className="text-blue-100 text-xl mb-8">Start your career journey with JobPortal today</p>
          <a href="/register" className="inline-block bg-yellow-400 text-blue-900 px-10 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-all shadow-xl">
            Get Started Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;